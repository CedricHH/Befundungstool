// ============== inline-zahnschema-module.js ==============
// V4: Dynamische Optionsauswahl basierend auf containerId.
//     Übergabe von optionsKey und placeholderText an createSingleInlineTooth.
// ========================================================================

// Global state for the new tooth container selection and its menu
let activeToothContainerSelection = { toothIds: new Set(), schemaOptionsKey: null }; // schemaOptionsKey of the originating schema instance
let currentGlobalToothMenu = null;
let currentGlobalToothMenuMultiSelectId = null;



const DEFAULT_SURFACE_COLOR = 'transparent'; // Oder eine andere Standardfarbe aus CSS
// Hilfsfunktion, um die Feldkonfiguration anhand der ID zu finden
function findFieldConfigById(configSections, targetId) {
    if (!configSections) return null;
    for (const section of configSections) {
        if (section.fields) {
            for (const field of section.fields) {
                if (field.id === targetId) return field;
            }
        }
        if (section.subSections) {
            // Rekursiver Aufruf für Unterabschnitte
            const foundInSub = findFieldConfigById(section.subSections, targetId);
            if (foundInSub) return foundInSub;
        }
    }
    return null;
}





function updateSurfaceVisuals(toothId, schemaOptionsKey) {
    const svgHost = document.getElementById(`svg-tooth-host-${toothId}-${schemaOptionsKey}`);
    if (!svgHost) return;

    // Get the *original* (untransformed) options for the schema to find color configurations
    const originalSchemaOptionsConfig = getDynamicElementOptions(schemaOptionsKey);
    const originalSchemaOptions = originalSchemaOptionsConfig?.items || originalSchemaOptionsConfig || [];

    const polygons = svgHost.querySelectorAll('.polygon');
    polygons.forEach(polygon => {
        const surfaceId = polygon.dataset.surfaceId;
        let appliedColor = null;
        // Check main tooth findings first for "Ganzer Zahn"
        const toothFindings = inlineZahnschemaState[toothId]?.findings;
        if (toothFindings) {
            for (const findingKey in toothFindings) { // e.g., "k" for Karies
                const findingState = toothFindings[findingKey];
                if (findingState.checked && findingState.details?.multiselectValue?.[`${findingKey}_ganzer_zahn`]?.checked) {
                    const findingConfig = originalSchemaOptions.find(opt => opt.value === findingKey);
                    if (findingConfig?.color) {
                        appliedColor = findingConfig.color;
                        break; // Prioritize "Ganzer Zahn" color
                    }
                }
            }
        }

        // If not colored by "Ganzer Zahn", check specific surface findings
        if (!appliedColor) {
            const surfaceFindingsData = inlineZahnschemaState[toothId]?.surfaceFindings?.[surfaceId];
            if (surfaceFindingsData) {
                for (const findingKey in surfaceFindingsData) {
                    if (surfaceFindingsData[findingKey].checked) {
                        const findingConfig = originalSchemaOptions.find(opt => opt.value === findingKey);
                        if (findingConfig && findingConfig.color) {
                            appliedColor = findingConfig.color;
                            break;
                        }
                    }
                }
            }
        }
        polygon.style.fill = appliedColor || DEFAULT_SURFACE_COLOR;
        // Ensure transient selection is removed if not handled elsewhere
    });
}

function updateToothCrownVisual(toothId, schemaOptionsKey, svgHostElement = null) {
    let svgHost = svgHostElement;
    if (!svgHost) {
        // Fallback to ID lookup if element not passed
        svgHost = document.getElementById(`svg-tooth-host-${toothId}-${schemaOptionsKey}`);
    }

    // console.log(`[CrownVisual] updateToothCrownVisual for ${toothId}-${schemaOptionsKey}. Host element provided: ${!!svgHostElement}, Host found by ID (if needed): ${!!svgHost}`);
    if (!svgHost) {
        // console.warn(`[CrownVisual] SVG host not found for ${toothId}-${schemaOptionsKey}. Cannot update crown visual.`);
        return;
    }

    const crownOverlayPolygon = svgHost.querySelector(`.crown-overlay[data-tooth-id="${toothId}"]`);
    // console.log(`[CrownVisual] Crown overlay polygon found: ${!!crownOverlayPolygon}`);

    const toothState = inlineZahnschemaState[toothId];
    let showCrownVisual = false; // Flag to determine if crown visual (base SVG change + overlay) should be shown
    let crownMaterialColor = 'none'; // For the material overlay line

    if (toothState) {
        // console.log(`[CrownVisual] Tooth state for ${toothId}: missing=${toothState.missing}, kr finding=${JSON.stringify(toothState.findings?.['kr'])}, br finding=${JSON.stringify(toothState.findings?.['br'])}`);

        // If the tooth is marked as missing (in the context of pathologische Befunde), it should not show a crown.
        if (toothState.missing && schemaOptionsKey === 'pathologischeZahnBefundeOptionen') {
            showCrownVisual = false;
            // console.log(`[CrownVisual] Tooth ${toothId} is marked as missing. No crown visual will be shown.`);
        } else if (toothState.findings) {
            const kroneFinding = toothState.findings['kr']; // 'kr' for Krone
            const brueckeFinding = toothState.findings['br']; // 'br' for Brücke

            let relevantFindingForMaterial = null;
            if (kroneFinding && kroneFinding.checked) {
                relevantFindingForMaterial = kroneFinding;
                showCrownVisual = true;
                // console.log(`[CrownVisual] Tooth ${toothId} has 'kr' (Krone) checked.`);
            } else if (brueckeFinding && brueckeFinding.checked) {
                relevantFindingForMaterial = brueckeFinding;
                showCrownVisual = true;
                // console.log(`[CrownVisual] Tooth ${toothId} has 'br' (Brücke) checked.`);
            }

            if (showCrownVisual && relevantFindingForMaterial && relevantFindingForMaterial.details && typeof relevantFindingForMaterial.details.multiselectValue === 'object') {
                const kroneOptionsDetails = relevantFindingForMaterial.details.multiselectValue;
                // console.log(`[CrownVisual] Krone/Brücke details for ${toothId}: ${JSON.stringify(kroneOptionsDetails)}`);
                for (const optKey in kroneOptionsDetails) {
                    if (kroneOptionsDetails[optKey].checked) {
                        const kroneOptionConfig = getDynamicElementOptions('kroneOptionen')?.find(o => o.value === optKey);
                        if (kroneOptionConfig && kroneOptionConfig.color) {
                            crownMaterialColor = kroneOptionConfig.color;
                            // console.log(`[CrownVisual] Material color for ${toothId} set to ${crownMaterialColor} from option ${optKey}`);
                            break;
                        }
                    }
                }
            }
        }
    } else {
        // console.log(`[CrownVisual] No toothState found for ${toothId}.`);
    }

    // Remove the CSS class manipulation for the host, as we'll directly style the overlay
    svgHost.classList.remove('crowned-tooth-svg'); // Ensure it's removed if previously added

    if (crownOverlayPolygon) {
        if (showCrownVisual) {
            // Crown is present: Style as an outline. Fill is none to keep underlying surfaces visible.
            crownOverlayPolygon.style.fill = 'none';
            crownOverlayPolygon.style.stroke = crownMaterialColor !== 'none' ? crownMaterialColor : 'black'; // Material color for stroke, or black if generic
            crownOverlayPolygon.style.strokeWidth = '1.5'; // Stroke width for the crown outline
            // console.log(`[CrownVisual] Applied crown visual to overlay for ${toothId}. Fill: ${crownOverlayPolygon.style.fill}`);
        } else {
            // No crown: Make the overlay invisible
            crownOverlayPolygon.style.fill = 'none';
            crownOverlayPolygon.style.stroke = 'none';
            crownOverlayPolygon.style.strokeWidth = '0'; // Or '0'
            // console.log(`[CrownVisual] Removed crown visual from overlay for ${toothId}`);
        }
    } else {
        // console.warn(`[CrownVisual] crownOverlayPolygon not found for ${toothId} in host ${svgHost.id}, cannot apply direct crown visual.`);
    }
}

function updateInlineToothMissingState(toothIdStr, isMissing) {
    // console.log(`[InlineSchema DEBUG] updateInlineToothMissingState CALLED for tooth: ${toothIdStr}, isMissing: ${isMissing}`);
    // This function is specific to the "fehlend" (fe) option from 'pathologischeZahnBefundeOptionen'
    const optionsKeyForMissing = 'pathologischeZahnBefundeOptionen';
    const toothElementId = `inline-zahn-${toothIdStr}-${optionsKeyForMissing}`;
    const toothElement = document.getElementById(toothElementId);

    // console.log(`[InlineSchema DEBUG] Attempting to find toothElement with ID: ${toothElementId}`);

    if (!toothElement) {
        // console.warn(`[InlineSchema DEBUG] updateInlineToothMissingState: Zahn Element ${toothElementId} NICHT gefunden.`);
        return;
    }
    // console.log(`[InlineSchema DEBUG] Zahn Element ${toothElementId} FOUND. Current display: '${toothElement.style.display}'`);

    const fehlendOptionConfig = getDynamicElementOptions(optionsKeyForMissing);
    const fehlendOptionen = fehlendOptionConfig?.items || fehlendOptionConfig || [];
    const fehlendOptionEntry = fehlendOptionen.find(opt => opt.value === 'fe');

    if (!fehlendOptionEntry) {
        console.error("[InlineSchema] 'fe' (fehlend) Option nicht in pathologischeZahnBefundeOptionen gefunden für updateInlineToothMissingState.");
        return;
    }

    if (!inlineZahnschemaState[toothIdStr]) {
        inlineZahnschemaState[toothIdStr] = { missing: false, findings: {} };
    } // surfaceFindings should also be considered if 'missing' clears them
    if (!inlineZahnschemaState[toothIdStr].findings) {
        inlineZahnschemaState[toothIdStr].findings = {};
    }
    // Ensure 'fe' finding is initialized
    if (!inlineZahnschemaState[toothIdStr].findings['fe']) {
        inlineZahnschemaState[toothIdStr].findings['fe'] = { checked: false, text: fehlendOptionEntry.text, details: '' };
    }
    // Initialize other findings from this specific option set if not present
    fehlendOptionen.forEach(opt => {
        if (!inlineZahnschemaState[toothIdStr].findings[opt.value]) {
            inlineZahnschemaState[toothIdStr].findings[opt.value] = { checked: false, text: opt.text, details: '' };
        }
    });
    // If tooth is missing, clear all surface findings for this tooth for this schema context
    if (isMissing && inlineZahnschemaState[toothIdStr].surfaceFindings) {
        Object.keys(inlineZahnschemaState[toothIdStr].surfaceFindings).forEach(surfaceId => {
            const surfaceData = inlineZahnschemaState[toothIdStr].surfaceFindings[surfaceId];
            Object.keys(surfaceData).forEach(findingKey => {
                surfaceData[findingKey].checked = false; // Uncheck all findings on surfaces
            });
        });
    }


    const previousMissingState = inlineZahnschemaState[toothIdStr].missing;
    inlineZahnschemaState[toothIdStr].missing = isMissing;

    const controlId = `inline_tooth_${toothIdStr}_findings_${optionsKeyForMissing}`;
    const control = controls[controlId];

    if (isMissing) {
        // toothElement ist spezifisch für pathologischeZahnBefundeOptionen wegen optionsKeyForMissing
        toothElement.classList.add('missing');

        // When tooth becomes missing, ensure its crown visual is also updated/cleared
        // Find the SVG host for this specific tooth and schema instance
        const svgHostForMissingTooth = document.getElementById(`svg-tooth-host-${toothIdStr}-${optionsKeyForMissing}`);
        if (svgHostForMissingTooth) {
            updateToothCrownVisual(toothIdStr, optionsKeyForMissing, svgHostForMissingTooth);
        }

        if (control?.optionsDiv && inlineZahnschemaState[toothIdStr].findings) {
            const fehlendCheckbox = control.optionsDiv.querySelector(`input[type="checkbox"][value="fe"]`);
            if (fehlendCheckbox && !fehlendCheckbox.checked) {
                fehlendCheckbox.checked = true;
                if (control.value?.['fe']) control.value['fe'].checked = true;
                if (inlineZahnschemaState[toothIdStr].findings['fe']) inlineZahnschemaState[toothIdStr].findings['fe'].checked = true;
                // Details-Wrapper für "fehlend" ggf. anzeigen (obwohl es keine Details hat)
                const detailsWrapperFe = control.optionsDiv.querySelector(`#${controlId}_fe_details_wrapper`);
                if (detailsWrapperFe) detailsWrapperFe.style.display = 'block';
            }
            inlineZahnschemaState[toothIdStr].findings['fe'].checked = true;

            // Uncheck all other options from the *pathologischeZahnBefundeOptionen* set
            Object.keys(inlineZahnschemaState[toothIdStr].findings).forEach(findingKey => {
                const isPathFinding = fehlendOptionen.some(opt => opt.value === findingKey);
                if (findingKey !== 'fe' && isPathFinding) {
                    inlineZahnschemaState[toothIdStr].findings[findingKey].checked = false;
                    inlineZahnschemaState[toothIdStr].findings[findingKey].details = '';

                    const otherCheckbox = control.optionsDiv.querySelector(`input[type="checkbox"][value="${findingKey}"]`);
                    if (otherCheckbox) otherCheckbox.checked = false;
                    if (control.value?.[findingKey]) {
                        control.value[findingKey].checked = false;
                        control.value[findingKey].details = '';
                    }

                    const detailsInput = control.optionsDiv.querySelector(`#${controlId}_${findingKey}_details`);
                    const detailsWrapper = control.optionsDiv.querySelector(`#${controlId}_${findingKey}_details_wrapper`);
                    if (detailsInput) detailsInput.value = '';
                    if (detailsWrapper) {
                        detailsWrapper.style.display = 'none';
                    }
                }
            });
        }
    } else {
        // toothElement ist spezifisch für pathologischeZahnBefundeOptionen
        toothElement.classList.remove('missing');

        // When tooth is no longer missing, update its crown visual based on other findings
        const svgHostForNotMissingTooth = document.getElementById(`svg-tooth-host-${toothIdStr}-${optionsKeyForMissing}`);
        if (svgHostForNotMissingTooth) {
            updateToothCrownVisual(toothIdStr, optionsKeyForMissing, svgHostForNotMissingTooth);
        }

        // Logik für Checkbox-Status beibehalten
        if (control?.optionsDiv && inlineZahnschemaState[toothIdStr].findings) {
            const fehlendCheckbox = control.optionsDiv.querySelector(`input[type="checkbox"][value="fe"]`);
            if (fehlendCheckbox && fehlendCheckbox.checked) {
                fehlendCheckbox.checked = false;
                if (control.value?.['fe']) control.value['fe'].checked = false;
            }
            if (inlineZahnschemaState[toothIdStr].findings['fe']) inlineZahnschemaState[toothIdStr].findings['fe'].checked = false;
        }
    }

    if (previousMissingState !== isMissing) {
        updateMultiSelectButtonText(controlId);
        updateBefundZusammenfassung();
        if (typeof updateAltersentsprechendOption === 'function') {
            updateAltersentsprechendOption();
        }
        updateSurfaceVisuals(toothIdStr, optionsKeyForMissing); // Update surface colors if tooth becomes missing/not missing
    }
    // console.log(`[InlineSchema DEBUG] updateInlineToothMissingState FINISHED for tooth: ${toothIdStr}`);
}

function createInlineZahnschema(containerId) {
    const mainContainer = document.getElementById(containerId);
    if (!mainContainer) {
        console.error(`[InlineSchema] Container #${containerId} nicht gefunden.`);
        return;
    }
    mainContainer.innerHTML = '';

    let optionsKey;
    let dataConfigPathForEditableElement;
    let placeholderTextKeyForButton; // Key für den Placeholder-Text

    // Determine optionsKey and related config paths based on containerId
    if (containerId === 'pathologische_zahnbefunde_container' || containerId === 'pathologische-zahnbefunde-container-dvt') {
        optionsKey = 'pathologischeZahnBefundeOptionen';
    } else if (containerId === 'implantatplanungs_container') { // Hypothetical new container for implant planning
        optionsKey = 'implantatplanungsOptionen'; // Hypothetical new options key
    } else {
        console.warn(`[InlineSchema] Unbekannter Container-ID für Optionsauswahl: ${containerId}. Fallback auf pathologischeZahnBefundeOptionen.`);
        optionsKey = 'pathologischeZahnBefundeOptionen';
    }
    dataConfigPathForEditableElement = `dynamicElementOptions.${optionsKey}`;
    placeholderTextKeyForButton = `${optionsKey}.placeholder`; // Convention: optionsKey.placeholder

    const activeOptionsConfig = getDynamicElementOptions(optionsKey);
    const activeOptions = activeOptionsConfig?.items || activeOptionsConfig || [];

    const appConf = typeof getAppConfig === 'function' ? getAppConfig() : window.appConfig;
    // Get placeholder from the specific options config first, then general, then default
    const placeholderText = activeOptionsConfig?.placeholder ||
        appConf?.textResources?.[placeholderTextKeyForButton] || // Try to get from textResources if defined
        appConf?.general?.opbPlaceholderText ||
        'opB';


    if (!activeOptions || activeOptions.length === 0) {
        console.error(`[InlineSchema] Optionen für Key "${optionsKey}" nicht in der Konfiguration gefunden oder leer.`);
        mainContainer.textContent = `Fehler: Konnte Optionen für "${optionsKey}" nicht laden.`;
        return;
    }

    const quadrants = {
        q1_viewer_left: { teeth: [18, 17, 16, 15, 14, 13, 12, 11] },
        q2_viewer_right: { teeth: [21, 22, 23, 24, 25, 26, 27, 28] },
        q4_viewer_left: { teeth: [48, 47, 46, 45, 44, 43, 42, 41] },
        q3_viewer_right: { teeth: [31, 32, 33, 34, 35, 36, 37, 38] }
    };

    const allTeethInSchema = [
        ...quadrants.q1_viewer_left.teeth, ...quadrants.q2_viewer_right.teeth,
        ...quadrants.q4_viewer_left.teeth, ...quadrants.q3_viewer_right.teeth
    ];

    const milkTeethQuadrants = {
        q5_viewer_left: { teeth: [55, 54, 53, 52, 51] },
        q6_viewer_right: { teeth: [61, 62, 63, 64, 65] },
        q8_viewer_left: { teeth: [85, 84, 83, 82, 81] },
        q7_viewer_right: { teeth: [71, 72, 73, 74, 75] }
    };
    const allMilkTeethInSchema = [
        ...milkTeethQuadrants.q5_viewer_left.teeth, ...milkTeethQuadrants.q6_viewer_right.teeth,
        ...milkTeethQuadrants.q8_viewer_left.teeth, ...milkTeethQuadrants.q7_viewer_right.teeth
    ];

    const initializeToothState = (toothId, currentOptions) => {
        const toothIdStr = String(toothId);
        if (!inlineZahnschemaState[toothIdStr]) {
            inlineZahnschemaState[toothIdStr] = { missing: false, findings: {}, surfaceFindings: {} };
        }
        // Initialize findings based on the activeOptions for this schema instance
        currentOptions.forEach(opt => {
            if (!inlineZahnschemaState[toothIdStr].findings[opt.value]) {
                inlineZahnschemaState[toothIdStr].findings[opt.value] = {
                    checked: false, text: opt.text, details: ''
                };
            }
        });
        // Initialize surfaceFindings structure if needed (though it's typically populated on demand)
        Object.keys(inlineZahnschemaState[toothIdStr].surfaceFindings).forEach(surfaceId => {
            // Ensure findings within surfaceFindings are also initialized if structure changes
        });
    };

    [...allTeethInSchema, ...allMilkTeethInSchema].forEach(toothId => initializeToothState(toothId, activeOptions));


    function createKieferRow(quadrantLeftConfig, quadrantRightConfig) {
        const kieferRowDiv = document.createElement('div');
        kieferRowDiv.classList.add('kiefer-row');

        [quadrantLeftConfig, quadrantRightConfig].forEach(quadrantConfig => {
            const quadrantDiv = document.createElement('div');
            quadrantDiv.classList.add('quadrant-container');
            quadrantConfig.teeth.forEach(toothId => {
                const toothIdStr = String(toothId);
                // Pass activeOptions, dataConfigPathForEditableElement, and placeholderText
                const toothElement = createSingleInlineTooth(toothIdStr, activeOptions, dataConfigPathForEditableElement, optionsKey, placeholderText);
                if (toothElement) quadrantDiv.appendChild(toothElement);
                if (inlineZahnschemaState[toothIdStr]?.missing && optionsKey === 'pathologischeZahnBefundeOptionen') { // Apply missing class only if relevant
                    toothElement?.classList.add('missing');
                    updateSurfaceVisuals(toothIdStr, optionsKey); // Ensure surfaces are also styled if tooth is missing
                    updateToothCrownVisual(toothIdStr, optionsKey); // Update the crown visibility based on 'missing' state
                }
            });
            kieferRowDiv.appendChild(quadrantDiv);
        });
        return kieferRowDiv;
    }

    const formConf = window.StandardFormConfiguration; // Zugriff auf die globale Konfiguration
    const fieldConfigForContainer = formConf ? findFieldConfigById(formConf.formSections, containerId) : null;

    let isMilkSchemaInstance = false;
    if (fieldConfigForContainer && fieldConfigForContainer.displayAllAdultTeeth === false) {
        isMilkSchemaInstance = true;
    }

    if (isMilkSchemaInstance) {
        // Dieser Container ist spezifisch für Milchzähne (z.B. milchzahn_container)
        const milkOkRow = createKieferRow(milkTeethQuadrants.q5_viewer_left, milkTeethQuadrants.q6_viewer_right);
        mainContainer.appendChild(milkOkRow);
        const milkUkRow = createKieferRow(milkTeethQuadrants.q8_viewer_left, milkTeethQuadrants.q7_viewer_right);
        mainContainer.appendChild(milkUkRow);

        // Visuelle Updates für die Milchzähne in diesem Schema
        allMilkTeethInSchema.forEach(toothId => {
            // initializeToothState wurde bereits oben für alle Zähne aufgerufen
            updateSurfaceVisuals(String(toothId), optionsKey);
            if (optionsKey === 'pathologischeZahnBefundeOptionen') { // Nur für relevante Schemata
                updateToothCrownVisual(String(toothId), optionsKey);
                // updatePersistentMilkVisual(String(toothId), optionsKey); // Falls implementiert
            }
        });
    } else {
        // Dieser Container ist für Erwachsenenzähne (z.B. pathologische_zahnbefunde_container)
        const okRow = createKieferRow(quadrants.q1_viewer_left, quadrants.q2_viewer_right);
        mainContainer.appendChild(okRow);
        const ukRow = createKieferRow(quadrants.q4_viewer_left, quadrants.q3_viewer_right);
        mainContainer.appendChild(ukRow);

        // Visuelle Updates für die Erwachsenenzähne in diesem Schema
        allTeethInSchema.forEach(toothId => {
            updateSurfaceVisuals(String(toothId), optionsKey);
            if (optionsKey === 'pathologischeZahnBefundeOptionen') {
                updateToothCrownVisual(String(toothId), optionsKey);
                // updatePersistentMilkVisual(String(toothId), optionsKey); // Falls implementiert
            }
        });

        // Optional: Füge den ausklappbaren Milchzahnbereich zum Haupt-Erwachsenenschema hinzu
        // Dies geschieht nur, wenn es sich um den Hauptcontainer für pathologische Befunde handelt.
        if (containerId === 'pathologische_zahnbefunde_container' && optionsKey === 'pathologischeZahnBefundeOptionen') {
            const milkTeethFieldset = document.createElement('fieldset');
            milkTeethFieldset.classList.add('collapsible-fieldset', 'milkteeth-section', 'mt-4', 'p-2', 'border', 'border-dashed', 'border-gray-400', 'rounded-md');
            const milkTeethLegend = document.createElement('legend');
            milkTeethLegend.textContent = 'Milchgebiss (Optional)';
            milkTeethLegend.classList.add('text-md', 'font-semibold', 'text-gray-600', 'px-2', 'cursor-pointer');
            milkTeethFieldset.appendChild(milkTeethLegend);

            const milkTeethContent = document.createElement('div');
            milkTeethContent.className = 'fieldset-content';
            milkTeethContent.style.display = 'none'; // Standardmäßig eingeklappt

            milkTeethLegend.addEventListener('click', () => {
                milkTeethFieldset.classList.toggle('expanded');
                milkTeethContent.style.display = milkTeethFieldset.classList.contains('expanded') ? 'block' : 'none';
            });

            const milkOkRowCollapsible = createKieferRow(milkTeethQuadrants.q5_viewer_left, milkTeethQuadrants.q6_viewer_right);
            milkTeethContent.appendChild(milkOkRowCollapsible);
            const milkUkRowCollapsible = createKieferRow(milkTeethQuadrants.q8_viewer_left, milkTeethQuadrants.q7_viewer_right);
            milkTeethContent.appendChild(milkUkRowCollapsible);
            milkTeethFieldset.appendChild(milkTeethContent);
            mainContainer.appendChild(milkTeethFieldset);
            // Visuelle Updates für diese optionalen Milchzähne sind durch die obigen Schleifen abgedeckt,
            // da createSingleInlineTooth die Updates beim Erstellen aufruft.
        }
    }

    if (typeof updateAltersentsprechendOption === 'function') {
        updateAltersentsprechendOption();
    }
    // Die initialen visuellen Updates werden jetzt spezifischer innerhalb der if/else-Blöcke gehandhabt.
}

function createSingleInlineTooth(toothIdStr, activeOptions, dataConfigPath, optionsKey, placeholderText) {
    if (!activeOptions || activeOptions.length === 0) {
        console.error(`[InlineSchema] Keine aktiven Optionen für Zahn ${toothIdStr} übergeben.`);
        return null;
    }
    const zahnContainer = document.createElement('div');
    zahnContainer.classList.add('inline-zahn-container', 'selectable-tooth-container');
    zahnContainer.id = `inline-zahn-${toothIdStr}-${optionsKey}`; // Make ID unique per optionsKey
    zahnContainer.dataset.toothId = toothIdStr;
    zahnContainer.dataset.optionsKey = optionsKey; // Store for reference

    zahnContainer.classList.add('editable-element');
    zahnContainer.dataset.configPath = dataConfigPath; // Use dynamic config path
    zahnContainer.dataset.elementType = 'dynamicOptionGroup';
    zahnContainer.dataset.elementId = optionsKey; // Use optionsKey as elementId for overlay

    if (typeof createEditControlsOverlay === 'function') {
        const overlay = createEditControlsOverlay(
            dataConfigPath,
            'dynamicOptionGroup',
            optionsKey,
            false,
            false,
            false
        );
        zahnContainer.appendChild(overlay);
    }

    // Add event listeners for tooth container selection
    zahnContainer.addEventListener('click', (event) => handleToothContainerLeftClick(toothIdStr, optionsKey, event));
    zahnContainer.addEventListener('contextmenu', (event) => handleToothContainerRightClick(toothIdStr, optionsKey, event));

    const numberEl = document.createElement('div');
    numberEl.classList.add('inline-zahn-number');
    numberEl.textContent = toothIdStr;
    zahnContainer.appendChild(numberEl);

    // Conditionally render SVG tooth only for pathologischeZahnBefundeOptionen
    const shouldRenderSVG = (optionsKey === 'pathologischeZahnBefundeOptionen');
    let svgToothHostDiv = null; // Declare here to make it accessible in the later if block

    if (shouldRenderSVG) {
        // Create a host for the SVG tooth rendering
        svgToothHostDiv = document.createElement('div'); // Assign to the higher-scoped variable
        svgToothHostDiv.id = `svg-tooth-host-${toothIdStr}-${optionsKey}`;
        svgToothHostDiv.classList.add('inline-svg-tooth-host'); // Add a class for potential styling
        // Style it to be small and fit within the inline tooth container
        svgToothHostDiv.style.width = '30px';
        svgToothHostDiv.style.height = '50px';
        svgToothHostDiv.style.margin = '0 auto 5px auto'; // Center it and add some bottom margin
        zahnContainer.appendChild(svgToothHostDiv);

        // Call the DentalChartModule to render the SVG tooth
        if (window.DentalChartModule && typeof window.DentalChartModule.renderSingleTooth === 'function' && window.exampleTeethData) {
            window.DentalChartModule.renderSingleTooth(
                toothIdStr,
                svgToothHostDiv,
                window.exampleTeethData,
                optionsKey, // schemaOptionsKey für Tooltip etc.
                (tId, sId, isSel, clickEvent) => handleSurfaceLeftClickForInlineSchema(tId, sId, isSel, optionsKey, clickEvent),
                (tId, sId, contextMenuEvent) => handleSurfaceRightClickForInlineSchema(tId, sId, contextMenuEvent, optionsKey)
            );
        }
    }

    const multiSelectHostDiv = document.createElement('div');
    multiSelectHostDiv.classList.add('inline-zahn-findings-select');
    zahnContainer.appendChild(multiSelectHostDiv);

    const controlId = `inline_tooth_${toothIdStr}_findings_${optionsKey}`; // Make controlId unique

    // Ensure state structure exists for this tooth and potentially this optionsKey
    if (!inlineZahnschemaState[toothIdStr]) {
        inlineZahnschemaState[toothIdStr] = { missing: false, findings: {}, surfaceFindings: {} };
    }
    // Initialize findings for this specific optionsKey if not already present
    // This assumes findings for different option sets are stored under the same `findings` object,
    // distinguished by their keys. If they need to be separate, state structure would need adjustment.
    activeOptions.forEach(opt => {
        if (!inlineZahnschemaState[toothIdStr].findings[opt.value]) {
            inlineZahnschemaState[toothIdStr].findings[opt.value] = { checked: false, text: opt.text, details: '' };
        }
    });
    // Transformiere die activeOptions, um die "Anwendungsbereich"-Ebene einzufügen
    const originalItemsForTransform = activeOptions;
    // Für ein einzelnes Zahn-Multiselect ist der Kontext die Zahn-ID
    const transformedOptionsForTooth = transformPathologischeBefundeOptions(originalItemsForTransform, toothIdStr, optionsKey);
    // console.log(`[InlineSchema] Tooth ${toothIdStr} (${optionsKey}) transformed options:`, JSON.parse(JSON.stringify(transformedOptionsForTooth)));

    const multiSelectConfig = {
        typ: 'multiselect_inline_tooth',
        label: '',
        containerElement: multiSelectHostDiv,
        options: transformedOptionsForTooth,
        initialState: inlineZahnschemaState[toothIdStr].findings, // This will use all findings; filtering might be needed if keys overlap
        buttonTextConfig: {
            placeholder: placeholderText, // Use the passed placeholderText
            maxItemsToShow: 1
        },
        optionsKeyForContext: optionsKey // Pass optionsKey for context if needed by createMultiSelect
    };
    createMultiSelect(controlId, multiSelectConfig);

    if (inlineZahnschemaState[toothIdStr]?.missing && optionsKey === 'pathologischeZahnBefundeOptionen') {
        zahnContainer.classList.add('missing');
    }

    // Initial visual updates for this specific tooth if SVG is rendered
    if (shouldRenderSVG) {
        updateSurfaceVisuals(toothIdStr, optionsKey);
        if (svgToothHostDiv) { // Check if it was created (it should have been if shouldRenderSVG is true)
            updateToothCrownVisual(toothIdStr, optionsKey, svgToothHostDiv); // Pass the host element
            // updatePersistentMilkVisual(toothIdStr, optionsKey); // If persistent milk tooth feature is active
        } else {
            // This case should ideally not be reached if shouldRenderSVG is true
            console.warn(`[InlineSchema] svgToothHostDiv was not created for tooth ${toothIdStr} when attempting to update crown visual, though shouldRenderSVG was true.`);
        }
    }

    return zahnContainer;
}

function handleToothContainerLeftClick(toothId, schemaKeyOfClickedTooth, event) {
    // Prevent interference if the click is on an interactive element within the container (like the multiselect button)
    if (event.target.closest('.multi-select-button, .inline-svg-tooth-host')) {
        return;
    }
    event.stopPropagation();

    const zahnContainer = document.getElementById(`inline-zahn-${toothId}-${schemaKeyOfClickedTooth}`);
    if (!zahnContainer) return;

    const isShiftPressed = event.shiftKey;

    if (!isShiftPressed) {
        // SINGLE CLICK behavior:
        // Clear any existing selection, then select the current tooth.
        activeToothContainerSelection.toothIds.forEach(tid => {
            // Use the stored schemaOptionsKey for clearing, as it might be different
            const prevContainer = document.getElementById(`inline-zahn-${tid}-${activeToothContainerSelection.schemaOptionsKey}`);
            prevContainer?.classList.remove('selected');
        });
        activeToothContainerSelection.toothIds.clear();

        activeToothContainerSelection.toothIds.add(toothId);
        zahnContainer.classList.add('selected');
        activeToothContainerSelection.schemaOptionsKey = schemaKeyOfClickedTooth;
    } else {
        // SHIFT CLICK behavior:
        // If the shift-click is on a tooth from a DIFFERENT schema instance,
        // treat it as a new single selection in that new schema.
        if (activeToothContainerSelection.schemaOptionsKey !== null && activeToothContainerSelection.schemaOptionsKey !== schemaKeyOfClickedTooth) {
            activeToothContainerSelection.toothIds.forEach(tid => {
                const prevContainer = document.getElementById(`inline-zahn-${tid}-${activeToothContainerSelection.schemaOptionsKey}`);
                prevContainer?.classList.remove('selected');
            });
            activeToothContainerSelection.toothIds.clear();

            activeToothContainerSelection.toothIds.add(toothId);
            zahnContainer.classList.add('selected');
            activeToothContainerSelection.schemaOptionsKey = schemaKeyOfClickedTooth;
        } else {
            // Shift-clicking within the SAME schema instance (or starting a new selection if schemaOptionsKey was null)
            if (activeToothContainerSelection.toothIds.has(toothId)) {
                activeToothContainerSelection.toothIds.delete(toothId);
                zahnContainer.classList.remove('selected');
            } else {
                activeToothContainerSelection.toothIds.add(toothId);
                zahnContainer.classList.add('selected');
            }

            // Update schemaOptionsKey if this is the first item in a new shift-selection
            if (activeToothContainerSelection.toothIds.size > 0 && activeToothContainerSelection.schemaOptionsKey === null) {
                activeToothContainerSelection.schemaOptionsKey = schemaKeyOfClickedTooth;
            }
        }
    }

    // If selection becomes empty, clear the schema key
    if (activeToothContainerSelection.toothIds.size === 0) {
        activeToothContainerSelection.schemaOptionsKey = null;
    }
}

function handleToothContainerRightClick(toothId, schemaKeyOfClickedTooth, event) {
    event.preventDefault();
    event.stopPropagation();

    // If the right-clicked tooth is not part of the current selection,
    // clear the existing selection and select only the right-clicked tooth.
    // Also, if the current selection belongs to a different schema instance, reset.
    if (activeToothContainerSelection.schemaOptionsKey !== schemaKeyOfClickedTooth || !activeToothContainerSelection.toothIds.has(toothId)) {
        activeToothContainerSelection.toothIds.forEach(tid => {
            // Use the stored schemaOptionsKey for clearing, as it might be different
            const prevContainer = document.getElementById(`inline-zahn-${tid}-${activeToothContainerSelection.schemaOptionsKey}`);
            prevContainer?.classList.remove('selected');
        });
        activeToothContainerSelection.toothIds.clear();
        activeToothContainerSelection.toothIds.add(toothId);
        const currentContainer = document.getElementById(`inline-zahn-${toothId}-${schemaKeyOfClickedTooth}`);
        currentContainer?.classList.add('selected');
        activeToothContainerSelection.schemaOptionsKey = schemaKeyOfClickedTooth; // Set schema context to the right-clicked tooth
    }
    // At this point, activeToothContainerSelection.toothIds contains the tooth/teeth that should be affected by the context menu.
    // And activeToothContainerSelection.schemaOptionsKey is set appropriately.

    if (activeToothContainerSelection.toothIds.size > 0) {
        openGlobalToothFindingsMenu(Array.from(activeToothContainerSelection.toothIds), event.clientX, event.clientY);
    }
}

function closeGlobalToothMenu() {
    if (currentGlobalToothMenu) {
        currentGlobalToothMenu.remove();
        currentGlobalToothMenu = null;
    }
    if (currentGlobalToothMenuMultiSelectId && controls[currentGlobalToothMenuMultiSelectId]) {
        delete controls[currentGlobalToothMenuMultiSelectId];
        currentGlobalToothMenuMultiSelectId = null;
    }
}

function closeGlobalToothMenuAndCleanUp() {
    closeGlobalToothMenu();
    // Clear visual selection from tooth containers
    activeToothContainerSelection.toothIds.forEach(tid => {
        // The schemaOptionsKey stored in activeToothContainerSelection is from the instance,
        // which is correct for finding the element ID.
        const container = document.getElementById(`inline-zahn-${tid}-${activeToothContainerSelection.schemaOptionsKey}`);
        container?.classList.remove('selected');
    });
    activeToothContainerSelection.toothIds.clear();
    activeToothContainerSelection.schemaOptionsKey = null;
}

function closeGlobalToothMenuOnClickOutside(event) {
    if (currentGlobalToothMenu && !currentGlobalToothMenu.contains(event.target)) {
        applyGlobalToothFindingsFromMenu(); // Always apply on click outside
        closeGlobalToothMenuAndCleanUp(); // Then close and clean up
    } else if (currentGlobalToothMenu) {
        // If the click was inside the menu, re-register the listener for the next click outside.
        document.addEventListener('click', closeGlobalToothMenuOnClickOutside, { once: true, capture: true });
    }
}

function openGlobalToothFindingsMenu(toothIdsArray, x, y) {
    console.log("[InlineSchema] openGlobalToothFindingsMenu called for teeth:", toothIdsArray);
    closeGlobalToothMenuAndCleanUp(); // Corrected: Close any existing global tooth menu and clean up selection
    // Ensure to call the global version from surface-menu.js
    if (typeof window.closeSurfaceFindingsMenuAndCleanUp === 'function') {
        window.closeSurfaceFindingsMenuAndCleanUp(activeToothSurfaceSelection.schemaOptionsKey);
    } // Also close any surface menu and clean its selection

    const menuOptionsKey = 'pathologischeZahnBefundeOptionen'; // This menu always uses these options
    const activeOptionsConfig = getDynamicElementOptions(menuOptionsKey);
    // const activeOptions = activeOptionsConfig?.items || activeOptionsConfig || []; // Alte Methode
    const originalItemsForGlobalMenu = activeOptionsConfig?.items || activeOptionsConfig || [];
    // Für das globale Menü übergeben wir das Array der ausgewählten Zahn-IDs als Kontext
    const transformedOptionsForGlobalMenu = transformPathologischeBefundeOptions(originalItemsForGlobalMenu, toothIdsArray, menuOptionsKey);

    if (!transformedOptionsForGlobalMenu || transformedOptionsForGlobalMenu.length === 0) {
        console.error(`[InlineSchema] No options found for ${menuOptionsKey} to build global tooth menu.`);
        return;
    }

    currentGlobalToothMenuMultiSelectId = `global_tooth_findings_menu_${Date.now()}`;

    const menuDiv = document.createElement('div');
    menuDiv.id = 'globalToothFindingsContextMenu';
    // Apply similar styling as surfaceFindingsContextMenu
    menuDiv.style.position = 'fixed';
    menuDiv.style.left = `${x}px`;
    menuDiv.style.top = `${y}px`;
    menuDiv.style.border = '1px solid #ccc';
    menuDiv.style.backgroundColor = 'white';
    menuDiv.style.padding = '10px';
    menuDiv.style.zIndex = '1001';
    menuDiv.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';
    currentGlobalToothMenu = menuDiv;

    currentGlobalToothMenu.dataset.toothIds = JSON.stringify(toothIdsArray);
    currentGlobalToothMenu.dataset.schemaOptionsKey = menuOptionsKey; // This is 'pathologischeZahnBefundeOptionen'

    const multiSelectHost = document.createElement('div');
    menuDiv.appendChild(multiSelectHost);

    // Calculate initial state for the multi-select
    // A finding is checked if *any* selected tooth has it checked. Details from the first.
    const initialStateForMultiSelect = {};

    transformedOptionsForGlobalMenu.forEach(transformedOpt => {
        const baseOptValue = transformedOpt.value; // z.B. "k"
        let isBaseFindingChecked = false;
        let commonDetailsForGlobalMenu = {}; // Wird die Struktur für transformedOpt.details halten

        // Prüfen, ob der Basisbefund (z.B. Karies) bei irgendeinem Zahn aktiv ist
        isBaseFindingChecked = toothIdsArray.some(toothId => inlineZahnschemaState[toothId]?.findings?.[baseOptValue]?.checked);

        if (transformedOpt._dynamicOptions) { // Dies ist ein transformierter Befund mit "Anwendungsbereich"
            // Initialisiere die Details-Struktur für das "Anwendungsbereich"-Multiselect
            commonDetailsForGlobalMenu = { multiselectValue: {}, additionalText: '' };

            transformedOpt._dynamicOptions.items.forEach(areaOpt => { // z.B. k_ganzer_zahn, k_okklusal
                const areaValue = areaOpt.value; // z.B. "k_ganzer_zahn"

                // Prüfen, ob DIESER Anwendungsbereich (z.B. "Ganzer Zahn" oder "Okklusal")
                // bei ALLEN ausgewählten Zähnen für den Basisbefund (z.B. "Karies") ausgewählt ist.
                let allSelectedTeethHaveThisAreaChecked = toothIdsArray.length > 0 && toothIdsArray.every(toothId =>
                    inlineZahnschemaState[toothId]?.findings?.[baseOptValue]?.details?.multiselectValue?.[areaValue]?.checked
                );

                let detailsForThisAreaFromFirstTooth = null;
                if (allSelectedTeethHaveThisAreaChecked && toothIdsArray.length > 0) {
                    // Nimm die Details (z.B. Kariesoptionen) vom ersten Zahn, wenn alle diesen Bereich ausgewählt haben.
                    const firstToothAreaState = inlineZahnschemaState[toothIdsArray[0]]?.findings?.[baseOptValue]?.details?.multiselectValue?.[areaValue];
                    if (firstToothAreaState) {
                        detailsForThisAreaFromFirstTooth = firstToothAreaState.details;
                    }
                }
                // Die Details für diesen Anwendungsbereich (z.B. für "k_okklusal" wären das die "kariesOptionen")
                // werden vom ersten Zahn übernommen, wenn alle Zähne diesen Bereich aktiv haben.
                // Sonst wird eine leere Detailstruktur initialisiert.
                let nestedDetails;
                if (allSelectedTeethHaveThisAreaChecked && detailsForThisAreaFromFirstTooth) {
                    nestedDetails = JSON.parse(JSON.stringify(detailsForThisAreaFromFirstTooth));
                } else {
                    if (areaOpt.detailsType === 'multiselect') {
                        nestedDetails = { multiselectValue: {}, additionalText: '' };
                    } else if (areaOpt.detailsType === 'select') {
                        nestedDetails = { selectValue: '', additionalText: '' };
                    } else {
                        nestedDetails = '';
                    }
                }

                commonDetailsForGlobalMenu.multiselectValue[areaValue] = {
                    checked: allSelectedTeethHaveThisAreaChecked,
                    text: areaOpt.text, // z.B. "Ganzer Zahn" oder "Okklusal"
                    details: nestedDetails // Dies sind die Details für die *nächste* Ebene (z.B. kariesOptionen)
                };

            });
        } else { // Nicht-transformierter Befund (z.B. "fe")
            let firstDetails = '';
            if (isBaseFindingChecked && toothIdsArray.length > 0) {
                const fState = inlineZahnschemaState[toothIdsArray[0]]?.findings?.[baseOptValue];
                if (fState) firstDetails = fState.details || '';
            }
            commonDetailsForGlobalMenu = firstDetails;
        }

        initialStateForMultiSelect[baseOptValue] = {
            checked: isBaseFindingChecked,
            text: transformedOpt.text,
            details: commonDetailsForGlobalMenu,
            isDefault: transformedOpt.isDefault || false
        };
    });

    createMultiSelect(currentGlobalToothMenuMultiSelectId, {
        typ: 'multiselect',
        label: `Befunde für Zähne: ${toothIdsArray.join(', ')}`,
        containerElement: multiSelectHost,
        options: transformedOptionsForGlobalMenu, // Verwende transformierte Optionen
        initialState: initialStateForMultiSelect,
        buttonTextConfig: { placeholder: 'Befunde auswählen...' }
    });

    const buttonsDiv = document.createElement('div');
    buttonsDiv.style.marginTop = '10px';
    buttonsDiv.style.textAlign = 'right';

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Übernehmen';
    confirmBtn.onclick = () => {
        applyGlobalToothFindingsFromMenu();
        closeGlobalToothMenuAndCleanUp();
    };
    buttonsDiv.appendChild(confirmBtn);

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Abbrechen';
    cancelBtn.style.marginLeft = '5px';
    // "Abbrechen" will now also attempt to apply before closing, as per "always save on close"
    cancelBtn.onclick = () => {
        closeGlobalToothMenuAndCleanUp();
    };
    buttonsDiv.appendChild(cancelBtn);
    menuDiv.appendChild(buttonsDiv);
    document.body.appendChild(menuDiv);

    menuDiv.addEventListener('click', e => e.stopPropagation());
    document.addEventListener('click', closeGlobalToothMenuOnClickOutside, { once: true, capture: true });
}

function applyGlobalToothFindingsFromMenu() {
    if (!currentGlobalToothMenu || !currentGlobalToothMenuMultiSelectId || !controls[currentGlobalToothMenuMultiSelectId]) {
        console.warn("[InlineSchema] Cannot apply global tooth findings: menu or multiselect not available.");
        return false;
    }

    const toothIds = JSON.parse(currentGlobalToothMenu.dataset.toothIds);
    const schemaOptionsKey = currentGlobalToothMenu.dataset.schemaOptionsKey; // Should be 'pathologischeZahnBefundeOptionen'

    const currentValues = controls[currentGlobalToothMenuMultiSelectId]?.value;
    const activeOptionsConfig = getDynamicElementOptions(schemaOptionsKey);
    const activeOptions = activeOptionsConfig?.items || activeOptionsConfig || [];

    if (currentValues && activeOptions.length > 0 && toothIds && toothIds.length > 0) {
        toothIds.forEach(toothId => {
            if (!inlineZahnschemaState[toothId]) {
                inlineZahnschemaState[toothId] = { missing: false, findings: {}, surfaceFindings: {} };
            }
            if (!inlineZahnschemaState[toothId].findings) {
                inlineZahnschemaState[toothId].findings = {};
            }

            const individualToothMultiselectId = `inline_tooth_${toothId}_findings_${schemaOptionsKey}`;
            const individualToothControl = controls[individualToothMultiselectId];

            activeOptions.forEach(opt => {
                const valueFromGlobalMenu = currentValues[opt.value];
                // Ensure finding entry exists in global state
                if (!inlineZahnschemaState[toothId].findings[opt.value]) {
                    inlineZahnschemaState[toothId].findings[opt.value] = { checked: false, text: opt.text, details: '' };
                }

                const isCheckedInGlobalMenu = valueFromGlobalMenu?.checked || false;
                // detailsFromGlobalMenu is the .details property from the global menu's state for this option.
                // It can be a string (for simple details) or an object (for complex details like nested multiselects).
                const detailsFromGlobalMenu = valueFromGlobalMenu?.details;

                // 1. Update inlineZahnschemaState (master state)
                inlineZahnschemaState[toothId].findings[opt.value].checked = isCheckedInGlobalMenu;

                const optionConfig = activeOptions.find(o => o.value === opt.value); // Config for the current top-level option (e.g., Karies)

                // If detailsFromGlobalMenu is a complex object (for nested multiselect/select), deep copy it.
                // Otherwise, assign it directly (it's likely a string or primitive).
                if (isCheckedInGlobalMenu && typeof detailsFromGlobalMenu === 'object' && detailsFromGlobalMenu !== null) {
                    inlineZahnschemaState[toothId].findings[opt.value].details = JSON.parse(JSON.stringify(detailsFromGlobalMenu));
                } else if (isCheckedInGlobalMenu) {
                    inlineZahnschemaState[toothId].findings[opt.value].details = detailsFromGlobalMenu || '';
                } else {
                    // If unchecked, clear details or reset to default structure for complex types
                    inlineZahnschemaState[toothId].findings[opt.value].details = (optionConfig?.detailsType === 'multiselect')
                        ? { multiselectValue: {}, additionalText: '' }
                        : (optionConfig?.detailsType === 'select')
                            ? { selectValue: '', additionalText: '' }
                            : '';
                }

                // 2. Update the corresponding individual tooth's multiselect control state
                if (individualToothControl?.value?.[opt.value]) {
                    individualToothControl.value[opt.value].checked = isCheckedInGlobalMenu;
                    if (isCheckedInGlobalMenu && typeof detailsFromGlobalMenu === 'object' && detailsFromGlobalMenu !== null) {
                        individualToothControl.value[opt.value].details = JSON.parse(JSON.stringify(detailsFromGlobalMenu));
                    } else if (isCheckedInGlobalMenu) {
                        individualToothControl.value[opt.value].details = detailsFromGlobalMenu || '';
                    } else {
                        individualToothControl.value[opt.value].details = (optionConfig?.detailsType === 'multiselect')
                            ? { multiselectValue: {}, additionalText: '' }
                            : (optionConfig?.detailsType === 'select')
                                ? { selectValue: '', additionalText: '' }
                                : '';
                    }
                } else if (individualToothControl?.value) { // If option didn't exist in control, initialize
                    let initialDetailsForControl;
                    if (isCheckedInGlobalMenu && typeof detailsFromGlobalMenu === 'object' && detailsFromGlobalMenu !== null) {
                        initialDetailsForControl = JSON.parse(JSON.stringify(detailsFromGlobalMenu));
                    } else if (isCheckedInGlobalMenu) {
                        initialDetailsForControl = (optionConfig?.detailsType === 'multiselect') ? { multiselectValue: {}, additionalText: detailsFromGlobalMenu || '' }
                            : (optionConfig?.detailsType === 'select') ? { selectValue: '', additionalText: detailsFromGlobalMenu || '' }
                                : detailsFromGlobalMenu || '';
                    } else { // Unchecked
                        initialDetailsForControl = (optionConfig?.detailsType === 'multiselect') ? { multiselectValue: {}, additionalText: '' }
                            : (optionConfig?.detailsType === 'select') ? { selectValue: '', additionalText: '' }
                                : '';
                    }
                    individualToothControl.value[opt.value] = {
                        checked: isCheckedInGlobalMenu, text: opt.text,
                        details: initialDetailsForControl,
                        isDefault: opt.isDefault || false
                    };
                }

                // Handle 'fehlend' state specifically
                if (opt.value === 'fe' && schemaOptionsKey === 'pathologischeZahnBefundeOptionen') {
                    updateInlineToothMissingState(toothId, isCheckedInGlobalMenu);
                }
            });

            // Update the individual tooth's multiselect button and visuals
            if (individualToothControl && individualToothControl.optionsDiv) {
                activeOptions.forEach(topLevelOpt => { // Iterate through pathologischeZahnBefundeOptionen
                    const topLevelOptValue = topLevelOpt.value;
                    const checkbox = individualToothControl.optionsDiv.querySelector(`input[type="checkbox"][value="${topLevelOptValue}"]`);
                    const topLevelOptStateInControl = individualToothControl.value[topLevelOptValue];

                    if (checkbox && topLevelOptStateInControl) {
                        checkbox.checked = topLevelOptStateInControl.checked;

                        const detailsWrapperId = `${individualToothMultiselectId}_${topLevelOptValue}_details_wrapper`;
                        const detailsWrapper = individualToothControl.optionsDiv.querySelector(`#${detailsWrapperId}`);
                        if (detailsWrapper) {
                            detailsWrapper.style.display = topLevelOptStateInControl.checked && topLevelOpt.needsDetails ? (detailsWrapper.style.flexDirection === 'column' ? 'flex' : 'block') : 'none';

                            if (topLevelOptStateInControl.checked && topLevelOpt.needsDetails) {
                                // Update nested controls if they exist
                                if (topLevelOpt.detailsType === 'select' && typeof topLevelOptStateInControl.details === 'object') {
                                    const nestedSelectId = `${individualToothMultiselectId}_${topLevelOptValue}_details_select`;
                                    const nestedSelectElement = document.getElementById(nestedSelectId);
                                    if (nestedSelectElement) {
                                        nestedSelectElement.value = topLevelOptStateInControl.details.selectValue || '';
                                    }
                                    const additionalTextId = `${individualToothMultiselectId}_${topLevelOptValue}_details_additional_text`;
                                    const additionalTextInput = detailsWrapper.querySelector(`#${additionalTextId}`);
                                    if (additionalTextInput) {
                                        additionalTextInput.value = topLevelOptStateInControl.details.additionalText || '';
                                    }
                                } else if (topLevelOpt.detailsType === 'multiselect' && typeof topLevelOptStateInControl.details === 'object' && typeof topLevelOptStateInControl.details.multiselectValue === 'object') {
                                    const nestedMsId = `${individualToothMultiselectId}_${topLevelOptValue}_details_multiselect`;
                                    const nestedMsControl = controls[nestedMsId];
                                    if (nestedMsControl && nestedMsControl.optionsDiv) {
                                        const nestedMsOptionsConfig = getDynamicElementOptions(topLevelOpt.optionsKey) || [];
                                        nestedMsOptionsConfig.forEach(nestedOpt => {
                                            const nestedOptValue = nestedOpt.value;
                                            const nestedCheckbox = nestedMsControl.optionsDiv.querySelector(`input[type="checkbox"][value="${nestedOptValue}"]`);
                                            const nestedOptStateInControl = topLevelOptStateInControl.details.multiselectValue[nestedOptValue];

                                            if (nestedCheckbox && nestedOptStateInControl) {
                                                nestedCheckbox.checked = nestedOptStateInControl.checked;
                                                // Update the nested control's internal state as well
                                                if (nestedMsControl.value[nestedOptValue]) {
                                                    nestedMsControl.value[nestedOptValue].checked = nestedOptStateInControl.checked;
                                                }

                                                const nestedDetailsWrapperId = `${nestedMsId}_${nestedOptValue}_details_wrapper`;
                                                const nestedDetailsWrapper = nestedMsControl.optionsDiv.querySelector(`#${nestedDetailsWrapperId}`);
                                                if (nestedDetailsWrapper) {
                                                    nestedDetailsWrapper.style.display = nestedOptStateInControl.checked && nestedOpt.needsDetails ? (nestedDetailsWrapper.style.flexDirection === 'column' ? 'flex' : 'block') : 'none';
                                                    if (nestedOptStateInControl.checked && nestedOpt.needsDetails) {
                                                        if (nestedOpt.detailsType === 'select' && typeof nestedOptStateInControl.details === 'object') {
                                                            const deepestSelectId = `${nestedMsId}_${nestedOptValue}_details_select`;
                                                            const deepestSelectElement = document.getElementById(deepestSelectId);
                                                            if (deepestSelectElement) {
                                                                deepestSelectElement.value = nestedOptStateInControl.details.selectValue || '';
                                                            }
                                                            // Update nested control's internal state for the select
                                                            if (nestedMsControl.value[nestedOptValue] && typeof nestedMsControl.value[nestedOptValue].details === 'object') {
                                                                nestedMsControl.value[nestedOptValue].details.selectValue = nestedOptStateInControl.details.selectValue || '';
                                                                nestedMsControl.value[nestedOptValue].details.additionalText = nestedOptStateInControl.details.additionalText || ''; // Also update additional text
                                                            }
                                                            const deepestAdditionalTextId = `${nestedMsId}_${nestedOptValue}_details_additional_text`;
                                                            const deepestAdditionalTextInput = nestedDetailsWrapper.querySelector(`#${deepestAdditionalTextId}`);
                                                            if (deepestAdditionalTextInput) {
                                                                deepestAdditionalTextInput.value = nestedOptStateInControl.details.additionalText || '';
                                                            }
                                                        }
                                                        // Add similar state updates for nested multiselect if it exists
                                                    }
                                                }
                                            }
                                        });
                                        updateMultiSelectButtonText(nestedMsId); // Update button text of this nested multiselect
                                    }
                                    const additionalTextMsId = `${individualToothMultiselectId}_${topLevelOptValue}_details_additional_text`;
                                    const additionalTextInputMs = detailsWrapper.querySelector(`#${additionalTextMsId}`);
                                    if (additionalTextInputMs) {
                                        additionalTextInputMs.value = topLevelOptStateInControl.details.additionalText || '';
                                    }
                                } else if (detailsWrapper.querySelector('input[type="text"]')) { // Simple text detail
                                    const textDetailInput = detailsWrapper.querySelector('input[type="text"]');
                                    if (textDetailInput) {
                                        textDetailInput.value = typeof topLevelOptStateInControl.details === 'string' ? topLevelOptStateInControl.details : '';
                                    }
                                }
                            }
                        }
                    }
                });
            }

            updateMultiSelectButtonText(individualToothMultiselectId);
            updateToothCrownVisual(toothId, schemaOptionsKey);
            updateSurfaceVisuals(toothId, schemaOptionsKey); // If 'fe' was applied, surfaces should clear
        });
        updateBefundZusammenfassung();
        return true;
    }
    return false;
}
