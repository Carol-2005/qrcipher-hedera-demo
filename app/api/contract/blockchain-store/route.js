import { NextResponse } from "next/server";
import { ContractId, ContractFunctionParameters, ContractExecuteTransaction } from "@hashgraph/sdk";
import environmentSetup from "@/lib/setup";

// async function mintTokens(client, supplyKeyStr, tokenIdStr, metadataArray) {
//     let serialNumbers = [];
//     const supplyKey = PrivateKey.fromStringDer(supplyKeyStr);
//     const tokenId = TokenId.fromString(tokenIdStr);

//     const maxTransactionFee = new Hbar(20);
        
//     for (let i = 0; i < metadataArray.length; i += 10) {
//         const segment = metadataArray.slice(i, i + 10);
//         const CID = segment.map(c => Buffer.from(c));

//         const mintTx = new TokenMintTransaction()
//             .setTokenId(tokenId)
//             .setMetadata(CID)
//             .setMaxTransactionFee(maxTransactionFee)
//             .freezeWith(client);

//         const mintTxSign = await mintTx.sign(supplyKey);
//         const mintTxSubmit = await mintTxSign.execute(client);
//         const mintRx = await mintTxSubmit.getReceipt(client);

//         console.log("Created NFT " + tokenId + " with serial number: " + mintRx.serials);
//         serialNumbers.push(...mintRx.serials.map(s => s.toString()));
//     }

//     return serialNumbers
// }

async function storeViaContract(client, metadataArray, contractId) {
    const CONTRACT_ID = ContractId.fromString(contractId);
    console.log("ContractId: ",CONTRACT_ID);

    for (let i = 0; i < metadataArray.length; i += 10) {
        const segment = metadataArray.slice(i, i + 10);
        
        const storeProducts = new ContractExecuteTransaction()
            .setContractId(CONTRACT_ID)
            .setGas(300000)
            .setFunction("addProduct",
                new ContractFunctionParameters().addStringArray(segment)
            );

        const storeProductsTx = await storeProducts.execute(client);
        const storeProductsRx = await storeProductsTx.getRecord(client);
        console.log("Contract execution record:", storeProductsRx);
    }

    return [];
}

export async function POST(req) {
    let serialNumbers = [];

    try {
        const { contractId, metadataArray } = await req.json();
        console.log(contractId);

        const client = await environmentSetup();

        const start = performance.now();
        
        serialNumbers = await storeViaContract(client, metadataArray, contractId);
        
        const end = performance.now();
        console.log(`Time taken to store ${metadataArray.length} units - ${end - start}ms`);
        
        return NextResponse.json({ success: true, runtime: (end - start) }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, error: err }, { status: 500 });
    }
}