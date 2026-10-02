# T51-PhishLens

## Project Overview
PhishLens is a modern, client-side cybersecurity dashboard designed to protect users from phishing attempts and malicious websites. It offers instantaneous, locally-executed heuristic analysis of URLs and QR codes to determine their safety before the user clicks or scans them. It features a premium, cybersecurity-inspired dark mode UI.

## Setup & Installation Instructions
To run PhishLens locally on your machine, follow these steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/daksheshsingh2351-ship-it/T51-PhishLens.git
   cd T51-PhishLens
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Key Features
- **URL Scanning:** Enter any URL to receive a heuristic breakdown of potential security issues (e.g., lack of HTTPS, IP-based domains, excessive subdomains, suspicious keywords).
- **QR Code Analysis:** Upload QR code images or use a device camera to instantly decode and analyze the embedded payload. It automatically differentiates between URLs, plain text, and UPI payment requests.
- **Simulated Test Environments:** Built-in simulated APIs for testing known Safe and Malicious URLs for demonstration purposes.
- **Client-Side Heuristics:** Uses an evidence-based risk scoring system operating completely within the browser without requiring a backend API.
- **Scan History:** Keeps a local record of your recently scanned URLs and their verdicts.

## Technology Stack
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS (with custom utility classes and animations)
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **QR Code Decoding:** jsQR
- **Routing:** React Router DOM

## Architecture / Workflow
PhishLens operates entirely on the client side. The architecture centers around a unified scanning engine (`Scanning.jsx`) that processes all URL payloads identically, regardless of whether they were manually typed or scanned from a QR code.
1. **Input:** User provides a URL string or a QR code (via image upload or camera).
2. **Decoding:** If a QR code is used, `jsQR` parses the image data to extract the raw string.
3. **Normalization:** The payload is checked and normalized (e.g., adding `https://` if a naked domain is provided).
4. **Analysis:** The `Scanning.jsx` engine evaluates the URL against a series of heuristic rules (HTTPS usage, suspicious keywords, URL shorteners, etc.) and assigns a risk score.
5. **Verdict:** The application classifies the link into one of three categories: `SAFE`, `CAUTION`, `DANGER`, or `UNVERIFIED` (if no definitive threats are found but it cannot be cryptographically proven safe).
6. **Result Display:** A detailed breakdown of the detected issues and the final risk score is displayed to the user.

## Dataset / API Information
PhishLens relies on **Client-Side Heuristics** for its primary threat detection. 

*Note: For the purposes of the TECHFORGE 2026 demonstration, the application includes simulated API responses to demonstrate how a backend integration would function. Specific test domains (`safe-test.phishlens.local` and `malicious-test.phishlens.local`) bypass heuristics to return guaranteed `SAFE` or `DANGER` verdicts, clearly labeled as `[Simulated Test Result]`. No live threat-intelligence API is currently integrated.*

## Screenshots / Demo Information
*(Add screenshots of the Dashboard, Scan URL, and QR Code analysis screens here)*

## Limitations & Future Scope
- **Current Limitations:** The application relies entirely on static, client-side heuristics. Without a backend threat-intelligence API, it cannot detect newly registered malicious domains that employ standard obfuscation tactics (like using HTTPS and normal-looking domains). Unknown URLs are correctly flagged as `UNVERIFIED` due to this limitation.
- **Future Scope:** Integration with live threat intelligence APIs (e.g., Google Safe Browsing or VirusTotal) via a secure backend proxy to provide real-time, real-world domain reputation verification.

## Team Members
- [Your Team Members]
