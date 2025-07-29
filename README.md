# Chumchon - Decentralized Social App for Solana Mobile

![Chumchon Logo](https://i.ibb.co/7tw4D4MM/logo.png)

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

## 🛠️ Prerequisites to preview UI demo


- **Android** (for Android emulator/AVD) **or** a physical Android device

- **Solana Wallet App** (e.g., [Phantom](https://phantom.app/), [Backpack](https://backpack.app/))
  - Set wallet to **devnet**
---

## ⚡ Installation & Running

1. **Download and Install the APK:**
   https://expo.dev/accounts/ghxstxbt/projects/chumchon/builds/1f8f002d-9350-45a9-8402-79dbe442214d


[QR CODE] (hhttps://i.ibb.co/MDnbt711/Screenshot-2025-07-29-at-17-39-44.png)

  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
   Or for preview on web: https://chumchon--demo.expo.app/


## 🧪 Testing

Run the Solana program tests:

```bash
git clone https://github.com/GHX5T-SOL/chumchon.git
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
- Twitter: https://x.com/chumchon_app

---

Built with ❤️ for the Solana Mobile Hackathon