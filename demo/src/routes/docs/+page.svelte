<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  let docsHtml = '';
  let loading = true;
  let error = '';
  
  onMount(async () => {
    if (browser) {
      try {
        const response = await fetch('/docs/index.html');
        if (response.ok) {
          docsHtml = await response.text();
          // Replace relative paths to work from the current location
          docsHtml = docsHtml.replace(/href="assets\//g, 'href="/docs/assets/');
          docsHtml = docsHtml.replace(/src="assets\//g, 'src="/docs/assets/');
        } else {
          error = 'Documentation not found';
        }
      } catch (err) {
        error = 'Failed to load documentation';
      } finally {
        loading = false;
      }
    }
  });
</script>

<svelte:head>
  <title>Documentation - Skin3d</title>
  <meta name="description" content="Skin3d Documentation" />
</svelte:head>

<div class="docs-container">
  {#if loading}
    <div class="loading">Loading documentation...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else}
    <div class="docs-content">
      {@html docsHtml}
    </div>
  {/if}
</div>

<style>
  .docs-container {
    min-height: calc(100vh - 4rem);
    background: var(--background);
  }
  
  .docs-content {
    width: 100%;
    height: 100%;
  }
  
  .loading, .error {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
    padding: 2rem;
    color: var(--text-secondary);
    font-size: 1.1rem;
  }
  
  .error {
    color: var(--error);
  }
  
  /* Override docs styles to work with our theme */
  :global(.docs-content) {
    color: var(--text-primary);
  }
  
  :global(.docs-content a) {
    color: var(--primary);
  }
  
  :global(.docs-content code) {
    background: var(--surface);
    color: var(--text-primary);
  }
</style>