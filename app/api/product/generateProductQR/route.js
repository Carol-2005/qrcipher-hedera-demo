import pLimit from 'p-limit';
import axios from 'axios';
import { NextResponse } from "next/server";
import Product from '@/model/Product';
import { dbConnect } from '@/lib/connection';

const limit = pLimit(30);
let errorQRs = [];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

async function storeDataInIpfs(data) {
    try {
        const ipfsResponse = await fetch(`${process.env.PROD_URL}/api/ipfs/store`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        // console.log("The ipfs response is",ipfsResponse);
        
        const result = await ipfsResponse.json();
        // console.log("The ipfs response after json is",result);
        
        if (!result.success) {
            return { success: false, errorMsg: "Failed to store data in IPFS" };
        }

        return { success: true, ipfsHash: result.ipfsHash };
    } catch (error) {
        console.error(error);
        return { success: false, errorMsg: error.message };
    }
}

async function storeHashOnBlockchain(ipfsHashArray, contractId) {
    try {
        console.log(contractId);
        const chainResponse = await axios.post(`${process.env.PROD_URL}/api/contract/blockchain-store`, {
                contractId: contractId,
                metadataArray: ipfsHashArray,
            }, {
                timeout: 18000000
        });

        if (chainResponse.status != 200) {
            return { success: false, errorMsg: "Failed to Store data on blockchain"}
        } 
        console.log("Response From Blockchain");

        const chainData = await chainResponse.data;
        return {success: true, runtime: chainData.runtime};
    } catch (error) {
        console.log(error);
        return { success: false, errorMsg: error.message };
    }
}

async function processBatches(productData, manufacturerName, contractId, tokenBasedFlag) {
    console.log("The processBatches function is hit");

    const {
        productName,
        location,
        createdAt,
        productPrice,
        batchNo,
        unitsCreated,
        startSerial,
    } = productData;

    const tasks = Array.from({ length: unitsCreated }, (_, i) => {
        const serialNumber = String(startSerial + i);
        const formattedDate = new Date(createdAt).toISOString().slice(0, 10).replace(/-/g, '');

        const data = {
            product_name: productName,
            batch_number: batchNo,
            location,
            date: formattedDate,
            productPrice,
            serial_number: serialNumber,
            weight: '12',
            man_name: manufacturerName,
        };

        return async () => {
            const ipfsResponse = await storeDataInIpfs(data);

            if (!ipfsResponse.success) {
                errorQRs.push({ productData: data, error: ipfsResponse.errorMsg });
                return { data, url: '' };
            }

            const ipfsHash = ipfsResponse.ipfsHash;
            const productUrl = `${process.env.PROD_URL}/products/${ipfsHash}`;
            
            console.log(`IPFS CID for ${data.serial_number}: ${ipfsHash}`);

            return { data, url: productUrl, cid: ipfsHash };
        };
    });

    const batchedTasks = chunkArray(tasks, 30);
    let results = [], metadataArray = [];


    for (const batch of batchedTasks) {
        const batchResults = await Promise.all(batch.map(task => limit(task)));
        results.push(...batchResults);

        const batchCids = batchResults.map(r => r.cid).filter(Boolean);
        metadataArray.push(...batchCids);

        await sleep(300);
    }

    const batchSize = 100;
    const blockchainChunks = chunkArray(metadataArray, batchSize);

    const blockchainTasks = blockchainChunks.map((batch, idx) =>
        limit(async () => {
            return await storeHashOnBlockchain(batch, contractId);
        })
    );

    const blockchainResults = await Promise.all(blockchainTasks);
    console.log(blockchainResults);

    return {results: results, contractRuntime: blockchainResults?.runtime};
}

export async function POST(req) {
    try {
        await dbConnect();

        const {
            productName,
            location,
            createdAt,
            productPrice,
            batchNo,
            endSerialNumber,
            startSerial,
            manufacturerName,
        } = await req.json()

        const unitsCreated = endSerialNumber - startSerial + 1;
        const productData = {
            productName,
            location,
            createdAt,
            productPrice,
            batchNo,
            unitsCreated,
            startSerial
        };

        const productDetails = await Product.findOne({
            name: productName
        });
        console.log(productDetails);

        if (!productDetails) {
            console.log('Product not found')
            return NextResponse.json({ success: false, err: 'Products not found' }, { status: 404 });
        }

        console.log(productDetails.contractId);
        const processResponse = await processBatches(productData, manufacturerName, productDetails.contractId, false);
        const results = processResponse.results;

        if (!results || results.length < 1) {
            throw new Error('No QRs created... Some Error Occured...');
        }
        if (results.length > 1) {
            const response = await axios.post(`${process.env.PROD_URL}/api/product/generatePDF`, {
                dataArray: results,
                email: 'carol.lobo2005@gmail.com'
            });
            const responseData = await response.data;

            if (response.status !== 200) {
                console.log(responseData.error);
                throw new Error('PDF Generation Failed...');
            }
            return NextResponse.json({
                success: true, ipfsHash: 'PDF sent to Your Email', url: 'Check Mail', runtime: processResponse.results,
                numQRcodes: results.length
            }, { status: 201 });
        }
        return NextResponse.json({ 
            success: true, ipfsHash: results[0].cid, url: results[0].url, runtime: processResponse.results 
        }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}