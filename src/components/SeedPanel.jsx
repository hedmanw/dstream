import React from "react";
import $ from "jquery";

let SeedPanel = React.createClass({
    render() {
        let warning = false ? <PaymentWarning/> : null;

        return <div className="container">
        {warning}
        <SeedForm/>
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

/*
let SeedFile = React.createClass({
    render() {
        return <form method="post" action="/ipfs">
                <input type="hidden" name="cmd" value="addFile"/>
                <input type="text" name="arg"/>
                <input type="submit" value="Seed file"/>
               </form>;
    }
});
*/

let SeedForm = React.createClass({
    render: function() {
        return <form className="seedForm" onSubmit={this.handleSubmit}>
                <input type="hidden" name="cmd" value="addFile"/>
                <input type="text" name="arg"/>
                <input type="submit" value="Seed file"/>
               </form>
    },

    handleSubmit: function(e) {
        console.log('HEJ:',e);
        e.preventDefault();
        this.handleSeedSubmit(); 
/*
        var cmd = React.findDOMNode(this.refs.cmd);
        var arg = React.findDOMNode(this.refs.arg);

        if (!cmd || !arg) {
            console.log("ERROR ERROR");
          return;
        }
        this.handleSeedSubmit({cmd: cmd, arg: arg});

        React.findDOMNode(this.refs.arg).value = '';
        return;*/
    },

    handleSeedSubmit: function(filepath) {
        $.post('/ipfs/file', {
          arg: '/file.txt'
        }, (data) => {
            console.log(data);
        }).fail((a1,a2,a3) => {
            console.error(a1,a2,a3);
        });
    }
});


export default SeedPanel;

