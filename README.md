## DAPI-SDK (1.1.0)
 
This module aim it's concerns at heping developers working with the DAPI on a Javascript landscape. 

It wraps all the work needed to answer to your real need (Tx, Blocks, Balance, UTXO..) and provide easy to use Promise-based method.

### Features :
- Deliver a bitcore-wallet-service compatible D-API (see [BWS doc here](https://github.com/dashevo/dapi-sdk/blob/master/BWS/README.md)).
- Provide accounts registration/authentication (using OP_RETURN for now).
- Basic discovery mode and request balancing.
- Explorer API (connector with Insight-API)
- Blockchain/SPV validation (blockheaders)
- TX/Blocks events (whenever a new block/tx is found emit the data).


## Getting Started
### Install DAPI-SDK
* npm : `npm i -S dapi-sdk`
* github : `npm i -S github:dashevo/dapi-sdk`

### Uses : 

You can check our [test folder](https://github.com/dashevo/dapi-sdk/tree/master/tests) to see some usage exemples. 


##### Import the package :
```js

//import package
const DAPISDK = require('dapi-sdk');

//Quiter version of possibles options.
const options = {
    debug:false,
    verbose:false,
    errors:false,
    warnings:false
};
let SDK = DAPISDK(options);
```

Where theses options can be (in parenthesis,the default value) : 

- debug(false) : Bool - When activated, returns utils logs (methods called, uris...)
- verbose(false) : Bool - Will talk. A lot. Emitted events, received stuff...
- warnings(true) : Bool - When activated, log errors received/handled.
- errors(true) : Bool - When activated, log errors received/handled.
- DISCOVER: Object - 
	- INSIGHT_SEEDS : Array of insight-api uri metadata endpoints (temporary step - see below an exemple) 
		
```json
{
"INSIGHT_SEEDS": [
           {
                "protocol": "http",
                "path": "insight-api-dash",
                "base": "51.15.5.18",
                "port": 3001
            }
        ]
}
```


Most of the SDK methods will returns you a Promise.

Therefore depending on your specific needs you can init or call methods of the SDK in a async way :

```js
let API = SDK.Explorer.API;

API
	.getLastBlockHeight()
	.then(function (height) {
        console.log(`last height is ${height}`);
    })

API
	.getLastBlockHeight(API.getHashFromHeight)
	.then(function(hash){
		console.log(`Last hash is ${hash}`);
	})
});
```

or using async/await features provided in last NodeJS version :

```js
let height = await SDK.Explorer.API.getLastBlockHeight();
console.log(`last height is ${height}`);
```

On the API documentation below, and for readability reasons, await will mostly be used.

#### Add specific insight-api node

During developement phase, you might need to have access to the website you want to call your data from. 
Therefore you have the possibility to add your seed yourself (we might bring default stable server later). 

Exemple : 

```js
const options = {
   STUFF:stuff,
   DISCOVER:{
           INSIGHT_SEEDS:[{
               protocol:"https",
               path:'api',
               base:"insight.dash.siampm.com",
               port: 443
           }]
       }
};
let SDK = await DAPISDK(options);
```

You will then have access to many components :

- `Explorer` will allow you to perform some command on the Insight-API of a masternode (chosen randomnly on a validated list).
As it will use some `Discover` methods in order to get the Insight Candidate, calling an Explorer call will first perform an init of Discover (and therefore will fetch and validate the list) before returning the value.
Make a note that this will be performed only once.

- `Blockchain` will allow you to have access to some components such as : getting an object stored in your in-mem db, or validate multiple blocks, calculate the next difficulty.
The initialization must be done by yourself using : `await SDK.Blockchain.init()` in order to beneficiate theses function.
Make note that by default it will connect to a randomnly selected insight-api by websocket and will listen to all block. When a block is emitter by the API, it will add it in the blockchain.
This comportement can be disable by passing to init the corresponding options (see below).
Using `SDK.Blockchain.chain` enable you to use the [blockchain-spv-dash](https://github.com/snogcel/blockchain-spv-dash) methods

- `tools` will allow to access to some of the dependencies of the SDK. Most notably, you have access to :
    - `SDK.tools.util` which correspond to a library of handy stuff such as toHash(hex), compressTarget, expandTarget. API here : [dash-util](https://github.com/snogcel/dash-util)
    - `SDK.tools.bitcore` which correspond to a library used in insight-api, see API here : [bitcore-dash-library](https://github.com/dashpay/bitcore-lib-dash). Contains elements that allow to generate address, sign/verify a message...

### API

##### Accounts :
WIP STATE
- `SDK.Accounts.User.create()`
- `SDK.Accounts.User.login()`
- `SDK.Accounts.User.remove()`
- `SDK.Accounts.User.search()`
- `SDK.Accounts.User.send()`
- `SDK.Accounts.User.update()`

##### Wallet :
TBA
##### Discover :
- `SDK.Discover.getInsightCandidate()` - Get a random insightAPI object (URI);

##### Explorer :
###### RPC :
TBA
###### InsightAPI :
- `SDK.Explorer.API.getStatus()` - Retrieve information `Object`. (diff, blocks...)
- `SDK.Explorer.API.getBlock(hash|height)` - Retrieve block information `Object` from either an hash `String` or an height `Number`
   It worth mentioning that retrieving from height is slower (2 call) than from an hash you might want to use Blockchain method instead.
- `SDK.Explorer.API.getLastBlockHash(hash)` - Retrieve last block hash `String`.
- `SDK.Explorer.API.getHashFromHeight(height)` - Retrieve hash value `String` from an height `Number|String`.
- `SDK.Explorer.API.getBlockHeaders(hash|height, [nbBlocks,[direction]])` - Retrieve 25 or `Number` of block headers `Array[Object]` from an height `Number` or a Hash `String` in a `Number` direction (see exemple below).
    This feature is not propagated everywhere yet. It has been pushed some weeks ago but even our official insight api do not reflect it - yet.

In this section, you retrieve a single value from one of the call (above), see theses methods as aliases.
- `SDK.Explorer.API.getLastBlockHeight()` - Retrieve the last height `Number`.
- `SDK.Explorer.API.getLastDifficulty()` - Retrieve the last diff `Number`.(float)
- `SDK.Explorer.API.getHeightFromHash(hash)` - Retrieve hash value `Number` from an hash `String`.
- `SDK.Explorer.API.getBlockConfirmations(hash|height)` - Retrieve the `Number` of confirmations of any block height `Number` or block hash `String`.
- `SDK.Explorer.API.getBlockSize(hash|height)` - Retrieve the size `Number` of any block height `Number` or block hash `String`.
- `SDK.Explorer.API.getBlockBits(hash|height)` - Retrieve the bits `String` of any block height `Number` or block hash `String`.
- `SDK.Explorer.API.getBlockChainwork(hash|height)` - Retrieve the chainwork `String` of any block height `Number` or block hash `String`.
- `SDK.Explorer.API.getBlockMerkleRoot(hash|height)` - Retrieve the merkle root `String` of any block height `Number` or block hash `String`.
- `SDK.Explorer.API.getBlockTransactions(hash|height)` - Retrieve the transactions `Array[String]` of any block height `Number` or block hash `String`.
- `SDK.Explorer.API.getBlockTime(hash|height)` - Retrieve the timestamp (epoch in sec) `Number` of any block height `Number` or block hash `String`.
- `SDK.Explorer.API.getBlockVersion(hash|height)` - Retrieve the version `Number` of any block height `Number` or block hash `String`.

##### Blockchain :
DAPI-SDK has a internal Blockchain. These function will use the internal blockchain when possible and will retrieve when it won't.

- `SDK.Blockchain.init([options])` - Initialize the blockchain in order to be used. Optional default can be changed by passing one of these options :
    - options :
        - `autoConnect` - `Boolean` by default `true`. Disabling it will prevent the automatic socket connection.
        - `numberOfHeadersToFetch` - `Number` by default `100`, allow to specify how many headers to fetch at init.
        - `fullFetch` - `Boolean` by default `false`. Activating it allow to fetch all the blockchain headers from genesis to last tip. (event `fullFetched` emitted when end)
        This way you can setup a full blockchain fetch (numberOfHeadersFetched will then be ignored).

//- `SDK.Blockchain.expectNextDifficulty()` - Will expect the likely difficulty `Number` of the next block.
//- `SDK.Blockchain.validateBlocks(hash|height, [nbBlocks,[direction]])` - Will validate 25 or `Number` of block headers from an height `Number` or a Hash `String` in a `Number` direction.
//- `SDK.Blockchain.getBlock(height)` - Will return a block by it's height `Number`.
//- `SDK.Blockchain.getLastBlock()` - Will return the last block stored.
//- `SDK.Blockchain.addBlock(block)` - Will add a block headers.

The blockchain provide you also some events such as
    - `ready`
    - `socket.connected` - Where the argument provided is the socket itself.
    - `socket.block` - Where the argument provided is the block.
    - `socket.tx` - Where the argument provided is the TX.


### Particular examples and usecases :

You can see some usecases and examples : [here](USECASES.md)

### [Changelog](CHANGELOG.md)
### License
