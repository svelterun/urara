<script lang="ts">
  import { site } from '$lib/config/site'
  import { head } from '$lib/config/head'
</script>

<svelte:head>
  {#if site.author.github}
    <link rel="me" href="https://github.com/{site.author.github}" />
  {/if}
  {#if site.author.twitter}
    <link rel="me" href="https://twitter.com/{site.author.github}" />
  {/if}
  {#if head.relMe}
    {#each head.relMe as href}
      <link rel="me" {href} />
    {/each}
  {/if}
</svelte:head>
