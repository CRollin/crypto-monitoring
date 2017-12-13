const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const CrossingMAStrategy = require('./../../src/strategies').crossingMa;

const SHORT_PERIOD = 5;
const LONG_PERIOD = 30;
const DELAY = 5;

const LOW = 1;
const HIGH = 2;

const flatData = (new Array(LONG_PERIOD)).fill(LOW);
const smallUpData = (new Array(DELAY - 1)).fill(HIGH);
const bigUpData = (new Array(DELAY + 1)).fill(HIGH);
const bigDownData = (new Array(LONG_PERIOD)).fill(LOW);

describe('Crossing Mobile Average strategy', () => {
    let crossingMa;
    let stub;

    beforeEach(() => {
        stub = sinon.stub();
        crossingMa = new CrossingMAStrategy(SHORT_PERIOD, LONG_PERIOD, DELAY);
        crossingMa.subscribe(stub);
    });

    it('should not emit on constant values', () => {
        flatData.forEach(value => {
            crossingMa.push(value);
        });
        expect(stub.called).to.equal(false);
    });

    it('should not emit on a cross that last less than 5 ticks', () => {
        flatData.forEach(value => {
            crossingMa.push(value);
        });
        smallUpData.forEach(value => {
            crossingMa.push(value);
        });
        expect(stub.called).to.equal(false);
    });

    it('should emit on a cross that last at leat 5 ticks', () => {
        flatData.forEach(value => {
            crossingMa.push(value);
        });
        bigUpData.forEach(value => {
            crossingMa.push(value);
        });
        expect(stub.called).to.equal(true);
        expect(stub.calledWith(1)).to.equal(true);
    });

    it('should consecutively detect an up and a down', () => {
        flatData.forEach(value => {
            crossingMa.push(value);
        });
        bigUpData.forEach(value => {
            crossingMa.push(value);
        });
        expect(stub.called).to.equal(true);
        expect(stub.calledWith(1)).to.equal(true);
        bigDownData.forEach(value => {
            crossingMa.push(value);
        });
        expect(stub.calledTwice).to.equal(true);
        expect(stub.calledWith(-1)).to.equal(true);
    });
});
