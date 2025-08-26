import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const {hashId} = await params;
    try{
        const dataResponse = await fetch(`https://ipfs.io/ipfs/${hashId}`);
        if (!dataResponse.ok) {
            return NextResponse.json({ success: false, data: null })
        }
        const productData = await dataResponse.json()
        return NextResponse.json({ success: true, data: productData});
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.message });
    }
}