import { createNoise2D } from 'simplex-noise';
import config from "./config";

type DailyStockData = {
    minute5Price: number[],
    hourlyPrice: number[],
    high: number,
    low: number,
    open: number,
    close: number,
}

// Constant variables
const SHOCK_CHANCE = 1/2500;
const SHOCK_SIZE = 25; // TODO: change this to be unique to the function

// Private variables
const noise2D = createNoise2D();

// Private functions
function randn() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function getTime(t: number) {
    const totalMinutes = t * config.MINUTES_PER_STEP;
    const totalHours = Math.floor(totalMinutes / config.MINUTES_PER_HOUR);
    const day = Math.floor(totalHours / config.HOURS_PER_DAY);
    const hour = totalHours % config.HOURS_PER_DAY;
    const minute = totalMinutes % config.MINUTES_PER_HOUR;

    return { day, hour, minute };
}

// Class definition
class Stock {
    readonly symbol: string;
    readonly volatility: number;
    private seed: number;
    currentPrice: number = 100;

    currentDailyData: DailyStockData;
    dailyData: DailyStockData[];

    constructor(symbol: string, volatility: number, startPrice: number | null) {
        this.symbol = symbol;
        this.volatility = volatility;
        this.seed = Math.random();

        if (startPrice) this.currentPrice = startPrice;

        this.currentDailyData = {
            minute5Price: [this.currentPrice],
            hourlyPrice: [this.currentPrice],
            high: this.currentPrice,
            low: this.currentPrice,
            open: this.currentPrice,
            close: this.currentPrice,
        }
        this.dailyData = [this.currentDailyData]
    }

    step(t: number) {
        let { day, hour, minute } = getTime(t);

        // little bit of random walk
        this.currentPrice = this.currentPrice + randn() * this.volatility;
        
        // perlin noise to make this look semi realistic
        let p = noise2D(t * .1, this.seed) * this.volatility;
        this.currentPrice += p;
        
        // random shock lul
        if (Math.random() < SHOCK_CHANCE) {
            const direction = Math.random() < 0.5 ? -1 : 1;
            this.currentPrice += direction * SHOCK_SIZE * Math.random();
        }

        // if this day doesn't exist right now, make it exist
        if (!this.dailyData[day]) {
            this.dailyData[day] = {
                minute5Price: [],
                hourlyPrice: [],
                high: this.currentPrice,
                low: this.currentPrice,
                open: this.currentPrice,
                close: this.currentPrice,
            }
            this.currentDailyData = this.dailyData[day]
        }

        // update stats about the day
        this.currentDailyData.close = this.currentPrice;
        this.currentDailyData.high = Math.max(this.currentDailyData.high, this.currentPrice);
        this.currentDailyData.low = Math.min(this.currentDailyData.low, this.currentPrice);

        // update prices for each segment
        this.currentDailyData.minute5Price[Math.round(minute/config.MINUTES_PER_STEP) + hour * config.MINUTES_PER_HOUR/config.MINUTES_PER_STEP] = this.currentPrice;
        this.currentDailyData.hourlyPrice[hour] = this.currentPrice;
    }
}

export default Stock;