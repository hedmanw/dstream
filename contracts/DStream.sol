contract DStream {

    address public owner;
    mapping (address => uint) public redeemable;
    uint public depositTotal;
    uint public depositLeft;
    uint public filesize;

    function DStream() {
        owner = msg.sender;
    }

    function setData(uint size) {
        depositTotal = msg.value;
        filesize = size;
    }

    function confirm(address provider, uint dataAmount) {
        if (owner == msg.sender) {
            redeemable[provider] += depositTotal*(dataAmount/filesize);
        }
    }

    function redeem() {
        if (redeemable[msg.sender] > 0) {
            msg.sender.send(redeemable[msg.sender]);
            redeemable[msg.sender] = 0;
        }
    }
}
