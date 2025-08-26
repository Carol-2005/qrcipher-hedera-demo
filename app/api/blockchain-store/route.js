import { NextResponse } from "next/server";
import { 
    Hbar, TokenMintTransaction, PrivateKey, TokenId, 
    AccountCreateTransaction, ContractFunctionParameters, ContractExecuteTransaction 
} from "@hashgraph/sdk";
import environmentSetup from "@/lib/setup";

async function mintTokens(client, supplyKeyStr, tokenIdStr, metadataArray) {
    let serialNumbers = [];
    const supplyKey = PrivateKey.fromStringDer(supplyKeyStr);
    const tokenId = TokenId.fromString(tokenIdStr);

    const maxTransactionFee = new Hbar(20);
        
    for (let i = 0; i < metadataArray.length; i += 10) {
        const segment = metadataArray.slice(i, i + 10);
        const CID = segment.map(c => Buffer.from(c));

        const mintTx = new TokenMintTransaction()
            .setTokenId(tokenId)
            .setMetadata(CID)
            .setMaxTransactionFee(maxTransactionFee)
            .freezeWith(client);

        const mintTxSign = await mintTx.sign(supplyKey);
        const mintTxSubmit = await mintTxSign.execute(client);
        const mintRx = await mintTxSubmit.getReceipt(client);

        console.log("Created NFT " + tokenId + " with serial number: " + mintRx.serials);
        serialNumbers.push(...mintRx.serials.map(s => s.toString()));
    }

    return serialNumbers
}

async function storeViaContract(client, metadataArray) {
    const newPrivateKey = await PrivateKey.generateECDSA();
    const newPublicKey = await newPrivateKey.publicKey;

    const transaction = new AccountCreateTransaction()
        .setECDSAKeyWithAlias(newPublicKey)
        .setInitialBalance(new Hbar(10));

    const txResponse = await transaction.execute(client);
    const receipt = await txResponse.getReceipt(client);
    const newAccountId = receipt.accountId;
    const evmAddress = `0x${newPublicKey.toEvmAddress()}`;

    console.log(`\nHedera Account created: ${newAccountId}`);
    console.log(`EVM Address: ${evmAddress}`);

    for (let i = 0; i < metadataArray.length; i += 10) {
        const segment = metadataArray.slice(i, i + 10);
        
        const storeProducts = new ContractExecuteTransaction()
            .setContractId(process.env.HEDERA_CONTRACT_ID)
            .setGas(270000)
            .setFunction("addProduct",
                new ContractFunctionParameters()
                    .addStringArray(segment)
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
        const { supplyKeyStr, tokenIdStr, metadataArray, tokenBasedFlag } = await req.json();
        const client = await environmentSetup();

        const start = performance.now();

        if (tokenBasedFlag) {
            serialNumbers = await mintTokens(client, supplyKeyStr, tokenIdStr, metadataArray);
        } else {
            serialNumbers = await storeViaContract(client, metadataArray);
        }

        const end = performance.now();
        console.log(`Time taken to store ${metadataArray.length} units - ${end - start}ms for ${tokenBasedFlag ? 'NFT':'Contracts'}`);
        
        return NextResponse.json({ success: true, serialNumbers: serialNumbers });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, error: err });
    }
}