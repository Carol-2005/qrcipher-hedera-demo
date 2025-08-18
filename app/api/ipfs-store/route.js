import AWS from 'aws-sdk';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const s3 = new AWS.S3({
    endpoint: 'https://s3.filebase.com',
    accessKeyId: process.env.FILEBASE_ACCESS_KEY,
    secretAccessKey: process.env.FILEBASE_SECRET_KEY,
    s3ForcePathStyle: true,
    signatureVersion: 'v4'
});

function generateHashFromObject(obj) {
    const dataString = JSON.stringify(obj);
    const hash = crypto.createHash('sha256').update(dataString, 'utf8').digest('hex');
    return hash;
}

export async function POST(request) {
    try {
        const jsonData = await request.json();
        
        if (!jsonData || Object.keys(jsonData).length === 0) {
            return NextResponse.json({
                success: false,
                error: 'No data provided'
            }, { status: 400 });
        }
        const objectHash = await generateHashFromObject(jsonData);
        const fileName = `${objectHash}.json`;
        console.log(`Uploading file: ${fileName}`);
        
        const uploadParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: fileName,
            Body: JSON.stringify(jsonData, null, 2),
            ContentType: 'application/json'
        };
        const uploadResult = await s3.upload(uploadParams).promise();

        await new Promise(resolve => setTimeout(resolve, 100));

        const headParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: fileName
        };
        const headResult = await s3.headObject(headParams).promise();
        
        const cid = headResult.Metadata?.cid || 
                headResult.Metadata?.['ipfs-hash'] || 
                headResult.Metadata?.['x-amz-meta-cid'] ||
                headResult.Metadata?.['x-amz-meta-ipfs-hash'];
        
        if (!cid) {
            console.warn('CID not found:', headResult.Metadata);

            await new Promise(resolve => setTimeout(resolve, 1000));
            const retryHeadResult = await s3.headObject(headParams).promise();
            const retryCid = retryHeadResult.Metadata?.cid || 
                            retryHeadResult.Metadata?.['ipfs-hash'] || 
                            retryHeadResult.Metadata?.['x-amz-meta-cid'] ||
                            retryHeadResult.Metadata?.['x-amz-meta-ipfs-hash'];
            
            if (!retryCid) {
                console.error('CID still not available after retry. Full metadata:', retryHeadResult.Metadata);
            }
            
            return NextResponse.json({
                success: true,
                ipfsHash: retryCid || null,
                fileName: fileName,
                location: uploadResult.Location,
                objectHash: objectHash,
                warning: !retryCid ? 'CID not available yet, may need to check later' : undefined
            });
        }
        
        return NextResponse.json({
            success: true,
            ipfsHash: cid,
            fileName: fileName,
            location: uploadResult.Location,
            objectHash: objectHash
        });
        
    } catch (error) {
        console.error('IPFS storage error:', error);
        
        if (error.code === 'NoSuchBucket') {
            return NextResponse.json({
                success: false,
                error: 'Bucket does not exist'
            }, { status: 400 });
        }
        if (error.code === 'InvalidAccessKeyId') {
            return NextResponse.json({
                success: false,
                error: 'Invalid access credentials'
            }, { status: 401 });
        }
        
        return NextResponse.json({ success: false, error: error.message || 'Upload failed'}, { status: 500 });
    }
}