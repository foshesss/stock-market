<script lang="ts">
	import { Button } from "flowbite-svelte";

	// Each point is an array [x, y]
	let points = [
		[0, 50], // 0
		[1, 75], // 200
		[2, 350], // 400
		[3, 50], // 600
	];
	let width = 600;
	let height = 400;
	let trending = false;

	// Create a helper that returns an array of line segments.
	// Each segment has { x1, y1, x2, y2 } to represent <line> endpoints.
	function getLineSegments(pts: number[][]) {
		const segments = [];

		const maxX = pts[pts.length - 1][0];
		const scaleX = (x: number) => (x / maxX) * width;

		for (let i = 0; i < pts.length - 1; i++) {
			const [x1, y1] = pts[i];
			const [x2, y2] = pts[i + 1];
			segments.push({
				x1: scaleX(x1),
				y1: height - y1,
				x2: scaleX(x2),
				y2: height - y2,
			});
		}

		trending = segments[0].y1 > segments[segments.length - 1].y2;

		return segments;
	}

	let lineSegments = getLineSegments(points);

	function buyStock() {}
</script>

<h2>Investing</h2>
<h1>$7,144.59</h1>

<p>
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
	<!-- Draw a line for each adjacent pair of points -->
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
</svg>

<style>
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
