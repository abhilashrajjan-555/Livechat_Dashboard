# Xtreme Online Solutions - Performance Dashboard 2025

![Dashboard Preview](https://img.shields.io/badge/Status-Live-00f3ff?style=for-the-badge&logo=react)

A high-performance, cyberpunk-themed analytics dashboard built to visualize Company, Employee, and Project metrics in real-time from Google Sheets data.

## 🚀 Live Demo
*[Insert your Vercel Link Here after deployment]*

## ✨ Features

### 📊 Multi-View Architecture
- **Company Performance**: High-level overview of total chats, leads, and global averages.
- **Employee Performance**: Deep dive into individual agent metrics with a dedicated sidebar filter.
- **Project Performance**: Analyze specific project verticals (e.g., Automotive, Merchandise).

### 🎨 Cyberpunk Aesthetic
- **Glassmorphism UI**: Translucent cards with backdrop blur.
- **Neon Color Coding**: 
  - **Company**: Cyan (#00f3ff)
  - **Employee**: Purple (#bc13fe)
  - **Project**: Lime Green (#39ff14)
- **Gold Standard**: Critical "FRT" (First Response Time) metrics highlighted in **Gold (#FFD700)** for visibility.

### 🛡️ Robust Data Handling
- **Real-time Sync**: Fetches live CSV data from Google Sheets.
- **Smart Aggregation**: Automatically sums volumes and averages rates based on the active view.
- **Sanitization**: Handles messy data (e.g., removes 's', '%', and text from number fields).

## 🛠️ Tech Stack
- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS (Custom Design System with Variables)
- **Charts**: [Recharts](https://recharts.org/)
- **Data Fetching**: [PapaParse](https://www.papaparse.com/)

## ⚡ Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/abhilashrajjan-555/Livechat_Dashboard.git
   ```
2. Navigate to the directory:
   ```bash
   cd Livechat_Dashboard
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment (Vercel)

1. Create a [Vercel](https://vercel.com) account.
2. Click **"Add New Project"**.
3. Select this GitHub Repository.
4. Click **Deploy**.
5. Vercel will detect it's a **Vite** project and handle the build settings automatically.

## 📝 License
This project is proprietary software of Xtreme Online Solutions.
