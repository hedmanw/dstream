import React from "react";
import EthClient from "../client/ethclient.js";

let CashComponent = React.createClass({
    getInitialState() {
        return {
            cash: 0
        };
    },

    refreshCash() {
        this.setState({cash: EthClient.getCash()});
    },

    componentDidMount() {
        this.refreshCash();
        this.token = EthClient.subscribe(this.refreshCash);
    },

    componentWillUnmount() {
        EthClient.unsubscribe(this.token);
    },

    render() {
        return <p>You have {this.state.cash} internet dollars!</p>
    }
});

export default CashComponent;

