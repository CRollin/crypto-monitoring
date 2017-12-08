const expect = require('chai').expect;

const CrossingMAStrategy = require('./../../src/strategies').crossingMa;

const SHORT_PERIOD = 5;
const LONG_PERIOD = 30;

describe('Crossing Mobile Average strategy', () => {
    it('should instantiate properly', () => {
        let crossingMa = new CrossingMAStrategy(SHORT_PERIOD, LONG_PERIOD);
        expect(crossingMa.lastLongMa).to.be.undefined;
        expect(crossingMa.lastShortMa).to.be.undefined;
        expect(crossingMa.longMa).to.be.an('object');
        expect(crossingMa.shortMa).to.be.an('object');
    });
});
