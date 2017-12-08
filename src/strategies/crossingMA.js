const events = require('events');

const EMA = require('technicalindicators').EMA;

const CROSSED_EVENT = 'cross';

class CrossingMAStrategy {
    constructor (short, long) {
        this.eventEmitter = new events.EventEmitter();
        this.shortMa = new EMA({period: short, values: []});
        this.longMa = new EMA({period: long, values: []});
    }

    push (value) {
        let newShortMa = this.shortMa.nextValue(value);
        let newLongMa = this.longMa.nextValue(value);
        if (!this.lastShortMa || !this.lastLongMa) {
            this._update(newShortMa, newLongMa);
            return false;
        }
        if ((this.lastLongMa - this.lastShortMa) * (newLongMa - newShortMa) < 0) {
            this.eventEmitter.emit(CROSSED_EVENT, this.lastShortMa > this.lastLongMa ? 1 : -1);
        }
        this._update(newShortMa, newLongMa);
    }

    subscribe (next) {
        this.eventEmitter.on(CROSSED_EVENT, next);
    }

    _update (newShort, newLong) {
        this.lastShortMa = newShort;
        this.lastLongMa = newLong;
    }
}

module.exports = CrossingMAStrategy;
