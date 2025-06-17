// ========================================================================
// MODULE: ZAHNSCHEMA MODAL LOGIC
// Datei: zahnschema-module.js
// ========================================================================

let zahnschemaModal;
let zahnschemaContainer;
let selectedTeethOutput;
let zahnschemaTitleEl;
let currentZahnschemaTargetId = null; // ID of the control that opened the modal
let currentSelectedTeeth = [];
// currentZahnschemaOptionValueTarget wird in ui-components.js gesetzt

function generateHorizontalZahnschema() {
    if (!zahnschemaContainer) {
        return;
    }
    zahnschemaContainer.innerHTML = '';
    const quadrants_map = {
        ok_links_betrachter: [18, 17, 16, 15, 14, 13, 12, 11],
        ok_rechts_betrachter:  [21, 22, 23, 24, 25, 26, 27, 28],
        uk_links_betrachter: [48, 47, 46, 45, 44, 43, 42, 41],
        uk_rechts_betrachter:  [31, 32, 33, 34, 35, 36, 37, 38]
    };
    const createRow = (qLeft, qRight) => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('zahnschema-row');
        const qLeftDiv = document.createElement('div');
        qLeftDiv.classList.add('zahnschema-quadrant');
        qLeft.forEach(num => qLeftDiv.appendChild(createZahnElement(num)));
        const qRightDiv = document.createElement('div');
        qRightDiv.classList.add('zahnschema-quadrant');
        qRight.forEach(num => qRightDiv.appendChild(createZahnElement(num)));
        const mitteDiv = document.createElement('div');
        mitteDiv.classList.add('zahnschema-mitte');
        rowDiv.appendChild(qLeftDiv);
        rowDiv.appendChild(mitteDiv);
        rowDiv.appendChild(qRightDiv);
        zahnschemaContainer.appendChild(rowDiv);
    };
    createRow(quadrants_map.ok_links_betrachter, quadrants_map.ok_rechts_betrachter);
    createRow(quadrants_map.uk_links_betrachter, quadrants_map.uk_rechts_betrachter);
    updateSelectionVisuals();
}

function createZahnElement(zahnNum) {
    const zahnDiv = document.createElement('div');
    zahnDiv.classList.add('zahn');
    zahnDiv.textContent = String(zahnNum).slice(-1);
    zahnDiv.title = `Zahn ${zahnNum}`;
    zahnDiv.dataset.zahnNum = String(zahnNum);
    zahnDiv.onclick = () => toggleZahnSelection(zahnDiv);
    return zahnDiv;
}

function toggleZahnSelection(zahnElement) {
    const zahnNumStr = zahnElement.dataset.zahnNum;
    const isSelected = zahnElement.classList.toggle('selected');
    if (isSelected) {
        if (!currentSelectedTeeth.includes(zahnNumStr)) currentSelectedTeeth.push(zahnNumStr);
    } else {
        currentSelectedTeeth = currentSelectedTeeth.filter(z => z !== zahnNumStr);
    }
    currentSelectedTeeth.sort((a, b) => parseInt(a) - parseInt(b));
    updateSelectedTeethOutput();
}

function updateSelectionVisuals() {
    if (!zahnschemaContainer) return;
    zahnschemaContainer.querySelectorAll('.zahn').forEach(el => {
         el.classList.toggle('selected', currentSelectedTeeth.includes(el.dataset.zahnNum));
     });
}

function updateSelectedTeethOutput() {
    const appConf = window.appConfig;
    const noSelectionText = appConf?.general?.noSelectionText || "Keine";
    const selectedTeethText = appConf?.general?.selectedTeethText || "Ausgewählte Zähne";
     if (selectedTeethOutput) {
        selectedTeethOutput.textContent = `${selectedTeethText}: ` + (currentSelectedTeeth.length > 0 ? currentSelectedTeeth.join(', ') : noSelectionText);
     }
}

function openZahnschema(targetControlId, title) {
    const appConf = window.appConfig; // Use window.appConfig directly
    if (!zahnschemaModal || !controls[targetControlId] || !appConf || !appConf.general) { // Added check for appConf.general
        console.error('[ZahnschemaModal] Modal, Ziel-Control oder AppConfig nicht initialisiert für:', targetControlId);
        return;
    }
    currentZahnschemaTargetId = targetControlId;
    const targetControl = controls[currentZahnschemaTargetId];

    if (zahnschemaTitleEl) {
        zahnschemaTitleEl.textContent = title || appConf.general?.modalTitleDefault || 'Zahnauswahl';
    }

    let teethStringToLoad = '';
    // Wenn das Zahnschema für die "Lückengebiss"-Option eines Multiselects geöffnet wird
    if (targetControl.type === 'multiselect' && currentZahnschemaOptionValueTarget && targetControl.value[currentZahnschemaOptionValueTarget]) {
        teethStringToLoad = targetControl.value[currentZahnschemaOptionValueTarget].details || '';
    } else if (targetControl.type === 'zahnschema_dynamic_multiselect') {
        teethStringToLoad = targetControl.value?.selectedTeeth || '';
    } else if (targetControl.type === 'zahnschema') { // Für direkte Zahnschema-Inputs
        teethStringToLoad = targetControl.value?.teeth || '';
    }

    currentSelectedTeeth = teethStringToLoad ? teethStringToLoad.split(',').map(s => s.trim()).filter(Boolean) : [];
    generateHorizontalZahnschema();
    updateSelectedTeethOutput();
    zahnschemaModal.style.display = 'block';
}

function closeZahnschema() {
    if (!zahnschemaModal) return;
    zahnschemaModal.style.display = 'none';
    currentZahnschemaTargetId = null;
    currentSelectedTeeth = [];
    currentZahnschemaOptionValueTarget = null; // Wichtig: Zurücksetzen nach Gebrauch
}

function confirmZahnschema() {
    if (!currentZahnschemaTargetId || !controls[currentZahnschemaTargetId]) {
        closeZahnschema();
        return;
    }
    const targetControl = controls[currentZahnschemaTargetId];
    const teethString = currentSelectedTeeth.join(', ');

    // Spezifische Logik für "Lückengebiss" in 'opg_zahnstatus_multiselect'
    if (targetControl.type === 'multiselect' && currentZahnschemaOptionValueTarget && targetControl.value[currentZahnschemaOptionValueTarget]) {
        targetControl.value[currentZahnschemaOptionValueTarget].details = teethString;
        const detailsInputId = `${currentZahnschemaTargetId}_${currentZahnschemaOptionValueTarget}_details`;
        const detailsInputElement = document.getElementById(detailsInputId);
        if (detailsInputElement) {
            detailsInputElement.value = teethString;
        }

        // Specific logic for "lueckengebiss" updating the main inline schema's missing state
        // This should only apply if the confirmed schema was for the "lueckengebiss" option
        // of the "zahnstatus_multiselect" control.
        if (currentZahnschemaTargetId === 'zahnstatus_multiselect' && currentZahnschemaOptionValueTarget === 'lueckengebiss') {
            const allTeethInInlineSchema = Object.keys(inlineZahnschemaState);
            allTeethInInlineSchema.forEach(toothId => {
                const isMissing = currentSelectedTeeth.includes(toothId);
                if (typeof updateInlineToothMissingState === 'function') {
                     updateInlineToothMissingState(toothId, isMissing);
                }
            });
            }
    } else if (targetControl.type === 'zahnschema') { // Für "normale" Zahnschema-Felder
        if (targetControl.inputElement && targetControl.value) {
            targetControl.inputElement.value = teethString;
            targetControl.value.teeth = teethString;
        }
    } else if (targetControl.type === 'zahnschema_dynamic_multiselect') {
        if (targetControl.zahnschemaInputElement && targetControl.value && targetControl.dynamicSelectsHostElement) {
            targetControl.zahnschemaInputElement.value = teethString;
            targetControl.value.selectedTeeth = teethString;
            updateDynamicRetentionSelects(currentZahnschemaTargetId, currentSelectedTeeth);
        }
    }

    updateBefundZusammenfassung();
    if (typeof updateAltersentsprechendOption === 'function') { // Sicherstellen, dass dies nach allen Änderungen aufgerufen wird
        updateAltersentsprechendOption();
    }
    closeZahnschema();
}

function updateDynamicRetentionSelects(mainControlId, selectedTeethArray) {
    const control = controls[mainControlId];
    if (!control || control.type !== 'zahnschema_dynamic_multiselect' || !control.dynamicSelectsHostElement) {
        return;
    }
    const retentionLageOptionen = getDynamicElementOptions('retentionLageOptionen');
    if (!retentionLageOptionen || retentionLageOptionen.length === 0) {
        control.dynamicSelectsHostElement.textContent = "Fehler: Konnte Detailoptionen nicht laden.";
        return;
    }

    const hostElement = control.dynamicSelectsHostElement;
    hostElement.innerHTML = '';
    const newDetailsPerTooth = {};

    selectedTeethArray.forEach(toothId => {
        const toothDetailControlId = `${mainControlId}_zahn_${toothId}_detail_multiselect`;
        const inputGroup = document.createElement('div');
        inputGroup.classList.add('input-group');
        const toothLabel = document.createElement('label');
        toothLabel.classList.add('control-label');
        toothLabel.textContent = `Details für Zahn ${toothId}:`;
        toothLabel.htmlFor = toothDetailControlId + '_button';
        inputGroup.appendChild(toothLabel);
        const multiSelectHost = document.createElement('div');
        multiSelectHost.id = toothDetailControlId + "_host";
        inputGroup.appendChild(multiSelectHost);
        hostElement.appendChild(inputGroup);

        let initialToothState = {};
        if (control.value.details_per_tooth && control.value.details_per_tooth[toothId]) {
            initialToothState = control.value.details_per_tooth[toothId];
        } else {
            retentionLageOptionen.forEach(opt => {
                initialToothState[opt.value] = { checked: false, text: opt.text, details: '', isDefault: opt.isDefault || false };
            });
        }
        newDetailsPerTooth[toothId] = initialToothState;

        createMultiSelect(toothDetailControlId, {
            typ: 'dynamic_retention_multiselect',
            label: '',
            containerElement: multiSelectHost,
            options: retentionLageOptionen,
            initialState: initialToothState,
            buttonTextConfig: {
                placeholder: 'Lage/Retention auswählen...',
                maxItemsToShow: 5
            }
        });
    });
    control.value.details_per_tooth = newDetailsPerTooth;
}
