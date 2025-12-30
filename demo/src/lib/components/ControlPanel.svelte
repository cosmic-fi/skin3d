<script>
	export let viewer;
	
	let skinUrl = '/img/skins/OSYDIAN_Blossom.png';
	let skinModel = 'auto-detect';
	let earsSource = 'none';
	let earsUrl = '';
	let capeUrl = '/img/capes/mojang_cape.png';
	let backEquipment = 'cape';
	let backgroundType = 'color';
	let backgroundColor = '#c2b4ff';
	let panoramaUrl = '/img/panoramas/panorama.png';
	let nameTagText = '';
	let animationType = 'idle';
	let animationSpeed = 1;
	let isPaused = false;
	let fov = 70;
	let zoom = 0.6;
	let globalLight = 3;
	let cameraLight = 0.6;
	let autoRotate = false;
	let autoRotateSpeed = 1;
	let controlRotate = true;
	let controlZoom = true;
	let controlPan = false;
	
	// Crouch animation settings
	let crouchRunOnce = false;
	let crouchShowProgress = false;
	let crouchAddHitAnimation = false;
	let hitSpeed = '';
	
	// Layer visibility
	let layers = {
		head: { innerLayer: true, outerLayer: true },
		body: { innerLayer: true, outerLayer: true },
		rightArm: { innerLayer: true, outerLayer: true },
		leftArm: { innerLayer: true, outerLayer: true },
		rightLeg: { innerLayer: true, outerLayer: true },
		leftLeg: { innerLayer: true, outerLayer: true },
	};
	
	function handleSkinChange() {
		if (viewer) {
			viewer.loadSkin(skinUrl, {
				model: skinModel,
				ers: earsSource === 'current_skin',
			});
		}
	}
	
	function handleCapeChange() {
		if (viewer) {
			viewer.loadCape(capeUrl, { backEquipment });
		}
	}
	
	function handleEarsChange() {
		if (!viewer) return;
		
		if (earsSource === 'none') {
			viewer.loadEars(null);
		} else if (earsSource === 'current_skin') {
			handleSkinChange();
		} else {
			viewer.loadEars(earsUrl, { 
				textureType: earsSource === 'skin' ? 'skin' : 'standalone' 
			});
		}
	}
	
	function handleBackgroundChange() {
		if (!viewer) return;
		
		if (backgroundType === 'color') {
			viewer.setBackground(backgroundColor);
		} else {
			viewer.loadPanorama(panoramaUrl);
		}
	}
	
	function handleAnimationChange() {
		if (viewer) {
			viewer.setAnimation(animationType);
			if (animationType === 'crouch') {
				updateCrouchAnimation();
			}
		}
	}
	
	function updateCrouchAnimation() {
		if (!viewer || animationType !== 'crouch') return;
		
		viewer.setAnimation('crouch');
		const anim = viewer.animation;
		if (anim) {
			anim.runOnce = crouchRunOnce;
			anim.showProgress = crouchShowProgress;
			if (crouchAddHitAnimation) {
				if (hitSpeed === '') {
					anim.addHitAnimation();
				} else {
					anim.addHitAnimation(hitSpeed);
				}
			}
		}
	}
	
	function handleLayerChange(part, layer, value) {
		layers[part][layer] = value;
		if (viewer) {
			viewer.setLayerVisibility(part, layer, value);
		}
	}
	
	function handleReset() {
		if (viewer) {
			viewer.reset();
		}
	}
	
	$: if (viewer && skinUrl) handleSkinChange();
	$: if (viewer && capeUrl) handleCapeChange();
	$: if (viewer && earsUrl && earsSource !== 'none' && earsSource !== 'current_skin') handleEarsChange();
	$: if (viewer && backgroundType === 'color' && backgroundColor) handleBackgroundChange();
	$: if (viewer && backgroundType === 'panorama' && panoramaUrl) handleBackgroundChange();
	$: if (viewer && nameTagText !== undefined) viewer.setNameTag(nameTagText);
	$: if (viewer && animationType) handleAnimationChange();
	$: if (viewer && animationSpeed) viewer.setAnimationSpeed(animationSpeed);
	$: if (viewer && fov) viewer.setFOV(fov);
	$: if (viewer && zoom) viewer.setZoom(zoom);
	$: if (viewer && globalLight !== undefined) viewer.setGlobalLight(globalLight);
	$: if (viewer && cameraLight !== undefined) viewer.setCameraLight(cameraLight);
	$: if (viewer && autoRotate !== undefined) viewer.setAutoRotate(autoRotate, autoRotateSpeed);
	$: if (viewer && controlRotate !== undefined && controlZoom !== undefined && controlPan !== undefined) {
		viewer.setControls(controlRotate, controlZoom, controlPan);
	}
	$: if (viewer && backEquipment) {
		viewer.setBackEquipment(backEquipment);
	}
</script>

<div class="control-panel">
	<!-- Viewport Controls -->
	<div class="control-section">
		<h3 class="section-title">Viewport</h3>
		<div class="control-grid">
			<div class="control-item">
				<label class="control-label">FOV</label>
				<input type="number" bind:value={fov} min="1" max="179" step="1" class="input" />
			</div>
			<div class="control-item">
				<label class="control-label">Zoom</label>
				<input type="number" bind:value={zoom} min="0.01" max="2" step="0.01" class="input" />
			</div>
		</div>
	</div>
	
	<!-- Lighting Controls -->
	<div class="control-section">
		<h3 class="section-title">Lighting</h3>
		<div class="control-grid">
			<div class="control-item">
				<label class="control-label">Global</label>
				<input type="number" bind:value={globalLight} min="0" max="2" step="0.01" class="input" />
			</div>
			<div class="control-item">
				<label class="control-label">Camera</label>
				<input type="number" bind:value={cameraLight} min="0" max="2" step="0.01" class="input" />
			</div>
		</div>
	</div>
	
	<!-- Animation Controls -->
	<div class="control-section">
		<h3 class="section-title">Animation</h3>
		<div class="control-group">
			<div class="radio-group">
				{#each ['none', 'idle', 'walk', 'run', 'fly', 'wave', 'crouch', 'hit'] as anim}
					<label class="radio-label">
						<input type="radio" bind:group={animationType} value={anim} class="radio" />
						{anim.charAt(0).toUpperCase() + anim.slice(1)}
					</label>
				{/each}
			</div>
			
			{#if animationType !== 'none'}
				<div class="control-grid">
					<div class="control-item">
						<label class="control-label">Speed</label>
						<input type="number" bind:value={animationSpeed} min="0.1" max="3" step="0.1" class="input" />
					</div>
					<div class="control-item">
						<button on:click={() => isPaused = !isPaused} class="btn btn-secondary">
							{isPaused ? 'Resume' : 'Pause'}
						</button>
					</div>
				</div>
			{/if}
			
			{#if animationType === 'crouch'}
				<div class="crouch-settings">
					<label class="checkbox-label">
						<input type="checkbox" bind:checked={crouchRunOnce} class="checkbox" />
						Run Once
					</label>
					<label class="checkbox-label">
						<input type="checkbox" bind:checked={crouchShowProgress} class="checkbox" />
						Show Progress
					</label>
					<label class="checkbox-label">
						<input type="checkbox" bind:checked={crouchAddHitAnimation} class="checkbox" />
						Add Hit Animation
					</label>
					{#if crouchAddHitAnimation}
						<input type="number" bind:value={hitSpeed} placeholder="Hit speed" class="input" />
					{/if}
				</div>
			{/if}
		</div>
	</div>
	
	<!-- Rotation Controls -->
	<div class="control-section">
		<h3 class="section-title">Rotation</h3>
		<div class="control-group">
			<label class="checkbox-label">
				<input type="checkbox" bind:checked={autoRotate} class="checkbox" />
				Auto Rotate
			</label>
			{#if autoRotate}
				<div class="control-item">
					<label class="control-label">Speed</label>
					<input type="number" bind:value={autoRotateSpeed} min="0.1" max="3" step="0.1" class="input" />
				</div>
			{/if}
		</div>
	</div>
	
	<!-- Mouse Controls -->
	<div class="control-section">
		<h3 class="section-title">Mouse Controls</h3>
		<div class="checkbox-group">
			<label class="checkbox-label">
				<input type="checkbox" bind:checked={controlRotate} class="checkbox" />
				Enable Rotate
			</label>
			<label class="checkbox-label">
				<input type="checkbox" bind:checked={controlZoom} class="checkbox" />
				Enable Zoom
			</label>
			<label class="checkbox-label">
				<input type="checkbox" bind:checked={controlPan} class="checkbox" />
				Enable Pan
			</label>
		</div>
	</div>
	
	<!-- Skin Layers -->
	<div class="control-section">
		<h3 class="section-title">Skin Layers</h3>
		<div class="layer-controls">
			<table class="layer-table">
				<thead>
					<tr>
						<th></th>
						<th>Head</th>
						<th>Body</th>
						<th>Right Arm</th>
						<th>Left Arm</th>
						<th>Right Leg</th>
						<th>Left Leg</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th>Inner</th>
						{#each Object.keys(layers) as part}
							<td>
								<input 
									type="checkbox" 
									bind:checked={layers[part].innerLayer} 
									on:change={() => handleLayerChange(part, 'innerLayer', layers[part].innerLayer)}
									class="checkbox"
								/>
							</td>
						{/each}
					</tr>
					<tr>
						<th>Outer</th>
						{#each Object.keys(layers) as part}
							<td>
								<input 
									type="checkbox" 
									bind:checked={layers[part].outerLayer} 
									on:change={() => handleLayerChange(part, 'outerLayer', layers[part].outerLayer)}
									class="checkbox"
								/>
							</td>
						{/each}
					</tr>
				</tbody>
			</table>
		</div>
		
		<div class="control-group">
			<label class="control-label">Back Equipment</label>
			<div class="radio-group">
				<label class="radio-label">
					<input type="radio" bind:group={backEquipment} value="cape" class="radio" />
					Cape
				</label>
				<label class="radio-label">
					<input type="radio" bind:group={backEquipment} value="elytra" class="radio" />
					Elytra
				</label>
			</div>
		</div>
	</div>
	
	<!-- Texture Controls -->
	<div class="control-section">
		<h3 class="section-title">Textures</h3>
		
		<!-- Skin -->
		<div class="texture-control">
			<label class="control-label">Skin</label>
			<div class="texture-inputs">
				<input type="text" bind:value={skinUrl} placeholder="Skin URL" class="input" />
				<select bind:value={skinModel} class="select">
					<option value="auto-detect">Auto Detect</option>
					<option value="default">Default</option>
					<option value="slim">Slim</option>
				</select>
			</div>
		</div>
		
		<!-- Cape -->
		<div class="texture-control">
			<label class="control-label">Cape</label>
			<input type="text" bind:value={capeUrl} placeholder="Cape URL" class="input" />
		</div>
		
		<!-- Ears -->
		<div class="texture-control">
			<label class="control-label">Ears</label>
			<div class="texture-inputs">
				<select bind:value={earsSource} class="select">
					<option value="none">None</option>
					<option value="current_skin">Current Skin</option>
					<option value="skin">Skin Texture</option>
					<option value="standalone">Standalone</option>
				</select>
				{#if earsSource === 'skin' || earsSource === 'standalone'}
					<input type="text" bind:value={earsUrl} placeholder="Ears URL" class="input" />
				{/if}
			</div>
		</div>
		
		<!-- Background -->
		<div class="texture-control">
			<label class="control-label">Background</label>
			<div class="texture-inputs">
				<select bind:value={backgroundType} class="select">
					<option value="color">Solid Color</option>
					<option value="panorama">Panorama</option>
				</select>
				{#if backgroundType === 'color'}
					<input type="color" bind:value={backgroundColor} class="input color-input" />
				{:else}
					<input type="text" bind:value={panoramaUrl} placeholder="Panorama URL" class="input" />
				{/if}
			</div>
		</div>
		
		<!-- Name Tag -->
		<div class="texture-control">
			<label class="control-label">Name Tag</label>
			<input type="text" bind:value={nameTagText} placeholder="Player name" class="input" />
		</div>
	</div>
	
	<!-- Reset Button -->
	<div class="control-section">
		<button on:click={handleReset} class="btn btn-primary" style="width: 100%;">
			Reset All Settings
		</button>
	</div>
</div>

<style>
	.control-panel {
		background: var(--surface);
		border-radius: 24px;
		padding: 1.5rem;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.control-section {
		flex-shrink: 0;
	}

	.control-panel::-webkit-scrollbar {
		width: 4px;
	}

	.control-panel::-webkit-scrollbar-track {
		background: var(--background);
		border-radius: var(--radius-sm);
	}

	.control-panel::-webkit-scrollbar-thumb {
		background: var(--border);
		border-radius: var(--radius-sm);
	}

	.control-section {
		margin-bottom: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--border);
	}

	.control-section:last-child {
		border-bottom: none;
		padding-bottom: 0;
		margin-bottom: 0;
	}

	.section-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text);
		margin-bottom: 0.5rem;
	}

	.control-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
	}

	.control-item {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.control-label {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.radio-group {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.25rem;
	}

	.radio-label {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.75rem;
		cursor: pointer;
	}

	.checkbox-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.75rem;
		cursor: pointer;
	}

	.crouch-settings {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.5rem;
		background: var(--background);
		border-radius: var(--radius-sm);
		border: 1px solid var(--border);
		margin-top: 0.5rem;
	}

	.layer-controls {
		overflow-x: auto;
		border-radius: var(--radius-sm);
		border: 1px solid var(--border);
		overflow: hidden;
	}

	.layer-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.75rem;
		background: var(--surface);
	}

	.layer-table th,
	.layer-table td {
		padding: 0.25rem;
		text-align: center;
		border: 1px solid var(--border);
	}

	.layer-table th {
		background: var(--surface);
		font-weight: 600;
		color: var(--text);
	}

	.texture-control {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin-bottom: 0.5rem;
		padding: 0.5rem;
		background: var(--background);
		border-radius: var(--radius-sm);
		border: 1px solid var(--border);
	}

	.texture-control:last-child {
		margin-bottom: 0;
	}

	.texture-inputs {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.color-input {
		width: 100%;
		height: 2rem;
		padding: 0.125rem;
		cursor: pointer;
		border-radius: var(--radius-sm);
		border: 1px solid var(--border);
	}

	/* Form elements */
	:global(.input) {
		background: var(--background);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 0.375rem 0.5rem;
		font-size: 0.75rem;
		color: var(--text);
	}

	:global(.input:focus) {
		outline: none;
		border-color: var(--accent);
		box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
	}

	:global(.checkbox) {
		accent-color: var(--accent);
		cursor: pointer;
	}

	:global(.radio) {
		accent-color: var(--accent);
		cursor: pointer;
	}

	@media (max-width: 768px) {
		.control-panel {
			padding: 1rem;
		}

		.control-grid {
			grid-template-columns: 1fr;
			gap: 0.25rem;
		}
		
		.radio-group {
			grid-template-columns: 1fr;
			gap: 0.25rem;
		}
		
		.texture-inputs {
			flex-direction: column;
			gap: 0.25rem;
		}
	}
</style>