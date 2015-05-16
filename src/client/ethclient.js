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
