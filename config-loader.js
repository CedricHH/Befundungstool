// config-loader.js (Überarbeitet für neue Konfigurationsstruktur)
// Lädt und aggregiert Konfigurationen aus aufnahmeartspezifischen Modulen.

/**
 * Stellt sicher, dass das window.appConfig Objekt und seine notwendigen Unterobjekte initialisiert sind.
 * Wird normalerweise von appconfig.js erledigt, aber diese Funktion dient als Sicherheitsnetz.
 */
function ensureAppConfigStructure() {
    if (typeof window.appConfig === 'undefined') {
        console.warn("[ConfigLoader] window.appConfig war nicht definiert. Initialisiere mit Basisstruktur. Stelle sicher, dass appconfig.js korrekt und vorher geladen wird.");
        window.appConfig = {};
    }
    window.appConfig.general = window.appConfig.general || {};
    window.appConfig.general.textResources = window.appConfig.general.textResources || {};
    window.appConfig.dynamicElementOptions = window.appConfig.dynamicElementOptions || {};
    window.appConfig.formSections = window.appConfig.formSections || [];
    window.appConfig.moduleRegistry = window.appConfig.moduleRegistry || {};
    window.appConfig.moduleRegistry.formSectionModules = window.appConfig.moduleRegistry.formSectionModules || [];
}

/**
 * Lädt die Anwendungskonfigurationen.
 * Iteriert durch die in `appConfig.moduleRegistry.formSectionModules` registrierten Module,
 * lädt deren Konfigurationen (die als globale Variablen erwartet werden) und
 * aggregiert `dynamicElementOptions` und `formSections` in das globale `appConfig` Objekt.
 */
async function loadAppConfig(xRayTypeToLoad = null) {
    console.log(`[ConfigLoader] loadAppConfig gestartet. Angeforderter xRayType: ${xRayTypeToLoad || 'Initial (erster verfügbarer)'}`);
    ensureAppConfigStructure(); // Stellt sicher, dass appConfig und seine Teile existieren

    // Globale Konfigurationscontainer zurücksetzen/initialisieren
    appConfig.dynamicElementOptions = {}; // Wird mit Optionen des spezifischen Moduls befüllt
    appConfig.formSections = [];          // Wird mit Sektionen des spezifischen Moduls befüllt
                                          // appConfig.general.textResources bleibt erhalten (aus appconfig.js)

    const modules = appConfig.moduleRegistry?.formSectionModules;
    if (!modules || modules.length === 0) {
        console.warn("[ConfigLoader] Keine formSectionModules in appConfig.moduleRegistry gefunden. Das Formular wird möglicherweise nicht korrekt aufgebaut.");
        document.dispatchEvent(new CustomEvent('appConfigLoaded', { detail: { status: 'warning', message: 'Keine Formularmodule registriert.' } }));
        return;
    }

    let moduleToLoadInfo = null;

    if (!xRayTypeToLoad) { // Initialer Ladevorgang oder kein spezifischer Typ angefordert
        moduleToLoadInfo = modules[0];
        console.log(`[ConfigLoader] Initialer Ladevorgang: Lade erstes Modul: ${moduleToLoadInfo.variableName} für xRayType: ${moduleToLoadInfo.xRayType}`);
    } else { // Spezifischer xRayType angefordert
        moduleToLoadInfo = modules.find(m => m.xRayType === xRayTypeToLoad);
        if (!moduleToLoadInfo) {
            console.error(`[ConfigLoader] Kein Modul für xRayType '${xRayTypeToLoad}' in appConfig.moduleRegistry gefunden.`);
            document.dispatchEvent(new CustomEvent('appConfigLoaded', { detail: { status: 'error', message: `Konfiguration für ${xRayTypeToLoad} nicht gefunden.` } }));
            return;
        }
        console.log(`[ConfigLoader] Lade spezifisches Modul: ${moduleToLoadInfo.variableName} für xRayType: ${moduleToLoadInfo.xRayType}`);
    }

    if (window[moduleToLoadInfo.variableName]) {
        const loadedConfigModule = window[moduleToLoadInfo.variableName];
        console.log(`[ConfigLoader] Verarbeite Konfigurationsmodul: ${moduleToLoadInfo.variableName} (erwarteter xRayType: ${moduleToLoadInfo.xRayType}, tatsächlicher Identifier im Modul: ${loadedConfigModule.xRayTypeIdentifier})`);

        // 1. dynamicElementOptions extrahieren und setzen (überschreibt vorherige)
        if (loadedConfigModule.dynamicElementOptions && typeof loadedConfigModule.dynamicElementOptions === 'object') {
            // Tiefe Kopie der Optionen des aktuellen Moduls
            appConfig.dynamicElementOptions = JSON.parse(JSON.stringify(loadedConfigModule.dynamicElementOptions));
        } else {
            console.warn(`[ConfigLoader] Modul ${moduleToLoadInfo.variableName} enthält keine 'dynamicElementOptions' oder es ist kein Objekt.`);
            appConfig.dynamicElementOptions = {}; // Sicherstellen, dass es ein leeres Objekt ist, falls nichts geladen wurde
        }

        // 2. formSections extrahieren und setzen (überschreibt vorherige)
        if (loadedConfigModule.formSections && Array.isArray(loadedConfigModule.formSections)) {
            const sectionsWithSource = loadedConfigModule.formSections.map(section => {
                return {
                    ...section,
                    _sourceConfigType: loadedConfigModule.xRayTypeIdentifier || moduleToLoadInfo.xRayType
                };
            });
            // Tiefe Kopie der Sektionen des aktuellen Moduls
            appConfig.formSections = JSON.parse(JSON.stringify(sectionsWithSource));
        } else {
            console.warn(`[ConfigLoader] Modul ${moduleToLoadInfo.variableName} enthält keine 'formSections' oder 'formSections' ist kein Array.`);
            appConfig.formSections = []; // Sicherstellen, dass es ein leeres Array ist
        }
    } else {
        console.error(`[ConfigLoader] Globale Variable '${moduleToLoadInfo.variableName}' für Modul '${moduleToLoadInfo.path}' nicht gefunden. Modul übersprungen.`);
        document.dispatchEvent(new CustomEvent('appConfigLoaded', { detail: { status: 'error', message: `Modul ${moduleToLoadInfo.variableName} nicht gefunden.` } }));
        return;
    }

    console.log("[ConfigLoader] Modulverarbeitung abgeschlossen.");
    console.log("[ConfigLoader] Geladene dynamicElementOptions:", JSON.parse(JSON.stringify(appConfig.dynamicElementOptions)));
    console.log("[ConfigLoader] Geladene formSections (Anzahl):", appConfig.formSections.length);
    // console.log("[ConfigLoader] Vollständige geladene formSections:", JSON.parse(JSON.stringify(appConfig.formSections)));

    console.log("[ConfigLoader] loadAppConfig abgeschlossen.");
    document.dispatchEvent(new CustomEvent('appConfigLoaded', { detail: { status: 'success', xRayType: moduleToLoadInfo.xRayType } }));
}


/**
 * Ruft eine Textressource ab.
 * Zuerst wird in `appConfig.general.textResources` nach dem Schlüssel gesucht.
 * Wenn nicht gefunden, wird angenommen, dass der `key` bereits der direkte Text ist,
 * oder der `fallback` wird verwendet.
 * @param {string} key - Der Schlüssel der Textressource oder der direkte Text.
 * @param {string} [fallback=key] - Der Text, der zurückgegeben wird, wenn der Schlüssel nicht gefunden wird. Standard ist der Schlüssel selbst.
 * @returns {string} Der Textressourcen-String.
 */
function getTextResource(key, fallback) {
    if (key === null || typeof key === 'undefined') {
        return typeof fallback !== 'undefined' ? fallback : '';
    }

    // Prüfe zuerst, ob es einen Eintrag in den globalen appConfig.general.textResources gibt.
    if (window.appConfig && window.appConfig.general && window.appConfig.general.textResources &&
        window.appConfig.general.textResources.hasOwnProperty(key)) {
        return window.appConfig.general.textResources[key];
    }

    // Wenn nicht in globalen Texten gefunden, wird angenommen, dass 'key' der eigentliche Text ist
    // oder der explizite Fallback verwendet wird. Wenn kein expliziter Fallback gegeben ist,
    // und der Key nicht in textResources war, geben wir den Key selbst zurück.
    return typeof fallback !== 'undefined' ? fallback : key;
}

/**
 * Ruft die Optionen für ein dynamisches Element ab (z.B. für Selects, Multiselects).
 * @param {string} optionsKey - Der Schlüssel, unter dem die Optionen in `appConfig.dynamicElementOptions` gespeichert sind.
 * @returns {Array|null} Ein Array von Optionen oder null, wenn nicht gefunden.
 */
function getDynamicElementOptions(optionsKey) {
    // console.log(`[ConfigLoader] getDynamicElementOptions aufgerufen für Key: '${optionsKey}'`);
    if (window.appConfig && window.appConfig.dynamicElementOptions &&
        typeof window.appConfig.dynamicElementOptions[optionsKey] !== 'undefined') {

        const optionsData = window.appConfig.dynamicElementOptions[optionsKey];

        // Die neue Struktur in config_formSections_opg_newformat.js hat oft:
        // "optionsKey": { "placeholder": "text", "items": [] }
        // oder direkt "optionsKey": []
        if (Array.isArray(optionsData)) {
            // console.log(`[ConfigLoader] Optionen für '${optionsKey}' direkt als Array gefunden.`);
            return optionsData;
        } else if (typeof optionsData === 'object' && optionsData !== null && Array.isArray(optionsData.items)) {
            // console.log(`[ConfigLoader] Optionen für '${optionsKey}' als Objekt mit 'items' Array gefunden.`);
            return optionsData.items; // Gibt das 'items' Array zurück
        } else if (typeof optionsData === 'object' && optionsData !== null) {
             console.warn(`[ConfigLoader] dynamicElementOptions für '${optionsKey}' ist ein Objekt, aber ohne 'items' Array. Gebe das Objekt selbst zurück, was möglicherweise nicht erwartet wird. Struktur:`, JSON.parse(JSON.stringify(optionsData)));
             return optionsData; // Fallback, um das Objekt selbst zurückzugeben
                }
        console.warn(`[ConfigLoader] dynamicElementOptions für '${optionsKey}' hat eine unerwartete Struktur. Erwartet Array oder Objekt mit 'items' Array.`, optionsData);
        return null;
    }
    console.warn(`[ConfigLoader] Optionen für dynamische Elemente unter Schlüssel "${optionsKey}" NICHT gefunden in appConfig.dynamicElementOptions.`);
    return null;
}

/**
 * HINWEIS: Diese Funktion ist mit der neuen Konfigurationsstruktur VERALTET,
 * da Felddefinitionen direkt in den `formSections` enthalten sind und nicht mehr
 * zentral in `appConfig.fieldDefinitions` gespeichert werden.
 * @param {string} key - Der Konfigurationsschlüssel des Feldes.
 * @returns {undefined} Gibt immer undefined zurück und loggt eine Warnung.
 */
function getFieldDefinition(key) {
    console.warn(`[ConfigLoader] DEPRECATED: getFieldDefinition(key) für '${key}' aufgerufen. Diese Funktion ist veraltet. Felddefinitionen sind inline in formSections zu finden.`);
    // In der alten Struktur:
    // if (window.appConfig && window.appConfig.fieldDefinitions && window.appConfig.fieldDefinitions.hasOwnProperty(key)) {
    //     return window.appConfig.fieldDefinitions[key];
    // }
    // console.warn(`[ConfigLoader] VERALTET: FieldDefinition für Schlüssel '${key}' nicht gefunden (da fieldDefinitions nicht mehr zentral befüllt wird).`);
    return undefined;
}

// Stellt sicher, dass die Konfiguration beim ersten Laden des Skripts (oder bei Bedarf) ausgeführt wird.
// Der eigentliche Aufruf von loadAppConfig() erfolgt typischerweise nach dem DOMContentLoaded Event
// in app-init-and-listeners.js, nachdem alle Konfigurationsskripte geladen wurden.
console.log('[ConfigLoader] config-loader.js wurde geladen und ist bereit.');
