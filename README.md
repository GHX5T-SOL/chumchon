# Chumchon - Decentralized Social Network on Solana

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-blue.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
[![Platform: Android](https://img.shields.io/badge/Platform-Android-green.svg)](https://developer.android.com/)
[![Framework: React Native](https://img.shields.io/badge/Framework-React%20Native-blue.svg)](https://reactnative.dev/)
[![Blockchain: Solana](https://img.shields.io/badge/Blockchain-Solana-purple.svg)](https://solana.com/)
[![Mobile Wallet Adapter](https://img.shields.io/badge/MWA-Supported-orange.svg)](https://docs.solanamobile.com/mobile-wallet-adapter/web-installation)
[![Solana Mobile Stack](https://img.shields.io/badge/SMS-Implemented-red.svg)](https://docs.solanamobile.com/developers/overview)

![Chumchon Logo](https://i.ibb.co/7tw4D4MM/logo.png)

> **A decentralized social app built for Solana Mobile, featuring token-gated communities, on-chain messaging, escrow trading, and meme challenges.**

---

## 📋 Table of Contents

- [🚀 Features](#-features)
- [🔧 Technology Stack](#-technology-stack)
- [📱 Solana Mobile Stack Implementation](#-solana-mobile-stack-implementation)
- [🗂️ Project Structure](#️-project-structure)
- [⚡ Quick Start](#-quick-start)
- [🛠️ Prerequisites](#️-prerequisites)
- [📦 Installation](#-installation)
- [🧪 Testing](#-testing)
- [🔐 Security](#-security)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📞 Contact](#-contact)

---

## 🚀 Features

### Core Social Features
- **👤 User Profiles**: Create and customize your on-chain profile with NFT profile pictures
- **🔒 Token-Gated Groups**: Create and join exclusive communities based on token or NFT ownership
- **💬 Messaging System**: Send messages in groups and tip content creators with SOL or SPL Tokens
- **🤝 Escrow System**: Securely trade tokens with other users through on-chain escrow in "Whale Groups"
- **📨 Invite System**: Generate and share invite links to bring friends into groups

### Gamification & Rewards
- **🎭 Meme Challenges**: Create AI-powered meme contests with SOL or token rewards
- **📚 Educational Rewards**: Complete tutorials to earn SOL or token rewards
- **🏆 Community Contests**: Participate in community-driven challenges and competitions

### Mobile-First Experience
- **📱 Native Mobile App**: Built specifically for Android with React Native
- **🔗 Wallet Integration**: Seamless connection with Phantom, Backpack, and other mobile wallets
- **⚡ Fast Transactions**: Optimized for mobile blockchain interactions

---

## 🔧 Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| **Frontend** | React Native (Expo) | Latest |
| **Blockchain** | Solana (Anchor Framework) | Latest |
| **Mobile Integration** | Solana Mobile Stack (SMS) | Latest |
| **Wallet Support** | Mobile Wallet Adapter (MWA) | Latest |
| **Language** | TypeScript | Latest |
| **State Management** | React Context | Built-in |
| **Storage** | AsyncStorage | React Native |

---

## 📱 Solana Mobile Stack Implementation

### ✅ Mobile Wallet Adapter (MWA)
- **Wallet Authorization**: Secure connection to mobile wallets (Phantom, Backpack, Solflare)
- **Transaction Signing**: Native transaction signing through mobile wallets
- **Message Signing**: Off-chain message signing for authentication
- **Session Management**: Persistent wallet sessions with automatic reauthorization

### ✅ MWA Authorization Caching
- **Persistent Sessions**: Users stay connected between app sessions
- **Smart Reauthorization**: Automatic wallet reconnection on app restart
- **Cache Invalidation**: Proper cleanup on disconnect/deauthorize
- **Error Recovery**: Handles corrupt cache data gracefully

### ✅ Sign In with Solana (SIWS)
- **Combined Authentication**: Single-step wallet verification
- **Cryptographic Verification**: Verifies signature authenticity
- **Domain-Specific Signing**: Customized signing messages for security
- **Enhanced Security Model**: Prevents impersonation attacks

### ✅ Wallet Discovery
- **Dynamic Detection**: Discovers installed mobile wallets
- **Multi-Wallet Support**: Works with Phantom, Backpack, Solflare
- **Wallet Status Monitoring**: Shows wallet readiness and connection status

### ✅ Expo Integration
- **Native UI Components**: Uses Expo's bottom sheet for wallet interactions
- **Cross-Platform Ready**: Optimized for Android with iOS compatibility
- **Phantom Wallet Support**: Enhanced integration with Phantom mobile wallet

---

## 🗂️ Project Structure

```
chumchon_mobile/
├── android/                    # Android native project files
├── app/                        # Expo Router entry (if used)
├── assets/                     # Images, fonts, icons
├── chumchon_program/           # Solana Anchor program
├── components/                 # React Native UI components
│   ├── solana/                # Solana-specific components
│   │   └── WalletDiscovery.tsx # Wallet discovery component
│   └── ...
├── constants/                  # App-wide constants
├── hooks/                     # Custom React hooks
├── ios/                       # iOS native project files (if needed)
├── src/                       # Main app source code
│   ├── assets/
│   ├── components/
│   ├── contexts/
│   │   └── SolanaProvider.tsx # Core Solana context with MWA
│   ├── idl/
│   ├── navigation/
│   ├── screens/
│   │   └── auth/
│   │       └── LoginScreen.tsx # Wallet connection UI
│   ├── services/
│   ├── utils/
│   │   └── siws.ts            # Sign In with Solana utilities
│   └── theme.ts
├── utils/                     # Utility functions
├── App.tsx                    # App entry point with MWA setup
├── app.json                   # Expo config with MWA plugin
├── package.json               # Project dependencies
├── tsconfig.json              # TypeScript config
└── README.md                  # This file
```

---

## ⚡ Quick Start

### 🎯 For Users
1. **Download the APK**: [Direct Download Link](https://expo.dev/accounts/ghxstxbt/projects/chumchon/builds/1f8f002d-9350-45a9-8402-79dbe442214d)
2. **Install on Android**: Open the APK file and install
3. **Connect Wallet**: Open the app and connect your Solana mobile wallet
4. **Start Socializing**: Join groups, send messages, and participate in challenges!

### 🔧 For Developers
```bash
# Clone the repository
git clone https://github.com/GHX5T-SOL/chumchon.git
cd chumchon_mobile

# Install dependencies
npm install

# Start the development server
npm start

# Run on Android
npm run android
```

---

## 🛠️ Prerequisites

### For Users
- **Android Device**: Android 8.0+ or Android emulator
- **Solana Mobile Wallet**: [Phantom](https://phantom.app/), [Backpack](https://backpack.app/), or [Solflare](https://solflare.com/)
- **Devnet Configuration**: Set wallet to **devnet** for testing

### For Developers
- **Node.js**: Version 18 or higher
- **npm** or **yarn**: Package manager
- **Android Studio**: For Android development
- **Expo CLI**: For React Native development
- **Solana CLI**: For blockchain interactions

---

## 📦 Installation

### Option 1: Direct APK Download (Recommended)
1. **Download APK**: [Download Link](https://expo.dev/accounts/ghxstxbt/projects/chumchon/builds/1f8f002d-9350-45a9-8402-79dbe442214d)
2. **Enable Unknown Sources**: Go to Settings > Security > Unknown Sources
3. **Install APK**: Open the downloaded file and install
4. **Launch App**: Open Chumchon from your app drawer

### Option 2: QR Code Installation
![QR Code](https://i.ibb.co/MDnbt711/Screenshot-2025-07-29-at-17-39-44.png)

### Option 3: Web Preview
Visit: https://chumchon--demo.expo.app/

### Option 4: Development Setup
```bash
# Install dependencies
npm install

# Start Expo development server
npx expo start

# Scan QR code with Expo Go app
# Or press 'a' for Android emulator
```

---

## 🧪 Testing

### Solana Program Tests
```bash
# Navigate to the program directory
cd chumchon_program

# Run Anchor tests
anchor test

# Run specific test file
anchor test --skip-local-validator
```

### Mobile App Tests
```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

### Wallet Integration Tests
- Test with Phantom mobile wallet
- Test with Backpack mobile wallet
- Test with Solflare mobile wallet
- Verify MWA authorization caching
- Test SIWS functionality

---

## 🔐 Security

### Blockchain Security
- **Secure Token Transfers**: All transfers go through escrow contracts
- **Account Validation**: Comprehensive validation in all Solana instructions
- **Reentrancy Protection**: Protection against reentrancy attacks
- **Error Handling**: Robust error handling and recovery

### Mobile Security
- **MWA Security**: Secure wallet connections through Mobile Wallet Adapter
- **SIWS Verification**: Cryptographic verification of wallet ownership
- **Cache Security**: Secure storage of authorization tokens
- **Session Management**: Proper session cleanup and invalidation

### Data Security
- **Encrypted Storage**: Sensitive data encrypted in AsyncStorage
- **Network Security**: Secure communication with Solana network
- **Input Validation**: Comprehensive input validation and sanitization

---

## 🤝 Contributing

We welcome contributions to Chumchon! Here's how you can help:

### 🐛 Reporting Bugs
1. Check existing issues first
2. Create a new issue with detailed description
3. Include steps to reproduce
4. Add screenshots if applicable

### 💡 Suggesting Features
1. Open a feature request issue
2. Describe the feature in detail
3. Explain the use case and benefits
4. Consider implementation complexity

### 🔧 Code Contributions
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 📝 Code Style
- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Write tests for new features
- Follow React Native conventions

---

## 📄 License

This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/) - see the [LICENSE](LICENSE) file for details.

### **🔒 License Terms:**

**✅ You are free to:**
- **Share** — Copy and redistribute the material in any medium or format
- **Adapt** — Remix, transform, and build upon the material for personal/educational use
- **Attribution** — Must give appropriate credit to Chumchon Team

**❌ Restrictions:**
- **NonCommercial** — You may not use this material for commercial purposes
- **No Rebranding** — You may not claim this work as your own
- **Commercial Use** — Requires explicit permission from Chumchon Team

### **💼 Commercial Licensing:**
For commercial use, enterprise licensing, or business partnerships, please contact:
- **Email**: [chumchon@proton.me](mailto:chumchon@proton.me)
- **Website**: [https://chumchon.app](https://chumchon.app)

**CC BY-NC 4.0 Benefits:**
- ✅ Protects intellectual property rights
- ✅ Allows personal and educational use
- ✅ Requires attribution to original creators
- ✅ Prevents commercial exploitation without permission
- ✅ Encourages community learning and collaboration

---

## 📞 Contact

| Platform | Link |
|----------|------|
| **🌐 Website** | [https://chumchon.app](https://chumchon.app) |
| **🐦 Twitter** | [https://x.com/chumchon_app](https://x.com/chumchon_app) |
| **📧 Email** | [chumchon@proton.me](mailto:chumchon@proton.me) |
| **📱 GitHub** | [https://github.com/GHX5T-SOL/chumchon](https://github.com/GHX5T-SOL/chumchon) |

---

## 🙏 Acknowledgments

- **Solana Mobile Team**: For the amazing Mobile Wallet Adapter and Solana Mobile Stack
- **Expo Team**: For the excellent React Native development platform
- **Anchor Framework**: For simplifying Solana program development
- **Phantom Wallet**: For leading mobile wallet innovation
- **Codigo.ai**: For troubleshooting bugs in Solana Program / smart contracts

---

<div align="center">

**Built with ❤️ for the Solana Mobile Hackathon**

[![Solana Mobile](https://img.shields.io/badge/Solana%20Mobile-Hackathon%20Project-purple.svg)](https://docs.solanamobile.com/)
[![Made with Love](https://img.shields.io/badge/Made%20with-Love-red.svg)](https://github.com/GHX5T-SOL/chumchon)

</div>