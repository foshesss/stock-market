<script lang="ts">
    export let openPrice: number;
    export let currentPrice: number;
    export let showPercentage: boolean = true;
    export let showArrow: boolean = true;
    export let showPrice: boolean = true;

    // 100 - 83

    let trending = (currentPrice - openPrice) > 0;
    let diff = Math.abs(currentPrice - openPrice).toFixed(2);
    let diffPercent = openPrice === 0 ? "-%" : `${(((currentPrice - openPrice)/openPrice) * 100).toFixed(2)}%`;

    showArrow = showArrow && openPrice != currentPrice;

</script>

<p>
    <span class={trending ? "positive" : "negative"}>
        {#if showArrow}
        {trending ? '▲' : '▼'}
        {/if}
        {#if showPrice}
            {#if !trending}-{/if}${diff}
        {/if}
        {#if showPercentage}
            ({diffPercent})
        {/if}
    </span>
    Today
</p>

<style>
	.negative {
		stroke: rgba(255, 80, 0);
		color: rgba(255, 80, 0);
	}

	.positive {
		color: rgb(0, 200, 5);
		stroke: rgb(0, 200, 5);
	}
</style>