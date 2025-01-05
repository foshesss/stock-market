<script lang="ts">
    export let openPrice: number;
    export let currentPrice: number;
    export let showPercentage: boolean = true;
    export let showArrow: boolean = true;
    export let showPrice: boolean = true;

    // 100 - 83

    let negative = (currentPrice - openPrice) < 0;
    let diff = Math.abs(currentPrice - openPrice).toFixed(2);
    let diffPercent = openPrice === 0 ? "-%" : `${(((currentPrice - openPrice)/openPrice) * 100).toFixed(2)}%`;

    showArrow = showArrow && openPrice != currentPrice;

</script>

<p>
    <span class={negative ? "negative" : "positive"}>
        {#if showArrow}
        {negative ? '▼' : '▲'}
        {/if}
        {#if showPrice}
            {#if negative}-{/if}${diff}
        {/if}
        {#if showPercentage}
            ({diffPercent})
        {/if}
    </span>
    Today
</p>

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