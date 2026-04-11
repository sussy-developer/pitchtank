# 🚀 PitchTank - AI-Powered Startup Fundraising Platform

PitchTank is a premium, high-fidelity platform designed to bridge the gap between ambitious founders and sophisticated investors. Built with speed, security, and aesthetics in mind.

![PitchTank Dashboard](screenshot_dashboard.png)

## ✨ Key Features

- **🚀 Performance-Optimized**: Implements full route-based lazy loading and code splitting for lightning-fast initial loads.
- **🛡️ Secure Onboarding**: Role-based onboarding flows (Founder vs. Investor) with real-time Firestore persistence and data integrity.
- **📄 Smart Pitch Protection**: Automatic PDF watermarking for pitch decks to protect founder intellectual property.
- **🎨 Premium UI/UX**: State-of-the-art design system featuring glassmorphism, fluid animations, and a modern dark-mode aesthetic.
- **🧩 Modular Architecture**: Clean, decoupled component structure (Settings Tabs, Onboarding Steps, Shared Icon Library) for maximum developer productivity.

## 🛠️ Tech Stack

- **Frontend**: React (Vite)
- **Styling**: Vanilla CSS (Custom Variable System)
- **Backend/Auth**: Firebase (Firestore, Auth, Storage)
- **PDF Engine**: pdf-lib (Serverless Client-Side Watermarking)

## 📦 Project Structure

```text
src/
├── components/         # Modular UI components
│   ├── onboarding/     # Extracted questionnaire logic
│   ├── settings/       # Decoupled settings tabs
│   └── Icons.jsx       # Consolidated SVG library
├── hooks/              # Custom React hooks (AuthContext)
├── pages/              # Lazy-loaded route containers
├── routes/             # App routing and layout managers
└── styles/             # Global and component-specific styling
```

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Firebase**:
   Ensure your Firebase credentials are set up in `src/firebase.js`.

3. **Start Development**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

---

*Built with ❤️ by sussy-developer*
