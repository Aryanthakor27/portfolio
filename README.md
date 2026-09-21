# Aryan Thakor — Full Stack Portfolio & CMS Studio 🚀

A modern, high-performance Full Stack Web Developer & Graphic Designer portfolio built with **React, Vite, Node.js/Express, and Tailwind CSS**. Features a custom interactive Admin CMS Dashboard with 2FA security, dynamic theme switching (Dark/Light mode), and full mobile responsiveness.

---

## ✨ Features

- 🌓 **Dynamic Theme System**: Seamless toggle between Dark Mode and Light Mode with high contrast and tailored color tokens.
- 🛠️ **Custom Admin CMS Studio**:
  - Direct Contact Details editor (Phone, WhatsApp, Email, Location, Availability).
  - Social Media Profiles Manager (Instagram, LinkedIn, GitHub, WhatsApp, etc.) with real-time add, edit, hide, and delete.
  - Resume / CV Document Manager with instant upload and cross-site sync.
  - Services, projects, and site content management.
- 🔐 **Enterprise-Grade Admin Security**:
  - Passcode protection with bcrypt hashing and session tokens.
  - Time-based One-Time Password (TOTP) / Google Authenticator 2FA support.
  - Emergency recovery keys.
- 📱 **100% Responsive Design**: Optimized for mobile phones, tablets, laptops, and ultra-wide displays.
- 🎨 **Design & Development Showcase**:
  - 48+ Web Projects gallery with live previews.
  - Graphic Design portfolio (Logos, Social Media Creatives, Branding, Retouching).
  - Verified certifications & credentials viewer.

---

## 📂 Project Architecture

```
My Portfolio/
├── frontend/                # React + Vite Client Application
│   ├── public/              # Static assets, images, documents
│   ├── src/
│   │   ├── components/      # Reusable UI components (Navbar, Footer, SocialIcon, etc.)
│   │   ├── context/         # ThemeContext, ContentContext (CMS Provider)
│   │   ├── pages/           # Home, About, Services, WebProjects, GraphicDesigns, Contact, AdminDashboard
│   │   ├── utils/           # Resume downloader, helper functions
│   │   └── index.css        # Core design system & theme overrides
│   └── package.json
│
├── backend/                 # Node.js + Express API & CMS Store
│   ├── controllers/         # API controllers for content, uploads, 2FA
│   ├── data/store/          # JSON data storage (siteContent.json, authConfig.json)
│   ├── routes/              # Express API route endpoints
│   ├── server.js            # Express server entry point
│   └── package.json
│
├── .gitignore               # Ignored dependencies and large design archives
└── README.md                # Project documentation
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/Aryanthakor27/portfolio.git
cd portfolio
```

### 2. Setup and run Backend
```bash
cd backend
npm install
npm run dev # Runs on http://localhost:5000
```

### 3. Setup and run Frontend
```bash
cd ../frontend
npm install
npm run dev # Runs on http://localhost:5173 or 5174
```

### 4. Build for Production
```bash
cd frontend
npm run build
```

---

## 👨‍💻 Author

**Aryan Thakor**
- **Role**: Senior Web Developer & Graphic Designer
- **Location**: Ahmedabad, Gujarat, India
- **Email**: [thakoraryan2002@gmail.com](mailto:thakoraryan2002@gmail.com)
- **LinkedIn**: [Aryan Thakor](https://linkedin.com/in/aryan-thakor)
- **GitHub**: [@Aryanthakor27](https://github.com/Aryanthakor27)

---

## 📄 License

This project is personal intellectual property of Aryan Thakor. All rights reserved.
