import * as skin3d from 'skin3d'

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
    const fov = document.getElementById("fov");
    const zoom = document.getElementById("zoom");
    const globalLight = document.getElementById("global_light");
    const cameraLight = document.getElementById("camera_light");
    const animationPauseResume = document.getElementById("animation_pause_resume");
    const autoRotate = document.getElementById("auto_rotate");
    const autoRotateSpeed = document.getElementById("auto_rotate_speed");
    const controlRotate = document.getElementById("control_rotate");
    const controlZoom = document.getElementById("control_zoom");
    const controlPan = document.getElementById("control_pan");
    const animationSpeed = document.getElementById("animation_speed");
    const hitSpeed = document.getElementById("hit_speed");
    const hitSpeedLabel = document.getElementById("hit_speed_label");
    const animationCrouch = document.getElementById("animation_crouch");
    const addHittingAnimation = document.getElementById("add_hitting_animation");

    fov?.addEventListener("change", e => {
        skinViewer.fov = Number(e.target.value);
    });

    zoom?.addEventListener("change", e => {
        skinViewer.zoom = Number(e.target.value);
    });

    globalLight?.addEventListener("change", e => {
        skinViewer.globalLight.intensity = Number(e.target.value);
    });

    cameraLight?.addEventListener("change", e => {
        skinViewer.cameraLight.intensity = Number(e.target.value);
    });

    animationPauseResume?.addEventListener("click", () => {
        if (skinViewer.animation) {
            skinViewer.animation.paused = !skinViewer.animation.paused;
        }
    });

    autoRotate?.addEventListener("change", e => {
        skinViewer.autoRotate = e.target.checked;
    });

    autoRotateSpeed?.addEventListener("change", e => {
        skinViewer.autoRotateSpeed = Number(e.target.value);
    });

    const animationRadios = document.querySelectorAll('input[type="radio"][name="animation"]');
    for (const el of animationRadios) {
        el.addEventListener("change", e => {
            const crouchSetting = document.getElementById("crouch_setting");
            if (crouchSetting) {
                crouchSetting.style.display = animationCrouch?.checked ? "block" : "none";
            }

            if (e.target.value === "") {
                skinViewer.animation = null;
            } else {
                skinViewer.animation = availableAnimations[e.target.value];
                if (skinViewer.animation && animationSpeed) {
                    skinViewer.animation.speed = Number(animationSpeed.value);
                }
            }
        });
    }

    animationCrouch?.addEventListener("change", () => {
        const crouchSettings = document.querySelectorAll('input[type="checkbox"][name="crouch_setting_item"]');
        for (const el of crouchSettings) {
            el.checked = false;
        }
        if (hitSpeed) hitSpeed.value = "";
        if (hitSpeedLabel) hitSpeedLabel.style.display = "none";
    });

    const crouchSettings = {
        runOnce: function(value) {
            if (skinViewer.animation) skinViewer.animation.runOnce = value;
        },
        showProgress: function(value) {
            if (skinViewer.animation) skinViewer.animation.showProgress = value;
        },
        addHitAnimation: function(value) {
            if (hitSpeedLabel) hitSpeedLabel.style.display = value ? "block" : "none";
            if (value && skinViewer.animation) {
                const hitSpeedValue = hitSpeed?.value;
                if (hitSpeedValue === "") {
                    skinViewer.animation.addHitAnimation();
                } else {
                    skinViewer.animation.addHitAnimation(hitSpeedValue);
                }
            }
        }
    };

    function updateCrouchAnimation() {
        skinViewer.animation = new skin3d.CrouchAnimation();
        if (skinViewer.animation && animationSpeed) {
            skinViewer.animation.speed = Number(animationSpeed.value);
        }
        const crouchSettingItems = document.querySelectorAll('input[type="checkbox"][name="crouch_setting_item"]');
        for (const el of crouchSettingItems) {
            const setting = crouchSettings[el.value];
            if (setting) setting(el.checked);
        }
    }

    const crouchSettingItems = document.querySelectorAll('input[type="checkbox"][name="crouch_setting_item"]');
    for (const el of crouchSettingItems) {
        el.addEventListener("change", updateCrouchAnimation);
    }

    hitSpeed?.addEventListener("change", updateCrouchAnimation);

    animationSpeed?.addEventListener("change", e => {
        if (skinViewer.animation) {
            skinViewer.animation.speed = Number(e.target.value);
        }
        if (animationCrouch?.checked && addHittingAnimation?.checked && hitSpeed?.value === "") {
            updateCrouchAnimation();
        }
    });

    controlRotate?.addEventListener("change", e => {
        skinViewer.controls.enableRotate = e.target.checked;
    });

    controlZoom?.addEventListener("change", e => {
        skinViewer.controls.enableZoom = e.target.checked;
    });

    controlPan?.addEventListener("change", e => {
        skinViewer.controls.enablePan = e.target.checked;
    });

    for (const part of skinParts) {
        for (const layer of skinLayers) {
            const checkbox = document.querySelector(
                `#layers_table input[type="checkbox"][data-part="${part}"][data-layer="${layer}"]`
            );
            checkbox?.addEventListener("change", e => {
                skinViewer.playerObject.skin[part][layer].visible = e.target.checked;
            });
        }
    }

    function initializeUploadButton(id, callback) {
        const urlInput = document.getElementById(id);
        const fileInput = document.getElementById(`${id}_upload`);
        const unsetButton = document.getElementById(`${id}_unset`);

        function unsetAction() {
            if (urlInput) {
                urlInput.readOnly = false;
                urlInput.value = "";
            }
            if (fileInput) {
                fileInput.value = fileInput.defaultValue;
            }
            callback();
        }

        fileInput?.addEventListener("change", callback);
        urlInput?.addEventListener("keydown", e => {
            if (e.key === "Backspace" && urlInput?.readOnly) {
                unsetAction();
            }
        });
        unsetButton?.addEventListener("click", unsetAction);
    }

    initializeUploadButton("skin_url", reloadSkin);
    initializeUploadButton("cape_url", reloadCape);
    initializeUploadButton("ears_url", reloadEars);
    initializeUploadButton("panorama_url", reloadPanorama);

    const skinUrl = document.getElementById("skin_url");
    const skinModel = document.getElementById("skin_model");
    const capeUrl = document.getElementById("cape_url");
    const earsSource = document.getElementById("ears_source");
    const earsUrl = document.getElementById("ears_url");
    const panoramaUrl = document.getElementById("panorama_url");

    skinUrl?.addEventListener("change", reloadSkin);
    skinModel?.addEventListener("change", reloadSkin);
    capeUrl?.addEventListener("change", reloadCape);
    earsSource?.addEventListener("change", () => reloadEars());
    earsUrl?.addEventListener("change", () => reloadEars());
    panoramaUrl?.addEventListener("change", reloadPanorama);

    const backEquipmentRadios = document.querySelectorAll('input[type="radio"][name="back_equipment"]');
    for (const el of backEquipmentRadios) {
        el.addEventListener("change", e => {
            if (skinViewer.playerObject.backEquipment === null) {
                // cape texture hasn't been loaded yet
                // this option will be processed on texture loading
            } else {
                skinViewer.playerObject.backEquipment = e.target.value;
            }
        });
    }

    const resetAll = document.getElementById("reset_all");
    resetAll?.addEventListener("click", () => {
        skinViewer.dispose();
        initializeViewer();
    });

    const nametagText = document.getElementById("nametag_text");
    nametagText?.addEventListener("change", reloadNameTag);

    const backgroundType = document.getElementById("background_type");
    const backgroundColor = document.getElementById("background_color");

    backgroundType?.addEventListener("change", updateBackground);
    backgroundColor?.addEventListener("change", updateBackground);

    // Set panorama as default
    if (backgroundType) {
        backgroundType.value = "panorama";
    }

    // Initialize background type
    updateBackground();
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
