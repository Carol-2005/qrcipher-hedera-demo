import environmentSetup from "@/lib/setup";
import { ContractCallQuery, ContractFunctionParameters } from "@hashgraph/sdk";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const client = await environmentSetup();
        const { ipfsHash } = await request.json();

        const params = new ContractFunctionParameters().addString(ipfsHash);
        const contractCallQuery = new ContractCallQuery()
            .setContractId(process.env.HEDERA_CONTRACT_ID)
            .setGas(100000)
            .setFunction("checkProduct", params);

        const contractCallResult = await contractCallQuery.execute(client);
        const returnValue = contractCallResult.getBool(0);

        if (returnValue) {
            return NextResponse.json({ success: true, message: "CID Verified" }, { status: 200 });
        }

        return NextResponse.json({ success: false, error: "CID Not Found" }, { status: 404 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: "Failed to Verify" }, { status: 500 });
    }
}