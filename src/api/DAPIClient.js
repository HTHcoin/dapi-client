const MNDiscoveryService = require('../services/MNDiscoveryService');
const rpcClient = require('../utils/rpcClient');
const config = require('../config');

async function makeRequestToRandomDAPINode(method, params) {
  const randomMasternode = await MNDiscoveryService.getRandomMasternode();
  return rpcClient.request({ host: randomMasternode.ip, port: config.DAPI.port }, method, params);
}

/**
 * Makes request to random DAPI node.
 * @param {string} method
 * @param {array|object} params
 * @returns {Promise<*>}
 */
async function request(method, params) {
  return makeRequestToRandomDAPINode(method, params);
}

module.exports = { request };
