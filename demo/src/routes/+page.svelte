<script>
	import { onMount } from 'svelte';
	import SkinViewer from '$lib/components/SkinViewer.svelte';
	import ControlPanel from '$lib/components/ControlPanel.svelte';
	import GettingStarted from '$lib/components/GettingStarted.svelte';
	
	let viewer;
	
	onMount(() => {
		// Initialize viewer when component mounts
	});
</script>

<svelte:head>
	<meta name="description" content="Skin3D: Instantly mess with Minecraft skins, capes, elytras, and more in real-time 3D. Tweak, preview, and play—perfect for devs who want to see what’s up fast.">
	<meta name="keywords" content="Minecraft, skin viewer, 3D, skin3d, skinview3d, cape, elytra, animation, preview, editor, API, web, JavaScript">
	<meta name="author" content="">
	<meta property="og:title" content="Skin3D - Home">
	<meta property="og:description" content="Skin3D: Instantly mess with Minecraft skins, capes, elytras, and more in real-time 3D. Tweak, preview, and play—perfect for devs who want to see what’s up fast.">
	<meta property="og:image" content="img/logo.png">
	<meta property="og:type" content="website">
	<meta property="og:url" content="https://github.com/cosmic-fi/skin3d">
	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:title" content="Skin3D - Home">
	<meta name="twitter:description" content="Skin3D: Instantly mess with Minecraft skins, capes, elytras, and more in real-time 3D. Tweak, preview, and play—perfect for devs who want to see what’s up fast.">
	<meta name="twitter:image" content="img/logo.png">
	<link rel="icon" type="image/png" href="favicon.png">
</svelte:head>

<div class="container">
	<!-- Hero Section -->
	<section class="hero">
		<div class="hero-content">
			<h1 class="hero-title">Welcome to Skin3D</h1>
			<p class="hero-description">
				A powerful open-source 3D Minecraft skin viewer library. Load skins, capes, and elytras with smooth animations, dynamic lighting, and full customization.
			</p>
			<div class="hero-actions">
				<a href="#preview" class="btn">Try it out</a>
				<a href="https://github.com/cosmic-fi/skin3d" class="btn btn-secondary" target="_blank">GitHub</a>
			</div>
		</div>
	</section>

	<!-- Preview Section -->
	<section id="preview" class="preview-section">
		<div class="viewer-container">
			<div class="viewer-wrapper">
				<SkinViewer bind:this={viewer} />
			</div>
			<div class="controls-wrapper">
				<ControlPanel {viewer} />
			</div>
		</div>
	</section>

	<GettingStarted />
	<div class="credits">
		<p>Created by <a href="https://github.com/cosmic-fi" target="_blank">cosmic-fi</a></p>
		<p class="disclaimer">This project is based on <a href="https://github.com/bs-community/skinview3d" target="_blank">skinview3d</a>, optimized for both performance and usability. All credits go to the original authors and contributors.</p>
	</div>
</div>

<style>
	.hero {
		text-align: center;
		padding: 4rem 1rem;
	}
	
	.hero-content {
		max-width: 600px;
		margin: 0 auto;
	}
	
	.hero-title {
		font-size: 2.5rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
		font-family: var(--font-minecraft);
		color: var(--text);
	}
	
	.hero-description {
		font-size: 1.125rem;
		color: var(--text-secondary);
		margin: 0 0 2rem 0;
		line-height: 1.6;
	}
	
	.hero-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}
	
	.btn {
		padding: 0.75rem 1.5rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		background: var(--surface);
		color: var(--text);
		text-decoration: none;
		font-weight: 500;
		transition: var(--transition-fast);
	}
	
	.btn:hover {
		background: var(--surface-hover);
		border-color: var(--accent);
		color: var(--accent);
	}
	
	.btn-secondary {
		background: var(--background);
	}
	
	.preview-section {
		padding: 3rem 0;
	}

	.viewer-container {
		display: grid;
		grid-template-columns: 1fr 400px;
		grid-template-rows: minmax(450px, 1fr);
		gap: 2rem;
		max-width: 1200px;
		margin: 0 auto;
		height: 70vh;
	}

	.viewer-wrapper {
		background: var(--surface);
		border-radius: 25px;
		box-shadow: 0 0 0 1px var(--border);
		transition: var(--transition-fast);
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.viewer-wrapper:hover {
		border-color: var(--accent);
	}

	.controls-wrapper {
		background: var(--surface);
		border-radius: 20px;
		box-shadow: 0 0 0 2px var(--border);
		transition: var(--transition-fast);
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	.controls-wrapper:hover {
		border-color: var(--accent);
	}
	
	@media (max-width: 1200px) {
		.viewer-container {
			grid-template-columns: 1fr;
			grid-template-rows: auto auto;
			height: auto;
			min-height: auto;
			max-height: none;
		}
		
		.viewer-wrapper {
			height: 450px;
		}
		
		.controls-wrapper {
			max-height: 60vh;
			min-height: 400px;
		}
	}
	
	@media (max-width: 768px) {
		.hero {
			padding: 3rem 1rem;
		}
		
		.hero-title {
			font-size: 2rem;
		}
		
		.hero-description {
			font-size: 1rem;
		}
		
		.hero-actions {
			flex-direction: column;
			align-items: center;
		}
	}
	
	@media (max-width: 480px) {
		.viewer-container {
			gap: 1rem;
		}
		
		.viewer-wrapper {
			height: 350px;
		}
		
		.controls-wrapper {
			max-height: 50vh;
			min-height: 300px;
		}
	}
	.credits{
		display: flex;
		flex-direction: row-reverse;
		justify-content: space-between;

		.disclaimer{
			font-size: 0.875rem;
			color: var(--text-secondary);
			line-height: 1.6;
			opacity: 0.8;
			max-width: 600px;
			text-align: left;
		}
	}
</style>