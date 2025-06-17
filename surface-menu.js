// surface-menu.js

// Global variables for managing the state of the surface findings menu
let currentSurfaceFindingsMenu = null;
let currentSurfaceMultiSelectId = null;
let activeToothSurfaceSelection = { toothId: null, surfaces: new Set(), schemaOptionsKey: null };

/**
 * Closes the currently open surface findings menu and cleans up associated controls.
 */
window.closeSurfaceFindingsMenu = function() {
    console.trace("closeSurfaceFindingsMenu called"); // Diagnostic trace for direct calls
    // Remove the menu element from the DOM if it exists
    if (currentSurfaceFindingsMenu) {
        currentSurfaceFindingsMenu.remove();
        currentSurfaceFindingsMenu = null;
    }
    // Delete the associated multiselect control if it exists
    if (currentSurfaceMultiSelectId && window.controls && window.controls[currentSurfaceMultiSelectId]) {
        delete window.controls[currentSurfaceMultiSelectId];
        currentSurfaceMultiSelectId = null;
    }
}

/**
 * Closes the surface findings menu and cleans up transient UI selections.
 * @param {string} schemaOptionsKey - The schema options key associated with the tooth.
 */
window.closeSurfaceFindingsMenuAndCleanUp = function(schemaOptionsKey) {
    console.trace("closeSurfaceFindingsMenuAndCleanUp called"); // Diagnostic trace
    window.closeSurfaceFindingsMenu(); // Close the menu itself

    // If there's an active tooth selection and a schema key, remove transient selection classes
    if (activeToothSurfaceSelection.toothId && schemaOptionsKey) {
        const toothSvg = document.querySelector(`#svg-tooth-host-${activeToothSurfaceSelection.toothId}-${schemaOptionsKey}`);
        toothSvg?.querySelectorAll('.surface-selected-transient').forEach(poly => {
            poly.classList.remove('surface-selected-transient');
        });
    }
    // Reset the active tooth surface selection state
    activeToothSurfaceSelection.surfaces.clear();
    activeToothSurfaceSelection.toothId = null;
    activeToothSurfaceSelection.schemaOptionsKey = null;
}

/**
 * Opens a context menu for selecting findings on tooth surfaces.
 * @param {string} toothId - The ID of the tooth.
 * @param {string[]} surfaceIds - An array of surface IDs for which the menu is being opened.
 * @param {number} x - The x-coordinate for the menu position.
 * @param {number} y - The y-coordinate for the menu position.
 * @param {string} schemaOptionsKey - The schema options key for dynamic element options.
 */
window.openSurfaceFindingsMenu = function(toothId, surfaceIds, x, y, schemaOptionsKey) {
    window.closeSurfaceFindingsMenuAndCleanUp(schemaOptionsKey); // Close any existing surface menu and clean up its selection

    // Ensure global tooth menu is also closed, if the function exists
    if (typeof window.closeGlobalToothMenuAndCleanUp === 'function') {
        window.closeGlobalToothMenuAndCleanUp();
    }

    // Generate a unique ID for the multiselect control within this menu
    currentSurfaceMultiSelectId = `surface_findings_menu_${toothId}_${Date.now()}`;

    // Create the main menu div
    const menuDiv = document.createElement('div');
    menuDiv.id = 'surfaceFindingsContextMenu';
    // Basic styling for the menu
    menuDiv.style.position = 'fixed';
    menuDiv.style.left = `${x}px`;
    menuDiv.style.top = `${y}px`;
    menuDiv.style.border = '1px solid #ccc';
    menuDiv.style.backgroundColor = 'white';
    menuDiv.style.padding = '10px';
    menuDiv.style.zIndex = '1001'; // Ensure it's above other elements
    menuDiv.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';

    // Store references and data on the menu element
    currentSurfaceFindingsMenu = menuDiv;
    currentSurfaceFindingsMenu.dataset.toothId = toothId;
    currentSurfaceFindingsMenu.dataset.surfaceIds = JSON.stringify(surfaceIds);
    currentSurfaceFindingsMenu.dataset.schemaOptionsKey = schemaOptionsKey;

    // Create a host element for the multiselect component
    const multiSelectHost = document.createElement('div');
    menuDiv.appendChild(multiSelectHost);

    // Retrieve dynamic options based on the schema key
    // Assumes getDynamicElementOptions is globally available or defined elsewhere
    const activeOptionsConfig = typeof window.getDynamicElementOptions === 'function' ? window.getDynamicElementOptions(schemaOptionsKey) : null;
    // For the surface menu, use the UNTRANSFORMED options.
    const untransformedOptionsForSurfaceMenu = activeOptionsConfig?.items || activeOptionsConfig || [];

    if (!untransformedOptionsForSurfaceMenu || untransformedOptionsForSurfaceMenu.length === 0) {
        console.error(`[InlineSchema] No options found for ${schemaOptionsKey} to build surface menu.`);
        // Optionally, display a message in the menu or close it
        menuDiv.textContent = 'No options available.';
        document.body.appendChild(menuDiv);
         // Add a click outside listener even if there are no options, to allow closing it.
        menuDiv.addEventListener('click', e => e.stopPropagation());
        document.addEventListener('click', closeSurfaceFindingsMenuOnClickOutside, { once: true, capture: true });
        return;
    }

    // Prepare the initial state for the multiselect component
    const initialStateForMultiSelect = {};
    untransformedOptionsForSurfaceMenu.forEach(opt => { // e.g., Karies, Füllung (original config)
        const findingKey = opt.value; // e.g., "k"
        let isCheckedForAnySurfaceInMenu = false;
        // Determine the default structure for details based on detailsType
        let detailsToDisplay = opt.detailsType === 'multiselect' ? { multiselectValue: {}, additionalText: '' }
            : opt.detailsType === 'select' ? { selectValue: '', additionalText: '' }
                : '';

        // Check if this finding is active on *any* of the surfaces the menu was opened for.
        // If so, take details from the *first* such surface.
        for (const sid of surfaceIds) {
            // Assumes inlineZahnschemaState is globally available or defined elsewhere
            const surfaceFindingState = window.inlineZahnschemaState?.[toothId]?.surfaceFindings?.[sid]?.[findingKey];
            if (surfaceFindingState?.checked) {
                isCheckedForAnySurfaceInMenu = true;
                if (surfaceFindingState.details) { // If details exist, use them
                    detailsToDisplay = JSON.parse(JSON.stringify(surfaceFindingState.details));
                }
                break; // Found it on one surface, use its details
            }
        }
        initialStateForMultiSelect[findingKey] = {
            checked: isCheckedForAnySurfaceInMenu,
            text: opt.text,
            details: detailsToDisplay,
            isDefault: opt.isDefault || false
        };
    });

    // Create the multiselect component
    // Assumes createMultiSelect is globally available
    if (typeof window.createMultiSelect === 'function') {
        window.createMultiSelect(currentSurfaceMultiSelectId, {
            typ: 'multiselect', // Standard multiselect for this popup
            label: `Befunde für Zahn ${toothId} (Flächen: ${surfaceIds.join(', ')})`,
            containerElement: multiSelectHost,
            options: untransformedOptionsForSurfaceMenu, // Use UNTRANSFORMED options
            initialState: initialStateForMultiSelect,
            buttonTextConfig: { placeholder: 'Befunde auswählen...' }
        });
    } else {
        console.error("[InlineSchema] createMultiSelect function is not available.");
        multiSelectHost.textContent = "Error: Multiselect component cannot be loaded.";
    }


    // Create action buttons (Confirm, Cancel)
    const buttonsDiv = document.createElement('div');
    buttonsDiv.style.marginTop = '10px';
    buttonsDiv.style.textAlign = 'right';

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Übernehmen'; // "Apply" or "Confirm"
    confirmBtn.onclick = () => {
        applySurfaceFindingsFromMenu(); // Apply changes from the menu
        const schemaKeyForCleanup = currentSurfaceFindingsMenu?.dataset?.schemaOptionsKey || schemaOptionsKey;
        window.closeSurfaceFindingsMenuAndCleanUp(schemaKeyForCleanup); // Close and clean up
    };
    buttonsDiv.appendChild(confirmBtn);

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Abbrechen'; // "Cancel"
    cancelBtn.style.marginLeft = '5px';
    cancelBtn.onclick = () => {
        const schemaKeyForCleanup = currentSurfaceFindingsMenu?.dataset?.schemaOptionsKey || schemaOptionsKey;
        window.closeSurfaceFindingsMenuAndCleanUp(schemaKeyForCleanup); // Close and clean up without applying
    };
    buttonsDiv.appendChild(cancelBtn);
    menuDiv.appendChild(buttonsDiv);

    // Append the menu to the body
    document.body.appendChild(menuDiv);

    // Event listener to prevent the menu from closing when clicking inside it
    menuDiv.addEventListener('click', e => e.stopPropagation());
    // Event listener to close the menu when clicking outside of it
    document.addEventListener('click', closeSurfaceFindingsMenuOnClickOutside, { once: true, capture: true });
}

/**
 * Handles clicks outside the surface findings menu to close it.
 * Applies changes if configured, then closes and cleans up.
 * @param {Event} event - The click event.
 */
function closeSurfaceFindingsMenuOnClickOutside(event) {
    if (currentSurfaceFindingsMenu && !currentSurfaceFindingsMenu.contains(event.target)) {
        const schemaKeyFromMenu = currentSurfaceFindingsMenu.dataset.schemaOptionsKey;
        if (schemaKeyFromMenu) {
            applySurfaceFindingsFromMenu(); // Apply changes before closing
            window.closeSurfaceFindingsMenuAndCleanUp(schemaKeyFromMenu);
        } else {
            // Fallback if schema key is somehow not on the menu dataset
            console.warn("[InlineSchema] Could not determine schemaOptionsKey from closing menu for cleanup. Attempting generic cleanup.");
            window.closeSurfaceFindingsMenu(); // Basic close
            // Manually try to clear transient selections if activeToothSurfaceSelection is still populated
            if (activeToothSurfaceSelection.toothId && activeToothSurfaceSelection.schemaOptionsKey) {
                const toothSvg = document.querySelector(`#svg-tooth-host-${activeToothSurfaceSelection.toothId}-${activeToothSurfaceSelection.schemaOptionsKey}`);
                toothSvg?.querySelectorAll('.surface-selected-transient').forEach(poly => {
                    poly.classList.remove('surface-selected-transient');

                });
            }
            activeToothSurfaceSelection.surfaces.clear();
            activeToothSurfaceSelection.toothId = null;
            activeToothSurfaceSelection.schemaOptionsKey = null;
        }
    } else if (currentSurfaceFindingsMenu) { // Click was inside, re-register listener to keep it open
        document.addEventListener('click', closeSurfaceFindingsMenuOnClickOutside, { once: true, capture: true });
    }
}

/**
 * Applies the selected findings from the surface menu to the main state and updates UI.
 * This function assumes `inlineZahnschemaState`, `controls`, `getDynamicElementOptions`,
 * `updateSurfaceVisuals`, `updateToothCrownVisual`, and `updateBefundZusammenfassung`
 * are available in the global scope or defined elsewhere.
 * @returns {boolean} True if successful, false otherwise.
 */
function applySurfaceFindingsFromMenu() {
    // Check if the menu and its multiselect control are available
    if (!currentSurfaceFindingsMenu || !currentSurfaceMultiSelectId || !window.controls || !window.controls[currentSurfaceMultiSelectId]) {
        window.closeSurfaceFindingsMenuAndCleanUp(activeToothSurfaceSelection.schemaOptionsKey || currentSurfaceFindingsMenu?.dataset?.schemaOptionsKey);
        console.warn("[InlineSchema] Cannot apply surface findings: menu or multiselect not available.");
        return false;
    }

    // Retrieve necessary data from the menu's dataset
    const toothId = currentSurfaceFindingsMenu.dataset.toothId;
    const surfaceIdsAppliedTo = JSON.parse(currentSurfaceFindingsMenu.dataset.surfaceIds); // Surfaces for which the menu was opened
    const schemaOptionsKey = currentSurfaceFindingsMenu.dataset.schemaOptionsKey;

    if (!toothId || !surfaceIdsAppliedTo || !schemaOptionsKey) {
        window.closeSurfaceFindingsMenuAndCleanUp(schemaOptionsKey || activeToothSurfaceSelection.schemaOptionsKey);
        console.error("[InlineSchema] Cannot apply surface findings: menu data incomplete.");
        return false;
    }

    // Get current values from the menu's multiselect and schema options
    const currentValuesFromMenu = window.controls[currentSurfaceMultiSelectId]?.value;
    const schemaFindingOptions = (typeof window.getDynamicElementOptions === 'function' ? window.getDynamicElementOptions(schemaOptionsKey)?.items : null) || (typeof window.getDynamicElementOptions === 'function' ? window.getDynamicElementOptions(schemaOptionsKey) : null) || [];

    if (currentValuesFromMenu && schemaFindingOptions.length > 0) {
        // Ensure inlineZahnschemaState and necessary sub-objects exist
        if (!window.inlineZahnschemaState) window.inlineZahnschemaState = {};
        if (!window.inlineZahnschemaState[toothId]) window.inlineZahnschemaState[toothId] = { findings: {}, surfaceFindings: {} };
        if (!window.inlineZahnschemaState[toothId].findings) window.inlineZahnschemaState[toothId].findings = {};
        if (!window.inlineZahnschemaState[toothId].surfaceFindings) window.inlineZahnschemaState[toothId].surfaceFindings = {};


        // Iterate over each finding option (e.g., Karies, Füllung) from the schema
        schemaFindingOptions.forEach(schemaOpt => { // schemaOpt is e.g., { value: "k", text: "Karies", _dynamicOptions: ... }
            const findingKey = schemaOpt.value; // e.g., "k"
            const findingStateInMenu = currentValuesFromMenu[findingKey]; // State of "Karies" in the surface menu

            if (!findingStateInMenu) return; // This finding was not in the menu's state (should not happen if menu built correctly)

            // Update the main tooth finding state based on the "Anwendungsbereich" (application area)
            if (findingStateInMenu.checked && schemaOpt._dynamicOptions && findingStateInMenu.details?.multiselectValue) {
                // This finding (e.g., Karies) has an "Anwendungsbereich"
                const areaSelections = findingStateInMenu.details.multiselectValue; // e.g., { "k_okklusal": { checked: true, ... }}

                // Initialize/update the main tooth finding (e.g., inlineZahnschemaState[toothId].findings.k)
                if (!window.inlineZahnschemaState[toothId].findings[findingKey]) {
                    window.inlineZahnschemaState[toothId].findings[findingKey] = { checked: false, text: schemaOpt.text, details: { multiselectValue: {}, additionalText: '' } };
                } else if (typeof window.inlineZahnschemaState[toothId].findings[findingKey].details !== 'object' || window.inlineZahnschemaState[toothId].findings[findingKey].details === null || !window.inlineZahnschemaState[toothId].findings[findingKey].details.multiselectValue) {
                    // Ensure the details structure is correct for an "Anwendungsbereich" multiselect
                    window.inlineZahnschemaState[toothId].findings[findingKey].details = { multiselectValue: {}, additionalText: findingStateInMenu.details.additionalText || '' };
                }

                let mainFindingChecked = false;
                Object.entries(areaSelections).forEach(([areaKey, areaState]) => { // areaKey e.g., "k_okklusal", areaState is its state
                    window.inlineZahnschemaState[toothId].findings[findingKey].details.multiselectValue[areaKey] = JSON.parse(JSON.stringify(areaState));
                    if (areaState.checked) mainFindingChecked = true;
                });
                window.inlineZahnschemaState[toothId].findings[findingKey].checked = mainFindingChecked;

                // Update the UI of the main tooth's multiselect
                const mainToothMultiselectControlId = `inline_tooth_${toothId}_findings_${schemaOptionsKey}`;
                const mainToothMultiselectControl = window.controls?.[mainToothMultiselectControlId];
                if (mainToothMultiselectControl?.value?.[findingKey]) {
                    mainToothMultiselectControl.value[findingKey].checked = mainFindingChecked;
                    mainToothMultiselectControl.value[findingKey].details = JSON.parse(JSON.stringify(window.inlineZahnschemaState[toothId].findings[findingKey].details));
                }
                 if (typeof window.updateMultiSelectButtonText === 'function') window.updateMultiSelectButtonText(mainToothMultiselectControlId);


            } else if (findingStateInMenu.checked) { // Finding from surface menu (which doesn't have _dynamicOptions structure for its items)
                // This means findingStateInMenu.details contains the actual details (e.g., Karies-Tiefe)
                surfaceIdsAppliedTo.forEach(sid => {
                    if (!window.inlineZahnschemaState[toothId].surfaceFindings[sid]) {
                        window.inlineZahnschemaState[toothId].surfaceFindings[sid] = {};
                    }
                    // Update the specific surface finding state
                    window.inlineZahnschemaState[toothId].surfaceFindings[sid][findingKey] = JSON.parse(JSON.stringify(findingStateInMenu));

                    // Synchronize this to the main tooth finding's "Anwendungsbereich"
                    if (!window.inlineZahnschemaState[toothId].findings[findingKey]) {
                        window.inlineZahnschemaState[toothId].findings[findingKey] = { checked: false, text: schemaOpt.text, details: { multiselectValue: {}, additionalText: '' } };
                    } else if (typeof window.inlineZahnschemaState[toothId].findings[findingKey].details !== 'object' || window.inlineZahnschemaState[toothId].findings[findingKey].details === null || !window.inlineZahnschemaState[toothId].findings[findingKey].details.multiselectValue) {
                        window.inlineZahnschemaState[toothId].findings[findingKey].details = { multiselectValue: {}, additionalText: '' };
                    }

                    const areaKeyForSurface = `${findingKey}_${sid.toLowerCase()}`;
                    window.inlineZahnschemaState[toothId].findings[findingKey].details.multiselectValue[areaKeyForSurface] = {
                        checked: true,
                        text: sid.charAt(0).toUpperCase() + sid.slice(1), // Or a more formatted name
                        details: JSON.parse(JSON.stringify(findingStateInMenu.details)) // Copy details from surface menu
                    };
                });
                // Also update the main tooth finding
                if (!window.inlineZahnschemaState[toothId].findings[findingKey]) {
                     window.inlineZahnschemaState[toothId].findings[findingKey] = { checked: false, text: schemaOpt.text, details: '' };
                }
                window.inlineZahnschemaState[toothId].findings[findingKey].checked = true; // Default to true if any surface has it
                window.inlineZahnschemaState[toothId].findings[findingKey].details = findingStateInMenu.details; // This might overwrite specific area details if not careful.

                // Ensure the main finding's "checked" status reflects if any area is checked
                let isAnyAreaCheckedForMainFinding = false;
                if (window.inlineZahnschemaState[toothId].findings[findingKey].details?.multiselectValue) {
                    isAnyAreaCheckedForMainFinding = Object.values(window.inlineZahnschemaState[toothId].findings[findingKey].details.multiselectValue).some(area => area.checked);
                }
                 window.inlineZahnschemaState[toothId].findings[findingKey].checked = isAnyAreaCheckedForMainFinding;


                // Update UI of main tooth multiselect
                const mainToothMultiselectControlId = `inline_tooth_${toothId}_findings_${schemaOptionsKey}`;
                const mainToothMultiselectControl = window.controls?.[mainToothMultiselectControlId];
                if (mainToothMultiselectControl?.value?.[findingKey]) {
                    mainToothMultiselectControl.value[findingKey].checked = window.inlineZahnschemaState[toothId].findings[findingKey].checked;
                    mainToothMultiselectControl.value[findingKey].details = JSON.parse(JSON.stringify(window.inlineZahnschemaState[toothId].findings[findingKey].details)); // Ensure deep copy
                }
                if (typeof window.updateMultiSelectButtonText === 'function') window.updateMultiSelectButtonText(mainToothMultiselectControlId);

            } else { // Finding was unchecked in the surface menu (findingStateInMenu.checked is false)
                // Clear for the specific surfaces the menu was for
                surfaceIdsAppliedTo.forEach(sid => {
                    if (window.inlineZahnschemaState[toothId].surfaceFindings[sid]?.[findingKey]) {
                        window.inlineZahnschemaState[toothId].surfaceFindings[sid][findingKey].checked = false;
                        // Reset details for the surface finding
                        const surfaceFindingOptConfig = schemaFindingOptions.find(o => o.value === findingKey); // Original config for Karies, Füllung etc.
                        window.inlineZahnschemaState[toothId].surfaceFindings[sid][findingKey].details =
                            surfaceFindingOptConfig?.detailsType === 'multiselect' ? { multiselectValue: {}, additionalText: '' } :
                                surfaceFindingOptConfig?.detailsType === 'select' ? { selectValue: '', additionalText: '' } : '';
                    }
                    // Also uncheck and reset details in the main tooth finding's corresponding "Anwendungsbereich"
                    const areaKeyForSurface = `${findingKey}_${sid.toLowerCase()}`;
                    if (window.inlineZahnschemaState[toothId].findings[findingKey]?.details?.multiselectValue?.[areaKeyForSurface]) {
                        window.inlineZahnschemaState[toothId].findings[findingKey].details.multiselectValue[areaKeyForSurface].checked = false;
                        // Reset details for the area in the main finding
                         const mainOptConfig = schemaFindingOptions.find(o => o.value === findingKey);
                         let defaultAreaDetails = '';
                         if (mainOptConfig?.detailsType === 'multiselect') defaultAreaDetails = { multiselectValue: {}, additionalText: ''};
                         else if (mainOptConfig?.detailsType === 'select') defaultAreaDetails = { selectValue: '', additionalText: ''};

                        window.inlineZahnschemaState[toothId].findings[findingKey].details.multiselectValue[areaKeyForSurface].details = defaultAreaDetails;
                    }
                });
                // Update the main finding's checked status
                let isAnyAreaStillChecked = false;
                if (window.inlineZahnschemaState[toothId].findings[findingKey]?.details?.multiselectValue) {
                     isAnyAreaStillChecked = Object.values(window.inlineZahnschemaState[toothId].findings[findingKey].details.multiselectValue).some(area => area.checked);
                }
                if (window.inlineZahnschemaState[toothId].findings[findingKey]) { // Ensure finding exists
                    window.inlineZahnschemaState[toothId].findings[findingKey].checked = isAnyAreaStillChecked;
                }
                 // Update UI of main tooth multiselect
                const mainToothMultiselectControlId = `inline_tooth_${toothId}_findings_${schemaOptionsKey}`;
                if (typeof window.updateMultiSelectButtonText === 'function') window.updateMultiSelectButtonText(mainToothMultiselectControlId);
            }
        });

        // Update visuals and summary after applying changes
        if (typeof window.updateSurfaceVisuals === 'function') window.updateSurfaceVisuals(toothId, schemaOptionsKey);
        if (typeof window.updateToothCrownVisual === 'function') window.updateToothCrownVisual(toothId, schemaOptionsKey);
        if (typeof window.updateBefundZusammenfassung === 'function') window.updateBefundZusammenfassung();
        return true;
    }
    // If currentValuesFromMenu is null or schemaFindingOptions is empty, log a warning.
    console.warn("[InlineSchema] Could not apply surface findings: currentValuesFromMenu or schemaFindingOptions are not valid.", currentValuesFromMenu, schemaFindingOptions);
    return false;
}


/**
 * Ermittelt die relevanten Oberflächennamen für einen gegebenen Zahn.
 * (Determines the relevant surface names for a given tooth.)
 * Assumes `window.exampleTeethData` is available.
 * @param {string} toothId The ID of the tooth.
 * @returns {string[]} An array of surface names (e.g., ['okklusal', 'mesial', ...]).
 */
function getSurfaceNamesForTooth(toothId) {
    // Ensure exampleTeethData is available
    if (!window.exampleTeethData) {
        console.error("exampleTeethData is not defined on window.");
        return [];
    }
    const toothData = window.exampleTeethData.find(t => String(t.id) === String(toothId)); // Ensure IDs are compared as strings
    if (!toothData || !toothData.surfaces) return [];

    // Start with all defined SVG surfaces for the tooth
    let definedSurfaces = new Set(toothData.surfaces.map(s => s.id));
    const toothNum = parseInt(toothId); // Used for quadrant logic
    const type = toothData.type; // e.g., 'molar', 'incisor'

    let surfaces = new Set(); // Using a Set to avoid duplicates

    // Standard surfaces common to most teeth
    surfaces.add('mesial');
    surfaces.add('distal');

    // Quadrant and type specific surfaces
    if ((toothNum >= 11 && toothNum <= 28) || (toothNum >= 51 && toothNum <= 65)) { // Upper jaw (Oberkiefer)
        surfaces.add('palatinal'); // Palatal/Oral for upper
        if (['molar', 'premolar', 'milk-molar'].includes(type)) {
            surfaces.add('bukkal'); // Buccal for upper posterior
            surfaces.add('okklusal'); // Occlusal for upper posterior
        } else if (['canine', 'incisor', 'milk-canine', 'milk-incisor'].includes(type)) {
            surfaces.add('labial'); // Labial for upper anterior
            surfaces.add('incisal'); // Incisal for upper anterior
        }
    } else if ((toothNum >= 31 && toothNum <= 48) || (toothNum >= 71 && toothNum <= 85)) { // Lower jaw (Unterkiefer)
        surfaces.add('lingual'); // Lingual/Oral for lower
        if (['molar', 'premolar', 'milk-molar'].includes(type)) {
            surfaces.add('bukkal'); // Buccal for lower posterior
            surfaces.add('okklusal'); // Occlusal for lower posterior
        } else if (['canine', 'incisor', 'milk-canine', 'milk-incisor'].includes(type)) {
            surfaces.add('labial'); // Labial for lower anterior
            surfaces.add('incisal'); // Incisal for lower anterior
        }
    }

    // Add root surfaces if defined in SVG data
    toothData.surfaces.forEach(s => {
        if (s.id.startsWith('root-')) {
            surfaces.add(s.id);
        }
    });

    // Filter out non-finding areas like 'crown_outline' and 'incisal_edge',
    // but ensure all offered surfaces are actually defined in the tooth's SVG data.
    const surfacesToOffer = Array.from(surfaces).filter(sId =>
        definedSurfaces.has(sId) && sId !== 'crown_outline' && sId !== 'incisal_edge'
    );

    return surfacesToOffer;
}

/**
 * Transforms pathological findings options to include application areas (e.g., "Whole Tooth", specific surfaces).
 * This is particularly for findings that need detailed specification of where they apply.
 * Assumes `getTextResource` is available globally if localization is used for `origOpt.text`.
 * @param {Array} originalItems The original items from a findings options configuration.
 * @param {string|string[]|null} contextIdentifier The tooth ID (string), array of tooth IDs, or null if context is global.
 * @param {string} schemaKey The `optionsKey` of the calling schema (e.g., 'pathologischeZahnBefundeOptionen').
 * @returns {Array} The transformed options array.
 */
window.transformPathologischeBefundeOptions = function(originalItems, contextIdentifier, schemaKey) {
    if (!originalItems || !Array.isArray(originalItems)) {
        console.warn("[Transform] originalItems is not a valid array.", originalItems);
        return [];
    }

    return originalItems.map(origOpt => {
        // List of findings that are not area-specific or don't require detailed area selection in this nested manner.
        const nonAreaSpecificFindings = ['fe', 'imp', 'ret', 'st', 'milchzahn_persistent', 'milchzahn_fruehverlust', 'wfx_l', 'wfx_q', 'pa', 'kn', 'fu', 'res_int', 'res_ext'];

        // Only transform if it's the 'pathologischeZahnBefundeOptionen' schema,
        // the finding is not in the non-area-specific list, and it needs details.
        if (schemaKey !== 'pathologischeZahnBefundeOptionen' || nonAreaSpecificFindings.includes(origOpt.value) || !origOpt.needsDetails) {
            return { ...origOpt }; // Return original option unchanged
        }

        const applicationAreaItems = [];
        const baseValueForArea = origOpt.value; // e.g., "k" for Karies (Caries)

        // 1. "Ganzer Zahn" (Whole Tooth) option
        applicationAreaItems.push({
            value: `${baseValueForArea}_ganzer_zahn`, // Unique value, e.g., "k_ganzer_zahn"
            text: "Ganzer Zahn", // "Whole Tooth"
            isDefault: true, // "Whole Tooth" is the default selection within application areas
            needsDetails: origOpt.needsDetails, // Inherits needsDetails from the original option
            detailsType: origOpt.detailsType,   // Inherits detailsType
            optionsKey: origOpt.optionsKey,     // Inherits optionsKey
            placeholderDetails: origOpt.placeholderDetails, // Inherits placeholderDetails
            color: origOpt.color // Color for sub-details (e.g., Caries type)
        });

        // 2. Surface options based on contextIdentifier
        let surfaceNamesToOffer = [];
        if (typeof contextIdentifier === 'string' && contextIdentifier) { // Single tooth ID
            surfaceNamesToOffer = getSurfaceNamesForTooth(contextIdentifier);
        } else if (Array.isArray(contextIdentifier) && contextIdentifier.length > 0) { // Array of tooth IDs
            // Find common surfaces if multiple teeth are selected
            let commonSurfaces = new Set(getSurfaceNamesForTooth(contextIdentifier[0]));
            for (let i = 1; i < contextIdentifier.length; i++) {
                const currentToothSurfaces = new Set(getSurfaceNamesForTooth(contextIdentifier[i]));
                commonSurfaces = new Set([...commonSurfaces].filter(s => currentToothSurfaces.has(s)));
            }
            surfaceNamesToOffer = Array.from(commonSurfaces);
        }
        // If contextIdentifier is null or an empty array, surfaceNamesToOffer remains empty.

        surfaceNamesToOffer.forEach(surfaceName => {
            let surfaceText = surfaceName.charAt(0).toUpperCase() + surfaceName.slice(1);
            // Overrides for common surface names to ensure correct capitalization/naming
            const textOverrides = {
                "okklusal": "Okklusal", "bukkal": "Bukkal", "labial": "Labial",
                "lingual": "Lingual", "palatinal": "Palatinal", "mesial": "Mesial",
                "distal": "Distal", "incisal": "Incisal",
                "root-1": "Wurzel 1", "root-2": "Wurzel 2", "root-3": "Wurzel 3", // Example root names
                "root-mb": "Wurzel MB", "root-db": "Wurzel DB", "root-p": "Wurzel P" // Example molar root names
            };
            surfaceText = textOverrides[surfaceName.toLowerCase()] || surfaceText;

            applicationAreaItems.push({
                value: `${baseValueForArea}_${surfaceName.toLowerCase()}`, // e.g., k_okklusal
                text: surfaceText,
                isSurfaceOption: true, // Mark as a surface option
                originalSurfaceId: surfaceName.toLowerCase(), // Store the original surface ID
                needsDetails: origOpt.needsDetails,
                detailsType: origOpt.detailsType,
                optionsKey: origOpt.optionsKey,
                placeholderDetails: origOpt.placeholderDetails,
                color: origOpt.color
            });
        });

        // Return the transformed option
        return {
            ...origOpt, // Inherit value, text, color etc. from the original option
            needsDetails: true, // The top-level finding (e.g., Karies) now ALWAYS needs details (for area selection)
            detailsType: "multiselect", // This detail is the "Anwendungsbereich" (application area) multiselect
            _dynamicOptions: { // This key is checked by createMultiSelect for nested options
                placeholder: `${(typeof window.getTextResource === 'function' ? window.getTextResource(origOpt.text, origOpt.text) : origOpt.text)}: Bereich festlegen...`, // "Set area..."
                items: applicationAreaItems
            }
        };
    });
}

/**
 * Handles left-click events on tooth surfaces within an inline dental schema.
 * Manages the selection of surfaces for applying findings.
 * @param {string} toothId - The ID of the tooth clicked.
 * @param {string} surfaceId - The ID of the surface clicked.
 * @param {boolean} isSelected - Current selection state (not directly used, derived from activeToothSurfaceSelection).
 * @param {string} schemaOptionsKey - The schema options key for the current context.
 * @param {Event} event - The click event.
 */
window.handleSurfaceLeftClickForInlineSchema = function(toothId, surfaceId, isSelected, schemaOptionsKey, event) {
    const svgPolygon = document.querySelector(`#svg-tooth-host-${toothId}-${schemaOptionsKey} #tooth-${toothId}-${surfaceId}`);

    // If the click is on a new tooth or a different schema context, clear previous transient selections.
    if (activeToothSurfaceSelection.toothId !== toothId || activeToothSurfaceSelection.schemaOptionsKey !== schemaOptionsKey) {
        if (activeToothSurfaceSelection.toothId && activeToothSurfaceSelection.schemaOptionsKey) {
            const prevToothSvg = document.querySelector(`#svg-tooth-host-${activeToothSurfaceSelection.toothId}-${activeToothSurfaceSelection.schemaOptionsKey}`);
            prevToothSvg?.querySelectorAll('.surface-selected-transient').forEach(poly => {
                poly.classList.remove('surface-selected-transient');
            });
        }
        activeToothSurfaceSelection.surfaces.clear(); // Clear previously selected surfaces
        activeToothSurfaceSelection.toothId = toothId; // Set new active tooth
        activeToothSurfaceSelection.schemaOptionsKey = schemaOptionsKey; // Set new schema context
    }

    // Toggle selection for the clicked surface
    if (activeToothSurfaceSelection.surfaces.has(surfaceId)) {
        activeToothSurfaceSelection.surfaces.delete(surfaceId); // Deselect if already selected
        svgPolygon?.classList.remove('surface-selected-transient'); // Remove visual highlight
    } else {
        activeToothSurfaceSelection.surfaces.add(surfaceId); // Select if not selected
        svgPolygon?.classList.add('surface-selected-transient'); // Add visual highlight
    }
}

/**
 * Handles right-click events on tooth surfaces for opening the surface findings menu.
 * @param {string} toothId - The ID of the tooth.
 * @param {string} surfaceId - The ID of the surface right-clicked.
 * @param {Event} event - The contextmenu event.
 * @param {string} schemaOptionsKey - The schema options key for the current context.
 */
window.handleSurfaceRightClickForInlineSchema = function (toothId, surfaceId, event, schemaOptionsKey) {
    event.preventDefault(); // Prevent default browser context menu
    event.stopPropagation(); // Prevent event from bubbling up (e.g., to tooth container right-click)

    // Close global tooth menu if open, as surface right-click is more specific
    if (typeof window.closeGlobalToothMenuAndCleanUp === 'function') {
        window.closeGlobalToothMenuAndCleanUp();
    }

    let surfacesForMenu = new Set();

    // Case 1: Right-click on a surface that is part of an existing left-click selection on the same tooth/schema.
    if (activeToothSurfaceSelection.toothId === toothId &&
        activeToothSurfaceSelection.schemaOptionsKey === schemaOptionsKey &&
        activeToothSurfaceSelection.surfaces.has(surfaceId) &&
        activeToothSurfaceSelection.surfaces.size > 0) {
        surfacesForMenu = new Set(activeToothSurfaceSelection.surfaces); // Use the existing selection
    } else {
        // Case 2: No existing relevant left-click selection, or right-click is on a different surface/tooth/schema.
        // Discard any previous transient selection and start a new one with the right-clicked surface.

        // Clear old transient markings (even from a different tooth/schema, if one was active)
        if (activeToothSurfaceSelection.toothId && activeToothSurfaceSelection.schemaOptionsKey) {
            const prevToothSvgHostId = `svg-tooth-host-${activeToothSurfaceSelection.toothId}-${activeToothSurfaceSelection.schemaOptionsKey}`;
            const prevToothSvg = document.querySelector(`#${prevToothSvgHostId}`);
            prevToothSvg?.querySelectorAll('.surface-selected-transient').forEach(poly => {
                poly.classList.remove('surface-selected-transient');
            });
        }

        // Reset active selection to the current right-clicked surface
        activeToothSurfaceSelection.surfaces.clear();
        activeToothSurfaceSelection.surfaces.add(surfaceId);
        activeToothSurfaceSelection.toothId = toothId;
        activeToothSurfaceSelection.schemaOptionsKey = schemaOptionsKey; // Important for cleanup
        surfacesForMenu.add(surfaceId);

        // Add transient marking for the newly (right-)clicked surface
        const svgPolygon = document.querySelector(`#svg-tooth-host-${toothId}-${schemaOptionsKey} #tooth-${toothId}-${surfaceId}`);
        svgPolygon?.classList.add('surface-selected-transient');
    }

    // Open the menu if a valid selection exists for the current context
    if (activeToothSurfaceSelection.toothId === toothId &&
        activeToothSurfaceSelection.schemaOptionsKey === schemaOptionsKey &&
        surfacesForMenu.size > 0) {
        // Call the globally exposed openSurfaceFindingsMenu
        window.openSurfaceFindingsMenu(toothId, Array.from(surfacesForMenu), event.clientX, event.clientY, schemaOptionsKey);
    } else {
        // Fallback: Clear selection if something went wrong (should ideally not be reached often)
        if (activeToothSurfaceSelection.toothId && activeToothSurfaceSelection.schemaOptionsKey) {
            const prevToothSvg = document.querySelector(`#svg-tooth-host-${activeToothSurfaceSelection.toothId}-${activeToothSurfaceSelection.schemaOptionsKey}`);
            prevToothSvg?.querySelectorAll('.surface-selected-transient').forEach(poly => {
                poly.classList.remove('surface-selected-transient');
            });
        }
        activeToothSurfaceSelection.surfaces.clear();
        activeToothSurfaceSelection.toothId = null;
        activeToothSurfaceSelection.schemaOptionsKey = null;
    }
}

// DOMContentLoaded listener for initial setup (e.g., tooltips, global click listeners)
document.addEventListener('DOMContentLoaded', function () {
    // Tooltip setup
    let surfaceTooltip = document.getElementById('surface-tooltip');
    if (!surfaceTooltip) {
        surfaceTooltip = document.createElement('div');
        surfaceTooltip.id = 'surface-tooltip';
        surfaceTooltip.style.position = 'absolute'; // Positioned by CSS or dynamically
        surfaceTooltip.style.display = 'none'; // Initially hidden
        // Add common styling for tooltip, e.g., border, padding, background
        surfaceTooltip.style.border = '1px solid black';
        surfaceTooltip.style.backgroundColor = 'lightyellow';
        surfaceTooltip.style.padding = '5px';
        surfaceTooltip.style.zIndex = '1002'; // Above menu
        document.body.appendChild(surfaceTooltip);
    }

    // Global click listener to deselect tooth containers if clicked outside.
    // This assumes `currentGlobalToothMenu` and `activeToothContainerSelection` are managed elsewhere globally.
    document.addEventListener('click', function (event) {
        // If a global tooth menu or surface findings menu is open, their own outside click handlers will manage them.
        // This listener is primarily for deselecting containers when no menu is open.
        if (window.currentGlobalToothMenu || currentSurfaceFindingsMenu) return; // Check window scope for currentGlobalToothMenu

        if (!event.target.closest('.selectable-tooth-container')) {
            // Click was outside any selectable tooth container
            if (window.activeToothContainerSelection && window.activeToothContainerSelection.toothIds.size > 0) {
                // Clear visual selection from tooth containers
                window.activeToothContainerSelection.toothIds.forEach(tid => {
                    const container = document.getElementById(`inline-zahn-${tid}-${window.activeToothContainerSelection.schemaOptionsKey}`);
                    container?.classList.remove('selected');
                });
                window.activeToothContainerSelection.toothIds.clear();
                window.activeToothContainerSelection.schemaOptionsKey = null;
            }
        }
    });
});
