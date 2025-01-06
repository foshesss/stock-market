import { createNoise2D } from 'simplex-noise';
import ValueRecorder from './ValueRecorder.svelte';

// Constant variables
const SHOCK_CHANCE = 1/2500;
const SHOCK_SIZE = 25; // TODO: change this to be unique to the function

// Private variables
const noise2D = createNoise2D();
const stocks: Map<string, Stock> = new Map();

// Private functions
function randn() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// Class definition
class Stock extends ValueRecorder {
    readonly symbol: string;
    readonly volatility: number;
    private seed: number;

    static getStock(symbol: string) {
        return stocks.get(symbol);
    }

    constructor(symbol: string, volatility: number, startValue: number | null) {
        super(startValue);

        this.symbol = symbol;
        this.volatility = volatility;
        this.seed = Math.random();

        // register stock
        stocks.set(symbol, this);
    }

    step(t: number) {
        // little bit of random walk
        this.value = this.value + randn() * this.volatility;
        
        // perlin noise to make this look semi realistic
        let p = noise2D(t * .1, this.seed) * this.volatility;
        this.value += p;
        
        // random shock lul
        if (Math.random() < SHOCK_CHANCE) {
            const direction = Math.random() < 0.5 ? -1 : 1;
            this.value += direction * SHOCK_SIZE * Math.random();
        }

        super.step(t);
    }
}

export default Stock;