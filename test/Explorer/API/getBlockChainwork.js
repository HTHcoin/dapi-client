require('../../_before.js');
const should = require('should');

const validBlockHash = '00000000e77f43412f0a536c1a02cc7ca4c84ce812122a0a4efe6bef386ee8dd';
const validBlockHeight = 195460;
describe('Insight-API - getBlockChainwork', () => {
  it('should return the valid chainwork from hash', () => SDK.Explorer.API.getBlockChainwork(validBlockHash)
    .then((chainwork) => {
      chainwork.should.equal('0000000000000000000000000000000000000000000000000000567c1242e904');
    }));
  it('should return the valid chainwork from height', () => SDK.Explorer.API.getBlockChainwork(validBlockHeight)
    .then((chainwork) => {
      chainwork.should.equal('0000000000000000000000000000000000000000000000000000567c1242e904');
    }));
});
