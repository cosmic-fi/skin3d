<script>
	//@ts-nocheck
	import { fade } from 'svelte/transition';
</script>

<div class="getting-started" in:fade={{ duration: 600 }}>
	<div class="section-title">
		Getting Started
	</div>
	
	<div class="content">
		<p class="intro">
			Skin3D is a standalone 3D Minecraft skin viewer and editor. Follow these steps to set up and use the API in your own project.
		</p>
		
		<div class="steps">
			<div class="step">
				<h3>1. Install skin3d</h3>
				<div class="code-block">
					<code>npm i skin3d</code>
				</div>
			</div>
			
			<div class="step">
				<h3>2. Basic Usage Example</h3>
				<div class="code-block">
					<pre><code>&lt;div id="skin_view_container"&gt;&lt;/div&gt;</code></pre>
				</div>
				<div class="code-block">
					<pre>{@html `import * as skin3d from 'skin3d'

const viewer = new skin3d.View({
   canvas: document.getElementById("skin_view_container"),
   width: 300,
   height: 400,
   skin: "path-to-your-skin/your-skin.png"
});

// Optional: Add controls
viewer.controls.enableRotate = true;
viewer.controls.enableZoom = true;
viewer.controls.enablePan = false;`}</pre>
				</div>
			</div>
			
			<div class="step">
				<h3>3. Loading Capes and Elytras</h3>
				<div class="code-block">
					<pre><code>// Set a cape
viewer.loadCape("img/mojang_cape.png");
// Set an elytra
viewer.loadElytra("img/elytra.png");</code></pre>
				</div>
			</div>
			
			<div class="step">
				<h3>4. Animations</h3>
				<div class="code-block">
					<pre><code>viewer.animation = new skin3d.WalkingAnimation();

// Change speed
viewer.animation.speed = 1.2;

// Pause or resume
viewer.animation.paused = false;</code></pre>
				</div>
			</div>
			
			<div class="step">
				<h3>5. More Features</h3>
				<ul class="feature-list">
					<li>Change background: <code>viewer.setBackground("#c2b4ff");</code></li>
					<li>Change FOV: <code>viewer.fov = 70;</code></li>
					<li>Show/hide layers: <code>viewer.playerObject.skin.visible = false;</code></li>
				</ul>
			</div>
		</div>
		
		<div class="cta">
			<p>
				See the <a href="https://skin3d.vercel.app/docs/" target="_blank" class="docs-link">documentation</a> for more advanced usage and API details.
			</p>
		</div>
	</div>
</div>

<style>
	.getting-started {
		background: var(--surface);
		border-radius: var(--radius-md);
		padding: 2rem;
		border: 2px solid var(--border);
		margin-bottom: 2rem;
	}

	.section-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text);
		margin: 0 0 1rem 0;
		padding-bottom: 0.25rem;
		border-bottom: 1px solid var(--border);
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.intro {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin: 0;
		line-height: 1.5;
	}

	.steps {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.step {
		background: var(--background);
		border-radius: 10px;
		padding: 1rem;
		border: 1px solid var(--border);

	}

	.step h3 {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text);
		margin: 0 0 0.5rem 0;
	}

	.code-block {
		background: var(--background);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 0.75rem;
		margin: 0.25rem 0;
		font-family: monospace;
		font-size: 0.75rem;
		overflow-x: auto;
	}

	.code-block code {
		color: #0099e0 !important;
		white-space: pre;
		line-height: 1.4;
	}

	.code-block pre {
		margin: 0;
		color: #00aeff !important;
	}

	.feature-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.feature-list li {
		color: var(--text-secondary);
		font-size: 0.75rem;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.feature-list li::before {
		content: '→';
		color: var(--accent);
	}

	.feature-list code {
		background: var(--background);
		padding: 0.125rem 0.25rem;
		border-radius: var(--radius-sm);
		font-family: monospace;
		font-size: 0.75rem;
		color: #00aeff !important;
		border: 1px solid var(--border);
	}

	.cta {
		margin-top: 1rem;
		padding: 1rem;
		background: var(--background);
		border-radius: var(--radius-sm);
		text-align: center;
		border: 1px solid var(--border);
	}

	.cta p {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-secondary);
		line-height: 1.5;
	}

	.docs-link {
		color: var(--accent);
		text-decoration: none;
		font-weight: 500;
	}

	.docs-link:hover {
		color: var(--accent-hover);
	}

	@media (max-width: 768px) {
		.getting-started {
			padding: 1.5rem;
		}
		
		.step {
			padding: 0.75rem;
		}
		
		.code-block {
			padding: 0.5rem;
			font-size: 0.75rem;
		}
		
		.intro {
			font-size: 0.875rem;
		}
	}
</style>