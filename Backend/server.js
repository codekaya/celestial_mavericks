const express = require('express');
const {Web3} = require('web3');
const cors = require('cors'); 

// Replace with your deployed contract address and ABI
const contractAddress = '0x95100ca6c667f635bDa30850a82b3feb91eBE46f'; // Update after deployment
const contractABI = [
    // ABI from compiled PredictionMarket.sol
    {
        "inputs": [{"internalType": "address", "name": "_usdc", "type": "address"}],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": false, "internalType": "uint256", "name": "marketId", "type": "uint256"},
            {"indexed": false, "internalType": "string", "name": "question", "type": "string"},
            {"indexed": false, "internalType": "uint256", "name": "resolutionDate", "type": "uint256"}
        ],
        "name": "MarketCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": false, "internalType": "uint256", "name": "marketId", "type": "uint256"},
            {"indexed": false, "internalType": "bool", "name": "outcome", "type": "bool"}
        ],
        "name": "MarketResolved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": false, "internalType": "uint256", "name": "marketId", "type": "uint256"},
            {"indexed": false, "internalType": "address", "name": "buyer", "type": "address"},
            {"indexed": false, "internalType": "bool", "name": "outcome", "type": "bool"},
            {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
            {"indexed": false, "internalType": "uint256", "name": "price", "type": "uint256"}
        ],
        "name": "SharesBought",
        "type": "event"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "_marketId", "type": "uint256"},
            {"internalType": "bool", "name": "_outcome", "type": "bool"},
            {"internalType": "uint256", "name": "_amount", "type": "uint256"},
            {"internalType": "uint256", "name": "_price", "type": "uint256"}
        ],
        "name": "buyShares",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_marketId", "type": "uint256"}],
        "name": "claimWinnings",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "string", "name": "_question", "type": "string"},
            {"internalType": "uint256", "name": "_resolutionDate", "type": "uint256"}
        ],
        "name": "createMarket",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "name": "markets",
        "outputs": [
            {"internalType": "string", "name": "question", "type": "string"},
            {"internalType": "uint256", "name": "resolutionDate", "type": "uint256"},
            {"internalType": "bool", "name": "resolved", "type": "bool"},
            {"internalType": "bool", "name": "outcome", "type": "bool"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "marketCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "_marketId", "type": "uint256"},
            {"internalType": "bool", "name": "_outcome", "type": "bool"}
        ],
        "name": "resolveMarket",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "usdc",
        "outputs": [{"internalType": "contract IERC20", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    }
];

const app = express();
const web3 = new Web3('https://polygon-rpc.com'); // Polygon RPC
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Middleware
app.use(express.json());
app.use(cors());

// API Endpoints
app.post('/createMarket', async (req, res) => {
    try {
        const { question, resolutionDate } = req.body;
        const accounts = await web3.eth.getAccounts(); // Assumes a default account is set
        const tx = await contract.methods.createMarket(question, resolutionDate).send({ from: accounts[0] });
        res.json({ success: true, transaction: tx });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/buyShares', async (req, res) => {
    try {
        const { marketId, outcome, amount, price } = req.body;
        const accounts = await web3.eth.getAccounts();
        const tx = await contract.methods.buyShares(marketId, outcome, amount, price).send({ from: accounts[0] });
        res.json({ success: true, transaction: tx });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/resolveMarket', async (req, res) => {
    try {
        const { marketId, outcome } = req.body;
        const accounts = await web3.eth.getAccounts();
        const tx = await contract.methods.resolveMarket(marketId, outcome).send({ from: accounts[0] });
        res.json({ success: true, transaction: tx });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/claimWinnings', async (req, res) => {
    try {
        const { marketId } = req.body;
        const accounts = await web3.eth.getAccounts();
        const tx = await contract.methods.claimWinnings(marketId).send({ from: accounts[0] });
        res.json({ success: true, transaction: tx });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3000, () => console.log('Backend running on port 3000'));