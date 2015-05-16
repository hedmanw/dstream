contract DStream {

    address owner;
    mapping (address => uint) redeemable;
    uint public depositTotal;
    uint public depositLeft;
    uint public filesize;

    function DStream(uint size) {
        owner = msg.sender;
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
