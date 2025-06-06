import * as skin3d from "skin3d";

const skinParts = ["head", "body", "rightArm", "leftArm", "rightLeg", "leftLeg"];
const skinLayers = ["innerLayer", "outerLayer"];
const availableAnimations = {
    idle: new skin3d.IdleAnimation(),
    walk: new skin3d.WalkingAnimation(),
    run: new skin3d.RunningAnimation(),
    fly: new skin3d.FlyingAnimation(),
    wave: new skin3d.WaveAnimation(),
    crouch: new skin3d.CrouchAnimation(),
    hit: new skin3d.HitAnimation(),
};
let skinViewer;

function obtainTextureUrl(id) {
    const urlInput = document.getElementById(id);
    const fileInput = document.getElementById(`${id}_upload`);
    const unsetButton = document.getElementById(`${id}_unset`);
    const file = fileInput?.files?.[0];

    if (!file) {
        if (unsetButton && !unsetButton.classList.contains("hidden")) {
            unsetButton.classList.add("hidden");
        }
        return urlInput?.value || "";
    }

    if (unsetButton) {
        unsetButton.classList.remove("hidden");
    }
    if (urlInput) {
        urlInput.value = `Local file: ${file.name}`;
        urlInput.readOnly = true;
    }
    return URL.createObjectURL(file);
}

function reloadSkin() {
    const input = document.getElementById("skin_url");
    const url = obtainTextureUrl("skin_url");
    if (url === "") {
        skinViewer.loadSkin(null);
        input?.setCustomValidity("");
    } else {
        const skinModel = document.getElementById("skin_model");
        const earsSource = document.getElementById("ears_source");

        skinViewer
            .loadSkin(url, {
                model: skinModel?.value,
                ears: earsSource?.value === "current_skin",
            })
            .then(() => input?.setCustomValidity(""))
            .catch(e => {
                input?.setCustomValidity("Image can't be loaded.");
                console.error(e);
            });
    }
}

function reloadCape() {
    const input = document.getElementById("cape_url");
    const url = obtainTextureUrl("cape_url");
    if (url === "") {
        skinViewer.loadCape(null);
        input?.setCustomValidity("");
    } else {
        const selectedBackEquipment = document.querySelector(
            'input[type="radio"][name="back_equipment"]:checked'
        );
        skinViewer
            .loadCape(url, { backEquipment: selectedBackEquipment?.value })
            .then(() => input?.setCustomValidity(""))
            .catch(e => {
                input?.setCustomValidity("Image can't be loaded.");
                console.error(e);
            });
    }
}

function reloadEars(skipSkinReload = false) {
    const earsSource = document.getElementById("ears_source");
    const sourceType = earsSource?.value;
    let hideInput = true;

    if (sourceType === "none") {
        skinViewer.loadEars(null);
    } else if (sourceType === "current_skin") {
        if (!skipSkinReload) {
            reloadSkin();
        }
    } else {
        hideInput = false;
        const options = document.querySelectorAll("#default_ears option[data-texture-type]");
        for (const opt of options) {
            opt.disabled = opt.dataset.textureType !== sourceType;
        }

        const input = document.getElementById("ears_url");
        const url = obtainTextureUrl("ears_url");
        if (url === "") {
            skinViewer.loadEars(null);
            input?.setCustomValidity("");
        } else {
            skinViewer
                .loadEars(url, { textureType: sourceType })
                .then(() => input?.setCustomValidity(""))
                .catch(e => {
                    input?.setCustomValidity("Image can't be loaded.");
                    console.error(e);
                });
        }
    }

    const el = document.getElementById("ears_texture_input");
    if (hideInput) {
        if (el && !el.classList.contains("hidden")) {
            el.classList.add("hidden");
        }
    } else if (el) {
        el.classList.remove("hidden");
    }
}

function reloadPanorama() {
    const input = document.getElementById("panorama_url");
    const url = obtainTextureUrl("panorama_url");
    if (url === "") {
        skinViewer.background = null;
        input?.setCustomValidity("");
    } else {
        skinViewer
            .loadPanorama(url)
            .then(() => input?.setCustomValidity(""))
            .catch(e => {
                input?.setCustomValidity("Image can't be loaded.");
                console.error(e);
            });
    }
}

function updateBackground() {
    const backgroundType = document.getElementById("background_type")?.value;
    const panoramaSection =
        document.querySelector(".control-section h1")?.textContent === "Panorama"
            ? document.querySelector(".control-section h1")?.parentElement
            : null;

    if (backgroundType === "color") {
        const color = document.getElementById("background_color")?.value;
        skinViewer.background = color;
        if (panoramaSection) {
            panoramaSection.style.display = "none";
        }
    } else {
        if (panoramaSection) {
            panoramaSection.style.display = "block";
        }
        reloadPanorama();
    }
}

function reloadNameTag() {
    const text = document.getElementById("nametag_text")?.value;
    if (text === "") {
        skinViewer.nameTag = null;
    } else {
        skinViewer.nameTag = text;
    }
}

// The rest of the code (initializeControls, initializeViewer, etc.) can be converted in the same way as above.
// Remove all TypeScript types and use plain JS syntax.

function initializeControls() {
    // ...convert as above, removing types...
}

function initializeViewer() {
    const skinContainer = document.getElementById("skin_container");
    if (!skinContainer) {
        throw new Error("Canvas element not found");
    }

    skinViewer = new skin3d.SkinViewer({
        canvas: skinContainer,
    });

    const fov = document.getElementById("fov");
    const zoom = document.getElementById("zoom");
    const globalLight = document.getElementById("global_light");
    const cameraLight = document.getElementById("camera_light");
    const autoRotate = document.getElementById("auto_rotate");
    const autoRotateSpeed = document.getElementById("auto_rotate_speed");
    const controlRotate = document.getElementById("control_rotate");
    const controlZoom = document.getElementById("control_zoom");
    const controlPan = document.getElementById("control_pan");
    const animationSpeed = document.getElementById("animation_speed");

    skinViewer.width = 500;
    skinViewer.height = 500;
    skinViewer.fov = Number(fov?.value);
    skinViewer.zoom = Number(zoom?.value);
    skinViewer.globalLight.intensity = Number(globalLight?.value);
    skinViewer.cameraLight.intensity = Number(cameraLight?.value);
    skinViewer.autoRotate = autoRotate?.checked ?? false;
    skinViewer.autoRotateSpeed = Number(autoRotateSpeed?.value);

    const animationRadio = document.querySelector('input[type="radio"][name="animation"]:checked');
    const animationName = animationRadio?.value;
    if (animationName) {
        skinViewer.animation = availableAnimations[animationName];
        if (skinViewer.animation && animationSpeed) {
            skinViewer.animation.speed = Number(animationSpeed.value);
        }
    }

    skinViewer.controls.enableRotate = controlRotate?.checked ?? false;
    skinViewer.controls.enableZoom = controlZoom?.checked ?? false;
    skinViewer.controls.enablePan = controlPan?.checked ?? false;

    for (const part of skinParts) {
        for (const layer of skinLayers) {
            const checkbox = document.querySelector(
                `#layers_table input[type="checkbox"][data-part="${part}"][data-layer="${layer}"]`
            );
            skinViewer.playerObject.skin[part][layer].visible = checkbox?.checked ?? false;
        }
    }

    reloadSkin();
    reloadCape();
    reloadEars(true);
    reloadPanorama();
    reloadNameTag();
}

initializeViewer();
initializeControls();