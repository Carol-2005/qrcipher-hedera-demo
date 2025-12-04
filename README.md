<!-- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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
Overview

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

Project Structure
project-root/
 ├── app/
 │    ├── api/
 │    │    ├── contract/
 │    │    │     ├── deploy-contract/route.js
 │    │    │     ├── verifyCID/route.js
 │    │    ├── ipfs/
 │    │    │     ├── upload/route.js
 │    │    │     ├── find/[hash]/route.js
 │    ├── products/[hash]/page.js
 │
 ├── lib/
 │    ├── setup.js (Hedera client)
 │    ├── contract.js (deployment function)
 │    ├── connection.js (MongoDB connection)
 │
 ├── model/
 │    ├── Product.js
 │    ├── SmartContract.sol
 │    ├── SmartContractMetadata.js
 │
 ├── .env
 ├── package.json
 ├── README.md

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
npm run dev
