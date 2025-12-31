<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  onMount(() => {
    if (browser) {
      // Redirect to the static documentation in a new window/tab
      window.open('/docs/index.html', '_blank');
      // Optionally redirect the current page back to home or show a message
      window.location.href = '/';
    }
  });
</script>

<svelte:head>
  <title>Documentation - Skin3d</title>
  <meta name="description" content="Skin3d Documentation" />
</svelte:head>

<div class="docs-redirect">
  <p>Opening documentation in a new window...</p>
  <p>If the documentation doesn't open automatically, <a href="/docs/index.html" target="_blank">click here</a>.</p>
</div>

<style>
  .docs-redirect {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
    padding: 2rem;
    text-align: center;
    gap: 1rem;
  }
  
  .docs-redirect p {
    color: var(--text-secondary);
    font-size: 1.1rem;
    margin: 0;
  }
  
  .docs-redirect a {
    color: var(--primary);
    text-decoration: none;
  }
  
  .docs-redirect a:hover {
    text-decoration: underline;
  }
</style>