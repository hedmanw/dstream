import React from "react";
import KeyValue from "./KeyValue.jsx";

let InfoBox = React.createClass({
    getInitialState() {
        return {
            items: [
            ]
        }
    },
    componentDidMount() {
        this.props.updateLoop(function(items) {
            this.setState(items);
        }.bind(this));
    },
    componentWillUnmount() {
        this.props.unregister();
    },
    render() {
        var pendingNodes = this.state.items.map(function (item) {
          return (
              <KeyValue key={item.label} label={item.label}>{item.value}</KeyValue>
          );
        });
        return (
            <div>
            {pendingNodes}
            </div>
        );
    }
});

export default InfoBox;
