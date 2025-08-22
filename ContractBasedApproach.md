# Contract Based Approach

This approach leverages Hedera Smart Contracts to store and manage the IPFS CIDs of our products. Instead of minting NFTs & embedding metadata, we use a contract as a decentralized registry where each product batch or unit can have its corresponding CID recorded permanently on-chain.

The main motivation here is that smart contracts provide flexibility & programmability we can implement access control, validation, versioning, and batch storage logic within the contract. This ensures more granular governance compared to NFTs, where metadata is static after minting.

```mermaid
flowchart TD
    A[Supervisor Assigns Task] --> B[Task Contains Product Details]
    A --> C[Task goes to Line Manager]
    
    B --> D[Check if Product Contract exists]
    D -- Yes --> D1[Do nothing]
    D -- No --> D2[Create Contract for Product]

    C --> E[Line Manager creates batch]
    E --> F[Batch sent for QR generation]

    F --> G[Store all units in IPFS & retrieve the CIDs]

    G --> H[Send ProductID, BatchID & CIDs to Contract]
    D2 --> H

    H --> I[Store CIDs via Contract individually ]
```

