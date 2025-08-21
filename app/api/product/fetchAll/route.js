import { NextResponse } from "next/server";
import Product from "@/model/Product";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/connection";

export async function GET(req) {
    try {
        await dbConnect();
        const products = await Product.find({});

        return NextResponse.json({ 
            success: true, 
            products: products
        })
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false });
    }
}