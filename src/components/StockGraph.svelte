<script lang="ts">

	interface Properties {
		candles: number[],
		symbol: string,
		height?: number
	}

	let { candles, symbol, height = 100 }: Properties = $props();
	
	let id = `${symbol}_graph`;
    let width = $state(100);

	let minTime = 0;
	let maxTime = 288;

	let minPrice = 60;
	let maxPrice = 160;

	function linearScale(
		value: number,
		domainMin: number,
		domainMax: number,
		rangeMin: number,
		rangeMax: number,
		clamp = true,
	): number {
		if (domainMax === domainMin) {
			return (rangeMin + rangeMax) / 2;
		}
		let result =
			((value - domainMin) / (domainMax - domainMin)) *
				(rangeMax - rangeMin) +
			rangeMin;
		if (clamp) {
			const low = Math.min(rangeMin, rangeMax);
			const high = Math.max(rangeMin, rangeMax);
			if (result < low) result = low;
			if (result > high) result = high;
		}
		return result;
	}

	const scaleX = (time: number) => {
		return linearScale(time, minTime, maxTime, 0, width);
	};

	const scaleY = (price: number) => {
		return linearScale(price, minPrice, maxPrice, height, 0);
	};

	// this is so wrong, i can't even begin to explain how wrong it is.
	// my problem is that i need to recalculate the graph bounds per stock, and i need it done
	// before the svg starts rendering.
	// the only solution i could quickly think of before going to bed was a refresh function, called
	// before the graph is rendered.
	function refresh() {
		if (candles.length === 0) {
			minPrice = -1;
			maxPrice = 1;
		} else {
			// Calculate min, max, and average prices
			const absoluteMin = Math.min(...candles);
			const absoluteMax = Math.max(...candles);
			
			// Determine padding relative to the average price
			const bottomPadding = 5;
			const topPadding = 5;

			// Adjust min and max prices with padding
			minPrice = Math.max(0, absoluteMin - bottomPadding);
			maxPrice = absoluteMax + topPadding;

			// Ensure there is a minimum padding for very small ranges
			const minimumRange = (absoluteMax - absoluteMin) * 0.1; // Add at least 10% of the range as padding
			if (maxPrice - minPrice < minimumRange) {
				const additionalPadding = (minimumRange - (maxPrice - minPrice)) / 2;
				minPrice = Math.max(0, minPrice - additionalPadding);
				maxPrice = maxPrice + additionalPadding;
			}
		}
	}

	function createPathData() {
		if (candles.length < 2) return { d: '', trending: false };

		const trending = candles[0] < candles[candles.length - 1];
		let d = `M${scaleX(0)},${scaleY(candles[0])}`;

		for (let i = 1; i < candles.length; i++) {
			d += ` L${scaleX(i)},${scaleY(candles[i])}`;
		}

		return { d, trending };
	}

	let pathInfo = $state(createPathData())
	$effect(() => { pathInfo = createPathData() })
</script>

<svg {height} class="stock-graph" {id} bind:clientWidth={width}>
	{refresh()}

	{#if candles[0]}
		<line
			x1="10"
			y1={scaleY(candles[0])}
			x2={width}
			y2={scaleY(candles[0])}
			stroke="black"
			stroke-width="5"
			stroke-linecap="round"
			stroke-dasharray="1, 10"
			stroke-opacity="0.5"
		/>
	{/if}

	<!-- Single continuous path -->
	<path
		class={pathInfo.trending ? 'positive' : 'negative'}
		d={pathInfo.d}
		stroke-width="2"
		stroke-opacity="1"
		fill="none"
	/>
</svg>

<style>
	.stock-graph {
		border:1px solid #ccc;
		width: 100%;
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