<script lang="ts">
	import StockPrice from "$lib/stock-price";
	import { writable } from "svelte/store";

	type StockData = {
		symbol: string;
		price: number;
	}

	const STOCKS = ["RBLX", "AAPL", "NVDA"];
	const SECONDS_PER_UPDATE = 1;

	let currentMoney = 1000;
	let portfolioStore = writable(new Map<string, number>());
	// 1D shows price every 5min
	// 1W shows price every 1h
	// 1M shows price every 1h
	// 3M shows price every 1d
	// 1Y shows price every 1d

	let stockPrices: StockData[] = [];
	STOCKS.forEach((symbol) => {
		stockPrices.push({ symbol, price: 100 });
	});

	function ownsStock(symbol: string): [boolean, number] {
		let numOwned = $portfolioStore.get(symbol);
		return numOwned !== undefined ? [true, numOwned] : [false, 0];
	}

	function buyStock(symbol: string, numStock: number) {
		let stockPrice = 100;
		if (currentMoney < stockPrice) return;
		currentMoney -= stockPrice;

		portfolioStore.update((portfolio) => portfolio.set(symbol, (portfolio.get(symbol) || 0) + numStock));
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

	function setBuyOrder(symbol: string, numStock: number, price: number) {

	}

	function setSellOrder(symbol: string, numStock: number, price: number) {

	}

	setInterval(() => {
		// update stock prices
		stockPrices.forEach((stock) => {
			stock.price += Math.random() * 10 - 5;
		});
		stockPrices = stockPrices;
	}, 1000);

	// every 1 second, 5 minutes passes in the "stock market". buying at each tick represents buying at the current visible price
</script>

<!-- Snippet Definitions -->
{#snippet stockMiniGraph({ symbol, price }: StockData)}
	<div>
		<h3>{symbol}</h3>
		<p>${price.toFixed(2)}</p>
		<!-- <svg {width} {height} style="border:1px solid #ccc;">
			{#each lineSegments as segment, idx}
				<line
					class={trending ? "positive" : "negative"}
					x1={segment.x1}
					y1={segment.y1}
					x2={segment.x2}
					y2={segment.y2}
					stroke-width="2"
				/>
			{/each}
		</svg> -->
	</div>
{/snippet}

{#snippet diffTicker(lastPrice: number, currentPrice: number, showPercentage: boolean)}
	<p>${(lastPrice - currentPrice).toFixed(2)} ({((lastPrice - currentPrice)/lastPrice).toFixed(2)}%) Today</p>
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
				{@render newsContainer("Fosh News", "NVDA plummets after competitor 'Fosh Studios' releases preview of new GPU.")}
			{/each}
		</div>
	</div>
	<div id="daily_movement">
		<h1>Investing</h1>
		<h2>${currentMoney.toFixed(2)}</h2>
		{@render diffTicker(currentMoney, currentMoney, true)}
	</div>
	<div id="mini-stocks">
		<h1>Shares</h1>
		{#each stockPrices as stock}
			{@render stockMiniGraph(stock)}
		{/each}
	</div>
</div>

<!-- temporary for testing lol -->
<h1>test stuff lol</h1>
<button onclick={() => buyStock("DERP", 1)}>
	Buy Stock
</button>

<button onclick={() => sellStock("DERP", 1)}>
	Sell Stock
</button>



<!-- <p>
	<span class={trending ? "positive" : "negative"}>
		{trending ? "+" : "-"}$61.40 (0.85%)</span
	>
	Today
</p>

<p>
	<span class={trending ? "positive" : "negative"}>
		{trending ? "+" : "-"}$9.60 (0.13%)</span
	>
	Overnight
</p>

<svg {width} {height} style="border:1px solid #ccc;">
	{#each lineSegments as segment, idx}
		<line
			class={trending ? "positive" : "negative"}
			x1={segment.x1}
			y1={segment.y1}
			x2={segment.x2}
			y2={segment.y2}
			stroke-width="2"
		/>
	{/each}
</svg> -->

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
		padding: .5rem;
	}

	.news-entry:nth-child(odd) {
		border-top: rgba(0,0,0,.3) solid 1px;
		border-bottom: rgba(0,0,0,.3) solid 1px;
		background: rgb(231, 231, 231);
	}

	line {
		stroke-width: 2;
	}

	.negative {
		stroke: rgba(255, 80, 0);
		color: rgba(255, 80, 0);
	}

	.positive {
		color: rgb(0, 200, 5);
		stroke: rgb(0, 200, 5);
	}
</style>
