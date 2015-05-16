contract DStream {

    address public owner;
    mapping (address => uint) public redeemable;
    uint public depositTotal;
    bytes32 public filehash;

    function DStream() {
        owner = msg.sender;
    }

    function setData(bytes32 hash) {
        depositTotal = msg.value;
        filehash = hash;
    }

    function confirm(address provider, uint amount) {
        if (msg.sender == owner) {
            redeemable[provider] = amount;
        }
    }

    function redeem() {
        if (redeemable[msg.sender] > 0) {
            msg.sender.send(redeemable[msg.sender]);
            redeemable[msg.sender] = 0;
        }
    }
}
