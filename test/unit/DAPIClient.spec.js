const DAPIClient = require('../../lib/DAPIClient');
const CoreMethodsFacade = require('../../lib/methods/core/CoreMethodsFacade');
const PlatformMethodsFacade = require('../../lib/methods/platform/PlatformMethodsFacade');
const SimplifiedMasternodeListDAPIAddressProvider = require('../../lib/dapiAddressProvider/SimplifiedMasternodeListDAPIAddressProvider');
const ListDAPIAddressProvider = require('../../lib/dapiAddressProvider/ListDAPIAddressProvider');

describe('DAPIClient', () => {
  let options;
  let dapiClient;

  describe('#constructor', () => {
    it('should construct DAPIClient with options', async () => {
      options = {
        retries: 0,
        newOption: true,
      };

      dapiClient = new DAPIClient(options);

      expect(dapiClient.options).to.deep.equal({
        retries: 0,
        newOption: true,
        timeout: 2000,
      });

      expect(dapiClient.dapiAddressProvider).to.be.an.instanceOf(
        SimplifiedMasternodeListDAPIAddressProvider,
      );

      expect(dapiClient.core).to.be.an.instanceOf(CoreMethodsFacade);
      expect(dapiClient.platform).to.be.an.instanceOf(PlatformMethodsFacade);
    });

    it('should construct DAPIClient without options', async () => {
      dapiClient = new DAPIClient();

      expect(dapiClient.options).to.deep.equal({
        retries: 3,
        timeout: 2000,
      });

      expect(dapiClient.dapiAddressProvider).to.be.an.instanceOf(
        SimplifiedMasternodeListDAPIAddressProvider,
      );

      expect(dapiClient.core).to.be.an.instanceOf(CoreMethodsFacade);
      expect(dapiClient.platform).to.be.an.instanceOf(PlatformMethodsFacade);
    });

    it('should construct DAPIClient with address options', async () => {
      options = {
        retries: 0,
        addresses: ['localhost'],
      };

      dapiClient = new DAPIClient(options);

      expect(dapiClient.options).to.deep.equal({
        retries: 0,
        addresses: ['localhost'],
        timeout: 2000,
      });

      expect(dapiClient.dapiAddressProvider).to.be.an.instanceOf(ListDAPIAddressProvider);

      expect(dapiClient.core).to.be.an.instanceOf(CoreMethodsFacade);
      expect(dapiClient.platform).to.be.an.instanceOf(PlatformMethodsFacade);
    });
  });
});