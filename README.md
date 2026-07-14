# Stimulant (STIM) - ERC-20 Token

A comprehensive, production-ready ERC-20 token smart contract built on Ethereum with advanced features including minting, burning, and pause functionality.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contract Details](#contract-details)
- [Security](#security)
- [License](#license)

## ✨ Features

- **ERC-20 Compliant**: Full ERC-20 token standard implementation
- **Minting**: Owner can mint new tokens
- **Burning**: Tokens can be burned by owner or user
- **Pausable**: Owner can pause/unpause all transfers
- **Ownership**: Ownable pattern for access control
- **Event Logging**: Comprehensive event emissions for all operations
- **Gas Optimized**: Optimized smart contract for minimal gas consumption
- **Well Tested**: Complete test coverage with 20+ test cases
- **Verified**: Ready for Etherscan verification

## 📦 Prerequisites

- Node.js >= 16.x
- npm or yarn
- An Ethereum wallet with testnet ETH (for deployment)
- API keys for:
  - [Infura](https://infura.io/) - For RPC endpoints
  - [Etherscan](https://etherscan.io/apis) - For contract verification

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shooksphere/stimulant.git
   cd stimulant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   npx hardhat --version
   ```

## ⚙️ Configuration

1. **Create environment file**
   ```bash
   cp .env.example .env
   ```

2. **Update .env with your credentials**
   ```env
   PRIVATE_KEY=0xee89ecebba279d85cef41d9774672c61fc2b21e0a2c93db2339f66e62c567c7f
INFURA_API_KEY=b8a94ea981e04eb1a482ef526c0e4430
ETHERSCAN_API_KEY=C6B51H8FR31KNXREX2WS2WRHP4PXG3WDJI
REPORT_GAS=true
   ```

⚠️ **IMPORTANT**: Never commit `.env` file or expose your private key!

## 🔨 Compilation

Compile the smart contract:

```bash
npm run compile
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
npm run test
```

Generate coverage report:

```bash
npm run test:coverage
```

## 📤 Deployment

### Local Network (Hardhat)

```bash
npx hardhat node
```

Then in another terminal:

```bash
npm run deploy
```

### Sepolia Testnet

```bash
npm run deploy:sepolia
```

### Mainnet

```bash
npm run deploy:mainnet
```

## 📄 Contract Details

**Token Information**:
- Name: Stimulant
- Symbol: STIM
- Decimals: 18
- Initial Supply: 1,000,000 STIM

## 🔒 Security

The contract uses audited OpenZeppelin contracts and follows Ethereum security best practices. See [SECURITY.md](SECURITY.md) for detailed security information.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for the Ethereum community**
