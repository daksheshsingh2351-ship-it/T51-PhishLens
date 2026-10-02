import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Camera, X, AlertCircle, Link2, CreditCard, FileText } from 'lucide-react';
import jsQR from 'jsqr';

export default function ScanQR() {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  
  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const streamRef = useRef(null);
  const lastLogRef = useRef(0);

  // Decoded state
  const [decoded, setDecoded] = useState(null);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const debugLog = (...args) => {
    const now = Date.now();
    // Throttle logs to once per second to avoid console spam during requestAnimationFrame
    if (now - lastLogRef.current > 1000) { 
      console.debug('[QR Scan Debug]', ...args);
      lastLogRef.current = now;
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Attach stream and start playing once the video element is rendered
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      debugLog('Attaching stream to video element');
      const video = videoRef.current;
      video.srcObject = streamRef.current;
      video.setAttribute("playsinline", true); // Required for iOS
      video.play().then(() => {
        debugLog('Video playing successfully');
        if (!animationFrameRef.current) {
          debugLog('Starting requestAnimationFrame loop');
          animationFrameRef.current = requestAnimationFrame(tick);
        }
      }).catch(err => {
        console.error('[QR Scan Debug] Video play failed:', err);
        setError('Failed to play video feed: ' + err.message);
      });
    }
  }, [isCameraActive]);

  const stopCamera = () => {
    debugLog('Stopping camera...');
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        debugLog('Stopped track:', track.label);
      });
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setError('');
    setPreview(null);
    setDecoded(null);
    debugLog('Requesting camera permission...');
    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        debugLog('Got environment camera stream');
      } catch (e) {
        debugLog('Environment camera failed, trying default camera', e.message);
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        debugLog('Got default camera stream');
      }
      streamRef.current = stream;
      // Trigger re-render so videoRef becomes available. 
      // The useEffect will catch this and play the video.
      setIsCameraActive(true);
    } catch (err) {
      console.error('[QR Scan Debug] Camera access failed:', err);
      setError('Camera access denied or unavailable. ' + err.message);
    }
  };

  const tick = () => {
    const video = videoRef.current;
    if (!video) {
      debugLog('Tick: No video element found');
      if (streamRef.current) {
        animationFrameRef.current = requestAnimationFrame(tick);
      }
      return;
    }

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      if (canvas) {
        const width = video.videoWidth;
        const height = video.videoHeight;
        
        if (width > 0 && height > 0) {
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          
          // 1. Try normal
          ctx.drawImage(video, 0, 0, width, height);
          let imageData = ctx.getImageData(0, 0, width, height);
          let code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
          
          // 2. Try mirrored if normal fails
          if (!code) {
            ctx.translate(width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0, width, height);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            imageData = ctx.getImageData(0, 0, width, height);
            code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
          }

          if (code) {
            console.debug('[QR Scan Debug] 🎉 QR Code successfully decoded!', code.data);
            stopCamera();
            processDecodedData(code.data);
            return;
          } else {
            debugLog(`Tick: No QR detected in frame (${width}x${height})`);
          }
        } else {
          debugLog(`Tick: Invalid video dimensions (${width}x${height})`);
        }
      } else {
        debugLog('Tick: No canvas element found');
      }
    } else {
      debugLog(`Tick: Video not ready yet (readyState: ${video.readyState})`);
    }
    
    if (streamRef.current) {
      animationFrameRef.current = requestAnimationFrame(tick);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    setError('');
    setDecoded(null);
    if (isCameraActive) stopCamera();

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, WEBP).');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      decodeQRImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const decodeQRImage = (dataUrl) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        processDecodedData(code.data);
      } else {
        setPreview(null);
        setError('No QR code found in the image. Please try a clearer image.');
      }
    };
    img.src = dataUrl;
  };

  const processDecodedData = (data) => {
    setPreview(null);
    let type = 'text';
    let parsed = null;

    if (data.startsWith('upi://pay')) {
      type = 'upi';
      try {
        const urlParams = new URLSearchParams(data.split('?')[1]);
        parsed = {
          pa: urlParams.get('pa') || 'Unknown UPI ID',
          pn: urlParams.get('pn') || 'Unknown Payee',
          am: urlParams.get('am') || 'Not specified',
          cu: urlParams.get('cu') || 'INR'
        };
      } catch (e) {
        parsed = { error: 'Failed to parse UPI fields' };
      }
    } else {
      let normalizedData = data.trim();
      if (!normalizedData.startsWith('http://') && !normalizedData.startsWith('https://')) {
        normalizedData = 'https://' + normalizedData;
      }
      try {
        new URL(normalizedData);
        // It's a valid URL, automatically start analysis
        if (isCameraActive) stopCamera();
        console.log('[DEBUG ScanQR] Auto-navigating to /scanning:', normalizedData);
        navigate('/scanning', { state: { target: normalizedData, type: 'qr' } });
        return;
      } catch {
        type = 'text';
      }
    }
    
    console.log('[DEBUG ScanQR] processDecodedData called with:', { data, type, parsed });
    setDecoded({ raw: data, type, parsed });
  };

  const clearAll = () => {
    setPreview(null);
    setDecoded(null);
    setError('');
    if (isCameraActive) stopCamera();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const renderDecodedContent = () => {
    if (!decoded) return null;

    if (decoded.type === 'url') {
      return (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="glass-panel p-6 text-left w-full border-brand-cyan/50 h-full flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <Link2 className="w-6 h-6 text-brand-cyan" />
            <h3 className="text-xl font-bold text-white">URL Detected</h3>
          </div>
          <div className="bg-brand-navy-lighter p-3 rounded text-slate-300 break-all mb-4 border border-brand-navy">
            {decoded.raw}
          </div>
          <p className="text-sm text-slate-400 mb-6">This QR code contains a web link. You can analyze it for phishing and scams before visiting.</p>
          <div className="flex gap-4">
            <button onClick={() => {
              console.log('[DEBUG ScanQR] Navigating to /scanning with state:', { target: decoded.raw, type: 'qr' });
              navigate('/scanning', { state: { target: decoded.raw, type: 'qr' } });
            }} className="flex-1 bg-brand-cyan hover:bg-cyan-400 text-brand-navy font-semibold py-3 rounded-xl transition-colors">
              Analyze URL
            </button>
            <button onClick={clearAll} className="px-6 py-3 border border-slate-600 hover:bg-slate-800 rounded-xl transition-colors text-white">Cancel</button>
          </div>
        </motion.div>
      );
    }

    if (decoded.type === 'upi') {
      return (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="glass-panel p-6 text-left w-full border-brand-amber/50 h-full flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-6 h-6 text-brand-amber" />
            <h3 className="text-xl font-bold text-white">UPI Payment Request</h3>
          </div>
          <div className="space-y-3 mb-6 bg-brand-navy-lighter p-4 rounded-xl border border-brand-navy text-sm">
            <div><span className="text-slate-400">Payee Name:</span> <span className="font-semibold text-white ml-2">{decoded.parsed.pn}</span></div>
            <div><span className="text-slate-400">UPI ID:</span> <span className="text-slate-300 ml-2">{decoded.parsed.pa}</span></div>
            <div><span className="text-slate-400">Amount:</span> <span className="font-bold text-brand-amber ml-2">{decoded.parsed.am !== 'Not specified' ? `${decoded.parsed.am} ${decoded.parsed.cu}` : 'Not specified'}</span></div>
          </div>
          <div className="flex items-start gap-2 mb-6 text-brand-amber text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>We cannot verify the true identity of this payee. Scammers often use fake names. Never enter your UPI PIN to <i>receive</i> money.</p>
          </div>
          <button onClick={clearAll} className="w-full py-3 border border-slate-600 hover:bg-slate-800 rounded-xl transition-colors text-white">Scan Another</button>
        </motion.div>
      );
    }

    return (
      <motion.div initial={{opacity:0}} animate={{opacity:1}} className="glass-panel p-6 text-left w-full border-slate-600 h-full flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-slate-400" />
          <h3 className="text-xl font-bold text-white">Plain Text</h3>
        </div>
        <div className="bg-brand-navy-lighter p-4 rounded text-slate-300 break-all mb-4 border border-brand-navy max-h-40 overflow-y-auto text-sm">
          {decoded.raw}
        </div>
        <p className="text-sm text-slate-400 mb-6">This QR code contains plain text, not a link or payment request. No security scan is applicable.</p>
        <button onClick={clearAll} className="w-full py-3 border border-slate-600 hover:bg-slate-800 rounded-xl transition-colors text-white">Scan Another</button>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col pt-10"
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Scan QR Code</h2>
          <p className="text-slate-400 mb-10">Upload or scan a QR code to check for potential risks.</p>
        </div>
        {(preview || isCameraActive || decoded) && (
          <button onClick={clearAll} className="flex items-center gap-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 px-4 py-2 rounded-lg transition-colors">
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-5xl">
        <div className="flex-1 h-[320px]">
          {!decoded && !isCameraActive && (
            <div 
              className={`glass-panel border-2 border-dashed p-10 flex flex-col items-center justify-center text-center transition-colors h-full relative ${dragActive ? 'border-brand-cyan bg-brand-cyan/5' : 'border-slate-700 hover:border-brand-cyan/50'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !preview && fileInputRef.current.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/png, image/jpeg, image/webp" 
                onChange={handleChange}
              />

              {preview ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <div className="relative w-48 h-48">
                    <img src={preview} alt="QR Preview" className="w-full h-full object-contain rounded-lg opacity-80" />
                    <div className="absolute inset-0 border-2 border-brand-cyan rounded-lg">
                      <motion.div 
                        className="absolute left-0 right-0 h-0.5 bg-brand-cyan shadow-[0_0_8px_2px_rgba(0,229,255,0.5)]"
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      />
                    </div>
                  </div>
                  <p className="mt-4 text-brand-cyan animate-pulse">Analyzing Image...</p>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-brand-navy-lighter rounded-full mb-4">
                    <UploadCloud className="w-8 h-8 text-brand-cyan" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Drop your QR image here</h3>
                  <p className="text-slate-400 text-sm mb-4">or click to upload</p>
                  <p className="text-xs text-slate-500">Supports JPG, PNG, WEBP (Max 5MB)</p>
                </>
              )}
            </div>
          )}

          {isCameraActive && !decoded && (
            <div className="glass-panel overflow-hidden relative h-full flex flex-col items-center justify-center bg-black">
              <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover opacity-70" />
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-brand-cyan/50 relative">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand-cyan"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-brand-cyan"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-brand-cyan"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand-cyan"></div>
                  <motion.div 
                    className="absolute left-0 right-0 h-0.5 bg-brand-cyan shadow-[0_0_8px_2px_rgba(0,229,255,0.5)]"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              </div>
              
              <div className="absolute bottom-4 z-10 flex gap-4">
                <p className="bg-black/60 px-4 py-2 rounded-lg text-sm text-white">Point camera at QR code</p>
                <button onClick={stopCamera} className="bg-brand-red hover:bg-red-600 px-4 py-2 rounded-lg text-sm text-white transition-colors">Stop</button>
              </div>
            </div>
          )}

          {decoded && renderDecodedContent()}
          
        </div>

        <div className="w-full lg:w-80 flex flex-col gap-6">
          {!isCameraActive && !decoded && (
            <>
              <div className="flex items-center gap-4 text-slate-500">
                <div className="flex-1 h-px bg-slate-700"></div>
                <span className="text-sm uppercase tracking-wider font-semibold">OR</span>
                <div className="flex-1 h-px bg-slate-700"></div>
              </div>

              <button 
                className="flex items-center justify-center gap-3 w-full py-4 glass-panel hover:border-brand-cyan hover:bg-brand-cyan/5 transition-all text-slate-300 hover:text-white group"
                onClick={startCamera}
              >
                <Camera className="w-5 h-5 group-hover:text-brand-cyan transition-colors" />
                <span className="font-semibold">Open Camera</span>
              </button>
            </>
          )}

          {error && (
            <div className="p-4 bg-brand-red/10 border border-brand-red/20 rounded-xl text-brand-red text-sm flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="mt-auto p-4 bg-brand-navy-lighter rounded-xl border border-brand-navy flex gap-4">
            <AlertCircle className="w-6 h-6 text-brand-amber shrink-0" />
            <div>
              <h4 className="font-semibold text-brand-amber text-sm mb-1">Stay Alert</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Scammers often use fake QR codes for payments or to trick you into downloading malware. Always verify the source.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated API Tests Section for Presentation */}
      <div className="mt-12 p-6 border border-brand-navy-lighter bg-brand-navy-lighter/30 rounded-2xl max-w-5xl">
        <h3 className="text-brand-cyan/80 font-medium mb-4 flex items-center gap-2">
          Simulated API Tests:
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Use these buttons to inject test payloads into the scanner pipeline for demonstration.
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate('/scanning', { state: { target: 'https://safe-test.phishlens.local', type: 'qr' } })} className="px-4 py-2 rounded-lg bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 border border-[#00e5ff]/30 text-sm text-[#00e5ff] transition-colors">
            Simulated SAFE
          </button>
          <button onClick={() => navigate('/scanning', { state: { target: 'https://malicious-test.phishlens.local', type: 'qr' } })} className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-sm text-red-400 transition-colors">
            Simulated DANGER
          </button>
          <button onClick={() => navigate('/scanning', { state: { target: 'http://secure-update.bit.ly', type: 'qr' } })} className="px-4 py-2 bg-brand-amber/10 hover:bg-brand-amber/20 border border-brand-amber/30 text-brand-amber rounded-lg text-sm transition-colors">
            Simulate Suspicious URL
          </button>
          <button onClick={() => navigate('/scanning', { state: { target: 'https://example.com', type: 'qr' } })} className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-300 rounded-lg text-sm transition-colors">
            Simulate Normal URL
          </button>
          <button onClick={() => processDecodedData('upi://pay?pa=fake@bank&pn=Fake%20Support&am=5000&cu=INR')} className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg text-sm transition-colors">
            Simulate UPI Request
          </button>
          <button onClick={() => processDecodedData('This is just plain text, no link here.')} className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-300 rounded-lg text-sm transition-colors">
            Simulate Plain Text
          </button>
        </div>
      </div>

    </motion.div>
  );
}
