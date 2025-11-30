import { NextResponse } from "next/server";
import Product from "@/model/Product";
import { dbConnect } from "@/lib/connection";

export async function POST(req) {
    await dbConnect();

    try {
        const { productName, price, location } = await req.json();
        // if (tokenBasedFlag) {
        //     const response = await fetch('http:localhost:3000/api/NFT/createNFT', {
        //         method: 'POST',
        //         body: {
        //             productName: productName
        //         }
        //     });

        //     if (!response.ok) {
        //         throw new Error('Token Creation Failed');
        //     }
        //     const { supplyKey, tokenId } = await response.json();

        //     await Product.insertOne({
        //       tokenId: tokenId.toString(),
        //           name: productName,
        //         location: location,
        //         supplyKey: supplyKey.toStringDer(),
        //         price: price
        //     });
        // }
            const response = await fetch(`${process.env.PROD_URL}/api/contract/deploy-contract`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('Contract Deployment failed');
            }
            const { contractId } = await response.json();

            await Product.insertOne({
                name: productName,
                location: location,
                contractId: contractId,
                price: price
            })

        return NextResponse.json({ success: true, id: productName }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, err: err }, { status: 500 });
    }
}