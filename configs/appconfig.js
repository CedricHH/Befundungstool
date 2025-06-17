// appConfig.js
// Defines the basic application configuration structure and module registry.
// Version nach Refactoring-Plan.

// Stellt sicher, dass das globale appConfig-Objekt existiert.
// In einer realen Anwendung würde dies typischerweise nur einmal initialisiert.
// Da die Skripte aber einzeln geladen und potenziell neu bewertet werden könnten,
// sorgt diese Prüfung für Robustheit.
if (typeof window.appConfig === 'undefined') {
    console.log('[appConfig.js] Initializing window.appConfig object.');
    window.appConfig = {};
} else {
    console.log('[appConfig.js] window.appConfig object already exists. Modifying moduleRegistry.');
}

window.appConfig.general = { // Behält allgemeine, globale Texte und Einstellungen
    appTitle: "Röntgen Befundungs-Tool Refactored",
    xRayTypeSelectorLabel: "Aufnahmeart auswählen:",
    modalTitleDefault: "Zahnauswahl",
    selectedTeethText: "Ausgewählte Zähne",
    noSelectionText: "Keine",
    confirmBtnText: "Bestätigen",
    cancelBtnText: "Abbrechen",
    copyButtonText: "Befund kopieren",
    copyButtonTextSuccess: "Kopiert!",
    copyFeedbackSuccess: "Kopiert!",
    copyFeedbackError: "Fehler beim Kopieren!",
    addNormalBefundeBtnText: "Regelbefunde zur Zusammenfassung hinzufügen",
    removeNormalBefundeBtnText: "Regelbefunde entfernen",
    opbPlaceholderText: "opB",
    // Weitere allgemeine Texte, die nicht direkt an UI-Element-Definitionen gebunden sind
    textResources: { // Dieser Bereich ist für wirklich globale Textbausteine
        "untersuchungstypLabel": "Art der Aufnahme",
        "indikationSectionLegend": "Indikation",
        "befundSectionLegend": "Befund",
        "technikLimitationenLegend": "Technische Qualität, Limitationen & Abbildungsfenster",
        "dentalStatusSubSectionLegend": "Zahnstatus & dentaler Befund",
        "pathologicalFindingsSubSectionLegend": "Pathologische Zahnbefunde (pro Zahn)",
        "implantatplanungLegend": "Implantatplanung",
        "sonstigeBefundeSubSectionLegend": "Weitere Auffälligkeiten (Allgemein)",
        "summarySectionLegend": "Zusammenfassung Befunde",
        "assessmentSectionLegend": "Indikationsbezogene Beurteilung / Empfehlung",
        "assessmentSectionLegendGesamtbeurteilung": "Indikationsbezogene Beurteilung:",
        "assessmentSectionLegendEmpfehlung": "Empfehlung:",
        "linksLabelText": "Links",
        "rechtsLabelText": "Rechts",
        "zahnLabel": "Zahn",
        "mmEinheitText": "mm",
        "bitte_angeben": "Bitte angeben...",
        "auswaehlen": "Auswählen...",
        "beschreibungPlaceholder": "Beschreibung...",
        "lokalisationPlaceholder": "Lokalisation...",
        "allTeethNormalSummary": "Alle Zähne: ohne pathologischen Befund (opB.)",
        "keineSpezifischenPathBefundeAusgewaehlt": "Keine spezifischen pathologischen Befunde ausgewählt.",
        "keineSpezifischeBeurteilung": "(Keine spezifische Beurteilung)",
        "keineSpezifischeEmpfehlung": "(Keine spezifische Empfehlung)",
        "nichtPathologischeBefundeSectionLegend": "Nicht pathologische Befunde",
        "keine_angabe_aufnahmeart": "(Keine Angabe)",
        "aufnahmeart_nicht_verfuegbar": "(Aufnahmeart nicht verfügbar)",
        "keine_spezifische_indikation": "(Keine spezifische Indikation)",
        "standardDefaultSuffix": "(Standard)",
        "otherTeethNoSpecificPathologicalFindingsOpB": "Weitere Zähne ohne spezifische pathologische Einzelbefunde: opB."
        // Fügen Sie hier weitere wirklich globale Texte hinzu, die von getTextResource() verwendet werden könnten.
    }
};

window.appConfig.moduleRegistry = {

    formSectionModules: [
        // Beispiel für die neue Struktur:
        {
            path: "configs/config_formSections_opg_newformat.js", // Pfad zur neuen Datei
            variableName: "StandardFormConfiguration",        // Globaler Variablenname, den die Datei bereitstellt
            xRayType: "OPG",                             // Identifikator der Aufnahmeart
            displayNameKey: "untersuchungstypOPGStandard"         // Schlüssel für den Anzeigenamen in textResources
        },
         {
            path: "configs/config_formSections_dvt_Ok_newformat.js",
            variableName: "FormConfiguration", 
             xRayType: "dvt_Ok",
             displayNameKey: "untersuchungstypOberkiefer"
         },
         {
             path: "configs/config_formSections_dvt_Uk_newformat.js",
             variableName: "dvtUkFormConfiguration",
             xRayType: "dvt_Uk",
             displayNameKey: "untersuchungstypUnterkiefer"
         }
        // ... weitere aufnahmeartspezifische Konfigurationsdateien
    ]
};

// Stellt sicher, dass textResources existiert, bevor es im IIFE verwendet wird.
window.appConfig.general.textResources = window.appConfig.general.textResources || {};

// Initialisierung der Konfigurationscontainer, die vom config-loader befüllt werden.
// Diese werden hier deklariert, um sicherzustellen, dass sie existieren, bevor der Loader versucht, sie zu befüllen.
window.appConfig.dynamicElementOptions = window.appConfig.dynamicElementOptions || {};
window.appConfig.formSections = window.appConfig.formSections || [];

/**
 * Extracts all xRayType values from the moduleRegistry.formSectionModules
 * and returns them as an array.
 * @returns {string[]} An array of xRayType strings.
 */
window.appConfig.xRayTypes = (function() {
    // Check if moduleRegistry and formSectionModules exist and are an array
    if (window.appConfig &&
        window.appConfig.moduleRegistry &&
        Array.isArray(window.appConfig.moduleRegistry.formSectionModules)) {
        // Use map to extract the xRayType and its display name from each module
        return window.appConfig.moduleRegistry.formSectionModules.map(function(module) {
            const displayName = (window.appConfig.general.textResources && window.appConfig.general.textResources[module.displayNameKey])
                                ? window.appConfig.general.textResources[module.displayNameKey]
                                : module.xRayType; // Fallback to xRayType if no displayNameKey or text found
            return { value: module.xRayType, text: displayName };
        });
    }
    // Return an empty array if the structure is not as expected
    console.warn('[appConfig.js] moduleRegistry.formSectionModules is not found or not an array. Returning empty array for xRayTypes.');
    return [];
})();

console.log('[appConfig.js] appConfig (refactored) structure and module registry initialized:', JSON.parse(JSON.stringify(window.appConfig)));
