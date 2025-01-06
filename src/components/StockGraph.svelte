<script lang="ts">

	interface Properties {
		candles: number[],
		symbol: string,
		height?: number
	}

	let { candles, symbol, height = 100 }: Properties = $props();
    type LineSegment = {
		x1: number;
		y1: number;
		x2: number;
		y2: number;
		trending: boolean
	};

	
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

	function createLineSegments(): LineSegment[] {
		if (candles.length < 2) return [];

		const segments: LineSegment[] = [];
		let trending = candles[0] < candles[candles.length - 1];

		for (let i = 1; i < candles.length; i++) {
			const prev = candles[i - 1];
			const curr = candles[i];

			const x1 = scaleX(i - 1);
			const y1 = scaleY(prev);
			const x2 = scaleX(i);
			const y2 = scaleY(curr);

			segments.push({ x1, y1, x2, y2, trending });
		}

		return segments;
	}

	$effect(() => {
		createLineSegments()
	})
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

	{#each createLineSegments() as segment}
		<line
			class={segment.trending ? "positive" : "negative"}
			x1={segment.x1}
			y1={segment.y1}
			x2={segment.x2}
			y2={segment.y2}
			stroke-width="2"
		/>
	{/each}
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