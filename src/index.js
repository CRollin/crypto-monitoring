const binance = require('binance-api-node').default();
const logger = require('./logger');

const CrossingMA = require('./strategies').crossingMa;

const SHORT_PERIOD = 10;
const LONG_PERIOD = 30;
const CALLS_FREQ = 30000; // Half a minute
const SYMBOL = 'IOTABTC';

let lastSymbolPrice;
let symbolBalance = 0;
let btcBalance = 0.01;

let strategy = new CrossingMA(SHORT_PERIOD, LONG_PERIOD);
strategy.subscribe(tendency => {
    if (tendency > 0) {
        symbolBalance += btcBalance / lastSymbolPrice;
        btcBalance = 0;
    } else {
        btcBalance += symbolBalance * lastSymbolPrice;
        symbolBalance = 0;
    }
    logger.info(`Current balance : ${btcBalance + symbolBalance * lastSymbolPrice}`);
});

const mainInterval = setInterval(() => {
    binance.prices().then(prices => {
        logger.info(`New ${SYMBOL} price: ${prices[SYMBOL]}`);
        lastSymbolPrice = parseFloat(prices[SYMBOL]);
        strategy.push(parseFloat(prices[SYMBOL]));
    });
}, CALLS_FREQ);

process.on('SIGINT', () => {
    logger.info(`Left with balance : ${btcBalance + symbolBalance * lastSymbolPrice}`);
    clearInterval(mainInterval);
});
