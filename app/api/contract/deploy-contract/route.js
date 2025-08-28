import { NextResponse } from "next/server";
import createContract from "@/lib/contract";

export async function GET(req) {
    try {
        const contractId = await createContract();
        console.log(contractId);

        return NextResponse.json({ success: true, contractId: contractId }, { status: 201 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, error: err }, { status: 500 });
    }
}