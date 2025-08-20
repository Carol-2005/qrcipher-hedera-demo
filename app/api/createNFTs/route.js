import { NextResponse } from "next/server";
import { AccountCreateTransaction, PrivateKey, TokenCreateTransaction, TokenSupplyType, TokenType, 
    AccountId, Hbar, TokenMintTransaction } from "@hashgraph/sdk";
import environmentSetup from "@/lib/setup";

async function storeDataInIpfs(data) {
    try {
        const ipfsResponse = await fetch('http://localhost:3000/api/ipfs-store', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        //console.log("The ipfs response is",ipfsResponse);
        
        const result = await ipfsResponse.json();
        // console.log("The ipfs response after json is",result);
        
        if (!result.success) {
            return { success: false, errorMsg: "Failed to store data in IPFS" };
        }

        return { success: true, ipfsHash: result.ipfsHash };
    } catch (error) {
        console.error(error);
        return { success: false, errorMsg: error.message };
    }
}

export async function POST(req) {
    try {
        const myPrivateKey = process.env.PRIVATE_KEY;
        const myAccountId = process.env.ACCOUNT_ID;

        const client = await environmentSetup();

        const newPrivateKey = PrivateKey.generate();
        const newPublicKey = newPrivateKey.publicKey;

        const { tokens } = await req.json();
        // const contractId = await createContract(client);
        const supplyKey = PrivateKey.generate();

        const defaultReferenceToken = tokens[0];
        const nftCreate = await new TokenCreateTransaction()
                                        .setTokenName(defaultReferenceToken.pokemonName)
                                        .setTokenSymbol(`H${defaultReferenceToken.pokemonName.toUpperCase()}`)
                                        .setTokenType(TokenType.NonFungibleUnique)
                                        .setDecimals(0)
                                        .setInitialSupply(0)
                                        .setTreasuryAccountId(myAccountId)
                                        .setSupplyType(TokenSupplyType.Finite)
                                        .setMaxSupply(250)
                                        .setSupplyKey(supplyKey)
                                        .freezeWith(client);

        console.log(`-Supply Key: ${supplyKey} /n`);

        const nftCreateTxSign = await nftCreate.sign(PrivateKey.fromString(myPrivateKey));
        const nftCreateSubmit = await nftCreateTxSign.execute(client);
        const nftCreateRx = await nftCreateSubmit.getReceipt(client);

        const tokenId = nftCreateRx.tokenId;
        console.log("Created NFT with Token ID: " + tokenId);
        
        const maxTransactionFee = new Hbar(20);
        
        let CID = [];
        for (const token of tokens) {
            const ipfsResponse = await storeDataInIpfs(token);

            const ipfsHash = ipfsResponse.ipfsHash;
            const productUrl =`https://www.qrcipher.in/products/${ipfsHash + "bcf"}`;

            console.log(`IPFS CID for ${token.tokenId}: ${ipfsHash}`);

            const metadata = Buffer.from(JSON.stringify(productUrl));
            CID.push(metadata);
        }
            
        const mintTx = new TokenMintTransaction()
            .setTokenId(tokenId)
            .setMetadata(CID)
            .setMaxTransactionFee(maxTransactionFee)
            .freezeWith(client);

        const mintTxSign = await mintTx.sign(supplyKey);
        const mintTxSubmit = await mintTxSign.execute(client);
        const mintRx = await mintTxSubmit.getReceipt(client);

        console.log("Created NFT " + tokenId + " with serial number: " + mintRx.serials);
        return NextResponse.json({ success: true, tokenId: tokenId });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, error: err });
    }
}