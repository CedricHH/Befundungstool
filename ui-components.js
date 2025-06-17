// ============== ui-components.js ==============
// V5 UPDATE: Lokale getTextResource entfernt, um globale Funktion aus config-loader.js zu nutzen.
//            Verwendung von getTextResource für Zahnschema-Titel angepasst.
// ========================================================================

// Globale Variable, die in zahnschema-module.js verwendet und hier potenziell gesetzt wird.
let currentZahnschemaOptionValueTarget = null;

// Die lokale getTextResource Funktion wird entfernt.
// Es wird davon ausgegangen, dass eine globale Funktion getTextResource
// (aus config-loader.js) verfügbar ist und korrekt funktioniert
// (d.h. sie kann direkte Strings oder Schlüssel aus appConfig.general.textResources auflösen).

function createSelect(id, config) {
    if (!id || !config || !config.options || !Array.isArray(config.options)) {
        console.error(`[UI] Ungültige Konfiguration für Select ID "${id}". Benötigt 'id', 'config' und 'config.options' (Array).`, config);
        return null;
    }

    const container = document.createElement('div');
    container.classList.add('input-group');

    const label = document.createElement('label');
    label.htmlFor = id;
    // config.label ist jetzt der direkte Text oder ein Schlüssel für globale Texte.
    // getTextResource(config.label, config.label) stellt sicher, dass es korrekt behandelt wird.
    label.textContent = getTextResource(config.label, config.label);
    label.classList.add('control-label');
    container.appendChild(label);

    const select = document.createElement('select');
    select.id = id;
    select.name = id;
    // config.prefix ist direkter Text oder Schlüssel.
    const prefixText = getTextResource(config.prefix, config.prefix);
    select.dataset.prefix = prefixText || (config.label ? getTextResource(config.label, config.label) + ': ' : '');
    select.dataset.isFormControl = 'true';
    select.dataset.configKey = config.configKey || id;

    if (typeof controls !== 'object' || controls === null) {
        console.error(`[UI] createSelect: Das globale 'controls'-Objekt ist nicht verfügbar oder nicht korrekt initialisiert für ID "${id}".`);
    } else {
         controls[id] = {
            element: select,
            config: config,
            type: 'select',
            value: config.options.find(opt => opt.isDefault)?.value || config.options[0]?.value || '',
            detailsValue: ''
        };
    }

    config.options.forEach((opt, index) => {
        const option = document.createElement('option');
        option.value = opt.value;
        // opt.text ist direkter Text oder Schlüssel.
        option.textContent = getTextResource(opt.text, opt.text);
        option.dataset.isDefault = opt.isDefault || false;
        option.dataset.optionIndex = index; // Für Bearbeitungsmodus relevant
        if (controls && controls[id] && opt.isDefault) {
            option.selected = true;
            if(controls[id]) controls[id].value = opt.value;
        }
        if (opt.needsDetails) {
            option.dataset.needsDetails = 'true';
        }
        select.appendChild(option);
    });
    container.appendChild(select);

    // Die Logik für "Add Option Button" bleibt für den Bearbeitungsmodus erhalten, falls dieser später wieder aktiviert wird.
    const addOptionBtn = document.createElement('button');
    addOptionBtn.type = 'button';
    addOptionBtn.textContent = '+ Option';
    addOptionBtn.classList.add('add-option-to-select-btn', 'text-xs', 'ml-2');
    addOptionBtn.style.display = 'none'; // Standardmäßig ausgeblendet
    addOptionBtn.dataset.targetSelectId = id;
    // Der optionsPath muss ggf. angepasst werden, wenn die Konfigurationsstruktur sich ändert
    addOptionBtn.dataset.optionsPath = `dynamicElementOptions.${select.dataset.configKey}.options`; // Beispielpfad
    container.appendChild(addOptionBtn);


    let detailsInput = null;

    if (config.options.some(opt => opt.needsDetails)) {
        detailsInput = document.createElement('input');
        detailsInput.type = 'text';
        detailsInput.id = id + '_details';
        detailsInput.name = id + '_details';
        // config.placeholderDetails ist direkter Text oder Schlüssel.
        detailsInput.placeholder = getTextResource(config.placeholderDetails, (config.placeholder || 'Details...'));
        detailsInput.classList.add('hidden-field', 'mt-2', 'w-full', 'p-2', 'border', 'border-gray-300', 'rounded-md'); // Tailwind-Klassen hinzugefügt
        container.appendChild(detailsInput);

        select.addEventListener('change', (e) => {
            const selectedOpt = e.target.options[e.target.selectedIndex];
            const needsDetails = selectedOpt.dataset.needsDetails === 'true';

            if (detailsInput) {
                detailsInput.style.display = needsDetails ? 'block' : 'none';
                if (needsDetails) {
                    const optionConfig = config.options.find(o => o.value === selectedOpt.value);
                    // optionConfig.placeholderDetails ist direkter Text oder Schlüssel.
                    detailsInput.placeholder = getTextResource(optionConfig?.placeholderDetails, (config.placeholderDetails || 'Details...'));
                }
                if (!needsDetails) detailsInput.value = '';
            }

            if (controls && controls[id]) {
                controls[id].value = e.target.value;
                if (detailsInput) {
                     controls[id].detailsValue = detailsInput.value;
                } else {
                    controls[id].detailsValue = '';
                }
            }
            updateBefundZusammenfassung();
            if (typeof window.updateDependentFieldVisibility === 'function') {
                window.updateDependentFieldVisibility(id);
            }
        });

        if (detailsInput) {
            detailsInput.addEventListener('input', (e) => {
                if (controls && controls[id]) {
                    controls[id].detailsValue = e.target.value;
                }
                updateBefundZusammenfassung();
            });
        }

        // Initialen Zustand für DetailsInput setzen
        const initialSelectedOpt = select.options[select.selectedIndex];
        if (detailsInput && initialSelectedOpt && initialSelectedOpt.dataset.needsDetails === 'true') {
            detailsInput.style.display = 'block';
            const initialOptionConfig = config.options.find(o => o.value === initialSelectedOpt.value);
            // initialOptionConfig.placeholderDetails ist direkter Text oder Schlüssel.
            detailsInput.placeholder = getTextResource(initialOptionConfig?.placeholderDetails, (config.placeholderDetails || 'Details...'));
        }
    } else {
        select.addEventListener('change', (e) => {
            if (controls && controls[id]) {
                controls[id].value = e.target.value;
                controls[id].detailsValue = ''; // Keine Details benötigt
            }
            updateBefundZusammenfassung();
            if (typeof window.updateDependentFieldVisibility === 'function') {
                window.updateDependentFieldVisibility(id);
            }
        });
    }
    return container;
}


function updateMultiSelectButtonText(id) {
    const control = controls[id];
    if (!control || !control.button) {
        // console.warn(`[UI] updateMultiSelectButtonText: Control oder Button für ID '${id}' nicht gefunden.`);
        return;
    }
    if (control.type && control.type !== 'multiselect' && control.type !== 'multiselect_inline_tooth' && control.type !== 'dynamic_retention_multiselect') {
        // console.warn(`[UI] updateMultiSelectButtonText: Falscher Kontrolltyp '${control.type}' für ID '${id}'.`);
        return;
    }

    const selectedTexts = [];
    const valueSource = control.value || {};

    Object.entries(valueSource).forEach(([key, valData]) => {
        if (valData && valData.checked) {
            // valData.text ist direkter Text oder Schlüssel.
            let textToPush = getTextResource(valData.text, valData.text);
            if (!textToPush && control.config && control.config.options) {
                 const optionConfig = control.config.options.find(opt => opt.value === key);
                 if(optionConfig) textToPush = getTextResource(optionConfig.text, optionConfig.text);
            }

            if (textToPush) {
                if (control.type === 'multiselect_inline_tooth') {
                    if (key !== 'fe') { // "fehlend" nicht im Button anzeigen
                        selectedTexts.push(textToPush);
                    }
                } else if (control.type === 'multiselect' || control.type === 'dynamic_retention_multiselect') {
                    selectedTexts.push(textToPush);
                }
            }
        }
    });

    const appConf = typeof getAppConfig === 'function' ? getAppConfig() : window.appConfig;
    const buttonTextConfig = control.config?.buttonTextConfig || {};
    // buttonTextConfig.placeholder ist direkter Text oder Schlüssel.
    let placeholder = getTextResource(buttonTextConfig.placeholder, 'Auswählen...');

    if (control.type === 'multiselect_inline_tooth') {
        // Spezifischer Placeholder für Inline-Zahnschema-Multiselects
        const inlinePlaceholderKey = control.config.optionsKeyForContext ? `${control.config.optionsKeyForContext}.placeholder` : null;
        const specificPlaceholder = inlinePlaceholderKey ? getDynamicElementOptions(control.config.optionsKeyForContext)?.placeholder : null;
        placeholder = getTextResource(specificPlaceholder, getTextResource(appConf?.general?.opbPlaceholderText, 'opB'));
    }


    const maxItems = buttonTextConfig.maxItemsToShow || (control.type === 'multiselect_inline_tooth' ? 1 : 2);

    let textWrapper = control.button.querySelector('.multi-select-button-text-wrapper');
    if (!textWrapper) { // Fallback, falls der Wrapper nicht existiert
        control.button.innerHTML = ''; // Inhalt leeren, um Duplikate zu vermeiden
        textWrapper = document.createElement('span');
        textWrapper.className = 'multi-select-button-text-wrapper';
        control.button.appendChild(textWrapper);
    }


    if (selectedTexts.length === 0) {
        textWrapper.textContent = placeholder;
    } else if (selectedTexts.length <= maxItems) {
        textWrapper.textContent = selectedTexts.join(', ');
    } else {
         const countText = control.type === 'multiselect_inline_tooth' ? 'Befunde' : 'Elemente';
        textWrapper.textContent = `${selectedTexts.length} ${countText}`;
    }
}


function createMultiSelect(id, config) {
    if (!id || !config || !config.options || !Array.isArray(config.options)) {
        console.error(`[UI] Ungültige Konfiguration für MultiSelect ID "${id}".`, config);
        return null;
    }

    let container;
    if (config.containerElement && config.containerElement instanceof HTMLElement) {
        container = config.containerElement;
    } else if (config.containerId) { // Für den Fall, dass eine ID übergeben wird
        container = document.getElementById(config.containerId);
    }


    if (!container) {
        // Wenn kein Container übergeben oder gefunden wurde, erstelle einen neuen.
        // Dies ist nützlich, wenn createMultiSelect direkt aufgerufen wird, ohne dass der Host schon existiert.
        container = document.createElement('div');
        // Es ist wichtig, dass dieser Container später dem DOM hinzugefügt wird.
        // console.warn(`[UI] MultiSelect-Zielcontainer für ID '${id}' nicht explizit übergeben. Erstelle neuen div-Container.`);
    }

    container.innerHTML = ''; // Inhalt leeren, um Duplikate zu vermeiden
    if (config.typ !== 'multiselect_inline_tooth' && !container.classList.contains('multi-select-container')) {
        container.classList.add('multi-select-container');
    }
    // Label nur hinzufügen, wenn es konfiguriert ist und nicht für Inline-Zahnschema-Typen
    if (config.label && config.typ !== 'multiselect_inline_tooth' && config.typ !== 'dynamic_retention_multiselect') {
         const labelEl = document.createElement('label');
         // config.label ist direkter Text oder Schlüssel.
         labelEl.textContent = getTextResource(config.label, config.label) + ':';
         labelEl.classList.add('control-label', 'block', 'mb-1'); // Tailwind-Klassen für Styling
         labelEl.htmlFor = id + '_button';
         container.insertBefore(labelEl, container.firstChild); // Label vor dem Button einfügen
    }


    const selectButton = document.createElement('button');
    selectButton.type = 'button';
    selectButton.id = id + '_button';
    selectButton.classList.add('multi-select-button'); // Styling via CSS
    // Initialisiere mit einem Text-Wrapper für korrekten Overflow
    const textWrapper = document.createElement('span');
    textWrapper.className = 'multi-select-button-text-wrapper';
    selectButton.appendChild(textWrapper);
    container.appendChild(selectButton);


    const optionsDiv = document.createElement('div');
    optionsDiv.id = id + '_options';
    optionsDiv.classList.add('multi-select-options'); // Styling via CSS
    // Der optionsPath muss ggf. angepasst werden, wenn die Konfigurationsstruktur sich ändert
    const fieldDefinitionKey = config.configKey || id;
    optionsDiv.dataset.optionsPath = config.optionsKey ? `dynamicElementOptions.${config.optionsKey}` : `dynamicElementOptions.${fieldDefinitionKey}.options`; // Beispielpfad
    container.appendChild(optionsDiv);

    if (typeof controls !== 'object' || controls === null) {
        console.error(`[UI] createMultiSelect: Das globale 'controls'-Objekt ist nicht verfügbar oder nicht korrekt initialisiert für ID "${id}".`);
    } else {
        controls[id] = {
            element: container, // Das Hauptcontainer-Element des Multiselects
            button: selectButton,
            optionsDiv: optionsDiv,
            config: config,
            type: config.typ || 'multiselect', // Standardtyp, falls nicht anders angegeben
            value: {} // Wird mit den Zuständen der Optionen befüllt
        };
    }

    const initialState = config.initialState || {};

    config.options.forEach((opt, index) => {
        const optionContainer = document.createElement('div');
        optionContainer.classList.add('multiselect-option-item', 'p-1'); // Tailwind-Klassen
        optionContainer.dataset.optionValue = opt.value;
        optionContainer.dataset.optionIndex = index; // Für Bearbeitungsmodus

        const optionLabel = document.createElement('label');
        optionLabel.classList.add('flex', 'items-center', 'space-x-2', 'cursor-pointer', 'p-1', 'hover:bg-gray-100', 'rounded'); // Tailwind
        optionLabel.addEventListener('click', (e) => {
            e.stopPropagation(); // Verhindert, dass das Dropdown sofort schließt
        });

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = opt.value;
        checkbox.id = `${id}_${opt.value}`;
        // opt.text ist direkter Text oder Schlüssel.
        checkbox.dataset.optionText = getTextResource(opt.text, opt.text);
        checkbox.dataset.isDefault = opt.isDefault || false;
        checkbox.classList.add('form-checkbox', 'h-4', 'w-4', 'text-blue-600', 'border-gray-300', 'rounded', 'focus:ring-blue-500'); // Tailwind

        const initialOptState = initialState[opt.value];
        checkbox.checked = initialOptState ? initialOptState.checked : (opt.isDefault || false);


        const labelText = document.createElement('span');
        // opt.text ist direkter Text oder Schlüssel.
        labelText.textContent = getTextResource(opt.text, opt.text);
        labelText.classList.add('multiselect-option-label-text', 'text-sm', 'text-gray-700'); // Tailwind
        labelText.dataset.optionValue = opt.value;
        labelText.dataset.optionIndex = index;

        optionLabel.appendChild(checkbox);
        optionLabel.appendChild(labelText);
        optionContainer.appendChild(optionLabel);

        if (controls && controls[id]) {
            controls[id].value[opt.value] = {
                checked: checkbox.checked,
                text: getTextResource(opt.text, opt.text),
                isDefault: opt.isDefault || false,
                // Details-Struktur basierend auf opt.detailsType initialisieren
                details: (() => {
                    const existingDetails = initialOptState?.details;
                    if (opt.detailsType === 'select') {
                        return { selectValue: existingDetails?.selectValue || '', additionalText: existingDetails?.additionalText || '' };
                    } else if (opt.detailsType === 'multiselect') {
                        // Ensure multiselectValue is properly initialized from existingDetails if present
                        return {
                            multiselectValue: (existingDetails && typeof existingDetails.multiselectValue === 'object') ? { ...existingDetails.multiselectValue } : {},
                            additionalText: existingDetails?.additionalText || ''
                        };
                    }
                    return existingDetails || ''; // Für Zahnschema oder Standard-Text
                })()
            };
        }

        // Hilfsfunktion zum Erstellen des zusätzlichen Texteingabefeldes
        const createAdditionalTextInput = (parentOptValue, currentAdditionalText) => {
            const additionalInput = document.createElement('input');
            additionalInput.type = 'text';
            additionalInput.id = `${id}_${parentOptValue}_details_additional_text`;
            additionalInput.placeholder = getTextResource(opt.placeholderDetails, 'Weitere Details...'); // Placeholder für das zusätzliche Feld
            additionalInput.classList.add('sonstiges-input', 'w-full', 'mt-2', 'border', 'border-gray-300', 'rounded-md', 'p-1', 'text-sm'); // Tailwind, mt-2 für Abstand
            additionalInput.value = currentAdditionalText || '';

            additionalInput.addEventListener('input', (e_add_text) => {
                if (controls[id]?.value[parentOptValue]?.details && typeof controls[id].value[parentOptValue].details === 'object') {
                    controls[id].value[parentOptValue].details.additionalText = e_add_text.target.value;
                }
                updateBefundZusammenfassung();
            });
            additionalInput.addEventListener('click', (e_add_text_click) => e_add_text_click.stopPropagation());
            return additionalInput;
        };

        let detailsControlHost = null; // Can be an input, select container, or multiselect host
        let detailsWrapper = null;

        if (opt.needsDetails) {
            detailsWrapper = document.createElement('div');
            detailsWrapper.id = `${id}_${opt.value}_details_wrapper`;
            detailsWrapper.classList.add('details-wrapper', 'ml-6', 'mt-1');
            detailsWrapper.style.display = checkbox.checked ? 'flex' : 'none'; // flex für nebeneinander, falls gewünscht, oder block
            detailsWrapper.style.flexDirection = 'column'; // Untereinander für Select/Multiselect und zusätzliches Textfeld

            // Verhindert, dass Klicks innerhalb des Details-Wrappers das Parent-Dropdown schließen
            detailsWrapper.addEventListener('click', (e_details_wrapper_click) => {
                e_details_wrapper_click.stopPropagation();
            });


            // Generalized handling for options requiring a Zahnschema input
            if (opt.detailsType === 'zahnschema') {
                const zahnschemaDetailInput = document.createElement('input');
                zahnschemaDetailInput.type = 'text';
                zahnschemaDetailInput.id = `${id}_${opt.value}_details`; // Keep ID for existing logic
                zahnschemaDetailInput.readOnly = true;
                // opt.placeholderDetails ist direkter Text oder Schlüssel.
                zahnschemaDetailInput.placeholder = getTextResource(opt.placeholderDetails, 'Zahnauswahl (Schema)...');
                zahnschemaDetailInput.classList.add('sonstiges-input', 'w-auto', 'inline-block', 'mr-2', 'p-1', 'border', 'rounded-sm', 'text-xs', 'cursor-pointer'); // Tailwind, cursor-pointer hinzugefügt
                zahnschemaDetailInput.value = controls[id]?.value[opt.value]?.details || '';
                
                // Event-Listener zum Öffnen des Zahnschemas bei Klick auf das Input-Feld hinzufügen
                zahnschemaDetailInput.onclick = (e) => {
                    e.stopPropagation(); // Verhindert, dass das Dropdown schließt, falls der Klick durchgeht
                    currentZahnschemaOptionValueTarget = opt.value;
                    const zahnschemaModalTitle = `${getTextResource('zahnschemaModalTitlePrefix', 'Zahnschema für')}: ${getTextResource(opt.text, opt.text)}`;
                    openZahnschema(id, zahnschemaModalTitle);
                };


                const schemaOeffnenButton = document.createElement('button');
                schemaOeffnenButton.type = 'button';
                schemaOeffnenButton.textContent = 'Zahnschema';
                schemaOeffnenButton.classList.add('text-blue-600', 'hover:underline', 'text-xs', 'bg-transparent', 'border-none', 'p-0', 'inline-block');
                schemaOeffnenButton.onclick = (e) => {
                    e.stopPropagation();
                    currentZahnschemaOptionValueTarget = opt.value;
                    // Generic title for the Zahnschema modal
                    const zahnschemaTitle = `${getTextResource('zahnschemaModalTitlePrefix', 'Zahnschema für')}: ${getTextResource(opt.text, opt.text)}`;
                    openZahnschema(id, zahnschemaTitle);
                };
                detailsWrapper.appendChild(zahnschemaDetailInput);
                detailsWrapper.appendChild(schemaOeffnenButton);
                detailsControlHost = zahnschemaDetailInput; // Reference for later
                // Kein zusätzliches Textfeld für Zahnschema, es sei denn, es wird explizit benötigt.
            } else if (opt.detailsType === 'select') {
                const nestedSelectId = `${id}_${opt.value}_details_select`;
                const nestedSelectOptions = getDynamicElementOptions(opt.optionsKey) || [];
                const nestedSelectConfig = {
                    label: '', // No explicit label for the nested control itself
                    options: nestedSelectOptions,
                    configKey: opt.optionsKey // For consistency, though options are passed directly
                };
                const selectElementContainer = createSelect(nestedSelectId, nestedSelectConfig);
                if (selectElementContainer) {
                    detailsWrapper.appendChild(selectElementContainer);
                    detailsControlHost = selectElementContainer.querySelector('select'); // The actual select element
                    
                    // Verhindert, dass das Klicken auf das verschachtelte Select das Parent-Multiselect schließt
                    if (detailsControlHost) {
                        detailsControlHost.addEventListener('click', (e_nested_select_click) => {
                            e_nested_select_click.stopPropagation();
                        });
                    }

                    const nestedSelectControl = controls[nestedSelectId];
                    if (nestedSelectControl && nestedSelectControl.element) {
                        // Initialize parent's detail from nested select's initial value or existing parent detail
                        const parentDetailObject = controls[id]?.value[opt.value]?.details;
                        if (parentDetailObject && typeof parentDetailObject === 'object') {
                            if (typeof parentDetailObject.selectValue === 'string' && parentDetailObject.selectValue !== '') {
                                nestedSelectControl.element.value = parentDetailObject.selectValue;
                                if (nestedSelectControl.element.value !== parentDetailObject.selectValue) { // Value might not exist
                                    nestedSelectControl.element.selectedIndex = 0; // Fallback
                                }
                                nestedSelectControl.value = nestedSelectControl.element.value;
                            } else { // Initialize parent's detail from nested select's current (default) value
                                parentDetailObject.selectValue = nestedSelectControl.value;
                            }
                        }
                        // Event listener for the nested select
                        nestedSelectControl.element.addEventListener('change', (e_nested) => {
                            const currentParentDetailObject = controls[id]?.value[opt.value]?.details;
                            if (currentParentDetailObject && typeof currentParentDetailObject === 'object') {
                                currentParentDetailObject.selectValue = e_nested.target.value;
                            }
                            updateBefundZusammenfassung();
                        });
                    }
                    // Add additional text input
                    const currentAdditionalText = controls[id]?.value[opt.value]?.details?.additionalText || '';
                    const additionalTextInput = createAdditionalTextInput(opt.value, currentAdditionalText);
                    detailsWrapper.appendChild(additionalTextInput);

                } else {
                    detailsWrapper.textContent = `Fehler: Detail-Select für ${opt.optionsKey} nicht geladen.`;
                }

            } else if (opt.detailsType === 'multiselect') {
                const nestedMultiSelectId = `${id}_${opt.value}_details_multiselect`;
                let nestedMultiSelectOptions;
                let nestedPlaceholder = opt.buttonTextConfig?.placeholder || // Veraltet, da buttonTextConfig auf der Ebene von _dynamicOptions sein sollte
                                        (opt._dynamicOptions?.buttonTextConfig?.placeholder) ||
                                        'Details auswählen...';

                if (opt._dynamicOptions && Array.isArray(opt._dynamicOptions.items)) { // Prüfe auf vor-transformierte Optionen
                    nestedMultiSelectOptions = opt._dynamicOptions.items;
                    if(opt._dynamicOptions.placeholder) nestedPlaceholder = getTextResource(opt._dynamicOptions.placeholder, opt._dynamicOptions.placeholder);
                } else {
                    nestedMultiSelectOptions = getDynamicElementOptions(opt.optionsKey) || [];
                }
                const nestedMultiSelectHostDiv = document.createElement('div');
                nestedMultiSelectHostDiv.id = nestedMultiSelectId + "_host";

                const initialNestedMsState = (controls[id]?.value[opt.value]?.details && typeof controls[id].value[opt.value].details === 'object')
                                            ? controls[id].value[opt.value].details.multiselectValue
                                            : {}; // Nur der multiselectValue Teil

                const nestedMultiSelectConfig = {
                    label: '',
                    options: nestedMultiSelectOptions,
                    containerElement: nestedMultiSelectHostDiv,
                    buttonTextConfig: opt.buttonTextConfig || { placeholder: 'Details auswählen...' },
                    typ: 'multiselect', // Standard multiselect type
                    optionsKey: opt.optionsKey,
                    initialState: initialNestedMsState
                };
                createMultiSelect(nestedMultiSelectId, nestedMultiSelectConfig); // Recursive call
                detailsWrapper.appendChild(nestedMultiSelectHostDiv);
                detailsControlHost = nestedMultiSelectHostDiv; // The host div

                const nestedMsControl = controls[nestedMultiSelectId];
                const parentDetailObjectForMs = controls[id]?.value[opt.value]?.details;
                if (parentDetailObjectForMs && typeof parentDetailObjectForMs === 'object' && nestedMsControl) {
                    // Link parent's detail to the nested multiselect's value object
                    parentDetailObjectForMs.multiselectValue = nestedMsControl.value;

                    // Verhindert, dass das Klicken auf den Button des verschachtelten Multiselects
                    // das Parent-Multiselect schließt
                    if (nestedMsControl.button) {
                        nestedMsControl.button.addEventListener('click', (e_nested_ms_button_click) => {
                            e_nested_ms_button_click.stopPropagation();
                        });
                    }
                }

                // Add additional text input
                const currentAdditionalTextMs = controls[id]?.value[opt.value]?.details?.additionalText || '';
                const additionalTextInputMs = createAdditionalTextInput(opt.value, currentAdditionalTextMs);
                detailsWrapper.appendChild(additionalTextInputMs);

            } else { // Standard-Details-Input
                const textDetailsInput = document.createElement('input');
                textDetailsInput.type = 'text';
                textDetailsInput.id = `${id}_${opt.value}_details`; // Keep ID for existing logic
                // opt.placeholderDetails oder opt.placeholder ist direkter Text oder Schlüssel.
                textDetailsInput.placeholder = getTextResource(opt.placeholderDetails, (opt.placeholder || 'Details...'));
                textDetailsInput.classList.add('sonstiges-input', 'w-full', 'mt-1', 'border', 'border-gray-300', 'rounded-md', 'p-1', 'text-sm'); // Tailwind
                if (controls && controls[id] && controls[id].value[opt.value]) {
                     textDetailsInput.value = (typeof controls[id].value[opt.value].details === 'string') ? controls[id].value[opt.value].details : '';
                }
                detailsWrapper.appendChild(textDetailsInput);
                detailsControlHost = textDetailsInput;

                textDetailsInput.addEventListener('input', (e) => {
                    if (controls && controls[id] && controls[id].value[opt.value]) {
                        controls[id].value[opt.value].details = e.target.value;
                        const controlType = controls[id].type;
                        if (controlType === 'multiselect_inline_tooth') {
                            const toothIdStrMatch = id.match(/_tooth_(\d+)_findings_/);
                            if (toothIdStrMatch && toothIdStrMatch[1]) {
                                const toothIdStr = toothIdStrMatch[1];
                                if (inlineZahnschemaState[toothIdStr]?.findings?.[opt.value]) { // opt.value is parent option's value
                                    inlineZahnschemaState[toothIdStr].findings[opt.value].details = e.target.value;
                                }
                            }
                        } else if (controlType === 'dynamic_retention_multiselect') {
                            const mainControlIdMatch = id.match(/^(.*)_zahn_\d+_detail_multiselect$/);
                            const toothIdForDetailMatch = id.match(/_zahn_(\d+)_detail_multiselect$/);
                            if (mainControlIdMatch && mainControlIdMatch[1] && toothIdForDetailMatch && toothIdForDetailMatch[1]) {
                                const mainControlId = mainControlIdMatch[1];
                                const toothIdForDetail = toothIdForDetailMatch[1];
                                if (controls[mainControlId]?.value.details_per_tooth?.[toothIdForDetail]?.[opt.value]) {
                                    controls[mainControlId].value.details_per_tooth[toothIdForDetail][opt.value].details = e.target.value;
                                }
                            }
                        }
                    }
                    updateBefundZusammenfassung();
                });
                textDetailsInput.addEventListener('click', (e) => e.stopPropagation()); // Verhindert Schließen bei Klick ins Input
            }
            optionContainer.appendChild(detailsWrapper);
        }
        optionsDiv.appendChild(optionContainer);

        checkbox.addEventListener('change', (e) => {
            // e.stopPropagation(); // Normalerweise nicht nötig, da der Label-Click bereits gestoppt wird
            const isChecked = e.target.checked;
            const parentOptVal = opt.value;

            if (controls[id]?.value[parentOptVal]) {
                controls[id].value[parentOptVal].checked = isChecked;

                if (detailsWrapper) {
                    detailsWrapper.style.display = isChecked ? 'flex' : 'none'; // flex oder block
                }

                if (isChecked) {
                    // When checked, ensure details are initialized or retain their current state.
                    // For text input, details are taken from the input field's current value.
                    // For select/multiselect, details are already linked or will be read by getControlValueText/summary logic.
                    if (opt.detailsType === 'text' || !opt.detailsType) { // Default to text if not specified
                        if (detailsControlHost && typeof detailsControlHost.value !== 'undefined') { // Zahnschema oder Standard-Text
                            controls[id].value[parentOptVal].details = detailsControlHost.value;
                        }
                    } else if (opt.detailsType === 'select' || opt.detailsType === 'multiselect') {
                        // Ensure the .details object exists
                        if (typeof controls[id].value[parentOptVal].details !== 'object') {
                            controls[id].value[parentOptVal].details = opt.detailsType === 'select'
                                ? { selectValue: '', additionalText: '' }
                                : { multiselectValue: {}, additionalText: '' };
                        } // else, it already exists and is being managed
                        // Update additionalText from its input field
                        const additionalTextInput = detailsWrapper.querySelector(`#${id}_${parentOptVal}_details_additional_text`);
                        if (additionalTextInput) {
                            controls[id].value[parentOptVal].details.additionalText = additionalTextInput.value;
                        }
                    }
                } else { // When UNCHECKED, reset details
                    const parentDetailObject = controls[id].value[parentOptVal].details;

                    if (opt.detailsType === 'select') {
                        if (parentDetailObject && typeof parentDetailObject === 'object') {
                            const nestedSelectId = `${id}_${parentOptVal}_details_select`;
                            const nestedSelectCtrl = controls[nestedSelectId];
                            if (nestedSelectCtrl?.element) {
                                const defaultNestedOpt = nestedSelectCtrl.config.options.find(o => o.isDefault);
                                const valToSet = defaultNestedOpt ? defaultNestedOpt.value : (nestedSelectCtrl.config.options[0]?.value || '');
                                nestedSelectCtrl.element.value = valToSet;
                                nestedSelectCtrl.value = valToSet;
                                parentDetailObject.selectValue = valToSet;
                            }
                            parentDetailObject.additionalText = '';
                            const additionalTextInput = detailsWrapper.querySelector(`#${id}_${parentOptVal}_details_additional_text`);
                            if (additionalTextInput) additionalTextInput.value = '';
                        }
                    } else if (opt.detailsType === 'multiselect') {
                        if (parentDetailObject && typeof parentDetailObject === 'object') {
                            const nestedMsId = `${id}_${parentOptVal}_details_multiselect`;
                            const nestedMsCtrl = controls[nestedMsId];
                            if (nestedMsCtrl && parentDetailObject.multiselectValue) {
                                Object.keys(parentDetailObject.multiselectValue).forEach(nestedOptKey => {
                                    const nestedOptConfig = nestedMsCtrl.config.options.find(o => o.value === nestedOptKey);
                                    const isNestedDefault = nestedOptConfig?.isDefault || false;
                                    parentDetailObject.multiselectValue[nestedOptKey].checked = isNestedDefault;
                                    parentDetailObject.multiselectValue[nestedOptKey].details = '';

                                    const nestedCheckboxEl = nestedMsCtrl.optionsDiv.querySelector(`input[type="checkbox"][value="${nestedOptKey}"]`);
                                    if (nestedCheckboxEl) nestedCheckboxEl.checked = isNestedDefault;
                                    // Details-Wrapper und Input des verschachtelten Multiselects zurücksetzen
                                });
                                updateMultiSelectButtonText(nestedMsId);
                            }
                            parentDetailObject.additionalText = '';
                            const additionalTextInputMs = detailsWrapper.querySelector(`#${id}_${parentOptVal}_details_additional_text`);
                            if (additionalTextInputMs) additionalTextInputMs.value = '';
                        }
                    } else if (detailsControlHost && typeof detailsControlHost.value !== 'undefined') { // Standard text input (or zahnschema)
                        detailsControlHost.value = '';
                        controls[id].value[parentOptVal].details = '';
                    }
                }

                // Spezifische Logik für Inline-Zahnschema und dynamische Retention
                const controlType = controls[id].type;
                let mainToothControlId = null;
                let toothIdForUpdate = null;
                let schemaKeyForUpdate = null;

                // Determine the toothId and schemaKey for visual updates
                if (controlType === 'multiselect_inline_tooth') { // Change in a main tooth multiselect
                    const toothIdMatch = id.match(/_tooth_(\d+)_findings_/);
                    const schemaKeyMatch = id.match(/_findings_(.+)$/);
                    if (toothIdMatch) toothIdForUpdate = toothIdMatch[1];
                    if (schemaKeyMatch) schemaKeyForUpdate = schemaKeyMatch[1];
                    mainToothControlId = id;
                } else if (controlType === 'multiselect') { // Change in a potentially nested multiselect
                    // ID pattern for nested: inline_tooth_TOOTHID_findings_SCHEMAKEY_PARENTOPTION_details_multiselect
                    const nestedMatch = id.match(/^(inline_tooth_(\d+)_findings_([^_]+))_[^_]+_details_multiselect$/);
                    if (nestedMatch) {
                        mainToothControlId = nestedMatch[1]; // The ID of the parent multiselect_inline_tooth
                        toothIdForUpdate = nestedMatch[2];
                        schemaKeyForUpdate = nestedMatch[3];
                    }
                }

                if (toothIdForUpdate && schemaKeyForUpdate) {
                    // Ensure inlineZahnschemaState is updated if the change was in the main tooth multiselect
                    // For nested multiselects, the state (details object) is updated by reference.
                    if (id === mainToothControlId && controls[mainToothControlId]?.type === 'multiselect_inline_tooth') {
                        if (inlineZahnschemaState[toothIdForUpdate]?.findings?.[parentOptVal]) {
                            inlineZahnschemaState[toothIdForUpdate].findings[parentOptVal].checked = isChecked;
                            // Update details in inlineZahnschemaState from controls state
                            // This handles simple text details; complex (nested) details are by reference.
                            if (controls[id]?.value[parentOptVal] && typeof controls[id].value[parentOptVal].details !== 'undefined') {
                                 inlineZahnschemaState[toothIdForUpdate].findings[parentOptVal].details = controls[id].value[parentOptVal].details;
                            }
                        }
                    }

                    // Call visual update functions for the identified tooth
                    if (controls[mainToothControlId]?.type === 'multiselect_inline_tooth' || controlType === 'multiselect_inline_tooth') {
                        if (typeof updateToothCrownVisual === 'function') {
                            updateToothCrownVisual(toothIdForUpdate, schemaKeyForUpdate);
                        }
                        if (typeof updatePersistentMilkVisual === 'function') {
                            updatePersistentMilkVisual(toothIdForUpdate, schemaKeyForUpdate);
                        }

                        // Specific logic like 'fe' (missing) should only run if the event is from the main tooth multiselect
                        if (id === mainToothControlId) { // i.e., the event originated in the main multiselect
                            if (parentOptVal === 'fe' && schemaKeyForUpdate === 'pathologischeZahnBefundeOptionen' && typeof updateInlineToothMissingState === 'function') {
                                updateInlineToothMissingState(toothIdForUpdate, isChecked);
                            }
                            // Call updateAltersentsprechendOption if it's a main tooth multiselect change
                            if (typeof updateAltersentsprechendOption === 'function') {
                                updateAltersentsprechendOption();
                            }
                        }
                    }
                } else if (controlType === 'dynamic_retention_multiselect') { // Handling for another specific multiselect type
                    const mainControlIdMatch = id.match(/^(.*)_zahn_\d+_detail_multiselect$/);
                    const toothIdForDetailMatch = id.match(/_zahn_(\d+)_detail_multiselect$/);
                    if (mainControlIdMatch && mainControlIdMatch[1] && toothIdForDetailMatch && toothIdForDetailMatch[1]) {
                        const mainControlId = mainControlIdMatch[1];
                        const toothIdForDetail = toothIdForDetailMatch[1];
                        if (controls[mainControlId]?.value.details_per_tooth?.[toothIdForDetail]?.[parentOptVal]) {
                            controls[mainControlId].value.details_per_tooth[toothIdForDetail][parentOptVal].checked = isChecked;
                            if (controls[id]?.value[parentOptVal] && typeof controls[id].value[parentOptVal].details !== 'undefined') {
                                controls[mainControlId].value.details_per_tooth[toothIdForDetail][parentOptVal].details = controls[id].value[parentOptVal].details;
                                }
                        }
                    }
                }
            }

            // Spezifische Logik für "altersentsprechend" und "Lückengebiss"
            if (id === 'opg_zahnstatus_multiselect') {
                const currentCheckboxValue = opt.value;
                if (currentCheckboxValue === 'altersentsprechend' && isChecked) {
                    // Deaktiviere alle anderen Optionen
                    for (const otherOptionValue in controls[id].value) {
                        if (otherOptionValue !== 'altersentsprechend' && controls[id].value[otherOptionValue].checked) {
                            const otherCheckbox = optionsDiv.querySelector(`input[type="checkbox"][value="${otherOptionValue}"]`);
                            if (otherCheckbox) otherCheckbox.checked = false;
                            controls[id].value[otherOptionValue].checked = false;
                            // Ggf. zugehörige Details-Wrapper ausblenden
                            const otherDetailsWrapper = optionsDiv.querySelector(`#${id}_${otherOptionValue}_details_wrapper`);
                            if (otherDetailsWrapper) otherDetailsWrapper.style.display = 'none';
                        }
                    }
                }
                if (opt.detailsType === 'zahnschema' && isChecked && detailsControlHost && detailsControlHost.value === '') {
                     currentZahnschemaOptionValueTarget = parentOptVal;
                     const zahnschemaModalTitle = `${getTextResource('zahnschemaModalTitlePrefix', 'Zahnschema für')}: ${getTextResource(opt.text, opt.text)}`;
                     openZahnschema(id, zahnschemaModalTitle);
                }
            }

            updateMultiSelectButtonText(id);
            updateBefundZusammenfassung();
            if (typeof window.updateDependentFieldVisibility === 'function') {
                window.updateDependentFieldVisibility(id); // Pass the multiselect's ID
            }
        });
    });

    // Die Logik für "Add Option Button" bleibt für den Bearbeitungsmodus erhalten, falls dieser später wieder aktiviert wird.
    const addOptionBtnMulti = document.createElement('button');
    addOptionBtnMulti.type = 'button';
    addOptionBtnMulti.textContent = '+ Option hinzufügen';
    addOptionBtnMulti.classList.add('add-option-to-multiselect-btn', 'text-xs', 'mt-2', 'p-1', 'text-blue-600', 'hover:text-blue-800'); // Tailwind
    addOptionBtnMulti.style.display = 'none'; // Standardmäßig ausgeblendet
    addOptionBtnMulti.dataset.targetMultiselectId = id;
    addOptionBtnMulti.dataset.optionsPath = optionsDiv.dataset.optionsPath;
    optionsDiv.appendChild(addOptionBtnMulti);


    selectButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Verhindert, dass der globale Click-Listener das Dropdown sofort wieder schließt

        // Schließe andere offene Multiselects, aber NICHT, wenn sie ein Elternelement des aktuellen Klickziels sind
        // oder wenn sie das optionsDiv des Buttons sind, der das aktuelle Dropdown öffnet/schließt.
        document.querySelectorAll('.multi-select-options.active').forEach(activeDiv => {
            // activeDiv: ein bereits geöffneter Optionen-Container
            // optionsDiv: der Optionen-Container für *diesen* Button, der gerade geklickt wurde
            // e.target: der Button, der gerade geklickt wurde (oder ein Element darin)

            // Schließe nicht den optionsDiv, den *dieser* Button kontrolliert.
            if (activeDiv === optionsDiv) return;

            // Schließe keinen activeDiv, wenn der Klick *innerhalb* dieses activeDivs stattgefunden hat.
            // Dies behandelt den Fall, dass wir auf einen Button eines verschachtelten Multiselects klicken,
            // der sich innerhalb der Optionen eines äußeren Multiselects befindet.
            if (activeDiv.contains(e.target)) return;

            activeDiv.classList.remove('active');
        });
        optionsDiv.classList.toggle('active'); // Toggle für das aktuelle Dropdown
    });

    updateMultiSelectButtonText(id); // Initialen Button-Text setzen
    return container; // Gib den Hauptcontainer zurück, falls er dynamisch erstellt wurde
}


function createTextInput(id, config, elementType = 'input') {
    if (!id || !config) {
        console.error(`[UI] Ungültige Konfiguration für TextInput ID "${id}".`, config);
        return null;
    }
    const container = document.createElement('div');
    container.classList.add('input-group');

    const label = document.createElement('label');
    label.htmlFor = id;
    // config.label ist direkter Text oder Schlüssel.
    label.textContent = getTextResource(config.label, config.label);
    label.classList.add('control-label');
    container.appendChild(label);

    const input = document.createElement(elementType === 'textarea' || elementType === 'textarea_readonly' ? 'textarea' : 'input');
    if (elementType === 'input') input.type = 'text'; // Standard-Textinput
    input.id = id;
    input.name = id;
    // config.placeholder ist direkter Text oder Schlüssel.
    input.placeholder = getTextResource(config.placeholder, '');
    // config.prefix ist direkter Text oder Schlüssel.
    const prefixText = getTextResource(config.prefix, config.prefix);
    input.dataset.prefix = prefixText || (config.label ? getTextResource(config.label, config.label) + ': ' : '');
    input.dataset.isFormControl = 'true';
    input.classList.add('w-full', 'p-2', 'border', 'border-gray-300', 'rounded-md'); // Tailwind-Klassen

    if (elementType === 'textarea' && config.rows) {
        input.rows = config.rows;
    }
     if (elementType === 'textarea_readonly') {
        input.readOnly = true;
        if (config.rows) input.rows = config.rows;
        input.classList.add('bg-gray-100'); // Visueller Hinweis für readonly
    }
    container.appendChild(input);

    if (typeof controls !== 'object' || controls === null) {
        console.error(`[UI] createTextInput: Das globale 'controls'-Objekt ist nicht verfügbar oder nicht korrekt initialisiert für ID "${id}".`);
    } else {
        controls[id] = {
            element: input,
            config: config,
            type: elementType.startsWith('textarea') ? 'textarea' : 'text',
            value: '', // Initialwert
            isDefault: config.isDefault !== undefined ? config.isDefault : true // Ob der Inhalt als "Standard" gilt
        };
    }


    input.addEventListener('input', (e) => {
        if (controls && controls[id]) {
            controls[id].value = e.target.value.trim(); // Leerzeichen am Anfang/Ende entfernen
        }
        if (elementType === 'textarea') adjustTextareaHeight(input);
        updateBefundZusammenfassung();
    });
    if (elementType === 'textarea') setTimeout(() => adjustTextareaHeight(input), 0); // Initiale Anpassung

    return container;
}

function createZahnschemaInput(id, config) {
    if (!id || !config) {
        console.error(`[UI] Ungültige Konfiguration für ZahnschemaInput ID "${id}".`, config);
        return null;
    }
    const container = document.createElement('div');
    container.classList.add('input-group');

    const label = document.createElement('span'); // Span statt Label, da das Input klickbar ist
    label.classList.add('control-label');
    // config.label ist direkter Text oder Schlüssel.
    label.textContent = getTextResource(config.label, config.label);
    container.appendChild(label);

    const input = document.createElement('input');
    input.type = 'text';
    input.id = id + '_input'; // Eindeutige ID für das Input-Element
    input.name = id + '_input';
    // config.placeholder ist direkter Text oder Schlüssel.
    input.placeholder = getTextResource(config.placeholder, 'Zähne auswählen...');
    input.readOnly = true; // Benutzer kann nicht direkt tippen
    input.classList.add('mt-1', 'bg-gray-50', 'cursor-pointer', 'w-full', 'p-2', 'border', 'border-gray-300', 'rounded-md'); // Tailwind
    // config.prefix ist direkter Text oder Schlüssel.
    const prefixText = getTextResource(config.prefix, config.prefix);
    input.dataset.prefix = prefixText || (config.label ? getTextResource(config.label, config.label) + ': ' : '');
    input.dataset.isFormControl = 'true';
    input.onclick = () => {
        currentZahnschemaOptionValueTarget = null; // Zurücksetzen für Standard-Zahnschema-Inputs
        // config.label ist direkter Text oder Schlüssel, wird als Titel für das Modal verwendet.
        openZahnschema(id, getTextResource(config.label, 'Zahnauswahl'));
    }
    container.appendChild(input);

    if (typeof controls !== 'object' || controls === null) {
        console.error(`[UI] createZahnschemaInput: Das globale 'controls'-Objekt ist nicht verfügbar oder nicht korrekt initialisiert für ID "${id}".`);
    } else {
        controls[id] = {
            element: container, // Der Hauptcontainer
            inputElement: input, // Das sichtbare Input-Feld
            config: config,
            type: 'zahnschema',
            value: { teeth: '', details: '' }, // Struktur für den Wert
            isDefault: config.isDefault !== undefined ? config.isDefault : true
        };
    }
    return container;
}

function createZahnschemaDynamicMultiSelectInput(id, config) {
    if (!id || !config) {
        console.error(`[UI] Ungültige Konfiguration für ZahnschemaDynamicMultiSelectInput ID "${id}".`, config);
        return null;
    }
    const mainContainer = document.createElement('div');
    mainContainer.classList.add('input-group', 'flex-col'); // Flex-col für Label über Input
    mainContainer.id = id + "_main_container";

    const zahnschemaLabel = document.createElement('span');
    zahnschemaLabel.classList.add('control-label');
    // config.label ist direkter Text oder Schlüssel.
    zahnschemaLabel.textContent = getTextResource(config.label, config.label);
    mainContainer.appendChild(zahnschemaLabel);

    const zahnschemaInput = document.createElement('input');
    zahnschemaInput.type = 'text';
    zahnschemaInput.id = id + '_zahnschema_input';
    zahnschemaInput.name = id + '_zahnschema_input';
    // config.placeholder ist direkter Text oder Schlüssel.
    zahnschemaInput.placeholder = getTextResource(config.placeholder, 'Zähne für Detailbeschreibung auswählen...');
    zahnschemaInput.readOnly = true;
    zahnschemaInput.classList.add('mt-1', 'bg-gray-50', 'cursor-pointer', 'w-full', 'p-2', 'border', 'border-gray-300', 'rounded-md'); // Tailwind
    zahnschemaInput.onclick = () => {
        currentZahnschemaOptionValueTarget = null; // Zurücksetzen
        // config.label ist direkter Text oder Schlüssel.
        openZahnschema(id, getTextResource(config.label, 'Zahnauswahl'));
    }
    mainContainer.appendChild(zahnschemaInput);

    const dynamicSelectsHost = document.createElement('div');
    dynamicSelectsHost.id = id + '_dynamic_selects_host';
    dynamicSelectsHost.classList.add('dynamic-multiselects-container', 'mt-2', 'w-full', 'pl-2', 'border-l-2', 'border-gray-200'); // Tailwind

    // Wrapper nicht unbedingt nötig, wenn mainContainer schon flex-col ist
    // const hostWrapper = document.createElement('div');
    // hostWrapper.style.flexBasis = '100%'; // Nimmt volle Breite im Flex-Container
    // hostWrapper.appendChild(dynamicSelectsHost);
    mainContainer.appendChild(dynamicSelectsHost); // Direkt hinzufügen


    if (typeof controls !== 'object' || controls === null) {
        console.error(`[UI] createZahnschemaDynamicMultiSelectInput: Das globale 'controls'-Objekt ist nicht verfügbar oder nicht korrekt initialisiert für ID "${id}".`);
    } else {
        controls[id] = {
            element: mainContainer,
            zahnschemaInputElement: zahnschemaInput,
            dynamicSelectsHostElement: dynamicSelectsHost,
            config: config,
            type: 'zahnschema_dynamic_multiselect',
            value: {
                selectedTeeth: '',
                details_per_tooth: {} // Hier werden die Multiselect-Werte pro Zahn gespeichert
            },
            isDefault: config.isDefault !== undefined ? config.isDefault : true,
        };
    }
    return mainContainer;
}
