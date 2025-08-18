import { NextResponse } from "next/server";
import { Hbar, TokenMintTransaction, PrivateKey, TokenId } from "@hashgraph/sdk";
import environmentSetup from "@/lib/setup";

export async function POST(req) {
    try {
        let serialNumbers = []
        const { supplyKeyStr, tokenIdStr, metadataArray } = await req.json();
        const client = await environmentSetup();

        const supplyKey = PrivateKey.fromStringDer(supplyKeyStr);
        const tokenId = TokenId.fromString(tokenIdStr);

        const maxTransactionFee = new Hbar(20);
            
        for (let i = 0; i < metadataArray.length; i += 10) {
            const segment = metadataArray.slice(i, i + 10);
            const CID = segment.map(c => Buffer.from(c));

            const mintTx = new TokenMintTransaction()
                .setTokenId(tokenId)
                .setMetadata(CID)
                .setMaxTransactionFee(maxTransactionFee)
                .freezeWith(client);

            const mintTxSign = await mintTx.sign(supplyKey);
            const mintTxSubmit = await mintTxSign.execute(client);
            const mintRx = await mintTxSubmit.getReceipt(client);

            console.log("Created NFT " + tokenId + " with serial number: " + mintRx.serials);
            serialNumbers.push(...mintRx.serials.map(s => s.toString()));
        }

        
        return NextResponse.json({ success: true, serialNumbers: serialNumbers });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, error: err });
    }
}