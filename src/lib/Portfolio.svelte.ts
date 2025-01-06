import ValueRecorder from "./ValueRecorder.svelte";
import Stock from "./Stock";


// Constant variables
const START_MONEY = 1000;

class Portfolio extends ValueRecorder {
    stocks: Map<string, number> = new Map();
    currentMoney: number = $state(START_MONEY);

    constructor() {
        super(0);
    }

    get totalValue() {
        return this.value + this.currentMoney;
    }

    buyStock(symbol: string) {
        let stock = Stock.getStock(symbol);
        console.log(stock);
        if (!stock  || this.currentMoney < stock.value) return;

        // add stock to portfolio
        this.currentMoney -= stock.value;
        this.stocks.set(symbol, (this.stocks.get(symbol) || 0) + 1)
    }

    sellStock(symbol: string) {
        let stock = Stock.getStock(symbol);
        let num_owned = this.stocks.get(symbol);

        console.log(stock, num_owned);
        if (!stock  || !num_owned) return;

        // remove stock from portfolio is none are owned
        this.currentMoney += stock.value;

        if (num_owned == 0) {
            // remove stock from portfolio is none are owned
            this.stocks.delete(symbol)
        } else {
            // remove only one of the stock
            this.stocks.set(symbol, num_owned - 1)
        }
    }

    step(t: number) {
        // tally up all totals
        let value = 0;
        for (let [symbol, amountOwned] of this.stocks) {
            let stock = Stock.getStock(symbol);
            if (!stock) continue;
            value += stock.value * amountOwned;
        }
        
        // log price
        this.value = (value + this.currentMoney) - START_MONEY;
        super.step(t);
    }
}

// singleton sorta-- just makes it so whenever a method pulls for the portfolio, it uses the user's
export default new Portfolio();