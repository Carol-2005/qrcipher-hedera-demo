import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
    endpoint: 'https://s3.filebase.com',
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.FILEBASE_ACCESS_KEY,
        secretAccessKey: process.env.FILEBASE_SECRET_KEY
    },
    forcePathStyle: true
});

function generateHashFromObject(obj) {
    const dataString = JSON.stringify(obj);
    return crypto.createHash('sha256').update(dataString, 'utf8').digest('hex');
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

        const objectHash = generateHashFromObject(jsonData);
        const fileName = `${objectHash}.json`;
        console.log(`Uploading file: ${fileName}`);

        const putParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: fileName,
            Body: JSON.stringify(jsonData, null, 2),
            ContentType: 'application/json'
        };

        await s3.send(new PutObjectCommand(putParams));
        await new Promise(resolve => setTimeout(resolve, 100));

        const headParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: fileName
        };

        let headResult = await s3.send(new HeadObjectCommand(headParams));

        let cid = headResult.Metadata?.cid ||
                  headResult.Metadata?.['ipfs-hash'] ||
                  headResult.Metadata?.['x-amz-meta-cid'] ||
                  headResult.Metadata?.['x-amz-meta-ipfs-hash'];

        if (!cid) {
            console.warn('CID not found:', headResult.Metadata);

            await new Promise(resolve => setTimeout(resolve, 1000));

            headResult = await s3.send(new HeadObjectCommand(headParams));
            cid = headResult.Metadata?.cid ||
                  headResult.Metadata?.['ipfs-hash'] ||
                  headResult.Metadata?.['x-amz-meta-cid'] ||
                  headResult.Metadata?.['x-amz-meta-ipfs-hash'];

            if (!cid) {
                console.error('CID still not available after retry. Full metadata:', headResult.Metadata);
            }
        }

        return NextResponse.json({
            success: true,
            ipfsHash: cid || null,
            fileName: fileName,
            location: `https://${process.env.BUCKET_NAME}.s3.filebase.com/${fileName}`,
            objectHash: objectHash,
            warning: !cid ? 'CID not available yet, may need to check later' : undefined
        }, { status: 201 });

    } catch (error) {
        console.error('IPFS storage error:', error);

        if (error.name === 'NoSuchBucket') {
            return NextResponse.json({
                success: false,
                error: 'Bucket does not exist'
            }, { status: 400 });
        }
        if (error.name === 'InvalidAccessKeyId') {
            return NextResponse.json({
                success: false,
                error: 'Invalid access credentials'
            }, { status: 401 });
        }

        return NextResponse.json({ success: false, error: error.message || 'Upload failed' }, { status: 500 });
    }
}
