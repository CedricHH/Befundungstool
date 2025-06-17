// ========================================================================
// MODULE: APP INITIALIZATION & EVENT LISTENERS
// Datei: app-init-and-listeners.js
// V10 UPDATE: Anpassung an die neue Konfigurationsstruktur.
//             getFieldDefinition entfernt, getTextResource angepasst (obwohl die Hauptlogik in config-loader.js liegt).
//             populateForm filtert Sektionen basierend auf _sourceConfigType und currentSelectedXRayType.
// ========================================================================

let closeZahnschemaModalBtn, confirmZahnschemaBtn, cancelZahnschemaBtn;
let befundForm;
let appContainer;
let currentSelectedXRayType = null; // Hält den aktuell ausgewählten Röntgentyp

window.befundZusammenfassung = null; // Globale Variable für die Zusammenfassung

// Definition der speziellen Container und ihrer Initialisierungsfunktionen
const specialContainerInitializers = {
    'pathologische_zahnbefunde_container': window.createInlineZahnschema,
    'implantatplanungs_container': window.createInlineZahnschema,
     'milchzahn_container': window.createInlineZahnschema
};

/**
 * Initialisiert einen speziellen Container, wenn er sichtbar ist und noch nicht initialisiert wurde.
 * @param {string} containerId Die ID des zu initialisierenden Containers.
 */
function initializeSpecialContainer(containerId) {
    console.log(`[AppInit] initializeSpecialContainer called for containerId: '${containerId}'`);
    const container = document.getElementById(containerId);
    if (container && container.offsetParent !== null && !container.dataset.specialContentInitialized) {
        if (specialContainerInitializers[containerId] && typeof specialContainerInitializers[containerId] === 'function') {
            console.log(`[AppInit] Initializing special content for visible container: ${containerId}`);
            specialContainerInitializers[containerId](containerId); // Ruft die registrierte Initialisierungsfunktion auf
            container.dataset.specialContentInitialized = 'true';
        } else {
            console.warn(`[AppInit] No initializer found or initializer is not a function for containerId: ${containerId}`);
        }
    } else if (container && container.offsetParent === null) {
        // console.log(`[AppInit] Special container '${containerId}' is not visible, skipping initialization.`);
    } else if (container && container.dataset.specialContentInitialized) {
        // console.log(`[AppInit] Special container '${containerId}' already initialized.`);
    }
}

/**
 * Initialisiert alle sichtbaren speziellen Container.
 * Wird typischerweise nach dem Erweitern von Fieldsets oder dem Neuaufbau des Formulars aufgerufen.
 */
function initializeAllVisibleSpecialContainers() {
    console.log("[AppInit] Checking all special containers for initialization...");
    for (const containerId in specialContainerInitializers) {
        initializeSpecialContainer(containerId);
    }
}

/**
 * Initialisiert allgemeine UI-Elemente basierend auf der App-Konfiguration.
 * @param {object} appConfigData Die geladene App-Konfiguration (window.appConfig).
 */
function initializeGeneralUI(appConfigData) {
    console.log('[AppInit] initializeGeneralUI called.');
    if (!appConfigData || !appConfigData.general) {
        console.warn("[AppInit] appConfig.general nicht gefunden, UI-Initialisierung übersprungen.");
        return;
    }
    // Globale Texte werden jetzt über getTextResource geholt, das auf appConfig.general.textResources zugreift
    document.title = getTextResource("appTitle", appConfigData.general.appTitle || 'Befundung'); // Fallback, falls appTitle nicht in textResources
    const appTitleElement = document.getElementById('appTitle');
    if (appTitleElement) {
        appTitleElement.textContent = getTextResource("appTitle", appConfigData.general.appTitle || 'Befundung');
    }

    const modalTitle = document.getElementById('zahnschemaTitle');
    if (modalTitle) {
        modalTitle.textContent = getTextResource("modalTitleDefault", appConfigData.general.modalTitleDefault || 'Zahnauswahl');
    }

    const selTeethOutput = document.getElementById('selected-teeth-output');
    if (selTeethOutput) {
        const selectedText = getTextResource("selectedTeethText", appConfigData.general.selectedTeethText || "Ausgewählte Zähne");
        const noSelection = getTextResource("noSelectionText", appConfigData.general.noSelectionText || "Keine");
        selTeethOutput.textContent = `${selectedText}: ${noSelection}`;
    }

    const confirmBtn = document.getElementById('confirmZahnschemaBtn');
    if (confirmBtn) {
        confirmBtn.textContent = getTextResource("confirmBtnText", appConfigData.general.confirmBtnText || 'Bestätigen');
    }
    const cancelBtn = document.getElementById('cancelZahnschemaBtn');
    if (cancelBtn) {
        cancelBtn.textContent = getTextResource("cancelBtnText", appConfigData.general.cancelBtnText || 'Abbrechen');
    }
    console.log('[AppInit] initializeGeneralUI finished.');
}

/**
 * Erstellt den Top-Level-Selektor für die Auswahl der Röntgenart.
 * @param {object} appConfigData Die geladene App-Konfiguration (window.appConfig).
 */
function createTopLevelSelector() {
    console.log('[AppInit] createTopLevelSelector called.');
    const container = document.getElementById('topLevelSelectorContainer');
    if (!container) {
        console.error("[AppInit] topLevelSelectorContainer nicht gefunden.");
        return;
    }
    container.innerHTML = ''; // Leere den Container vor dem Neuaufbau

    // Optionen für xRayTypes werden jetzt aus appConfig.dynamicElementOptions geholt,
    // die vom config-loader.js befüllt wurden.
    const xRayTypesOptions = window.appConfig.xRayTypes;

    if (!xRayTypesOptions || xRayTypesOptions.length === 0) {
        console.warn("[AppInit] Keine Optionen für xRayTypes in appConfig.dynamicElementOptions gefunden.");
        container.textContent = "Keine Aufnahmearten konfiguriert.";
        return;
    }

    if (!currentSelectedXRayType && xRayTypesOptions.length > 0) {
        // Setze den ersten Typ als Standard, wenn noch keiner ausgewählt ist.
        currentSelectedXRayType = xRayTypesOptions[0].value;
        console.log('[AppInit] Default currentSelectedXRayType set to:', currentSelectedXRayType);
    }

    const selectorConfig = {
        label: getTextResource("xRayTypeSelectorLabel", window.appConfig.general.xRayTypeSelectorLabel || "Aufnahmeart auswählen:"),
        options: xRayTypesOptions, // Bereits das Array von Optionen
        initialValue: currentSelectedXRayType, // Der aktuelle oder erste Typ
        configKey: 'topLevelXRaySelector' // Wird für das Controls-Objekt verwendet
    };

    const selectGroup = createSelect('topLevelXRaySelector', selectorConfig); // createSelect ist in ui-components.js
    if (selectGroup) {
        container.appendChild(selectGroup);
        console.log('[AppInit] Top-Level-Selektor erstellt und dem Container hinzugefügt.');
        const selectElement = selectGroup.querySelector('select');
        if (selectElement) {
            if (currentSelectedXRayType) {
                selectElement.value = currentSelectedXRayType;
            }
            selectElement.addEventListener('change', async (e) => { // Make listener async
                currentSelectedXRayType = e.target.value;
                console.log("[AppInit] Röntgen-Typ geändert auf:", currentSelectedXRayType);

                // Optional: Show a loading indicator in the form
                // befundForm.innerHTML = '<p class="text-center py-4">Lade Konfiguration für ' + currentSelectedXRayType + '...</p>';

                await loadAppConfig(currentSelectedXRayType); // Load the specific module's config
                window.befundZusammenfassung=null;
                populateForm(window.appConfig); // populateForm will use the new config in window.appConfig
                updateBefundZusammenfassung(); 
            });
        }
    } else {
        console.error("[AppInit] Konnte Top-Level-Auswahlknopf nicht erstellen.");
    }
    console.log('[AppInit] createTopLevelSelector finished.');
}


/**
 * Überprüft, ob ein Konfigurationselement basierend auf dem aktuellen Röntgentyp angezeigt werden soll.
 * Diese Funktion ist jetzt weniger kritisch für Top-Level-Sektionen, da populateForm bereits filtert,
 * kann aber für bedingte Elemente *innerhalb* einer Röntgenart-Konfiguration nützlich sein.
 * @param {object} elementConfig Die Konfiguration des Elements (Sektion oder Feld).
 * @param {string} activeXRayType Der aktuell ausgewählte Röntgentyp.
 * @returns {boolean} True, wenn das Element angezeigt werden soll, sonst false.
 */
function checkDisplayCriteria(elementConfig, activeXRayType) {
    if (!elementConfig.displayCriteria) return true; // Keine Kriterien, also anzeigen

    // displayCriteria könnte ein String oder ein Array von Strings sein, die xRayTypes repräsentieren
    if (Array.isArray(elementConfig.displayCriteria)) {
        return elementConfig.displayCriteria.includes(activeXRayType);
    }
    if (typeof elementConfig.displayCriteria === 'string') {
        return elementConfig.displayCriteria === activeXRayType;
    }
    // Fallback, wenn displayCriteria ein komplexeres Objekt ist (nicht im aktuellen Scope)
    console.warn("[AppInit] checkDisplayCriteria: Unbekannte Struktur für displayCriteria:", elementConfig.displayCriteria);
    return true;
}

/**
 * Überprüft, ob ein Feld basierend auf dem Wert eines anderen Feldes angezeigt werden soll.
 * @param {object} fieldConfig Die Konfiguration des Feldes.
 * @param {object} formControls Das globale `controls`-Objekt.
 * @returns {boolean} True, wenn das Feld angezeigt werden soll, sonst false.
 */
function checkFieldCondition(fieldConfig, formControls) {
    if (!fieldConfig.condition) return true;

    const condition = fieldConfig.condition;
    const controllingField = formControls[condition.field]; // condition.field ist die ID des steuernden Feldes

    if (!controllingField || !controllingField.element) {
        console.warn(`[AppInit] checkFieldCondition: Steuerndes Feld mit ID '${condition.field}' nicht in controls gefunden.`);
        return false; // Steuerndes Feld nicht gefunden
    }

    let controllingValue;
    if (controllingField.type === 'select') {
        controllingValue = controllingField.element.value;
    } else if (controllingField.type === 'multiselect' || controllingField.type === 'multiselect_inline_tooth' || controllingField.type === 'dynamic_retention_multiselect') {
        // Für Multiselect prüfen, ob eine bestimmte Option (condition.optionValue) ausgewählt ist
        if (condition.optionValue && controllingField.value && controllingField.value[condition.optionValue]) {
            return controllingField.value[condition.optionValue].checked === (condition.value === undefined ? true : condition.value); // Prüft auf checked status
        }
        // Wenn keine spezifische optionValue, könnte man prüfen, ob *irgendetwas* ausgewählt ist,
        // aber das ist meist nicht das, was man mit condition.value meint.
        // Für den Fall, dass condition.value direkt einen Wert prüft (selten bei Multiselects ohne optionValue):
        // controllingValue = Object.values(controllingField.value).some(opt => opt.checked) ? "some_selected" : "none_selected";
        console.warn(`[AppInit] checkFieldCondition für Multiselect '${condition.field}' ohne gültigen 'condition.optionValue'. Bedingung kann nicht sicher evaluiert werden.`);
        return false;
    } else if (controllingField.type === 'text' || controllingField.type === 'textarea') {
        controllingValue = controllingField.value;
    } else {
        console.warn(`[AppInit] checkFieldCondition: Unbehandelter Kontrolltyp '${controllingField.type}' für Feld '${condition.field}'.`);
        return true; // Im Zweifel anzeigen
    }
    return controllingValue === condition.value;
}


/**
 * Baut das Hauptformular basierend auf der aktuellen Konfiguration und dem ausgewählten Röntgentyp.
 * @param {object} appConfigData Die geladene App-Konfiguration (sollte window.appConfig sein).
 */
function populateForm(appConfigData) {
    console.log('[AppInit] populateForm called with currentSelectedXRayType:', currentSelectedXRayType);
    befundForm = document.getElementById('befundungsForm');
    if (!befundForm) {
        console.error("[AppInit] befundungsForm nicht gefunden.");
        return;
    }
    befundForm.innerHTML = ''; // Formular leeren
    console.log('[AppInit] Formular geleert.');

    // `controls` Objekt zurücksetzen, aber den Top-Level-Selektor behalten, falls er existiert
    const topLevelSelectorControl = controls['topLevelXRaySelector'];
    controls = {}; // Alle anderen Controls entfernen
    if (topLevelSelectorControl) {
        controls['topLevelXRaySelector'] = topLevelSelectorControl;
        console.log('[AppInit] topLevelXRaySelector im `controls`-Objekt beibehalten.');
    }

    // Initialisierungsstatus für spezielle Container zurücksetzen, die für verschiedene Röntgenarten neu initialisiert werden müssen
    const sharedContainerIds = ['pathologische-zahnbefunde-container', 'implantatplanungs-container']; // Beispiel
    sharedContainerIds.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            delete container.dataset.specialContentInitialized;
            // container.innerHTML = ''; // Optional: Inhalt leeren, wenn er nicht von UI-Komponenten selbst geleert wird
            console.log(`[AppInit] Reset specialContentInitialized for ${id}`);
        }
    });


    if (!appConfigData || !appConfigData.formSections || appConfigData.formSections.length === 0) {
        befundForm.innerHTML = '<p class="text-red-500 text-center">Fehler: Formularstruktur-Konfiguration (`formSections`) fehlt oder ist leer.</p>';
        console.error("[AppInit] populateForm: appConfigData.formSections fehlt oder ist leer.");
        return;
    }

    // Filtere die Sektionen basierend auf dem currentSelectedXRayType.
    // _sourceConfigType wurde im config-loader.js hinzugefügt.
    const relevantSections = appConfigData.formSections.filter(section => section._sourceConfigType === currentSelectedXRayType);

    if (relevantSections.length === 0) {
        console.warn(`[AppInit] Keine formSections für den xRayType '${currentSelectedXRayType}' in appConfig.formSections gefunden (nach Filterung).`);
        const p = document.createElement('p');
        p.className = 'text-gray-600 text-center py-4';
        p.textContent = `Für den Aufnahmetyp "${getTextResource(currentSelectedXRayType, currentSelectedXRayType)}" ist keine spezifische Formular-Konfiguration vorhanden.`;
        befundForm.appendChild(p);
        return;
    }

    console.log(`[AppInit] Rendere ${relevantSections.length} Sektionen für xRayType '${currentSelectedXRayType}'.`);

    relevantSections.forEach((sectionConfig) => {
        // Die Top-Level-Filterung nach _sourceConfigType hat bereits stattgefunden.
        // checkDisplayCriteria hier könnte für feinere Kriterien *innerhalb* einer Röntgenart-Konfig nützlich sein,
        // ist aber für die Auswahl der Röntgenart-Sektionen nicht mehr primär zuständig.
        // if (!checkDisplayCriteria(sectionConfig, currentSelectedXRayType)) {
        //     return;
        // }

        const fieldset = document.createElement('fieldset');
        fieldset.classList.add('collapsible-fieldset', 'mb-6', 'p-4', 'border', 'border-gray-300', 'rounded-md', 'bg-gray-50');
        if (sectionConfig.initiallyExpanded) {
            fieldset.classList.add('expanded');
        }

        const legend = document.createElement('legend');
        // In der neuen Struktur ist sectionConfig.legend bereits der Text.
        legend.textContent = getTextResource(sectionConfig.legend, sectionConfig.legend); // getTextResource für globale Fallbacks
        legend.classList.add('text-lg', 'font-semibold', 'text-gray-700', 'px-2', 'cursor-pointer');
        fieldset.appendChild(legend);

        legend.addEventListener('click', () => {
            fieldset.classList.toggle('expanded');
            // Toggle the display style of the content container
            fieldsAndSubSectionsContainer.style.display = fieldset.classList.contains('expanded') ? 'block' : 'none';
            // Verzögerte Initialisierung spezieller Container, falls das Fieldset jetzt sichtbar wird
            setTimeout(() => {
                if (fieldset.classList.contains('expanded') && fieldset.offsetParent !== null) {
                    console.log(`[AppInit] Fieldset '${sectionConfig.id}' expanded. Checking for special containers within.`);
                    // Durchsuche das Fieldset nach Elementen, die spezielle Container-IDs haben könnten
                    const specialContainersInFieldset = fieldset.querySelectorAll('[id^="pathologische-zahnbefunde-container"], [id^="implantatplanungs-container"], [data-special-container-id]');
                    specialContainersInFieldset.forEach(sc => {
                        const containerIdToInit = sc.id || sc.dataset.specialContainerId;
                        if (containerIdToInit && specialContainerInitializers[containerIdToInit]) {
                            initializeSpecialContainer(containerIdToInit);
                        }
                    });
                }
            }, 0);
        });

        const fieldsAndSubSectionsContainer = document.createElement('div');
        fieldsAndSubSectionsContainer.className = 'fieldset-content'; // Wird durch CSS gesteuert (display: none/block)
        if (sectionConfig.initiallyExpanded) {
            fieldsAndSubSectionsContainer.style.display = 'block'; // Sicherstellen, dass es sichtbar ist, wenn expanded
        }
        fieldset.appendChild(fieldsAndSubSectionsContainer);

        if (sectionConfig.description) { // description ist direkter Text
            const p = document.createElement('p');
            p.classList.add('text-sm', 'text-gray-600', 'mb-4');
            p.textContent = getTextResource(sectionConfig.description, sectionConfig.description);
            fieldsAndSubSectionsContainer.appendChild(p);
        }

        // Funktion zum Verarbeiten von Feldern (wird für Hauptsektionen und Untersektionen verwendet)
        const processFields = (fieldsArray, parentContainer) => {
            fieldsArray?.forEach((fieldConf) => {
                // completeConfig ist nun direkt fieldConf, da getFieldDefinition obsolet ist.
                const completeConfig = fieldConf;
                let isConditionalField = !!completeConfig.condition;

                let controlElementContainer = null;
                let targetRenderContainer = parentContainer; // Standardmäßig im aktuellen Container rendern

                // Wenn das Feld eine eigene containerId hat, dort rendern
                if (completeConfig.containerId) {
                    const specificContainer = document.getElementById(completeConfig.containerId);
                    if (specificContainer) {
                        targetRenderContainer = specificContainer;
                        targetRenderContainer.innerHTML = ''; // Inhalt des spezifischen Containers leeren
                        console.log(`[AppInit] Feld '${completeConfig.id}' wird in spezifischem Container '${completeConfig.containerId}' gerendert.`);
                        if (specialContainerInitializers[completeConfig.containerId]) {
                            // Markieren, damit initializeSpecialContainer es später findet
                            targetRenderContainer.dataset.specialContainerId = completeConfig.containerId;
                        }
                    } else {
                        console.warn(`[AppInit] Spezifischer Container '${completeConfig.containerId}' für Feld '${completeConfig.id}' nicht gefunden. Feld wird im Parent gerendert.`);
                    }
                }
                // Die Texte für label, placeholder etc. sind in completeConfig bereits die finalen Strings.
                // getTextResource wird hier nur noch für Fallbacks oder globale Texte benötigt.
                const labelText = getTextResource(completeConfig.label, completeConfig.label);
                const placeholderText = getTextResource(completeConfig.placeholder, completeConfig.placeholder);
                const prefixText = getTextResource(completeConfig.prefix, completeConfig.prefix);

                const optionsForElement = completeConfig.optionsKey ? getDynamicElementOptions(completeConfig.optionsKey) : completeConfig.options;

                switch (completeConfig.type) {
                    case 'textarea':
                    case 'textarea_readonly':
                    case 'text':
                        controlElementContainer = createTextInput(completeConfig.id, { ...completeConfig, label: labelText, placeholder: placeholderText, prefix: prefixText }, completeConfig.type);
                        if (completeConfig.type === 'textarea_readonly' && controlElementContainer) {
                            const textarea = controlElementContainer.querySelector('textarea');
                            if (textarea) {
                                textarea.readOnly = true;
                                textarea.id = completeConfig.id; // Sicherstellen, dass die ID gesetzt ist
                                if (completeConfig.id === 'befundZusammenfassung' || completeConfig.id === 'mySummaryTextarea') { // mySummaryTextarea ist aus der neuen config
                                    window.befundZusammenfassung = textarea;
                                }
                            }
                        }
                        break;
                    case 'select':
                        if (optionsForElement) {
                            controlElementContainer = createSelect(completeConfig.id, { ...completeConfig, label: labelText, placeholder: placeholderText, prefix: prefixText, options: optionsForElement });
                        } else {
                            console.warn(`[AppInit] Optionen für Select '${completeConfig.id}' (optionsKey: ${completeConfig.optionsKey}) nicht gefunden.`);
                            controlElementContainer = document.createElement('div');
                            controlElementContainer.textContent = `Fehler: Optionen für '${labelText}' nicht geladen.`;
                            controlElementContainer.className = 'text-red-500';
                        }
                        break;
                    case 'multiselect':
                        if (optionsForElement) {
                            // Multiselects benötigen oft einen Host-Container, der von createMultiSelect selbst erstellt oder übergeben wird.
                            // Hier erstellen wir einen Wrapper, wenn nicht in einem spezifischen Container gerendert wird.
                            let hostForMultiSelect = targetRenderContainer;
                            if (targetRenderContainer === parentContainer && !completeConfig.containerId) { // Nur wenn im Standardfluss
                                hostForMultiSelect = document.createElement('div');
                                hostForMultiSelect.id = completeConfig.id + "_multiselect_host_wrapper";
                                hostForMultiSelect.classList.add('input-group'); // Für korrekte Darstellung mit Label
                            }
                             // createMultiSelect erwartet, dass containerElement bereits im DOM ist oder es selbst hinzufügt.
                            createMultiSelect(completeConfig.id, { ...completeConfig, label: labelText, options: optionsForElement, containerElement: hostForMultiSelect, buttonTextConfig: completeConfig.buttonTextConfig });
                            controlElementContainer = hostForMultiSelect; // Der Host-Container
                        } else {
                            console.warn(`[AppInit] Optionen für Multiselect '${completeConfig.id}' (optionsKey: ${completeConfig.optionsKey}) nicht gefunden.`);
                            controlElementContainer = document.createElement('div');
                            controlElementContainer.textContent = `Fehler: Optionen für '${labelText}' nicht geladen.`;
                            controlElementContainer.className = 'text-red-500';
                        }
                        break;
                    case 'zahnschema':
                        controlElementContainer = createZahnschemaInput(completeConfig.id, { ...completeConfig, label: labelText, placeholder: placeholderText, prefix: prefixText });
                        break;
                    case 'zahnschema_dynamic_multiselect':
                        controlElementContainer = createZahnschemaDynamicMultiSelectInput(completeConfig.id, { ...completeConfig, label: labelText, placeholder: placeholderText });
                        break;
                    case 'paired_multiselect_group':
                        // Die Konfiguration für paired_multiselect_group ist in config_formSections_opg_newformat.js anders (direkter)
                        controlElementContainer = document.createElement('div');
                        controlElementContainer.classList.add('paired-structure-group', 'input-group', 'mb-4');

                        const groupLabelSpan = document.createElement('span');
                        groupLabelSpan.classList.add('paired-structure-label', 'control-label', 'font-medium', 'text-gray-700', 'block', 'mb-1');
                        groupLabelSpan.textContent = getTextResource(completeConfig.groupLabel, completeConfig.groupLabel);
                        controlElementContainer.appendChild(groupLabelSpan);

                        const controlsWrapperDiv = document.createElement('div');
                        controlsWrapperDiv.classList.add('paired-controls-container', 'flex', 'gap-4');

                        [completeConfig.leftConfig, completeConfig.rightConfig].forEach(pairedConf => {
                            if (pairedConf) {
                                const pairedMultiSelectHost = document.createElement('div');
                                pairedMultiSelectHost.id = pairedConf.id + "_host"; // Eindeutige ID für den Host
                                pairedMultiSelectHost.classList.add('flex-1'); // Für gleichmäßige Verteilung

                                const pairedOptions = getDynamicElementOptions(pairedConf.optionsKey) || [];
                                createMultiSelect(pairedConf.id, {
                                    ...pairedConf, // Enthält id, label, prefix, optionsKey
                                    label: getTextResource(pairedConf.label, pairedConf.label),
                                    prefix: getTextResource(pairedConf.prefix, pairedConf.prefix),
                                    options: pairedOptions,
                                    containerElement: pairedMultiSelectHost,
                                    buttonTextConfig: pairedConf.buttonTextConfig || { placeholder: getTextResource("auswaehlen", "Auswählen...") }
                                });
                                controlsWrapperDiv.appendChild(pairedMultiSelectHost);
                            }
                        });
                        controlElementContainer.appendChild(controlsWrapperDiv);
                        break;
                    case 'static_text_display':
                        // Der Text ist direkt in completeConfig.text
                        if (completeConfig.text) {
                            controlElementContainer = document.createElement('div');
                            controlElementContainer.classList.add('static-text-content', 'mb-4', 'p-3', 'bg-gray-100', 'rounded', 'border', 'border-gray-200', 'text-sm');
                            const staticTextParagraph = document.createElement('p');
                            staticTextParagraph.style.whiteSpace = 'pre-wrap'; // Zeilenumbrüche respektieren
                            staticTextParagraph.textContent = getTextResource(completeConfig.text, completeConfig.text);
                            controlElementContainer.appendChild(staticTextParagraph);
                        }
                        break;
                    case 'inline_zahnschema': // Für die neue Struktur aus config_formSections_opg_newformat.js
                        // This is the wrapper for legend, description, and the schema host.
                        // This element will be stored in `controls[completeConfig.id]`.
                        const wrapperElement = document.createElement('div');
                        wrapperElement.classList.add('inline-zahnschema-wrapper', 'mb-4'); // Main wrapper class

                        // Add Legend (using legendText or label as a fallback for this component type)
                        const legendTextToShow = completeConfig.legendText || completeConfig.label; // Prioritize legendText
                        if (legendTextToShow) {
                            const legendDiv = document.createElement('div');
                            legendDiv.textContent = getTextResource(legendTextToShow, legendTextToShow);
                            legendDiv.classList.add('text-md', 'font-semibold', 'text-gray-700', 'mb-2'); // Style similar to a sub-legend
                            wrapperElement.appendChild(legendDiv);
                        }

                        // Add Description if defined in config
                        if (completeConfig.description) {
                            const descriptionP = document.createElement('p');
                            descriptionP.textContent = getTextResource(completeConfig.description, completeConfig.description);
                            descriptionP.classList.add('text-sm', 'text-gray-600', 'mb-3'); // Style for description text
                            wrapperElement.appendChild(descriptionP);
                        }

                        // This is the actual container for the schema content, targeted by createInlineZahnschema.
                        // It gets the ID from the configuration (e.g., "pathologische_zahnbefunde_container").
                        const schemaHostDiv = document.createElement('div');
                        schemaHostDiv.id = completeConfig.id;
                        schemaHostDiv.classList.add('p-3', 'border', 'rounded-md', 'bg-white', 'inline-zahnschema-content-host');

                        wrapperElement.appendChild(schemaHostDiv); // Append schema host to the wrapper

                        // The initializer (createInlineZahnschema) will be called with schemaHostDiv.id.
                        // initializeSpecialContainer finds elements by ID, so it will find schemaHostDiv.
                        if (specialContainerInitializers[completeConfig.id]) {
                             schemaHostDiv.dataset.specialContainerId = completeConfig.id; // For initializeSpecialContainer to find it

                             const loadingPlaceholder = document.createElement('p');
                             loadingPlaceholder.className = 'text-gray-500 text-xs italic';
                             loadingPlaceholder.textContent = `Inline Zahnschema wird geladen...`;
                             schemaHostDiv.appendChild(loadingPlaceholder); // Placeholder inside the schemaHostDiv

                            // Store the wrapperElement in the controls object.
                            // Conditional visibility will act on this wrapper.
                            if (typeof controls === 'object' && controls !== null) {
                                controls[completeConfig.id] = {
                                    element: wrapperElement, // The element is the wrapper
                                    config: completeConfig,
                                    type: completeConfig.type
                                };
                            }
                        } else {
                            console.warn(`[AppInit] Kein Initializer für inline_zahnschema mit ID '${completeConfig.id}' oder optionsKey '${completeConfig.optionsKey}' gefunden.`);
                            const errorLegendTextContent = completeConfig.legendText || completeConfig.label || completeConfig.id;
                            const errorP = document.createElement('p');
                            errorP.textContent = `Fehler: Inline Zahnschema '${getTextResource(errorLegendTextContent, errorLegendTextContent)}' konnte nicht konfiguriert werden (Initializer fehlt).`;
                            errorP.className = 'text-red-500 text-xs'; // Keep error message distinct
                            schemaHostDiv.appendChild(errorP); // Error inside the schemaHostDiv
                        }
                        controlElementContainer = wrapperElement; // This is what gets appended to the form section
                        break;
                    case 'collapsible_section': // Handle fields that are themselves collapsible sections
                        controlElementContainer = document.createElement('fieldset');
                        controlElementContainer.id = completeConfig.id;
                        controlElementContainer.classList.add('collapsible-fieldset', 'config-subsection', 'mt-4', 'mb-4', 'p-3', 'border', 'border-gray-200', 'rounded-md', 'bg-white');
                        if (completeConfig.initiallyExpanded) {
                            controlElementContainer.classList.add('expanded');
                        }

                        const legendInner = document.createElement('legend');
                        legendInner.textContent = getTextResource(completeConfig.legend, completeConfig.legend);
                        legendInner.classList.add('text-md', 'font-semibold', 'text-gray-700', 'px-2', 'cursor-pointer');
                        controlElementContainer.appendChild(legendInner);

                        const fieldsContainerInner = document.createElement('div');
                        fieldsContainerInner.className = 'fieldset-content';
                        if (completeConfig.initiallyExpanded) {
                            fieldsContainerInner.style.display = 'block';
                        }
                        controlElementContainer.appendChild(fieldsContainerInner);

                        legendInner.addEventListener('click', () => {
                            controlElementContainer.classList.toggle('expanded');
                            fieldsContainerInner.style.display = controlElementContainer.classList.contains('expanded') ? 'block' : 'none';
                            setTimeout(() => {
                                if (controlElementContainer.classList.contains('expanded') && controlElementContainer.offsetParent !== null) {
                                    const specialContainersInField = controlElementContainer.querySelectorAll('[data-special-container-id]');
                                    specialContainersInField.forEach(sc => {
                                        const scId = sc.id || sc.dataset.specialContainerId;
                                        if (scId && specialContainerInitializers[scId]) initializeSpecialContainer(scId);
                                    });
                                    if (specialContainerInitializers[completeConfig.id]) initializeSpecialContainer(completeConfig.id);
                                }
                            }, 0);
                        });

                        if (completeConfig.description) {
                            const pDesc = document.createElement('p');
                            pDesc.classList.add('text-sm', 'text-gray-600', 'mb-4');
                            pDesc.textContent = getTextResource(completeConfig.description, completeConfig.description);
                            fieldsContainerInner.appendChild(pDesc);
                        }
                        if (completeConfig.fields && Array.isArray(completeConfig.fields)) {
                            processFields(completeConfig.fields, fieldsContainerInner); // Recursive call
                        }
                        // Store in controls
                        if (typeof controls === 'object' && controls !== null) {
                            controls[completeConfig.id] = {
                                element: controlElementContainer, // The fieldset itself
                                config: completeConfig,
                                type: 'collapsible_section_field' // Custom type for controls object
                            };
                        } else {
                            console.error(`[UI] processFields: Das globale 'controls'-Objekt ist nicht verfügbar für collapsible_section ID "${completeConfig.id}".`);
                        }
                        break;
                     case 'textarea_summary': // Für die automatische Zusammenfassung
                        controlElementContainer = createTextInput(completeConfig.id, { ...completeConfig, label: labelText, placeholder: placeholderText }, 'textarea_readonly');
                        // Die Logik zur automatischen Befüllung müsste hier oder in updateBefundZusammenfassung erfolgen.
                        // Fürs Erste wird es als normale readonly Textarea behandelt.
                        // window.befundZusammenfassung wird oben bereits zugewiesen.
                        break;
                    case 'button_toggle_normalbefunde':
                        controlElementContainer = document.createElement('button');
                        controlElementContainer.type = 'button';
                        controlElementContainer.id = completeConfig.id;
                        controlElementContainer.className = completeConfig.cssClass || 'secondary mt-2';
                        // Text wird initial gesetzt und bei Klick aktualisiert
                        controlElementContainer.textContent = window.includeNormalInSummary ?
                            getTextResource(completeConfig.textRemoveKey, completeConfig.textRemoveDefault) :
                            getTextResource(completeConfig.textAddKey, completeConfig.textAddDefault);

                        controlElementContainer.addEventListener('click', () => {
                            window.includeNormalInSummary = !window.includeNormalInSummary;
                            console.log('[AppInit] button_toggle_normalbefunde geklickt. includeNormalInSummary ist jetzt:', window.includeNormalInSummary);
                            controlElementContainer.textContent = window.includeNormalInSummary ?
                                getTextResource(completeConfig.textRemoveKey, completeConfig.textRemoveDefault) :
                                getTextResource(completeConfig.textAddKey, completeConfig.textAddDefault);
                            window.updateBefundZusammenfassung();
                        });
                        break;
                    default:
                        console.warn('[AppInit] Unbekannter Feldtyp aus Konfiguration:', completeConfig.type, completeConfig.id);
                        controlElementContainer = document.createElement('div');
                        controlElementContainer.textContent = `Unbekannter Feldtyp: ${completeConfig.type}`;
                        controlElementContainer.className = 'text-orange-500';
                }

                if (controlElementContainer) {
                    // Check condition *after* element creation to determine initial visibility
                    if (isConditionalField) {
                        const initiallyVisible = checkFieldCondition(completeConfig, controls);
                        if (!initiallyVisible) {
                            controlElementContainer.style.display = 'none';
                            console.log(`[AppInit] Feld '${completeConfig.id}' wird initial aufgrund einer Bedingung ausgeblendet.`);
                        }
                    }
                    // Wenn der targetRenderContainer der Standard-Parent ist UND es keine spezifische containerId gab,
                    // dann füge das Element dem Parent hinzu.
                    // Wenn es eine spezifische containerId gab, wurde es bereits dort gerendert (oder der Host-Container wurde vorbereitet).
                    if (targetRenderContainer === parentContainer && !completeConfig.containerId) {
                        parentContainer.appendChild(controlElementContainer);
                    } else if (completeConfig.containerId && targetRenderContainer !== parentContainer) {
                        // Bereits im spezifischen Container gerendert oder Host vorbereitet.
                    } else if (targetRenderContainer !== parentContainer && !completeConfig.containerId) {
                        // Dies sollte nicht passieren, wenn die Logik oben korrekt ist.
                        // Es bedeutet, dass targetRenderContainer geändert wurde, aber keine containerId spezifiziert war.
                        // Zur Sicherheit trotzdem hinzufügen.
                         parentContainer.appendChild(controlElementContainer);
                    }
                }
            });
        };

        processFields(sectionConfig.fields, fieldsAndSubSectionsContainer);

        sectionConfig.subSections?.forEach((subSectionConf) => {
            // Filterung der Untersektion nach displayCriteria (falls vorhanden und spezifisch für die Untersektion)
            // if (subSectionConf.displayCriteria && !checkDisplayCriteria(subSectionConf, currentSelectedXRayType)) {
            //     return;
            // }

            const subFieldset = document.createElement('fieldset');
            subFieldset.classList.add('config-subsection', 'collapsible-fieldset', 'mt-4', 'mb-4', 'p-3', 'border', 'border-gray-200', 'rounded-md', 'bg-white');
             if (subSectionConf.initiallyExpanded) { // Aus der neuen Config
                subFieldset.classList.add('expanded');
            }

            const subLegend = document.createElement('legend');
            subLegend.textContent = getTextResource(subSectionConf.legend, subSectionConf.legend);
            subLegend.classList.add('text-md', 'font-semibold', 'text-gray-700', 'px-2', 'cursor-pointer');
            subFieldset.appendChild(subLegend);

            subLegend.addEventListener('click', () => {
                subFieldset.classList.toggle('expanded');
                // Toggle the display style of the content container
                subFieldsContainer.style.display = subFieldset.classList.contains('expanded') ? 'block' : 'none';
                setTimeout(() => {
                    if (subFieldset.classList.contains('expanded') && subFieldset.offsetParent !== null) {
                        console.log(`[AppInit] Sub-Fieldset '${subSectionConf.id}' expanded. Checking for special containers within.`);
                        let containerIdToInit = subSectionConf.containerId; // Für den Fall, dass die Sektion selbst ein spezieller Container ist
                        if (containerIdToInit && specialContainerInitializers[containerIdToInit]) {
                            initializeSpecialContainer(containerIdToInit);
                        } else {
                            // Durchsuche die Untersektion nach speziellen Containern
                            const specialContainersInSubFieldset = subFieldset.querySelectorAll('[id^="pathologische-zahnbefunde-container"], [id^="implantatplanungs-container"], [data-special-container-id]');
                            specialContainersInSubFieldset.forEach(sc => {
                                const subContainerIdToInit = sc.id || sc.dataset.specialContainerId;
                                if (subContainerIdToInit && specialContainerInitializers[subContainerIdToInit]) {
                                    initializeSpecialContainer(subContainerIdToInit);
                                }
                            });
                        }
                    }
                }, 0);
            });

            const subFieldsContainer = document.createElement('div');
            subFieldsContainer.className = 'fieldset-content';
             if (subSectionConf.initiallyExpanded) { // Aus der neuen Config
                subFieldsContainer.style.display = 'block';
            }

            // Wenn die Untersektion eine eigene containerId hat (für spezielle Renderer)
            if (subSectionConf.containerId) {
                subFieldsContainer.id = subSectionConf.containerId;
                console.log(`[AppInit] Sub-section '${subSectionConf.id}' verwendet spezifische containerId '${subSectionConf.containerId}'.`);
                if (specialContainerInitializers[subSectionConf.containerId]) {
                    subFieldsContainer.dataset.specialContainerId = subSectionConf.containerId;
                }
            }
            subFieldset.appendChild(subFieldsContainer);

            if (subSectionConf.description) {
                const subP = document.createElement('p');
                subP.classList.add('text-sm', 'text-gray-500', 'mb-3');
                subP.textContent = getTextResource(subSectionConf.description, subSectionConf.description);
                subFieldsContainer.appendChild(subP);
            }

            processFields(subSectionConf.fields, subFieldsContainer); // Verarbeite Felder der Untersektion

            // LoopSections (falls vorhanden und benötigt) - Momentan nicht in config_formSections_opg_newformat.js
            subSectionConf.loopSections?.forEach(loopDef => {
                console.log(`[AppInit] Processing loopSection '${loopDef.id}' within subSection '${subSectionConf.id}'. (Implementierung ausstehend)`);
                // Hier müsste die Logik zum dynamischen Hinzufügen und Verwalten von Loop-Instanzen implementiert werden.
            });

            fieldsAndSubSectionsContainer.appendChild(subFieldset);
        });
        befundForm.appendChild(fieldset);
    });

    // Sicherstellen, dass window.befundZusammenfassung korrekt gesetzt ist
    if (!window.befundZusammenfassung) {
        const existingSummary = document.getElementById('mySummaryTextarea') || document.getElementById('befundZusammenfassung');
        if (existingSummary && existingSummary.tagName === 'TEXTAREA') {
            window.befundZusammenfassung = existingSummary;
        } else {
            console.warn("[AppInit] befundZusammenfassung Element nicht im Formular gefunden oder erstellt. Erstelle Fallback.");
            // Dies sollte idealerweise nicht passieren, wenn die Konfiguration korrekt ist.
            const hiddenSummary = document.createElement('textarea');
            hiddenSummary.id = 'befundZusammenfassung_hidden_fallback';
            hiddenSummary.style.display = 'none';
            document.body.appendChild(hiddenSummary); // Nicht ideal, aber besser als nichts
            window.befundZusammenfassung = hiddenSummary;
        }
    }


    // Button für "Regelbefunde hinzufügen/entfernen" - wird jetzt dynamisch per 'button_toggle_normalbefunde' Feldtyp erstellt.
    // Die alte Logik hier kann entfernt werden, wenn der Button über die JSON-Konfig kommt.
    // Falls der Button nicht über JSON kommt, muss die alte Logik hier angepasst werden, um den Button zu finden/erstellen.
    // Annahme: Der Button wird jetzt über die field definition erstellt.

    // Kopierbutton erstellen, falls nicht vorhanden
    if (!document.getElementById('copyButtonContainer')) {
        const finalActionsDiv = document.createElement('div');
        finalActionsDiv.id = 'copyButtonContainer';
        finalActionsDiv.classList.add('mt-8', 'pt-6', 'border-t', 'border-gray-300', 'flex', 'flex-col', 'items-center');

        const copyButton = document.createElement('button');
        copyButton.type = 'button';
        copyButton.id = 'copyButton';
        copyButton.textContent = getTextResource("copyButtonText", appConfigData.general?.copyButtonText || 'Befund kopieren');
        copyButton.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded');
        finalActionsDiv.appendChild(copyButton);

        const copyFeedback = document.createElement('p');
        copyFeedback.id = 'copyFeedback';
        copyFeedback.classList.add('text-sm', 'mt-2', 'h-5'); // Höhe für Layoutstabilität
        finalActionsDiv.appendChild(copyFeedback);

        befundForm.appendChild(finalActionsDiv);
    }
    setupCopyButtonListener(appConfigData); // Listener neu anhängen

    // Textarea-Höhen anpassen
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', () => adjustTextareaHeight(textarea));
        adjustTextareaHeight(textarea); // Initiale Anpassung
    });

    // Fieldsets initial auf/zuklappen (Beispiel: erstes Haupt-Fieldset offen)
    const allMainFieldsets = befundForm.querySelectorAll(':scope > fieldset.collapsible-fieldset');
    allMainFieldsets.forEach((mainFs, mainIndex) => {
        if (!mainFs.classList.contains('expanded') && mainIndex === 0 && !mainFs.querySelector('fieldset.collapsible-fieldset.expanded')) { // Nur wenn nicht schon explizit expanded
             // mainFs.classList.add('expanded'); // Logik aus config_formSections_opg_newformat.js wird bevorzugt
        }
        // Die Logik für initiallyExpanded in der Config sollte das jetzt steuern.
        const contentDiv = mainFs.querySelector(':scope > .fieldset-content');
        if (contentDiv) {
            contentDiv.style.display = mainFs.classList.contains('expanded') ? 'block' : 'none';
        }

        const subFieldsets = mainFs.querySelectorAll('fieldset.config-subsection.collapsible-fieldset');
        subFieldsets.forEach(subFs => {
            const subContentDiv = subFs.querySelector(':scope > .fieldset-content');
            if (subContentDiv) {
                 subContentDiv.style.display = subFs.classList.contains('expanded') ? 'block' : 'none';
            }
        });
    });


    initializeAllVisibleSpecialContainers(); // Spezielle Container initialisieren, die jetzt sichtbar sind
    updateBefundZusammenfassung(); // Initiale Zusammenfassung erstellen
    console.log('[AppInit] populateForm finished.');
}


/**
 * Richtet den Event-Listener für den Kopierbutton ein.
 * @param {object} appConfigData Die geladene App-Konfiguration (window.appConfig).
 */
function setupCopyButtonListener(appConfigData) {
    console.log('[AppInit] setupCopyButtonListener called.');
    const copyButton = document.getElementById('copyButton');
    const copyFeedback = document.getElementById('copyFeedback');

    if (copyButton && copyFeedback) {
        // Alten Listener entfernen, falls vorhanden, durch Klonen des Buttons
        const newCopyButton = copyButton.cloneNode(true);
        if (copyButton.parentNode) {
            copyButton.parentNode.replaceChild(newCopyButton, copyButton);
        } else {
            // Sollte nicht passieren, wenn der Button korrekt im DOM ist.
            console.error("[AppInit] CopyButton hat keinen ParentNode. Listener kann nicht sicher neu angehängt werden.");
            return;
        }
        console.log('[AppInit] Copy button listener (re-)attached.');

        newCopyButton.addEventListener('click', () => {
            console.log('[AppInit] Copy button clicked.');
            if (typeof updateBefundZusammenfassung === 'function') {
                updateBefundZusammenfassung(); // Sicherstellen, dass die Zusammenfassung aktuell ist
            }

            let clipboardText = "";
            if (window.befundZusammenfassung && typeof window.befundZusammenfassung.value === 'string') {
                clipboardText = window.befundZusammenfassung.value;
                console.log('[AppInit] Content from befundZusammenfassung for clipboard:', clipboardText.substring(0, 100) + "...");
            } else {
                console.warn('[AppInit] befundZusammenfassung Element oder dessen Wert ist nicht verfügbar für das Kopieren.');
                clipboardText = getTextResource('noSpecificFindingsAbnormalText', appConfigData.general?.noSpecificFindingsAbnormalText || "Keine Befunde zum Kopieren vorhanden.");
            }

            navigator.clipboard.writeText(clipboardText.trim()).then(() => {
                console.log('[AppInit] Clipboard write successful.');
                if (copyFeedback) {
                    copyFeedback.textContent = getTextResource("copyFeedbackSuccess", appConfigData.general?.copyFeedbackSuccess || 'Kopiert!');
                    copyFeedback.className = 'text-sm text-green-600 mt-2 h-5';
                }
                const originalText = newCopyButton.textContent;
                newCopyButton.textContent = getTextResource("copyButtonTextSuccess", appConfigData.general?.copyButtonTextSuccess || 'Kopiert!');
                newCopyButton.classList.remove('bg-blue-500', 'hover:bg-blue-700');
                newCopyButton.classList.add('bg-green-500', 'hover:bg-green-700');
                newCopyButton.disabled = true;

                setTimeout(() => {
                    if (copyFeedback) copyFeedback.textContent = '';
                    newCopyButton.textContent = originalText;
                    newCopyButton.classList.remove('bg-green-500', 'hover:bg-green-700');
                    newCopyButton.classList.add('bg-blue-500', 'hover:bg-blue-700');
                    newCopyButton.disabled = false;
                }, 2500);

            }).catch(err => {
                console.error('[AppInit] Fehler beim Kopieren: ', err);
                if (copyFeedback) {
                    copyFeedback.textContent = getTextResource("copyFeedbackError", appConfigData.general?.copyFeedbackError || 'Fehler beim Kopieren!');
                    copyFeedback.className = 'text-sm text-red-600 mt-2 h-5';
                }
                setTimeout(() => { if (copyFeedback) copyFeedback.textContent = ''; }, 3000);
            });
        });
    } else {
        console.warn('[AppInit] Copy button oder feedback element nicht gefunden. Listener nicht eingerichtet.');
    }
}


/**
 * Initialisiert die gesamte Anwendung neu, basierend auf der (potenziell geänderten) Konfiguration.
 * @param {object} newConfig Die neue oder aktuelle App-Konfiguration (sollte window.appConfig sein).
 */
window.reinitializeOPGApplication = function(newConfig) {
    console.log("[AppInit] reinitializeOPGApplication called.");
    // newConfig ist bereits das globale window.appConfig, das von loadAppConfig befüllt wurde.
    // Es ist nicht notwendig, window.appConfig hier neu zuzuweisen, es sei denn,
    // man möchte explizit eine komplett neue, unabhängige Konfiguration übergeben.
    // Für den normalen Fluss ist window.appConfig bereits aktuell.
    const configToUse = newConfig || window.appConfig; // Nutze übergebene Config oder globales appConfig

    if (typeof configToUse !== 'object' || configToUse === null) {
        console.error("[AppInit] Keine gültige Konfiguration zum Neuinitialisieren vorhanden.");
        const form = document.getElementById('befundungsForm');
        if (form) form.innerHTML = '<p class="text-red-500 text-center">Fehler: Konnte Anwendung nicht mit neuer Konfiguration laden.</p>';
        return;
    }
    // window.appConfig = JSON.parse(JSON.stringify(configToUse)); // Nur wenn newConfig wirklich eine *neue* Instanz ist.
                                                                // Normalerweise ist window.appConfig schon aktuell.

    initializeGeneralUI(configToUse);
    createTopLevelSelector(); // Erstellt den Selektor und setzt ggf. currentSelectedXRayType
    populateForm(configToUse);           // Baut das Formular basierend auf currentSelectedXRayType
    console.log("[AppInit] reinitializeOPGApplication finished.");
}

/**
 * Updates the visibility of fields/sections based on their conditions.
 * Call this function when a controlling field's value changes.
 * @param {string} changedControlId - The ID of the control that triggered the update (optional, for logging).
 */
window.updateDependentFieldVisibility = function(changedControlId) {
    console.log(`[AppInit] updateDependentFieldVisibility triggered by: ${changedControlId || 'unknown control'}`);

    for (const controlId in controls) {
        const control = controls[controlId];
        if (control.config && control.config.condition) {
            // Determine the actual DOM element to toggle.
            // For inputs, it's usually the .input-group. For sections/custom containers, it's control.element itself.
            let elementToToggle = control.element;
            if (!elementToToggle) {
                console.warn(`[AppInit] updateDependentFieldVisibility: No DOM element found for control ${controlId}`);
                continue;
            }

            if (control.type === 'select' || control.type === 'text' || control.type === 'textarea' || control.type === 'zahnschema') {
                const groupContainer = control.element.closest('.input-group');
                if (groupContainer) {
                    elementToToggle = groupContainer;
                }
            }
            // For 'multiselect', 'collapsible_section_field', 'inline_zahnschema', control.element is already the main container/fieldset.

            const shouldBeVisible = checkFieldCondition(control.config, controls);
            const isCurrentlyVisible = elementToToggle.style.display !== 'none';

            if (shouldBeVisible && !isCurrentlyVisible) {
                elementToToggle.style.display = ''; // Reset to default display (block, flex, etc.)
                console.log(`[AppInit] Showing conditional element: ${controlId} (type: ${control.type || control.config.type})`);

                // Initialize special containers if they become visible
                let containerIdForInit = null; // Variable to hold the ID of a potential special container to initialize
                if (control.config.type === 'inline_zahnschema') { // Check config.type as control.type might be generic
                    containerIdForInit = control.config.id;
                } else if (control.type === 'collapsible_section_field') { // This is our custom type for fieldsets
                    containerIdForInit = control.config.id; // The fieldset itself might be a special container (less likely)
                                                          // Or it contains special_container children
                }

                if (containerIdForInit && specialContainerInitializers[containerIdForInit]) {
                   initializeSpecialContainer(containerIdForInit);
                }
                // Also check for special containers *within* a newly visible fieldset/container
                const specialChildren = elementToToggle.querySelectorAll('[data-special-container-id]');
                specialChildren.forEach(sc => {
                    const childContainerId = sc.id || sc.dataset.specialContainerId;
                    if (childContainerId && specialContainerInitializers[childContainerId]) {
                        initializeSpecialContainer(childContainerId);
                    }
                });
            } else if (!shouldBeVisible && isCurrentlyVisible) {
                elementToToggle.style.display = 'none';
                console.log(`[AppInit] Hiding conditional element: ${controlId}`);
            }
        }
    }
};



// Hauptinitialisierung beim Laden des DOMs
document.addEventListener('DOMContentLoaded', async () => {
    console.log("[AppInit] DOMContentLoaded event fired. Starting initialization...");

    // DOM-Elemente referenzieren
    appContainer = document.querySelector('.app-container');
    zahnschemaModal = document.getElementById('zahnschemaModal');
    zahnschemaContainer = document.getElementById('zahnschemaContainer');
    selectedTeethOutput = document.getElementById('selected-teeth-output');
    zahnschemaTitleEl = document.getElementById('zahnschemaTitle');
    closeZahnschemaModalBtn = document.getElementById('closeZahnschemaModalBtn');
    confirmZahnschemaBtn = document.getElementById('confirmZahnschemaBtn');
    cancelZahnschemaBtn = document.getElementById('cancelZahnschemaBtn');

    // Event-Listener für Zahnschema-Modal
    if (closeZahnschemaModalBtn) closeZahnschemaModalBtn.onclick = closeZahnschema;
    if (confirmZahnschemaBtn) confirmZahnschemaBtn.onclick = confirmZahnschema;
    if (cancelZahnschemaBtn) cancelZahnschemaBtn.onclick = closeZahnschema;

    // Entferne Listener und UI-Elemente für den Konfigurations-Editor (falls noch Reste vorhanden)
    const mainToggleBtn = document.getElementById('toggleConfigEditorBtn');
    if (mainToggleBtn) mainToggleBtn.remove();
    const configEditorOverlay = document.getElementById('configEditorOverlay');
    if (configEditorOverlay) configEditorOverlay.remove();

    console.log("[AppInit] About to call loadAppConfig().");
    try {
        // Initial load: loadAppConfig() without arguments will load the first module.
        // This populates window.appConfig with the data from the first module.
        await loadAppConfig(); 
        console.log("[AppInit] Initial loadAppConfig() call completed.");

        // window.appConfig ist jetzt mit allen Konfigurationen (aller Röntgenarten) befüllt.
        // reinitializeOPGApplication verwendet dann window.appConfig.
        if (window.appConfig) { // Überprüfen, ob appConfig nach dem Laden existiert
            console.log("[AppInit] Initial window.appConfig loaded. About to call reinitializeOPGApplication().");
            window.reinitializeOPGApplication(window.appConfig); // Übergibt das globale, befüllte appConfig
            console.log("[AppInit] reinitializeOPGApplication() call completed.");
        } else {
            console.error("[AppInit] FATAL: Konfiguration (window.appConfig) konnte nicht geladen werden oder ist leer nach loadAppConfig().");
            throw new Error("Konfiguration (window.appConfig) konnte nicht geladen werden.");
        }
    } catch (error) {
        console.error("[AppInit] FATAL: App kann nicht initialisiert werden:", error);
        const form = document.getElementById('befundungsForm');
        if (form) form.innerHTML = '<p class="text-red-500 text-center py-8">FEHLER: Anwendungskonfiguration konnte nicht geladen werden. Details siehe Konsole.</p>';
        // Hier sollte die weitere Ausführung gestoppt oder ein Fallback-UI angezeigt werden.
        return;
    }

    // Globaler Click-Listener zum Schließen von Dropdowns/Multiselects
    document.addEventListener('click', (e) => {
        // Schließe alle aktiven Multiselect-Optionen, wenn außerhalb geklickt wird
        if (!e.target.closest('.multi-select-container') && !e.target.closest('.multi-select-button')) {
            document.querySelectorAll('.multi-select-options.active').forEach(optionsDiv => {
                optionsDiv.classList.remove('active');
            });
        }
        // Schließe das Zahnschema-Modal, wenn außerhalb des Modal-Contents geklickt wird
        if (zahnschemaModal && e.target === zahnschemaModal) {
            closeZahnschema();
        }
    });
    console.log("[AppInit] DOMContentLoaded handler finished.");
});