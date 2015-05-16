import React from "react";

let SeedPanel = React.createClass({
    render() {
        return <div className="container">
            <PaymentWarning/>
            <p>Hej!</p>
        </div>
    }
});

let PaymentWarning = React.createClass({
    render() {
        return <div className="alert alert-danger" role="alert">
            <strong>Oh snap! </strong> You're not receiving payment! Stop streaming at once unless you're some kind of communist!
        </div>
    }
});

export default SeedPanel;

