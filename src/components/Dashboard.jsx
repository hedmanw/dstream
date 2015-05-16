import React from "react";
import MovieBox from "./MovieBox.jsx";
import EthClient from "../client/ethclient.js";
import CashComponent from "./CashComponent.jsx";

let Dashboard = React.createClass({
    render() {
        return (
            <div className="container">
                <h1>
                    DDD - Dastardly Dstream Dashboard
                </h1>
                <p className="lead">pls seed torrentz.</p>
                <CashComponent/>
                <div className="row">
                    <div className="col-md-12">
                        <MovieBox/>
                        <hr />
                    </div>
                </div>
            </div>
        );
    }
});

export default Dashboard;
