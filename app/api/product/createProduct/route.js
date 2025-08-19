import { NextResponse } from "next/server";
import Product from "@/model/Product";
import environmentSetup from "@/lib/setup";
import { PrivateKey, TokenCreateTransaction, TokenType, TokenSupplyType } from "@hashgraph/sdk";
import { dbConnect } from "@/lib/connection";

export async function POST(req) {
    await dbConnect();

    try {
        const { productName, price, location } = await req.json();

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

        await Product.insertOne({
            name: productName,
            location: location,
            supplyKey: supplyKey.toStringDer(),
            tokenId: tokenId.toString(),
            price: price
        });

        return NextResponse.json({ success: true, id: productName });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, err: err });
    }
}