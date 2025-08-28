import { NextResponse } from "next/server";
import Product from "@/model/Product";
import { dbConnect } from "@/lib/connection";

export async function GET(req) {
    try {
        await dbConnect();
        
        const url = new URL(req.url);
        const id = url.searchParams.get('productId');

        const productDetails = await Product.findOne({
            _id: id
        });

        return NextResponse.json({ 
            success: true, 
            productName: productDetails.name,
            location: productDetails.location,
            price: productDetails.price
        }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}