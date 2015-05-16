import ipfsapi from "ipfs-api";

var logging = false;

class IPFSClient {

    constructor() {
        try {
            this.ipfs = ipfsapi("localhost","5001");
        }
        catch(e) {
            console.error("Could not contact IPFS on localhost:5001 due to: %O", e);
        }
    }

    getReceivedAmount(seeder) {
        this.ipfs.stats.bw("-p " + seeder, function(err,seederStats) {
            if(err || !seederStats) {
                return console.error(err);
            }

            if(logging)
                console.log("Peer " + seeder + " has seeded " + seederStats.TotalIn);

            return seederStats.TotalIn;
        });
    }

    getFile(hash) {
        this.ipfs.cat(hash, function(err,file) {
            if(err || !file) {
                return console.error(err);
            }

            if(logging)
                if(file.readable) {
                    // Returned as a stream
                    file.pipe(process.stdout);
                } else {
                    // Returned as a string
                    console.log(file);
                }
            return file;
        });
    }

    addFile(filePath) {
        this.ipfs.add(filePath, function(err, res) {
            if(err || !res) {
                return console.error(err);
            }

            res.forEach(function(file) {
                if(logging) {
                    console.log("File " + file.Name + " published on IPFS");
                    console.log("Hash: " + file.Hash);
                }
                return file.Hash;
            });
        });
    }

    getProviders(fileHash) {
        this.ipfs.dht.findprovs(fileHash, function(err, res) {
            if(err || !res) {
                return console.error(err);
            }

            if(logging) {
                console.log("Providers of " + fileHash + ":");
                console.log(res);
            }
            return res;
        });
    }
/*
    disconnect(peerID) {
        ipfs.id(peerID, function(err,res) {
            if(err || !ipfsFile) {
                return console.error(err);
            }
        });
    }*/
}

let ipfsclient = new IPFSClient();

export default ipfsclient;