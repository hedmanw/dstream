import React from "react";

let SeedPanel = React.createClass({
    render() {
        let warning = false ? <PaymentWarning/> : null;

        return <div className="container">
        {warning}
        <SeedFile/>
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


let SeedFile = React.createClass({
    render() {
        return <form method="post" action="/ipfs">
                <input type="hidden" name="cmd" value="addFile"/>
                <input type="text" name="arg"/>
                <input type="submit" value="Seed file"/>
               </form>;
    }
});

/*

let SeedFile = React.createClass({
    render() {
        $.post("/ipfs", {
            cmd: "addFile",
            arg: 
        }, (data) => {
            console.log(data);
        }).fail((xhr, status, err) => {
            console.error(document.URL, status, err.toString())
        });
        EthClient.contract.setWorkerDtPort(DockerConfig.port);
    }
});

let SeedForm = React.createClass({
    render: function() {
        return
            <form className="seedForm" onSubmit={this.handleSubmit}>
                <input type="hidden" name="cmd" value="addFile"/>
                <input type="text" name="arg"/>
                <input type="submit" value="Seed file"/>
            </form>
    },

    handleSubmit: function(e) {
        e.preventDefault();
        var author = React.findDOMNode(this.refs.author).value.trim();
        var text = React.findDOMNode(this.refs.text).value.trim();
        if (!text || !author) {
          return;
        }
        this.props.onCommentSubmit({author: author, text: text});

        React.findDOMNode(this.refs.author).value = '';
        React.findDOMNode(this.refs.text).value = '';
        return;
    }
});

let SeedBox = React.createClass({
    handleCommentSubmit: function(comment) {
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          type: 'POST',
          data: comment,
          success: function(data) {
            this.setState({data: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
    }
})
*/
export default SeedPanel;

