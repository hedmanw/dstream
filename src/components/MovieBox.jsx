import React from "react";

let MovieBox = React.createClass({
    getInitialState() {
        return {
            items: [
            ]
        }
    },
    componentDidMount() {
    },
    componentWillUnmount() {
    },
    render() {
        return (
            <div>
            <h1>
              A long time ago, in a galaxy far far away...
            </h1>
            <p>(Här ska det vara film sen!)</p>
            </div>
        );
    }
});

export default MovieBox;
