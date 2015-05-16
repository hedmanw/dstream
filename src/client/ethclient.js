import ContractAddress from "../fixtures/contractAddress.js";
import ContractStructure from "../fixtures/contractStructure.js";
import web3 from "web3";

var listeners = [];

class EthClient {
    constructor() {
        try {
            web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"))
            this.chainFilter = web3.eth.filter('latest');
        }
        catch(e) {
            console.error("Could not contact Ethereum on localhost:8545 due to: %O", e);
        }
    }
    getCoinbase(success) {
        success(web3.eth.coinbase);
    }

    formatBalance(wei) {
        let unit = 'wei';

        if (wei > 10e18) {
            unit = 'ether';
        } else if (wei > 10e15) {
            unit = 'finney';
        }

        return (unit !== 'wei' ? web3.fromWei(wei, unit) : wei) + ' ' + unit;
    }

    getChain(success) {
        var createContent = function() {
            return {
                items: [
                    {label: "Coinbase", value: web3.eth.coinbase},
                    {label: "Accounts", value: web3.eth.accounts},
                    {
                        label: "Balance",
                        value: this.formatBalance(web3.eth.getBalance(web3.eth.coinbase))
                    }
                ]
            }
        }.bind(this);

        success(createContent());
        this.chainFilter.watch(function() {
            success(createContent());
        });
    }

    getPending(success) {
        let contract = this.contract;
        function createContent() {
            let latestBlock = web3.eth.blockNumber;
            return {
                items: [
                    {label: "Latest block", value: latestBlock},
                    {
                        label: "Latest block hash",
                        value: web3.eth.getBlock(latestBlock).hash
                    },
                    {
                        label: "Latest block timestamp",
                        value: Date(web3.eth.getBlock(latestBlock).timestamp)
                    },
                    {label: "Contract address", value: ContractAddress},
                ]
            }
        }
        success(createContent());
        web3.eth.filter('pending').watch(function() {
            success(createContent());
        });
    }

    setContract(contractAddress) {
        this.contract = new DStream(contractAddress);
    }

    confirmStreamedData(dataSize) {
        contract.confirm(dataSize);
    }

    redeemPayout() {
        contract.redeem();
    }

    unregisterChain() {
        this.chainFilter.stopWatching();
    }

    unregisterAll() {
        this.unregisterChain();
    }

    confirmStreamedData(dataSize) {
        contract.confirm(dataSize);
    }

    redeemPayout() {
        contract.redeem();
    }

    registerListener(callback) {
        listeners.push(callback);
    }

    unregisterListener(callback) {
        listeners = listeners.filter((a) => a != callback);
    }
}

let ethclient = new EthClient();
window.ethclient = ethclient;

export default ethclient;
