# Chumchon - Decentralized Social App for Solana Mobile

![Chumchon Logo](https://i.ibb.co/d4fcp5t5/chumchon.png)

Chumchon is a decentralized social app built for Solana Mobile, featuring token-gated communities, on-chain messaging, escrow trading, and meme challenges.

---

## 🚀 Features

- **User Profiles**: Create and customize your on-chain profile with NFT profile pictures
- **Token-Gated Groups**: Create and join exclusive communities based on token or NFT ownership
- **Messaging System**: Send messages in groups and tip content creators with SOL or SPL Tokens
- **Escrow System**: Securely trade tokens with other users through on-chain escrow in "Whale Groups"
- **Invite System**: Generate and share invite links to bring friends into groups
- **Meme Challenges**: Create AI-powered meme contests with SOL or token rewards
- **Educational Rewards**: Complete tutorials to earn SOL or token rewards

---

## 📱 Technology Stack

- **Frontend**: React Native (Expo) for Android
- **Blockchain**: Solana (Anchor Framework)
- **Mobile Integration**: Solana Mobile Stack (SMS)
- **Wallet**: Mobile Wallet Adapter (Phantom, Backpack, etc.)

---

## 🗂️ Project Structure

```
chumchon_mobile/
├── android/           # Android native project files
├── app/               # Expo Router entry (if used)
├── assets/            # Images, fonts, icons
├── chumchon_program/  # Solana Anchor program
├── components/        # React Native UI components
├── constants/         # App-wide constants
├── hooks/             # Custom React hooks
├── ios/               # iOS native project files (if needed)
├── src/               # Main app source code
│   ├── assets/
│   ├── components/
│   ├── contexts/
│   ├── idl/
│   ├── navigation/
│   ├── screens/
│   ├── services/
│   └── theme.ts
├── utils/             # Utility functions
├── App.tsx            # App entry point
├── app.json           # Expo config
├── package.json       # Project dependencies
├── tsconfig.json      # TypeScript config
└── ...
```

---

## 🛠️ Prerequisites

- **Node.js** (v16+)
- **Yarn** or **npm**
- **Android Studio** (for Android emulator/AVD) **or** a physical Android device
- **Solana CLI tools** ([Install Guide](https://docs.solana.com/cli/install-solana-cli-tools))
- **Anchor Framework** ([Install Guide](https://book.anchor-lang.com/chapter_2/installation.html))
- **Solana Wallet App** (e.g., [Phantom](https://phantom.app/), [Backpack](https://backpack.app/))
  - Set wallet to **devnet**
- **Expo Go** app (from Google Play) **or** an [Expo account](https://expo.dev/signup) (for EAS builds)

---

## ⚡ Installation & Running

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GHX5T-SOL/chumchon.git
   cd chumchon_mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Build the Android app (EAS Build):**
   ```bash
   npx eas build --profile development --platform android
   ```
   - Follow the prompts. You may need to log in to Expo.
   - When the build is ready, you can:
     - **On emulator:** Press `a` to open on Android emulator (if running)
     - **On device:** Scan the QR code with Expo Go or your camera app

4. **Start the Expo development server:**
   - Open a new terminal in `chumchon_mobile`:
   ```bash
   npx expo start
   ```
   - Press `a` to open on Android emulator, or scan the QR code with Expo Go on your device.

---

## 🧪 Testing

Run the Solana program tests:

```bash
cd chumchon_program
anchor test
```

---

## 🔐 Security

- Secure token transfers through escrow contracts
- Proper account validation in all instructions
- Protection against reentrancy attacks
- Comprehensive error handling

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Contact

- Website: 
- Email: 
- Twitter:
- Discord:

---

Built with ❤️ for the Solana Mobile Hackathon