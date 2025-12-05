<!-- <!-- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
 -->
<!-- Overview

This project implements a blockchain-backed supply-chain tracking system using:

Hedera Smart Contracts (Hedera Hashgraph)

IPFS/Filebase for decentralized product metadata storage

MongoDB for off-chain product indexing

Next.js for frontend + backend API routes

QR Code–based verification

Each product maps to its own deployed smart contract, and each product batch is uploaded to IPFS. A QR code contains the IPFS CID, which is used by the consumer to verify authenticity.

System Flow (Important)
1. Create Product

User submits:
productName, price, location, etc.

API → deploys new Hedera contract

Returned contractId is stored in MongoDB along with product metadata

2. Create Batch

Batch data (serial number, date, manufacturer, etc.) uploaded to IPFS via Filebase

IPFS returns a CID

CID is stored inside the product’s smart contract via addProduct()
→ productContractId.addProduct(cid)

3. Consumer Scans QR Code

QR contains the IPFS hash:
https://yourapp.com/products/<CID>

4. Verification API

The verification process:

Step 1 — Fetch product record from MongoDB using the hash

(to determine which contract this hash belongs to)

Step 2 — Call the product’s smart contract

checkProduct(cid) → returns true/false

Step 3 — If valid → fetch metadata from IPFS

And render UI on /products/<CID>

🔧 Smart Contract System
SmartContract.sol

Stores:

mapping of valid product IPFS CIDs

event: ProductAdded(cid, timestamp)

functions:

addProduct(string[] calldata cid)

checkProduct(string cid) returns (bool)

Each product gets its own contract instance.

🔧 Environment Variables (.env)

Your .env MUST contain:

# ---- MongoDB ----
MONGODB_URI=your-mongo-connection-string

# ---- Hedera ----
HEDERA_OPERATOR_ID=0.0.xxxxx
HEDERA_OPERATOR_KEY=302e...
HEDERA_NETWORK=testnet

# (note: HEDERA_CONTRACT_ID is NOT universal)
# Each product stores its own contractId in MongoDB

# ---- Filebase (S3-Compatible) ----
FILEBASE_ACCESS_KEY=xxxxxx
FILEBASE_SECRET_KEY=xxxxxx
FILEBASE_BUCKET=your-bucket-name
FILEBASE_ENDPOINT=https://s3.filebase.com

# ---- App URL ----
PROD_URL=http://localhost:3000   # or your deployed domain

🔨 How to Run the Project
1. Install Dependencies
npm install

2. Create .env file

Paste the environment variables listed above.

3. Start Dev Server
npm run dev --> -->
# 🔗 Blockchain Supply Chain Tracker

> A decentralized supply-chain tracking system powered by Hedera Hashgraph, IPFS, and smart contracts

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Hedera](https://img.shields.io/badge/Hedera-Hashgraph-purple?style=flat)](https://hedera.com/)
[![IPFS](https://img.shields.io/badge/IPFS-Decentralized-blue?style=flat&logo=ipfs)](https://ipfs.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=flat&logo=mongodb)](https://www.mongodb.com/)

---

## 🌟 Overview

This project implements a **blockchain-backed supply-chain tracking system** that ensures product authenticity and transparency through immutable records. Built with cutting-edge Web3 technologies:

- **🔷 Hedera Smart Contracts** - Lightning-fast, eco-friendly blockchain
- **📦 IPFS/Filebase** - Decentralized product metadata storage
- **🗄️ MongoDB** - Off-chain product indexing for fast queries
- **⚡ Next.js** - Full-stack framework with API routes
- **📱 QR Code Verification** - Consumer-facing authenticity checks

Each product is represented by its own smart contract, and every batch is uploaded to IPFS with a unique Content Identifier (CID). Consumers scan QR codes to instantly verify product authenticity on the blockchain.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or cloud)
- Hedera testnet account
- Filebase account for IPFS storage

### Installation

```bash
# Clone the repository
git clone https://github.com/Carol-2005/qrcipher-hedera-demo.git
cd supply-chain-tracker

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

---

## 🔄 System Architecture

### Complete Product Journey

```
┌─────────────────────────────────────────────────────────────────┐
│  1. CREATE PRODUCT  →  2. CREATE BATCH  →  3. CONSUMER SCANS   │
└─────────────────────────────────────────────────────────────────┘
```

### 1️⃣ **Create Product**

Manufacturer registers a new product:

```javascript
// User Input
{
  productName: "Organic Coffee Beans",
  price: 25.99,
  location: "Colombia",
  manufacturer: "Bean Co."
}
```

**What Happens:**
- ✅ New Hedera smart contract deployed
- ✅ Contract ID stored in MongoDB
- ✅ Product metadata indexed for fast retrieval

---

### 2️⃣ **Create Batch**

Add a new production batch to the blockchain:

```javascript
// Batch Data
{
  serialNumber: "BATCH-2024-001",
  manufactureDate: "2024-03-15",
  expiryDate: "2025-03-15",
  quantity: 500
}
```

**What Happens:**
- 📤 Batch data uploaded to IPFS via Filebase
- 🔗 IPFS returns unique CID (Content ID)
- 🔐 CID stored in product's smart contract
  ```solidity
  productContract.addProduct(cid)
  ```

---

### 3️⃣ **Consumer Verification**

Customer scans QR code on product packaging:

```
QR Code → https://yourapp.com/products/<IPFS_CID>
```

**Verification Flow:**

```mermaid
graph LR
    A[Scan QR] --> B[Get CID]
    B --> C[Query MongoDB]
    C --> D[Find Contract]
    D --> E[Call Smart Contract]
    E --> F{Valid?}
    F -->|Yes| G[Fetch IPFS Data]
    F -->|No| H[Show Error]
    G --> I[Display Product Info]
```

**Step-by-Step:**
1. 🔍 Extract CID from QR code
2. 📊 Query MongoDB to find which contract owns this CID
3. 🔗 Call smart contract: `checkProduct(cid)`
4. ✅ If valid → Fetch metadata from IPFS
5. 🎨 Render product details on UI

---

## 🧩 Smart Contract System

### `SmartContract.sol`

Each product has its own deployed contract instance with these capabilities:

```solidity
contract ProductContract {
    // Storage
    mapping(string => bool) private validCIDs;
    
    // Events
    event ProductAdded(string cid, uint256 timestamp);
    
    // Functions
    function addProduct(string[] calldata cid) external;
    function checkProduct(string cid) external view returns (bool);
}
```

**Key Features:**
- ✅ Stores valid IPFS CIDs for product batches
- ✅ Emits blockchain events for transparency
- ✅ Immutable verification mechanism
- ✅ One contract per product for better organization

---

## ⚙️ Environment Configuration

Create a `.env` file in your project root:

```bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🗄️  DATABASE
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/supplychain

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🔷  HEDERA HASHGRAPH
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HEDERA_OPERATOR_ID=0.0.xxxxx
HEDERA_OPERATOR_KEY=302e020100300506032b657004220420...
HEDERA_NETWORK=testnet

# Note: HEDERA_CONTRACT_ID is NOT needed here
# Each product stores its own contractId in MongoDB

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 📦  FILEBASE (IPFS Storage)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILEBASE_ACCESS_KEY=your_access_key
FILEBASE_SECRET_KEY=your_secret_key
FILEBASE_BUCKET=supply-chain-bucket
FILEBASE_ENDPOINT=https://s3.filebase.com

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🌐  APPLICATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROD_URL=http://localhost:3000
# For production: https://your-domain.com
```

### 🔑 Getting Your Credentials

| Service | How to Get |
|---------|-----------|
| **MongoDB** | [Create free cluster](https://www.mongodb.com/cloud/atlas/register) on MongoDB Atlas |
| **Hedera** | [Create testnet account](https://portal.hedera.com/) and get test HBAR |
| **Filebase** | [Sign up for IPFS storage](https://filebase.com/) (free tier available) |

---




## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| 🔐 **Blockchain Security** | Immutable records on Hedera Hashgraph |
| 📦 **Decentralized Storage** | Product data stored on IPFS |
| ⚡ **Fast Verification** | Sub-second product authentication |
| 📱 **QR Code Scanning** | Easy consumer verification |
| 🔍 **Full Traceability** | Track products from origin to consumer |
| 💚 **Eco-Friendly** | Hedera's carbon-negative blockchain |

---

## 📚 Learn More

### Next.js Resources
- 📖 [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- 🎓 [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- 💬 [Next.js GitHub](https://github.com/vercel/next.js) - Feedback and contributions welcome

### Blockchain Resources
- 🔷 [Hedera Documentation](https://docs.hedera.com/)
- 📦 [IPFS Documentation](https://docs.ipfs.tech/)
- 🗄️ [MongoDB Documentation](https://www.mongodb.com/docs/)

---

## 🚀 Deployment

### Deploy on Vercel

The fastest way to deploy your Next.js app:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/supply-chain-tracker)

1. Click the button above
2. Import your repository
3. Add environment variables in Vercel dashboard
4. Deploy!

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with ❤️ using Next.js, Hedera, and IPFS**

⭐ Star this repo if you find it helpful!

</div>