// ============== app-state-and-core.js ==============
// MODULE: APP STATE & CORE LOGIC
// V12 UPDATE: Korrekte Label-Auflösung in updateBefundZusammenfassung.
//             Basis für Integration von Implantatplanungs-Inline-Schema-Daten.
// V13 UPDATE (User Request): Sicherstellen, dass vorausgewählte Werte für Indikation,
//                             Beurteilung und Empfehlung in der Zusammenfassung angezeigt werden.
// V14 UPDATE (User Feedback): Erneuter Versuch, die Anzeige von Default-Vorauswahlen
//                             für Select-Felder in Beurteilung/Empfehlung sicherzustellen durch
//                             explizitere Prüfung der selectedOption und ihres Textes,
//                             während für den finalen Text weiterhin getControlValueText genutzt wird.
// V15 UPDATE (User Feedback): Direktere Verwendung von selectedOption.text für einfache Defaults
//                             in Beurteilung/Empfehlung, um mögliche Probleme mit getControlValueText
//                             im Initialzustand für diese Felder zu minimieren.
// V16 UPDATE (Based on User Feedback/Diff): Anpassungen für neue Konfigurationsstruktur,
//                             Label-Keys, explizite ID-Handhabung und Logik für Abschnittsanzeige.
// V17 UPDATE (User Feedback): Verbesserte Indikation-Label-Anzeige, Vermeidung redundanter "Befund"-Subheader,
//                             Konsolidierung von "opB"-Zahnbefunden in Bereiche.
// V18 UPDATE (User Feedback): Korrekte Positionierung von Zahnbefunden unter "Zahnstatus & dentaler Befund",
//                             Verbesserte Anzeige von Default-Werten für Beurteilung/Empfehlung.
// ========================================================================

let controls = {};
const inlineZahnschemaState = {};
window.befundZusammenfassung = null;
window.includeNormalInSummary = false;

function getTextResource(key, fallback) {
    const appConf = typeof getAppConfig === 'function' ? getAppConfig() : window.appConfig;
    return appConf?.general?.textResources?.[key] || fallback || key;
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function adjustTextareaHeight(textarea) {
    if (!textarea) return;
    textarea.style.height = 'auto';
    const minHeight = parseInt(window.getComputedStyle(textarea).minHeight, 10) || 40;
    textarea.style.height = Math.max(minHeight, textarea.scrollHeight) + 'px';
}

function isProblematicInlineFindingPresent(currentInlineZahnschemaState) {
    const wisdomTeethIds = ['18', '28', '38', '48'];
    const pathOptions = getDynamicElementOptions('pathologischeZahnBefundeOptionen');
    const pathBefunde = pathOptions?.items || pathOptions || [];

    for (const toothIdStr in currentInlineZahnschemaState) {
        const toothState = currentInlineZahnschemaState[toothIdStr];
        if (toothState && toothState.findings) {
            for (const findingKey in toothState.findings) {
                if (toothState.findings[findingKey].checked) {
                    const findingConfig = pathBefunde.find(opt => opt.value === findingKey);
                    if (findingConfig) { 
                        if (findingKey === 'fe') {
                            if (!wisdomTeethIds.includes(toothIdStr)) {
                                return true;
                            }
                        } else {
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}

function updateAltersentsprechendOption() {
    const opgZahnstatusControl = controls['opg_zahnstatus_multiselect'];
    if (!opgZahnstatusControl || !opgZahnstatusControl.value || !opgZahnstatusControl.optionsDiv) {
        return;
    }
    const altersentsprechendCheckbox = opgZahnstatusControl.optionsDiv.querySelector('input[type="checkbox"][value="altersentsprechend"]');
    if (!altersentsprechendCheckbox) {
        return;
    }
    let shouldAltersentsprechendBeUnchecked = false;
    for (const optionValueKey in opgZahnstatusControl.value) {
        if (optionValueKey !== 'altersentsprechend' && opgZahnstatusControl.value[optionValueKey].checked) {
            shouldAltersentsprechendBeUnchecked = true;
            break;
        }
    }
    if (!shouldAltersentsprechendBeUnchecked) {
        if (isProblematicInlineFindingPresent(inlineZahnschemaState)) {
            shouldAltersentsprechendBeUnchecked = true;
        }
    }
    if (shouldAltersentsprechendBeUnchecked && altersentsprechendCheckbox.checked) {
        altersentsprechendCheckbox.checked = false;
        if (opgZahnstatusControl.value['altersentsprechend']) {
            opgZahnstatusControl.value['altersentsprechend'].checked = false;
        }
        updateMultiSelectButtonText('opg_zahnstatus_multiselect');
        updateBefundZusammenfassung();
    }
}

function getControlValueText(control) {
    if (!control || !control.config) return { text: '', isPathological: false, isDefaultOrEmpty: true, isActuallyDefault: false };

    let valueText = '';
    let detailsText = '';
    let isPathological = false;
    let isDefaultOrEmpty = true;
    let isActuallyDefault = false;

    switch (control.type) {
        case 'select':
            if (control.element && typeof control.element.selectedIndex !== 'undefined') {
                const selectedOption = control.element.options[control.element.selectedIndex];
                if (selectedOption) {
                    valueText = selectedOption.text; 
                    detailsText = control.detailsValue || '';
                    isActuallyDefault = selectedOption.dataset.isDefault === 'true';
                    // An option is "empty" if it has no value OR it's marked as the structural default (like an initial placeholder)
                    // However, for Beurteilung/Empfehlung, even a "default" option can be meaningful content.
                    // This function primarily determines if a value is non-standard or has details.
                    isDefaultOrEmpty = isActuallyDefault || !selectedOption.value; 


                    if (selectedOption.value && !isActuallyDefault) { // Non-default selection
                        isPathological = true; // Or simply "not standard"
                    }
                    // If it needs details and has them, it's significant, even if the base option was default
                    if (selectedOption.dataset.needsDetails === 'true' && control.detailsValue && control.detailsValue.trim() !== '') {
                        isPathological = true; 
                         if (isActuallyDefault) isDefaultOrEmpty = false; 
                    }
                }
            }
            break;
        case 'multiselect':
            const selectedItems = [];
            let hasAnySelection = false;
            if (control.value && typeof control.value === 'object') {
                Object.entries(control.value).forEach(([optVal, optState]) => {
                    if (!optState.checked) return;

                    hasAnySelection = true;
                    let mainText = getTextResource(optState.text, optState.text);
                    let detailString = '';

                    if (optState.checked) {
                        // Construct detailString based on optState.details and parent option config
                        if (optState.details != null) { // Check for null or undefined
                            const parentOptionConfig = control.config.options.find(o => o.value === optVal);
                            if (parentOptionConfig?.detailsType === 'select') {
                                let selectDetailText = '';
                                if (typeof optState.details === 'object' && optState.details.selectValue != null) {
                                    const nestedSelectId = `${control.button.id.replace('_button', '')}_${optVal}_details_select`;
                                    const nestedSelectControl = controls[nestedSelectId];
                                    if (nestedSelectControl?.element) {
                                        const selectedOptionElement = nestedSelectControl.element.options[nestedSelectControl.element.selectedIndex];
                                        if (selectedOptionElement) {
                                            selectDetailText = selectedOptionElement.text;
                                        } else { // Fallback to raw value if text not found
                                            selectDetailText = optState.details.selectValue;
                                        }
                                    } else { // Fallback if control not found
                                        selectDetailText = optState.details.selectValue;
                                    }
                                }
                                let additionalDetailText = (typeof optState.details === 'object' && optState.details.additionalText) ? optState.details.additionalText.trim() : '';
                                if (selectDetailText && additionalDetailText) {
                                    detailString = `${selectDetailText}, ${additionalDetailText}`;
                                } else {
                                    detailString = selectDetailText || additionalDetailText;
                                }
                            } else if (parentOptionConfig?.detailsType === 'multiselect') {
                                let nestedSelectedTexts = [];
                                // Config for the options of the *nested* multiselect (e.g., "kariesOptionen")
                                const nestedMultiselectOptions = getDynamicElementOptions(parentOptionConfig.optionsKey) || [];

                                if (typeof optState.details === 'object' && typeof optState.details.multiselectValue === 'object') {
                                    Object.entries(optState.details.multiselectValue).forEach(([nOptVal, nOptState]) => { // nOptVal is "m", "d"; nOptState is its state
                                        if (nOptState.checked) {
                                            const currentNestedOptionConfig = nestedMultiselectOptions.find(o => o.value === nOptVal); // Config for "m", "d"
                                            let nText = getTextResource(nOptState.text, nOptState.text);

                                            if (currentNestedOptionConfig) { // If we found the config for the nested option
                                                let detailPartForNText = '';
                                                if (currentNestedOptionConfig.detailsType === 'select' && typeof nOptState.details === 'object' && nOptState.details.selectValue != null) {
                                                    const deepestSelectOptions = getDynamicElementOptions(currentNestedOptionConfig.optionsKey) || []; // e.g., "kariestiefeOptionen"
                                                    const deepestSelectedOpt = deepestSelectOptions.find(dOpt => dOpt.value === nOptState.details.selectValue);
                                                    let deepestSelectText = deepestSelectedOpt ? getTextResource(deepestSelectedOpt.text, deepestSelectedOpt.text) : nOptState.details.selectValue; // e.g., "D1"

                                                    let deepestAdditionalText = (typeof nOptState.details.additionalText === 'string') ? nOptState.details.additionalText.trim() : '';
                                                    if (deepestSelectText && deepestAdditionalText) {
                                                        detailPartForNText = `${deepestSelectText}, ${deepestAdditionalText}`;
                                                    } else {
                                                        detailPartForNText = deepestSelectText || deepestAdditionalText;
                                                    }
                                                } else if (currentNestedOptionConfig.detailsType === 'multiselect' && typeof nOptState.details === 'object' && typeof nOptState.details.multiselectValue === 'object') {
                                                    // Handle even deeper nested multiselects if necessary (recursive call or similar logic)
                                                    let evenDeeperTexts = [];
                                                    const evenDeeperOptions = getDynamicElementOptions(currentNestedOptionConfig.optionsKey) || [];
                                                    Object.entries(nOptState.details.multiselectValue).forEach(([nnOptVal, nnOptState]) => {
                                                        if (nnOptState.checked) {
                                                            const nnOptConfig = evenDeeperOptions.find(o => o.value === nnOptVal);
                                                            evenDeeperTexts.push(nnOptConfig ? getTextResource(nnOptConfig.text, nnOptConfig.text) : nnOptVal);
                                                        }
                                                    });
                                                    if (evenDeeperTexts.length > 0) detailPartForNText = evenDeeperTexts.join('; ');
                                                    let nnAdditionalText = (typeof nOptState.details.additionalText === 'string') ? nOptState.details.additionalText.trim() : '';
                                                    if (detailPartForNText && nnAdditionalText) detailPartForNText += `, ${nnAdditionalText}`;
                                                    else if (nnAdditionalText) detailPartForNText = nnAdditionalText;
                                                } else if (typeof nOptState.details === 'string' && nOptState.details.trim() !== '') {
                                                    // Simple text detail for the nested multiselect option
                                                    detailPartForNText = nOptState.details.trim();
                                                }
                                                if (detailPartForNText) nText += ` (${detailPartForNText})`;
                                            }
                                            nestedSelectedTexts.push(nText);
                                        }
                                    });
                                }
                                let multiSelectDetailText = nestedSelectedTexts.join('; '); // Use semicolon for clarity if many items
                                let additionalDetailTextMs = (typeof optState.details === 'object' && optState.details.additionalText) ? optState.details.additionalText.trim() : '';
                                
                                if (multiSelectDetailText && additionalDetailTextMs) {
                                    detailString = `${multiSelectDetailText} | ${additionalDetailTextMs}`; // Separator for clarity
                                } else {
                                    detailString = multiSelectDetailText || additionalDetailTextMs;
                                }
                            } else if (typeof optState.details === 'string' && optState.details.trim() !== '') { // Standard text details
                                detailString = optState.details.trim();
                            }
                        }

                        selectedItems.push(detailString ? `${mainText} (${detailString})` : mainText);

                        if (!optState.isDefault) {
                            isPathological = true;
                        }
                        if (detailString && !optState.isDefault) { // If details were present and non-empty, it's significant
                            isPathological = true; 
                        } else if (detailString) { // Any detail makes it non-standard for summary purposes
                            isPathological = true;
                        }
                    }
                });
            }
            valueText = selectedItems.join(', ');
            isDefaultOrEmpty = !hasAnySelection; 
            break;
        case 'text':
        case 'textarea':
        case 'textarea_readonly':
            valueText = control.value || '';
            isDefaultOrEmpty = !control.value; 
            if (control.value && control.value.trim() !== '') {
                isPathological = true; 
                if (control.type === 'textarea_readonly' && control.element && (control.element.id === 'befundZusammenfassung' || control.element.id === 'mySummaryTextarea')) {
                    isPathological = false;
                }
            }
            break;
        case 'zahnschema':
            // This type seems unused in the provided context for summary generation.
            // If it were used, it would need logic similar to zahnschema_dynamic_multiselect.
            if (control.value) {
                valueText = control.value.teeth || '';
                isDefaultOrEmpty = !control.value.teeth;
                if (control.value.teeth) isPathological = true;
            }
            break;
        case 'zahnschema_dynamic_multiselect':
             // This control type seems to be for a different UI element not directly part of the main Befund.
             // Its value processing logic is complex and specific to its own structure.
            if (control.value) {
                let dynamicSchemaTextParts = [];
                if (control.value.selectedTeeth) {
                    dynamicSchemaTextParts.push(`${getTextResource('zaehneLabel', 'Zähne')}: ${control.value.selectedTeeth}`);
                    isPathological = true; // Assuming selection implies pathology or significance
                    isDefaultOrEmpty = false;
                }
                let detailsAddedForPathology = false;
                if (control.value.details_per_tooth) {
                    Object.entries(control.value.details_per_tooth).forEach(([toothId, toothDetails]) => {
                        let toothSpecificDetails = [];
                        Object.entries(toothDetails).forEach(([findingKey, findingData]) => {
                            if(findingData.checked) {
                                let detailStr = findingData.text;
                                if (findingData.details) detailStr += `: ${findingData.details}`;
                                toothSpecificDetails.push(detailStr);
                                if(!findingData.isDefault || (findingData.details && findingData.details.trim() !== '')) {
                                    isPathological = true;
                                    detailsAddedForPathology = true;
                                }
                            }
                        });
                        if (toothSpecificDetails.length > 0) {
                            dynamicSchemaTextParts.push(`${getTextResource('zahnLabel', 'Zahn')} ${toothId}: ${toothSpecificDetails.join(', ')}`);
                        }
                    });
                }
                valueText = dynamicSchemaTextParts.join('; ');
                if (!control.value.selectedTeeth && !detailsAddedForPathology && dynamicSchemaTextParts.length === 0) isDefaultOrEmpty = true;
                else if (dynamicSchemaTextParts.length > 0) isDefaultOrEmpty = false;
            }
            break;
    }

    const fullText = `${valueText}${detailsText ? ' ' + detailsText : ''}`.trim();
    return { text: fullText, isPathological: isPathological, isDefaultOrEmpty: isDefaultOrEmpty, isActuallyDefault: isActuallyDefault };
}

function consolidateOpBTeeth(toothIds, placeholder) {
    if (!toothIds || toothIds.length === 0) return [];
    
    const numericToothIds = toothIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
    if (numericToothIds.length === 0) return [];

    numericToothIds.sort((a, b) => a - b);
    
    const consolidated = [];
    let rangeStart = -1;
    
    for (let i = 0; i < numericToothIds.length; i++) {
        const currentTooth = numericToothIds[i];
        if (rangeStart === -1) {
            rangeStart = currentTooth;
        }
        
        if (i + 1 < numericToothIds.length && numericToothIds[i+1] === currentTooth + 1) {
            // Range continues
        } else {
            // Range ends or it's a single tooth
            if (currentTooth === rangeStart) {
                consolidated.push(`${getTextResource('zahnLabel', 'Zahn')} ${currentTooth}: ${placeholder}`);
            } else {
                consolidated.push(`${getTextResource('zahnLabel', 'Zahn')} ${rangeStart}-${currentTooth}: ${placeholder}`);
            }
            rangeStart = -1; 
        }
    }
    return consolidated;
}

// V18: Modified processInlineSchemaFindings to return findings
function processInlineSchemaFindings(optionsKey, sectionTitleKey, appConf, currentInlineZahnschemaState, currentControls) {
    const schemaOptionsConfig = getDynamicElementOptions(optionsKey); // Assumes getDynamicElementOptions is available
    const schemaOptions = schemaOptionsConfig?.items || schemaOptionsConfig || [];
    const schemaPlaceholder = schemaOptionsConfig?.placeholder || appConf?.general?.opbPlaceholderText || 'opB.';
    
    let pathLines = [];
    let nonPathOpBIds = [];
    let nonPathOtherLines = [];
    let hasAnyFindingInThisSchema = false; // Tracks if any tooth had any finding (checked) for *this* schema

    if (schemaOptions && schemaOptions.length > 0 && Object.keys(currentInlineZahnschemaState).length > 0) {
        const sortedTeeth = Object.keys(currentInlineZahnschemaState).map(id => parseInt(id)).filter(id => !isNaN(id)).sort((a, b) => a - b).map(String);
        
        sortedTeeth.forEach(toothId => {
            const toothState = currentInlineZahnschemaState[toothId];
            let toothFindingsTexts = [];
            let hasPathologicalFindingForTooth = false;
            let hasAnyFindingForThisToothInThisSchemaContext = false; // For this specific tooth and schema

                        // Process surface findings for this tooth and schema context
                        if (toothState && toothState.surfaceFindings && Object.keys(toothState.surfaceFindings).length > 0) {
                            let surfaceFindingLines = [];
                            Object.entries(toothState.surfaceFindings).forEach(([surfaceId, surfaceData]) => {
                                let surfaceSpecificFindingTexts = [];
                                schemaOptions.forEach(opt => { // Iterate schema options to check against surface data
                                    const findingOnSurface = surfaceData[opt.value];
                                    if (findingOnSurface && findingOnSurface.checked) {
                                        hasAnyFindingInThisSchema = true;
                                        hasAnyFindingForThisToothInThisSchemaContext = true;
                                        let surfaceFindingText = getTextResource(findingOnSurface.text || opt.text, findingOnSurface.text || opt.text);
                                        let surfaceDetailString = '';
                                        if (typeof findingOnSurface.details === 'string' && findingOnSurface.details.trim() !== '') {
                                            surfaceDetailString = findingOnSurface.details.trim();
                                        }
                                        // TODO: Handle complex details types (select, multiselect) for surface findings if needed, similar to tooth-level findings

                                        if (surfaceDetailString) {
                                            surfaceFindingText += `: ${surfaceDetailString}`;
                                        }
                                        surfaceSpecificFindingTexts.push(surfaceFindingText);
                                        
                                        const isWisdomToothMissingFe = optionsKey === 'pathologischeZahnBefundeOptionen' && opt.value === 'fe' && ['18', '28', '38', '48'].includes(toothId);
                                        if (!isWisdomToothMissingFe && (!opt.isDefault || (surfaceDetailString !== ''))) {
                                            hasPathologicalFindingForTooth = true; // Mark tooth as pathological if any surface finding is
                                        }
                                    }
                                });
                                if (surfaceSpecificFindingTexts.length > 0) {
                                    surfaceFindingLines.push(`${getTextResource(surfaceId, surfaceId)}: ${surfaceSpecificFindingTexts.join('; ')}`);
                                }
                            });
                            if (surfaceFindingLines.length > 0) {
                                toothFindingsTexts.push(`Oberflächen (${surfaceFindingLines.join(', ')})`);
                            }
                        }

            if (toothState && toothState.findings) {
                schemaOptions.forEach(opt => { 
                    const findingData = toothState.findings[opt.value];
                    if (findingData && findingData.checked) {
                        hasAnyFindingInThisSchema = true;
                        hasAnyFindingForThisToothInThisSchemaContext = true;
                        let findingText = getTextResource(findingData.text, findingData.text);
                        
                        let detailStringForSummary = '';
                        if (findingData.details != null) {
                            if (opt.detailsType === 'select') {
                                let selectValueText = '';
                                if (typeof findingData.details === 'object' && findingData.details.selectValue != null) {
                                    const nestedOptions = getDynamicElementOptions(opt.optionsKey) || [];
                                    const selectedNestedOpt = nestedOptions.find(nOpt => nOpt.value === findingData.details.selectValue);
                                    selectValueText = selectedNestedOpt ? getTextResource(selectedNestedOpt.text, selectedNestedOpt.text) : findingData.details.selectValue;
                                }
                                let additionalText = (typeof findingData.details === 'object' && typeof findingData.details.additionalText === 'string') ? findingData.details.additionalText.trim() : '';
                                if (selectValueText && additionalText) {
                                    detailStringForSummary = `${selectValueText}, ${additionalText}`;
                                } else {
                                    detailStringForSummary = selectValueText || additionalText;
                                }
                            } else if (opt.detailsType === 'multiselect') {
                                let nestedMsTexts = [];
                                if (typeof findingData.details === 'object' && typeof findingData.details.multiselectValue === 'object') {
                                    const nestedMsOptions = getDynamicElementOptions(opt.optionsKey) || [];
                                    Object.entries(findingData.details.multiselectValue).forEach(([msOptVal, msOptState]) => {
                                        if (msOptState.checked) {
                                            const nestedMsOptConfig = nestedMsOptions.find(nOpt => nOpt.value === msOptVal);
                                            let nMsText = nestedMsOptConfig ? getTextResource(nestedMsOptConfig.text, nestedMsOptConfig.text) : msOptVal; // z.B. "mesial"

                                            let detailPartForNMsText = '';
                                            // Prüfen, ob die Option des inneren Multiselects (z.B. "mesial") selbst Details vom Typ "select" hat
                                            if (nestedMsOptConfig?.detailsType === 'select' && typeof msOptState.details === 'object' && msOptState.details.selectValue != null) {
                                                const deepestSelectOptions = getDynamicElementOptions(nestedMsOptConfig.optionsKey) || []; // z.B. kariestiefeOptionen
                                                const deepestSelectedOpt = deepestSelectOptions.find(dOpt => dOpt.value === msOptState.details.selectValue);
                                                let deepestSelectText = deepestSelectedOpt ? getTextResource(deepestSelectedOpt.text, deepestSelectedOpt.text) : msOptState.details.selectValue; // z.B. "D1"

                                                let deepestAdditionalText = (typeof msOptState.details.additionalText === 'string') ? msOptState.details.additionalText.trim() : '';

                                                if (deepestSelectText && deepestAdditionalText) {
                                                    detailPartForNMsText = `${deepestSelectText}, ${deepestAdditionalText}`;
                                                } else {
                                                    detailPartForNMsText = deepestSelectText || deepestAdditionalText;
                                                }
                                            } else if (msOptState.details && typeof msOptState.details === 'string' && msOptState.details.trim() !== '') {
                                                // Fallback für einfache String-Details, falls die Option des inneren Multiselects keine komplexen Details hat
                                                detailPartForNMsText = msOptState.details.trim();
                                            }

                                            if (detailPartForNMsText) {
                                                nMsText += ` (${detailPartForNMsText})`; // z.B. "mesial (D1)" oder "mesial (D1, weiterer Text)"
                                            }
                                            nestedMsTexts.push(nMsText);
                                        }
                                    });
                                }
                                let multiSelectDetailText = nestedMsTexts.join('; ');
                                let additionalTextMs = (typeof findingData.details === 'object' && typeof findingData.details.additionalText === 'string') ? findingData.details.additionalText.trim() : '';
                                if (multiSelectDetailText && additionalTextMs) {
                                    detailStringForSummary = `${multiSelectDetailText} | ${additionalTextMs}`;
                                } else {
                                    detailStringForSummary = multiSelectDetailText || additionalTextMs;
                                }
                            } else if (typeof findingData.details === 'string') { // Standard text details or zahnschema
                                detailStringForSummary = findingData.details.trim();
                            }
                        }

                        if (detailStringForSummary !== '') {
                            findingText += `: ${detailStringForSummary}`;
                        }
                        toothFindingsTexts.push(findingText);
                        
                        const isWisdomToothMissingFe = optionsKey === 'pathologischeZahnBefundeOptionen' && opt.value === 'fe' && ['18', '28', '38', '48'].includes(toothId);
                        if (!isWisdomToothMissingFe && (!opt.isDefault || (detailStringForSummary !== ''))) {
                            hasPathologicalFindingForTooth = true;
                        }
                    }
                });
            }

            if (hasAnyFindingForThisToothInThisSchemaContext) {
                const fullFindingTextForTooth = toothFindingsTexts.join(', ');
                const lineItem = `${getTextResource('zahnLabel', 'Zahn')} ${toothId}: ${fullFindingTextForTooth}`;
                if (hasPathologicalFindingForTooth) {
                    pathLines.push(lineItem);
                } else {
                    if (fullFindingTextForTooth === schemaPlaceholder) {
                        nonPathOpBIds.push(toothId);
                    } else {
                        nonPathOtherLines.push(lineItem);
                    }
                }
            } else if (optionsKey === 'pathologischeZahnBefundeOptionen' && window.includeNormalInSummary) {
                // If processing general pathological findings schema, and this tooth has no *checked* findings for *this* schema,
                // consider it for the opB list if it's not otherwise pathologically marked from *any* finding in this schema.
                // This ensures teeth not explicitly marked with a pathological finding (from this schema) are listed as opB.
                let isPathologicalFromThisSchema = false;
                 if (toothState && toothState.findings) {
                    for (const opt of schemaOptions) {
                        const findingData = toothState.findings[opt.value];
                        if (findingData && findingData.checked) {
                             const isWisdomToothMissingFe = optionsKey === 'pathologischeZahnBefundeOptionen' && opt.value === 'fe' && ['18', '28', '38', '48'].includes(toothId);
                             if (!isWisdomToothMissingFe && (!opt.isDefault || (findingData.details && findingData.details.trim() !== ''))) {
                                isPathologicalFromThisSchema = true;
                                break;
                            }
                        }
                    }
                 }
                if (!isPathologicalFromThisSchema) {
                    nonPathOpBIds.push(toothId);
                    hasAnyFindingInThisSchema = true; // To indicate that opB was derived from this schema processing
                }
            }
        });
    }
    
    let finalNonPathLines = [];
    if (nonPathOpBIds.length > 0) {
        finalNonPathLines.push(`\n#### Zahnstatus:`);
        finalNonPathLines.push(...consolidateOpBTeeth([...new Set(nonPathOpBIds)], schemaPlaceholder));
    }
    finalNonPathLines.push(...nonPathOtherLines);

    // Add section title for pathological findings if any
    if (pathLines.length > 0 && sectionTitleKey) {
        pathLines.unshift(`\n#### ${getTextResource(sectionTitleKey)}:`);
    }
    
    return {
        pathLines: pathLines,
        nonPathLines: finalNonPathLines,
        hasAnyFinding: hasAnyFindingInThisSchema // Useful to know if this schema contributed anything
    };
}

function updateBefundZusammenfassung() {
    console.log('[State] updateBefundZusammenfassung START. includeNormalInSummary:', window.includeNormalInSummary);
    const appConf = typeof getAppConfig === 'function' ? getAppConfig() : window.appConfig;
    if (!window.befundZusammenfassung || typeof controls !== 'object' || !appConf) {
        console.error("[State] updateBefundZusammenfassung: Kritische Abhängigkeiten nicht erfüllt.");
        if (window.befundZusammenfassung) window.befundZusammenfassung.value = "Fehler bei der Erstellung der Zusammenfassung.";
        return;
    }

    // Helper function to get text resource, returning default if not found
    const getTextResource = (key, defaultValue) => {
        if (window.localizedText && window.localizedText[key]) {
            return window.localizedText[key];
        }
        // console.warn(`[getTextResource] Key not found: ${key}, using default: ${defaultValue}`);
        return defaultValue;
    };
    
    // Helper function to get control value text (assuming it exists and is similar to original)
    // This is a placeholder, ensure getControlValueText is defined and works as expected
    const getControlValueText = (control) => {
        if (typeof window.getControlValueText === 'function') {
            return window.getControlValueText(control);
        }
        // Fallback or mock if actual function is not available in this scope
        console.warn("getControlValueText function is not available. Using placeholder logic.");
        if (control && control.value) {
            return { text: String(control.value), isPathological: false, isDefaultOrEmpty: String(control.value).trim() === "" };
        }
        if (control && control.element && control.element.value) {
             return { text: String(control.element.value), isPathological: false, isDefaultOrEmpty: String(control.element.value).trim() === "" };
        }
        return { text: "", isPathological: false, isDefaultOrEmpty: true };
    };

    // Helper function for display criteria (assuming it exists)
    const checkDisplayCriteria = (config, currentXRayType) => {
        if (typeof window.checkDisplayCriteria === 'function') {
            return window.checkDisplayCriteria(config, currentXRayType);
        }
        // Fallback: if no function, assume true
        return true;
    };
    
    // Helper to process inline schema findings (assuming it exists)
    const processInlineSchemaFindings = (optionsKey, legendKey, config, schemaState, ctrls) => {
        if (typeof window.processInlineSchemaFindings === 'function') {
            return window.processInlineSchemaFindings(optionsKey, legendKey, config, schemaState, ctrls);
        }
        console.warn("processInlineSchemaFindings function is not available. Returning empty results.");
        return { pathLines: [], nonPathLines: [] };
    };


    let markdownLines = [`# ${getTextResource('befundSectionLegend','Befund')}`, ""];

    markdownLines.push(`## ${getTextResource('untersuchungstypLabel','Art der Aufnahme')}`);
    const aufnahmeArtControl = controls['topLevelXRaySelector'];
    if (aufnahmeArtControl && aufnahmeArtControl.element) {
        const selectedOption = aufnahmeArtControl.element.options[aufnahmeArtControl.element.selectedIndex];
        markdownLines.push(`${selectedOption && selectedOption.text ? selectedOption.text.trim() : getTextResource('keine_angabe_aufnahmeart', '(Keine Angabe)')}`);
    } else {
        markdownLines.push(getTextResource('aufnahmeart_nicht_verfuegbar', "(Aufnahmeart nicht verfügbar)"));
    }
    markdownLines.push("");

    markdownLines.push(`## ${getTextResource('indikationSectionLegend','Indikation')}`);
    let indikationContentAdded = false;
    const indikationFreitextIds = ['indikation_freitext'];
    const indikationAuswahlIds = ['indikation_auswahl_multiselect'];

    indikationFreitextIds.forEach(id => {
        const control = controls[id];
        if (control && control.value && control.value.trim()) {
            const { text } = getControlValueText(control); // Assuming getControlValueText handles freitext correctly
            const labelText = control.config?.label ? getTextResource(control.config.label, control.config.label) : id;
            if (text) {
                // For Indikation, if label is not the main section title, prefix it. Otherwise, just text.
                if (labelText !== getTextResource('indikationSectionLegend','Indikation') && labelText !== id) {
                    markdownLines.push(`${labelText}: ${text.trim()}`);
                } else {
                    markdownLines.push(text.trim());
                }
                indikationContentAdded = true;
            }
        }
    });
    indikationAuswahlIds.forEach(id => {
        const control = controls[id];
        if (control) {
            const { text } = getControlValueText(control);
            let labelText = control.config?.label ? getTextResource(control.config.label, control.config.label) : '';
            const mainIndikationLegend = getTextResource('indikationSectionLegend', 'Indikation');

            if (text && text.trim() !== '' && text.trim() !== getTextResource('auswaehlen', '(Keine Auswahl)')) {
                if (!labelText || labelText === id || labelText === mainIndikationLegend) {
                    markdownLines.push(text.trim());
                } else {
                    markdownLines.push(`${labelText}: ${text.trim()}`);
                }
                indikationContentAdded = true;
            }
        }
    });
    if (!indikationContentAdded) { markdownLines.push(getTextResource('keine_spezifische_indikation', "(Keine spezifische Indikation)")); }
    markdownLines.push("");

    let globalNichtPathologischeBefunde = [];
    let globalPathologischeBefunde = [];
    let nonPathologicalToothSpecificFindings = [];

    const pathSchemaResults = processInlineSchemaFindings('pathologischeZahnBefundeOptionen', 'pathologicalFindingsSubSectionLegend', appConf, inlineZahnschemaState, controls);
    if (pathSchemaResults.pathLines.length > 0) {
        globalPathologischeBefunde.push(...pathSchemaResults.pathLines);
    }
    if (pathSchemaResults.nonPathLines.length > 0 && window.includeNormalInSummary) {
        nonPathologicalToothSpecificFindings.push(...pathSchemaResults.nonPathLines);
    }

    if (document.getElementById('implantatplanungs_container') && document.getElementById('implantatplanungs_container').offsetParent !== null) {
        const implantSchemaResults = processInlineSchemaFindings('implantatplanungsOptionen', null, appConf, inlineZahnschemaState, controls);
        if (implantSchemaResults.pathLines.length > 0) {
            markdownLines.push('## Implantatplanung:');
            markdownLines.push(...implantSchemaResults.pathLines);
            markdownLines.push('\n');
        }
        if (implantSchemaResults.nonPathLines.length > 0 && window.includeNormalInSummary) {
            markdownLines.push('## Implantatplanung:');
            markdownLines.push(...implantSchemaResults.pathLines);
            markdownLines.push('\n');
        }
    }

    const currentXRayType = controls['topLevelXRaySelector']?.element.value;
    const dentalFindingsSubSectionLegendKey = 'Zahnstatus & dentaler Befund';

    const processField = (fieldConf, targetNichtPath, targetPath) => {
        const controlId = fieldConf.id;
        const control = controls[controlId];

        const isExplicitlyHandled = controlId === 'topLevelXRaySelector' ||
            indikationFreitextIds.includes(controlId) ||
            indikationAuswahlIds.includes(controlId) ||
            controlId.startsWith('diagnose_') ||
            controlId.startsWith('empfehlung_') || // Adjusted to catch 'empfehlung_select' and 'empfehlung_text'
            controlId === 'gesamtbeurteilung_text' || // Keep for old compatibility if needed
            // controlId === 'empfehlung_text' || // Covered by startsWith now
            controlId === 'befundZusammenfassung' ||
            controlId === 'mySummaryTextarea' ||
            controlId === 'toggleNormalBefundeButton';
        if (isExplicitlyHandled) return;

        if (fieldConf.type === 'paired_multiselect_group') {
            // console.log(`[State] updateBefundZusammenfassung: Processing paired_multiselect_group - ID: ${fieldConf.id}, GroupLabel: ${fieldConf.groupLabel}`);
            if (fieldConf.leftConfig && fieldConf.rightConfig && fieldConf.groupLabel) {
                const linksControl = controls[fieldConf.leftConfig.id];
                const rechtsControl = controls[fieldConf.rightConfig.id];
                let groupItems = [];
                let isPairPathological = false;
                let pairHasContent = false;
                const groupLabelText = getTextResource(fieldConf.groupLabel, fieldConf.groupLabel);

                if (linksControl && linksControl.config) {
                    const { text: linksText, isPathological: linksPath, isDefaultOrEmpty: linksEmpty } = getControlValueText(linksControl);
                    const linksLabel = getTextResource(linksControl.config.label, 'Links');
                    if (linksText && linksText.trim() && (!linksEmpty || window.includeNormalInSummary || linksPath)) {
                        groupItems.push(`- **${linksLabel}:** ${linksText.trim()}`);
                        if (linksPath) isPairPathological = true;
                        pairHasContent = true;
                    }
                } else { /* console.warn */ }

                if (rechtsControl && rechtsControl.config) {
                    const { text: rechtsText, isPathological: rechtsPath, isDefaultOrEmpty: rechtsEmpty } = getControlValueText(rechtsControl);
                    const rechtsLabel = getTextResource(rechtsControl.config.label, 'Rechts');
                    if (rechtsText && rechtsText.trim() && (!rechtsEmpty || window.includeNormalInSummary || rechtsPath)) {
                        groupItems.push(`- **${rechtsLabel}:** ${rechtsText.trim()}`);
                        if (rechtsPath) isPairPathological = true;
                        pairHasContent = true;
                    }
                } else { /* console.warn */ }

                if (pairHasContent) {
                    const targetArray = isPairPathological ? targetPath : (window.includeNormalInSummary ? targetNichtPath : null);
                    if (targetArray) {
                        targetArray.push(`#### ${groupLabelText}:`);
                        targetArray.push(...groupItems);
                    }
                }
            } else { /* console.warn */ }
        } else { // Handles all other non-explicitly handled field types
            if (!control || !control.config || !control.type || control.type === 'inline_tooth_select') return;

            const { text, isPathological, isDefaultOrEmpty } = getControlValueText(control);
            const controlLabelText = control.config.label ? getTextResource(control.config.label, control.config.label) : controlId;
            
            if (text && text.trim() !== '' && text.trim() !== getTextResource('auswaehlen', '(Keine Auswahl)')) {
                const lineItemText = text.trim();
                let addThisItem = false;

                if (isPathological) {
                    addThisItem = true;
                } else if (window.includeNormalInSummary) {
                    if (!isDefaultOrEmpty || (isDefaultOrEmpty && lineItemText !== "" && lineItemText.toLowerCase() !== getTextResource('standardDefaultSuffix','standard').toLowerCase() && lineItemText.toLowerCase() !== '(standard)')) {
                        addThisItem = true;
                    }
                }

                if (addThisItem) {
                    const targetArray = isPathological ? targetPath : (window.includeNormalInSummary ? targetNichtPath : null);
                    if (targetArray) {
                        targetArray.push(`#### ${controlLabelText}:`);
                        targetArray.push(lineItemText);
                    }
                }
            }
        }
    };

    appConf.formSections.forEach(sectionConfig => {
        if (!checkDisplayCriteria(sectionConfig, currentXRayType)) return;

        let sectionNichtPathologische = [];
        let sectionPathologische = [];

        sectionConfig.fields?.forEach(fieldConf => processField(fieldConf, sectionNichtPathologische, sectionPathologische));

        sectionConfig.subSections?.forEach(subSectionConf => {
            if (!checkDisplayCriteria(subSectionConf, currentXRayType)) return;
            let subSectionNichtPathologischeLocal = [];
            let subSectionPathologischeLocal = [];

            const subLegendText = getTextResource(subSectionConf.legend, subSectionConf.legend || 'Unterabschnitt');

            subSectionConf.fields?.forEach(fieldConfSub => {
                processField(fieldConfSub, subSectionNichtPathologischeLocal, subSectionPathologischeLocal);
            });

            if (subSectionConf.legend === dentalFindingsSubSectionLegendKey && nonPathologicalToothSpecificFindings.length > 0 && window.includeNormalInSummary) {
                subSectionNichtPathologischeLocal.push(...nonPathologicalToothSpecificFindings);
                nonPathologicalToothSpecificFindings = []; // Clear after adding
            }

            if (subSectionPathologischeLocal.length > 0) {
                sectionPathologische.push(`### ${subLegendText}`); // Changed from ** to ###
                sectionPathologische.push(...subSectionPathologischeLocal); // Removed indent map
            }
            if (window.includeNormalInSummary && subSectionNichtPathologischeLocal.length > 0) {
                sectionNichtPathologische.push(`### ${subLegendText}`); // Changed from ** to ###
                sectionNichtPathologische.push(...subSectionNichtPathologischeLocal); // Removed indent map
            }
        });

        const legendText = getTextResource(sectionConfig.legend, sectionConfig.legend || 'Abschnitt');
        const isGenericBefundLegend = legendText === getTextResource('befundSectionLegend', 'Befund');
        
        if (sectionPathologische.length > 0) {
            const containsSubHeaders = sectionPathologische.length > 0 && sectionPathologische[0].trim().startsWith('###');
            if (!isGenericBefundLegend || !containsSubHeaders || (sectionConfig.fields && sectionConfig.fields.length > 0 && sectionPathologische.some(line => !line.trim().startsWith('###'))) ) {
                 globalPathologischeBefunde.push(`\n### ${legendText}`); // Changed from ** to ###
            }
            globalPathologischeBefunde.push(...sectionPathologische);
        }
        if (window.includeNormalInSummary && sectionNichtPathologische.length > 0) {
            const containsSubHeaders = sectionNichtPathologische.length > 0 && sectionNichtPathologische[0].trim().startsWith('###');
             if (!isGenericBefundLegend || !containsSubHeaders || (sectionConfig.fields && sectionConfig.fields.length > 0 && sectionNichtPathologische.some(line => !line.trim().startsWith('###'))) ) {
                globalNichtPathologischeBefunde.push(`\n### ${legendText}`); // Changed from ** to ###
            }
            globalNichtPathologischeBefunde.push(...sectionNichtPathologische);
        }
    });

    if (nonPathologicalToothSpecificFindings.length > 0 && window.includeNormalInSummary) {
        globalNichtPathologischeBefunde.push(`\n### ${getTextResource('allgemeineZahnbefundeLegend', 'Allgemeine Zahnbefunde')}`);
        globalNichtPathologischeBefunde.push(...nonPathologicalToothSpecificFindings);
    }

    if (window.includeNormalInSummary && globalNichtPathologischeBefunde.length > 0) {
        markdownLines.push(`## ${getTextResource('nichtPathologischeBefundeSectionLegend','Nicht pathologische Befunde')}`);
        markdownLines.push(...globalNichtPathologischeBefunde.filter(l => l.trim() !== "").map(l => l.startsWith("\n###") ? l.substring(1) : l));
        markdownLines.push("");
    }

    if (globalPathologischeBefunde.length > 0) {
        markdownLines.push(`## ${getTextResource('pathologischeBefundeSectionLegend','Pathologische Befunde')}`);
        markdownLines.push(...globalPathologischeBefunde.filter(l => l.trim() !== "").map(l => l.startsWith("\n###") ? l.substring(1) : l));
        markdownLines.push("");
    } else if (!window.includeNormalInSummary && globalPathologischeBefunde.length === 0) {
        markdownLines.push(`## ${getTextResource('pathologischeBefundeSectionLegend','Pathologische Befunde')}`);
        markdownLines.push(getTextResource('keineSpezifischenPathBefundeAusgewaehlt', "Keine spezifischen pathologischen Befunde ausgewählt."));
        markdownLines.push("");
    }

    markdownLines.push(`## ${getTextResource('assessmentSectionLegendGesamtbeurteilung','Beurteilung')}`);
    let beurteilungContentAdded = false;

    Object.entries(controls).forEach(([controlId, control]) => {
        if (control.element && control.element.offsetParent !== null && control.config && controlId.startsWith('diagnose_')) {
            const selectedOption = control.element.options[control.element.selectedIndex];
            if (selectedOption) {
                let textFromOption = selectedOption.text ? selectedOption.text.trim() : "";
                let finalDisplayValue = textFromOption;
                const genericPlaceholders = [
                    getTextResource('auswaehlen', '(Keine Auswahl)').toLowerCase(),
                    "(bitte auswählen)".toLowerCase(), "bitte auswählen".toLowerCase(), ""
                ];
                if (genericPlaceholders.includes(finalDisplayValue.toLowerCase())) {
                    finalDisplayValue = "";
                }
                if (selectedOption.dataset.needsDetails === 'true' && control.detailsValue && control.detailsValue.trim() !== '') {
                    const valueDetails = getControlValueText(control);
                    if (valueDetails.text && valueDetails.text.trim() !== "" && !genericPlaceholders.includes(valueDetails.text.trim().toLowerCase())) {
                        finalDisplayValue = valueDetails.text.trim();
                    } else if (finalDisplayValue === "" && valueDetails.text && !genericPlaceholders.includes(valueDetails.text.trim().toLowerCase())) {
                        finalDisplayValue = valueDetails.text.trim();
                    }
                }
                if (finalDisplayValue) {
                    markdownLines.push(finalDisplayValue); // Removed leading space
                    beurteilungContentAdded = true;
                }
            }
        } else if (control.element && control.element.offsetParent !== null && control.config && control.config.configKey === 'gesamtbeurteilung_text') {
            const valueDetails = getControlValueText(control);
            const text = valueDetails.text;
            // const labelText = control.config?.label ? getTextResource(control.config.label, control.config.label) : (control.id ? control.id.replace(/_select|_textarea/g, '') : 'Gesamtbeurteilung');
            if (text && text.trim() !== '') {
                // For direct text under "Beurteilung", just push the text.
                markdownLines.push(text.trim());
                beurteilungContentAdded = true;
            }
        }
    });
    if (!beurteilungContentAdded) {
        markdownLines.push(getTextResource('keineSpezifischeBeurteilung', "(Keine spezifische Beurteilung)"));
    }
    markdownLines.push("");

    markdownLines.push(`## ${getTextResource('assessmentSectionLegendEmpfehlung','Empfehlung')}`);
    let empfehlungContentAdded = false;

    Object.entries(controls).forEach(([controlId, control]) => {
        if (control.element && control.element.offsetParent !== null && control.config && controlId === 'empfehlung_select') {
            const selectedOption = control.element.options[control.element.selectedIndex];
            if (selectedOption) {
                let textFromOption = selectedOption.text ? selectedOption.text.trim() : "";
                let finalDisplayValue = textFromOption;
                const genericPlaceholders = [
                    getTextResource('auswaehlen', '(Keine Auswahl)').toLowerCase(),
                    "(bitte auswählen)".toLowerCase(), "bitte auswählen".toLowerCase(), ""
                ];
                if (genericPlaceholders.includes(finalDisplayValue.toLowerCase())) {
                    finalDisplayValue = "";
                }
                if (selectedOption.dataset.needsDetails === 'true' && control.detailsValue && control.detailsValue.trim() !== '') {
                    const valueDetails = getControlValueText(control);
                    if (valueDetails.text && valueDetails.text.trim() !== "" && !genericPlaceholders.includes(valueDetails.text.trim().toLowerCase())) {
                        finalDisplayValue = valueDetails.text.trim();
                    } else if (finalDisplayValue === "" && valueDetails.text && !genericPlaceholders.includes(valueDetails.text.trim().toLowerCase())) {
                        finalDisplayValue = valueDetails.text.trim();
                    }
                }
                if (finalDisplayValue) {
                    markdownLines.push(finalDisplayValue); // Removed leading space
                    empfehlungContentAdded = true;
                }
            }
        } else if (control.element && control.element.offsetParent !== null && control.config && control.config.configKey === 'empfehlung_text') {
            const valueDetails = getControlValueText(control);
            const text = valueDetails.text;
            // const labelText = control.config?.label ? getTextResource(control.config.label, control.config.label) : (control.id ? control.id.replace(/_select|_textarea/g, '') : 'Empfehlung Freitext');
            if (text && text.trim() !== '') {
                 // For direct text under "Empfehlung", just push the text.
                markdownLines.push(text.trim());
                empfehlungContentAdded = true;
            }
        }
    });
    if (!empfehlungContentAdded) {
        markdownLines.push(getTextResource('keineSpezifischeEmpfehlung', "(Keine spezifische Empfehlung)"));
    }

    let finalSummary = markdownLines.join('\n').replace(/\n\n\n+/g, '\n\n').trim();
    window.befundZusammenfassung.value = finalSummary;
    if (typeof adjustTextareaHeight === 'function') { // Check if function exists
        adjustTextareaHeight(window.befundZusammenfassung);
    }
    console.log('[State] updateBefundZusammenfassung END.');
}
