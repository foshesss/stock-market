<script lang="ts">
    export let openPrice: number;
    export let currentPrice: number;
    export let showPercentage: boolean = true;
    export let showArrow: boolean = true;
    export let showPrice: boolean = true;

    // 100 - 83

    let negative = (currentPrice - openPrice) < 0;
    let diff = Math.abs(currentPrice - openPrice).toFixed(2);
    let diffPercent = openPrice === 0 ? "-%" : `${((currentPrice - openPrice)/openPrice).toFixed(2)}%`;

    showArrow = showArrow && openPrice != currentPrice;

</script>

<p>
    {#if showArrow}
        {negative ? '▼' : '▲'}
    {/if}
    {#if showPrice}
        {#if negative}-{/if}${diff}
    {/if}
    {#if showPercentage}
        ({diffPercent})
    {/if}
    Today
</p>