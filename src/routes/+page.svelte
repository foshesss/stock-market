<script lang="ts">
	import { writable } from "svelte/store";
	import StockGraph from "../components/StockGraph.svelte";
	import MovementTicker from "../components/MovementTicker.svelte";

	import Stock from "$lib/Stock";

	const STOCKS = ["RBLX", "AAPL", "NVDA"];
	const MS_PER_UPDATE = 250;

	// register all stocks
	let stocks: Stock[] = [];
	STOCKS.forEach((symbol) => stocks.push(new Stock(symbol, .25, 100)));

	let currentMoney = 1000;
	let portfolioStore = writable(new Map<string, number>());
	// 1D shows price every 5min
	// 1W shows price every 1h
	// 1M shows price every 1h
	// 3M shows price every 1d
	// 1Y shows price every 1d

	function ownsStock(symbol: string): [boolean, number] {
		let numOwned = $portfolioStore.get(symbol);
		return numOwned !== undefined ? [true, numOwned] : [false, 0];
	}

	function buyStock(symbol: string, numStock: number) {
		let stockPrice = 100;
		if (currentMoney < stockPrice) return;
		currentMoney -= stockPrice;

		portfolioStore.update((portfolio) =>
			portfolio.set(symbol, (portfolio.get(symbol) || 0) + numStock),
		);
	}

	function sellStock(symbol: string, numStock: number) {
		let [owns, numOwned] = ownsStock(symbol);
		if (owns === false) return;

		let stockPrice = 100;
		currentMoney += stockPrice * numStock;

		// remove stock from portfolio if all are sold
		portfolioStore.update((portfolio) => {
			let newNumStock = numOwned - numStock;
			if (newNumStock === 0) {
				portfolio.delete(symbol);
			} else {
				portfolio.set(symbol, newNumStock);
			}
			return portfolio;
		});
	}

	function setBuyOrder(symbol: string, numStock: number, price: number) {}

	function setSellOrder(symbol: string, numStock: number, price: number) {}

	let step = 0;
	setInterval(() => {
		for (let stock of stocks) stock.step(step);
		stocks = stocks;
		step++;
	}, MS_PER_UPDATE);

	// every 1 second, 5 minutes passes in the "stock market". buying at each tick represents buying at the current visible price
</script>

<!-- Snippet Definitions -->
{#snippet stockMiniGraph({
	symbol,
	currentPrice,
	currentDailyData
}: Stock)}
	<div>
		<h3>{symbol}</h3>
		<p>${currentPrice.toFixed(2)}</p>
		{#key step}
			<MovementTicker currentPrice={currentPrice} openPrice={currentDailyData.open} />
		{/key}
		<StockGraph candles={currentDailyData.minute5Price} />
	</div>
{/snippet}

{#snippet newsContainer(subject: string, content: string)}
	<div class="news-entry">
		<p><b>{subject}</b> 1h</p>
		<p>{content}</p>
		<!-- TODO: show affected tickers -->
	</div>
{/snippet}

<!-- TODO: add navbar -->
<div class="mx-32" id="home">
	<div id="news">
		<h1 class="mb-2">News</h1>

		<div id="news-container">
			{#each { length: 9 }}
				{@render newsContainer(
					"Fosh News",
					"NVDA plummets after competitor 'Fosh Studios' releases preview of new GPU.",
				)}
			{/each}
		</div>
	</div>
	<div id="daily_movement">
		<h1>Investing</h1>
		<h2>${currentMoney.toFixed(2)}</h2>

		<MovementTicker currentPrice={currentMoney} openPrice={currentMoney} />
	</div>
	<div id="mini-stocks">
		<h1>Shares</h1>
		{#each stocks as stock}
			{@render stockMiniGraph(stock)}
		{/each}
	</div>
</div>

<!-- temporary for testing lol -->
<h1>test stuff lol</h1>
<button onclick={() => buyStock("DERP", 1)}> Buy Stock </button>
<button onclick={() => sellStock("DERP", 1)}> Sell Stock </button>

<style>
	h1 {
		font-size: 1.5rem;
		font-weight: bold;
	}

	#home {
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 2rem;
	}

	#home > * {
		width: 100%;
	}

	#daily_movement {
		width: 200%;
		background: rgb(231, 231, 231);
	}

	.news-entry {
		padding: 0.5rem;
	}

	.news-entry:nth-child(odd) {
		border-top: rgba(0, 0, 0, 0.3) solid 1px;
		border-bottom: rgba(0, 0, 0, 0.3) solid 1px;
		background: rgb(231, 231, 231);
	}
</style>
