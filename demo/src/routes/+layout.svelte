<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	
	let theme = 'light';
	
	onMount(() => {
		// Check for saved theme preference or default to light mode
		const savedTheme = localStorage.getItem('theme') || 'light';
		setTheme(savedTheme);
		
		// Close menu on desktop resize
		if (browser) {
			window.addEventListener('resize', handleResize);
			return () => window.removeEventListener('resize', handleResize);
		}
	});
	
	function toggleTheme() {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);
	}
	
	function setTheme(newTheme) {
		theme = newTheme;
		localStorage.setItem('theme', newTheme);
		document.documentElement.setAttribute('data-theme', newTheme);
	}
	
	// Mobile menu state
	let isMenuOpen = false;
	
	$: if (browser && isMenuOpen) {
		document.body.style.overflow = 'hidden';
	} else if (browser) {
		document.body.style.overflow = '';
	}
	
	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
	
	// Close menu on desktop resize
	function handleResize() {
		if (browser && window.innerWidth >= 768) {
			isMenuOpen = false;
		}
	}
</script>

<nav class="navbar">
	<div class="nav-container">
		<div class="nav-brand">
			<img src='./logo.png' alt="Skin3D" class="nav-logo" />
		</div>
		
		<!-- Mobile menu button -->
	<button class="mobile-menu-toggle" on:click={toggleMenu} aria-label="Toggle menu" class:active={isMenuOpen}>
		{#if isMenuOpen}
			<i class="fa fa-times"></i>
		{:else}
			<i class="fa fa-bars"></i>
		{/if}
	</button>
		
		<div class="nav-links" class:nav-links-mobile={isMenuOpen}>
			<a href="/docs" class="nav-link" on:click={toggleMenu}>
				<i class="fa fa-book"></i>
				DOCUMENTATION
			</a>
			<a href="https://github.com/cosmic-fi/skin3d" class="nav-link" target="_blank" on:click={toggleMenu}>
				<i class="fab fa-github"></i>
				GITHUB
			</a>
			<button class="theme-toggle" on:click={toggleTheme} aria-label="Toggle theme">
				{@html theme === 'light' ? '<i class="fa fa-moon"></i>' : '<i class="fa fa-sun"></i>'}
			</button>
			<span class="nav-spacer"></span>
			<button class="btn btn-primary">
				<i class="fa fa-heart"></i>
				Donate
			</button>
		</div>
	</div>
	
	<!-- Mobile menu backdrop -->
	{#if isMenuOpen}
		<button class="mobile-backdrop" on:click={toggleMenu} aria-label="Close menu"></button>
	{/if}
</nav>

<main>
	<slot />
</main>

<style>
	.navbar {
		position: sticky;
		top: 0 !important;
		z-index: 100;
		background: var(--surface);
		border-bottom: 1px solid var(--border);
		position: relative;
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 70px;
		position: relative;
	}

	.nav-brand {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
		color: var(--text);
		font-weight: 500;
		font-size: 1.125rem;
	}
	.nav-spacer {
		width: 1px;
		height: 24px;
		background: var(--border);
	}
	.nav-logo {
		height: 34px;
		border-radius: var(--radius-sm);
	}

	.nav-links {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.nav-link {
		color: var(--text-secondary);
		text-decoration: none;
		font-size: 0.875rem;
		padding: 0.375rem 0.75rem;
		border-radius: var(--radius-sm);
		transition: var(--transition-fast);
	}

	.nav-link:hover {
		color: var(--text);
		background: var(--surface-hover);
	}

	.theme-toggle {
		background: none;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 0.375rem 0.5rem;
		font-size: 1rem;
		cursor: pointer;
		transition: var(--transition-fast);
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 2rem;
		color: var(--text);
	}

	.theme-toggle:hover {
		background: var(--surface-hover);
		border-color: var(--accent);
	}

	:global(body) {
		margin: 0;
		padding: 0;
		background: var(--background);
		color: var(--text);
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
		line-height: 1.5;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	:global(.container) {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	/* Mobile menu styles */
	.mobile-menu-toggle {
		display: none;
		background: none;
		color: var(--text);
		border: none;
		padding: 0.5rem;
		cursor: pointer;
		flex-direction: column;
		gap: 0.25rem;
		border-radius: var(--radius-sm);
		transition: var(--transition-fast);
		width: 40px;
		font-size: 1.25rem;
		height: 40px;
		justify-content: center;
		align-items: center;
	}

	.mobile-menu-toggle:hover {
		background: var(--surface-hover);
	}

	/* Mobile menu backdrop */
	.mobile-backdrop {
		position: fixed;
		top: 70px;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 98;
		transition: var(--transition-fast);
		border: none;
		padding: 0;
		margin: 0;
		cursor: pointer;
	}

	/* Mobile responsive styles */
	@media (max-width: 768px) {
		.mobile-menu-toggle {
			display: flex;
		}

		.nav-links {
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			align-items: center !important;
			justify-content: center !important;
			background: var(--surface);
			border-bottom: 1px solid var(--border) !important;
			flex-direction: column;
			padding: 1rem;
			gap: 0.75rem;
			transform: translateY(-10px);
			opacity: 0;
			visibility: hidden;
			pointer-events: none;
			transition: var(--transition-fast);
			z-index: 99;
			box-shadow: var(--shadow-lg);
		}

		.nav-links-mobile {
			transform: translateY(0);
			opacity: 1;
			visibility: visible;
			pointer-events: auto;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		.nav-link {
			text-align: center;
			justify-content: center;
			padding: 0.75rem;
		}

		.nav-spacer {
			display: none;
		}

		.btn-primary {
			margin-top: 1rem;
			justify-content: center;
		}
	}

	:global(.btn) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-sm) var(--spacing-lg);
		font-weight: 500;
		text-decoration: none;
		border-radius: var(--radius-md);
		transition: all var(--transition-fast);
		border: none;
		cursor: pointer;
		font-size: 0.95rem;
		line-height: 1;
	}

	:global(.btn-primary) {
		background: var(--primary);
		color: white;
		box-shadow: var(--shadow-sm);
	}

	:global(.btn-primary:hover) {
		background: var(--primary-dark);
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
	}

	:global(.btn-secondary) {
		background: var(--surface);
		color: var(--text);
		border: 1px solid var(--border);
	}

	:global(.btn-secondary:hover) {
		background: var(--surface-hover);
		border-color: var(--primary);
		color: var(--primary);
	}

	@media (max-width: 768px) {
		.nav-container {
			padding: 0 var(--spacing-md);
		}

		.nav-links {
			gap: var(--spacing-xs);
		}

		.nav-link {
			padding: var(--spacing-sm);
			font-size: 0.9rem;
		}
	}
</style>