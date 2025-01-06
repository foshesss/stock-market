<script lang="ts">
	import StockGraph from "../components/StockGraph.svelte";
	import MovementTicker from "../components/MovementTicker.svelte";

	import Stock from "$lib/Stock";
	import Portfolio from "$lib/Portfolio.svelte";

	const STOCKS = ["RBLX", "AAPL", "NVDA"];
	const MS_PER_UPDATE = 250;

	// register all stocks
	let stocks: Stock[] = [];
	STOCKS.forEach((symbol) => stocks.push(new Stock(symbol, .25, 100)));

	let step = 0;
	setInterval(() => {
		for (let stock of stocks) stock.step(step);
		stocks = stocks;

		Portfolio.step(step);
		step++;
	}, MS_PER_UPDATE);

	// every 1 second, 5 minutes passes in the "stock market". buying at each tick represents buying at the current visible price
</script>

<!-- Snippet Definitions -->
{#snippet stockMiniGraph({
	symbol,
	value,
	currentDailyData
}: Stock)}
	<div>
		<h3>{symbol}</h3>
		<p>${value.toFixed(2)}</p>
		{#key step}
			<MovementTicker currentPrice={value} openPrice={currentDailyData.open} />
			<StockGraph candles={currentDailyData.minute5Value} {symbol} />
		{/key}
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
		<h2>${Portfolio.totalValue.toFixed(2)}</h2>

		{#key step}
			<MovementTicker currentPrice={Portfolio.value} openPrice={Portfolio.currentDailyData.open} />
			<StockGraph candles={Portfolio.currentDailyData.minute5Value} symbol={"DAILY_MOVEMENT"} height={300} />
		{/key}
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
<button onclick={() => Portfolio.buyStock("RBLX")}> Buy Stock </button>
<button onclick={() => Portfolio.sellStock("RBLX")}> Sell Stock </button>

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
