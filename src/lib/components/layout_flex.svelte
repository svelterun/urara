<script lang="ts">
  import { onMount } from 'svelte'
  import Head from '$lib/components/head.svelte'
  export let title = undefined
  export let date = undefined
  export let lastmod = undefined
  export let priority = undefined
  export let tags = undefined
  export let cover = undefined
  export let descr = undefined
  export let path = undefined
  export let page = undefined
  let loaded = false
  export let head = true
  onMount(() => (loaded = true))
</script>

{#if head !== false}
  <Head post={{ title, date, lastmod, priority, tags, cover, descr, path }} {page} />
{/if}

<div class="flex flex-col flex-nowrap justify-center xl:flex-row xl:flex-wrap">
  <div
    class="flex-1 w-full max-w-screen-md order-first  transition-all duration-[400ms] xl:delay-[600ms] ease-out transform mx-auto xl:mr-0 {loaded
      ? 'translate-x-0 opacity-100'
      : 'translate-x-[100vw] xl:translate-x-96 opacity-0'}">
    <slot name="left" />
  </div>
  <div
    class="flex-1 w-full max-w-screen-md xl:order-last transition-all duration-[400ms] xl:delay-[600ms] ease-out transform mx-auto xl:mr-0 {loaded
      ? 'translate-x-0 opacity-100'
      : '-translate-x-[100vw] xl:-translate-x-96 opacity-0'}">
    <slot name="right" />
  </div>
  <div class="flex-none w-full max-w-screen-md mx-auto xl:mx-0">
    {#if $$slots.left || $$slots.right}
      <slot name="center" />
    {:else}
      <slot />
    {/if}
  </div>
</div>
