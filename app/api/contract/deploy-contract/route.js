import { NextResponse } from "next/server";
import { metadata } from "@/model/SmartContractMetadata";
import createContract from "@/lib/contract";
import fs from 'fs';

export async function GET(req) {
    try {
        const contractId = await createContract();
        console.log(contractId);

        const smartContractFile = await fs.readFileSync('./model/SmartContract.sol', 'utf8');
        const metadataString = JSON.stringify(metadata);
        
        const body = JSON.stringify({
            address: `0x${contractId.toEvmAddress()}`,
            chain: '296',
            files: {
                "metadata.json": metadataString,
                "ProductStorage.sol": smartContractFile,
            }
        });
        const result = await fetch('https://server-verify.hashscan.io/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })
        .then(response => {
            return response.json();
        })
        .catch(error => {
            console.log(error);
            throw new Error('Verification Falied');
        });

        return NextResponse.json({ success: true, contractId: `${contractId.realm}.${contractId.shard}.${contractId.num}` }, 
            { status: 201 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, error: err }, { status: 500 });
    }
}