import ContractAddress from "../fixtures/contractAddress.js";
import ContractAbi from "../fixtures/contractAbi.js";
import ContractStructure from "../fixtures/contractStructure.js";
import web3 from "web3";
import PubSub from "pubsub-js";
import Q from "q";

web3.eth.getBalancePromise = Q.denodeify(web3.eth.getBalance);

var listeners = [];

class EthClient {
    constructor() {
        try {
            web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"))
            this.chainFilter = web3.eth.filter('latest');

            this.chainFilter.watch(() => {
                PubSub.publish('chain');
            })
        }
        catch(e) {
            console.error("Could not contact Ethereum on localhost:8545 due to: %O", e);
        }
        this.DStream = web3.eth.contract(ContractStructure.DStream);
        window.DStream = this.DStream;
    }

    getCoinbase(success) {
        success(web3.eth.coinbase);
    }

    getCash() {
        web3.eth.getBalancePromise(web3.eth.coinbase);
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

    deployContract(dataHash) {
        let address = web3.eth.sendTransaction({code: ContractAbi})
        this.setContract(address);
        this.contract.setData(dataHash, {value: 100})
    }

    setContract(contractAddress, callback) {
        this.contract = new this.DStream(contractAddress);
        window.contract = this.contract;
    }

    confirmStreamedData(address, amount) {
        contract.confirm(address, amount);
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

    subscribe(callback) {
        return PubSub.subscribe('chain', callback);
    }

    unsubscribe(token) {
        PubSub.unsubscribe(token);
    }
}

let ethclient = new EthClient();
window.ethclient = ethclient;

export default ethclient;
