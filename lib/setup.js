import { Client, Hbar } from "@hashgraph/sdk";

let client;

export default async function environmentSetup() {
    try {
        if (client) {
            console.log('Already created client...');
            return client;
        }
        console.log('Creating new client....');

        const accountId = process.env.ACCOUNT_ID;
        const privateKey = process.env.PRIVATE_KEY;

        if (!privateKey || !accountId) {
            console.log(`Account ID: ${accountId}\nPrivate key: ${privateKey}`);
            throw new Error('Missing Environment variables');
        }
        
        client = Client.forTestnet();

        client.setOperator(accountId, privateKey);
        client.setDefaultMaxTransactionFee(new Hbar(100));
        client.setDefaultMaxQueryPayment(new Hbar(10));

        return client;
    } catch (err) {
        console.log(err);
        throw new Error('Environment setup failed');
    }
}