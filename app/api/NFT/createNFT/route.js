import environmentSetup from "@/lib/setup";
import { NextResponse } from "next/server";
import { TokenCreateTransaction, Hbar, PrivateKey, TokenSupplyType, TokenType } from "@hashgraph/sdk";

export async function POST(request) {
    try {
        const { productName } = await req.json();

        const myPrivateKey = process.env.PRIVATE_KEY;
        const myAccountId = process.env.ACCOUNT_ID;

        const client = await environmentSetup();

        const supplyKey = PrivateKey.generate();
        const nftCreate = await new TokenCreateTransaction()
                                        .setTokenName(productName)
                                        .setTokenSymbol(`H${productName.toUpperCase()}`)
                                        .setTokenType(TokenType.NonFungibleUnique)
                                        .setDecimals(0)
                                        .setInitialSupply(0)
                                        .setTreasuryAccountId(myAccountId)
                                        .setSupplyType(TokenSupplyType.Infinite)
                                        .setSupplyKey(supplyKey)
                                        .freezeWith(client);

        console.log(`-Supply Key: ${supplyKey} \n`);

        const nftCreateTxSign = await nftCreate.sign(PrivateKey.fromString(myPrivateKey));
        const nftCreateSubmit = await nftCreateTxSign.execute(client);
        const nftCreateRx = await nftCreateSubmit.getReceipt(client);

        const tokenId = nftCreateRx.tokenId;
        console.log("Created NFT with Token ID: " + tokenId);

        return NextResponse.json({ success: true, tokenId: tokenId, supplyKey: supplyKey }, { status: 201 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, err: err }, { status: 500 });
    }
}