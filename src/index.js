const binance = require('binance-api-node').default();

const CrossingMA = require('./strategies').crossingMa;

const SHORT_PERIOD = 5;
const LONG_PERIOD = 30;
const CALLS_FREQ = 30000; // Half a minute
const SYMBOL = 'MANABTC';

const logger = {
    info: str => console.log(`[${(new Date()).toISOString()
        .replace(/T/, ' ')
        .replace(/\..+/, '')}] ${str}`),
};

let strategy = new CrossingMA(SHORT_PERIOD, LONG_PERIOD);
strategy.subscribe(tendency => {
    if (tendency > 0) {
        logger.info(`${SYMBOL} is going up!`);
    } else {
        logger.info(`${SYMBOL} is going down!`);
    }
});

setInterval(() => {
    binance.prices().then(prices => {
        logger.info(`New ${SYMBOL} price: ${prices[SYMBOL]}`);
        strategy.push(parseFloat(prices[SYMBOL]));
    });
}, CALLS_FREQ);
