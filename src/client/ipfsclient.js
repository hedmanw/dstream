import ipfsapi from "ipfs-api";

var logging = true;

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

    addFile(filePath) {
        var hash;
        
        this.ipfs.add(filePath, function(err, res) {
            if(err || !res) {
                return console.error(err);
            }

            let ipfsFile = res[0];
            console.log('File ' + ipfsFile.Name + " published on IPFS");
            console.log('Hash: ' + ipfsFile.Hash);

            hash = ipfsFile.Hash;
        });

        console.log(hash);
        return hash;
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


getFileSize(hash) {
    this.ipfs.ls(hash, function(err,res) {
        if(err || !res) {
            return console.error(err);
        }

        let totalSize = 0;

        res.Objects.forEach(function(file) {
            file.Links.forEach(function(link) {
                totalSize += link.Size;
            });
        });

        if(logging)
            console.log("File " + hash + " has size " + totalSize);

        return totalSize;
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