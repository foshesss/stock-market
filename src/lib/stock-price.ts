type StockPriceImpl = {
    GetPriceAtTime: (t: number) => number;
}

type StockPriceEntry = {
    t: number;
    price: number;
}

// Module table:
const StockPrice = {} as StockPriceImpl;

// Private variables:
const stockPrices: { [key: string]: StockPriceEntry[] } = {};

// Private functions:
function randn() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// Global methods:
StockPrice.GetPriceAtTime = function(t) {
    // TODO: loop through all stock prices to find best time. if the first entry is greater than t, error or return -1
    // TODO: Save stock data for past 30 days, where each entry represents { t: number, price: number }
    return 100 + 10 * randn() * Math.sqrt(t);
}



export default StockPrice;