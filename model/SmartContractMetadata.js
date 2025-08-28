export const metadata = {
	"compiler": {
		"version": "0.8.30+commit.73712a01"
	},
	"language": "Solidity",
	"output": {
		"abi": [
			{
				"inputs": [],
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "string",
						"name": "ipfsCid",
						"type": "string"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"name": "ProductAdded",
				"type": "event"
			},
			{
				"inputs": [
					{
						"internalType": "string[]",
						"name": "_ipfsCids",
						"type": "string[]"
					}
				],
				"name": "addProduct",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "_cid",
						"type": "string"
					}
				],
				"name": "checkProduct",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			}
		],
		"devdoc": {
			"kind": "dev",
			"methods": {},
			"version": 1
		},
		"userdoc": {
			"kind": "user",
			"methods": {},
			"version": 1
		}
	},
	"settings": {
		"compilationTarget": {
			"contracts/ManageProductsOnly.sol": "ProductStorage"
		},
		"evmVersion": "prague",
		"libraries": {},
		"metadata": {
			"bytecodeHash": "ipfs"
		},
		"optimizer": {
			"enabled": false,
			"runs": 200
		},
		"remappings": []
	},
	"sources": {
		"contracts/ManageProductsOnly.sol": {
			"keccak256": "0x6f27b432facff233366b14eceb5967d1f68289ca39d26e8cb134a1c5a315ca8a",
			"license": "MIT",
			"urls": [
				"bzz-raw://44059f6bf66e616d09d231056d0feefff4d5b106d2af0f25c6b944a4104ed121",
				"dweb:/ipfs/Qme16rZnTcuSLPBTJ37xXcFFQ92m1EyWKvn8kXee4fMTug"
			]
		}
	},
	"version": 1
}