// V6/config/config_formSections_.js
// Contains the highly integrated configuration for  forms.
// Refactored for use without ES6 modules (file:/// protocol).

(function () {
  // --- Start of Original File Content (with modifications) ---

  // const 'CONFIG' = 'Config'; // This line was commented out and seems like a placeholder, removed.
  // debugLog is not available here unless debugfunc.js is loaded AND debugLog is global.
  // For a pure config file, it's best to avoid side effects like logging.
  // If logging is essential, ensure debugLog is globally available before this script runs.
  // console.log('[LOG] Initializing ultra-condensed  form configuration.'); // Replaced by debugLog, but removed for cleaner config.

  const formConfig = {
    xRayTypeIdentifier: "OPG",

    dynamicElementOptions: {
      "IndikationOptions": [
        { "value": "routine_uebersicht", "text": "Routinediagnostik / Übersicht", "isDefault": true },
        { "value": "implantatplanung", "text": "Implantatplanung" },
        { "value": "verlagerte_zaehne", "text": "Verlagerte/retinierte Zähne" },
        { "value": "zysten_tumoren", "text": "Zysten/Tumoren Abklärung" },
        { "value": "kfo", "text": "Kieferorthopädische Fragestellung" },
        { "value": "kg_diagnostik", "text": "Kiefergelenksdiagnostik" },
        { "value": "trauma_fraktur", "text": "Trauma/Frakturabklärung" },
        { "value": "schmerzen_unklar", "text": "Unklare Schmerzsymptomatik" },
        { "value": "sonstiges", "text": "Sonstiges", "needsDetails": true, "placeholderDetails": "Grund der Aufnahme...", "detailsType": "textarea" }
      ],
      "TechQualitaetOptions": [
        { "value": "optimal", "text": "Positionierung, Belichtung und Abbildungsqualität optimal", "isDefault": true },
        { "value": "eingeschraenkt", "text": "Eingeschränkt durch" }
      ],
      "TechEinschraenkungenOptions": [
        { "value": "verwacklung", "text": "leichte Verwacklung / Bewegungsunschärfe" },
        { "value": "positionierungsfehler", "text": "Positionierungsfehler", "needsDetails": true, "placeholderDetails": "Beschreibung Positionierungsfehler..." },
        { "value": "belichtungsfehler", "text": "Belichtungsfehler", "needsDetails": true, "placeholderDetails": "Beschreibung Belichtungsfehler..." },
        { "value": "schuerze", "text": "Schatten durch Röntgenschürze / Schutzweste" },
        { "value": "metallartefakte", "text": "Metallartefakte durch Zahnersatz/Piercings", "needsDetails": true, "placeholderDetails": "Beschreibung/Lokalisation Metallartefakte..." },
        { "value": "sonstige_artefakte", "text": "Sonstige Artefakte", "needsDetails": true, "placeholderDetails": "Beschreibung sonstige Artefakte..." }
      ],
      "AbbildungsfensterOptions": [
        { "value": "vollstaendig", "text": "Vollständige Darstellung von Ober- und Unterkiefer inklusive beider Kiefergelenke", "isDefault": true },
        { "value": "uebersichtlich", "text": "Übersichtliche Abbildung dentoalveolärer und benachbarter skelettaler Strukturen", "isDefault": true },
        { "value": "unvollstaendig", "text": "Abbildung unvollständig / Teilbereiche nicht beurteilbar", "needsDetails": true, "placeholderDetails": "Beschreibung unvollständige Abbildung..." }
      ],
      "OrbitaboedenOptions": [
        { "value": "intakt", "text": "intakt und regelrecht dargestellt, soweit im Ausschnitt sichtbar", "isDefault": true },
        { "value": "pathologisch", "text": "Pathologischer Befund / Auffälligkeit", "needsDetails": true, "placeholderDetails": "Beschreibung Pathologie Orbitaboden...", "isPathological": true }
      ],
      "JochbeineOptions": [
        { "value": "symmetrisch", "text": "symmetrisch, unauffällig (projektionsbedingte Überlagerungen ohne path. Bedeutung)", "isDefault": true },
        { "value": "asymmetrie", "text": "Asymmetrie / Frakturverdacht / Pathologie", "needsDetails": true, "placeholderDetails": "Beschreibung Asymmetrie/Pathologie Jochbein...", "isPathological": true }
      ],
      "NasenhoehleOptions": [
        { "value": "unauffaellig", "text": "unauffällig", "isDefault": true },
        { "value": "pathologisch", "text": "Pathologischer Befund / Auffälligkeit", "needsDetails": true, "placeholderDetails": "z.B. deutliche Septumdeviation, Concha bullosa, Verschattung...", "isPathological": true }
      ],
      "SinusMaxillaresOptions": [
        { "value": "klar", "text": "klar belüftet, Schleimhaut unauffällig, knöcherne Begrenzungen intakt", "isDefault": true },
        { "value": "basale_schwellung", "text": "Mäßige basale Schleimhautschwellung (< 3mm) ohne Krankheitswert" },
        { "value": "path_verschattung", "text": "Pathologische Verschattung / Sekret / deutliche Schleimhautschwellung", "needsDetails": true, "placeholderDetails": "Beschreibung/Seite Verschattung...", "isPathological": true },
        { "value": "path_zyste", "text": "Pathologische Zystische/Polypoide Läsion", "needsDetails": true, "placeholderDetails": "Beschreibung/Seite/Größe approx. Zyste...", "isPathological": true },
        { "value": "fremdkoerper", "text": "Fremdkörper", "needsDetails": true, "placeholderDetails": "Beschreibung/Seite Fremdkörper...", "isPathological": true },
        { "value": "dehiszenz", "text": "knöcherne Dehiszenz / Relation zu Zahnwurzeln", "needsDetails": true, "placeholderDetails": "Seite/Lokalisation Dehiszenz...", "isPathological": true }
      ],
      "RecessusAlveolaresOptions": [
        { "value": "opb", "text": "ohne pathologischen Befund", "isDefault": true },
        { "value": "pathologisch", "text": "Pathologischer Befund / Auffälligkeit", "needsDetails": true, "placeholderDetails": "Beschreibung Pathologie Recessus...", "isPathological": true }
      ],
      "CanalisInfraorbitaleOptions": [
        { "value": "regelrecht", "text": "regelrecht abgrenzbar", "isDefault": true },
        { "value": "nicht_sicher", "text": "nicht sicher abgrenzbar" },
        { "value": "pathologisch", "text": "Pathologischer Befund / Auffälligkeit", "needsDetails": true, "placeholderDetails": "Beschreibung Pathologie Canalis infraorbitale...", "isPathological": true }
      ],
      "NasenbodenGaumenOptions": [
        { "value": "unauffaellig", "text": "unauffällig, keine Erweiterung oder Zystenbildung", "isDefault": true },
        { "value": "pathologisch", "text": "Pathologischer Befund / Auffälligkeit", "needsDetails": true, "placeholderDetails": "z.B. V.a. Zyste im Canalis incisivus...", "isPathological": true }
      ],
      "ZahnstatusOptions": [
        { "value": "altersentsprechend", "text": "Altersentsprechend vollständiges Gebiss, regelrechte Zahnstellung", "isDefault": true },
        { "value": "lueckengebiss", "text": "Lückengebiss / Teilbezahnt", "needsDetails": true, "detailsType": "zahnschema", "placeholderDetails": "Fehlende Zähne (Schema)...", "markAsFinding": true },
        { "value": "zahnlos", "text": "Zahnlos", "markAsFinding": true },
        { "value": "fehlstellungen", "text": "Zahnfehlstellungen/Anomalien", "needsDetails": true, "placeholderDetails": "Beschreibung Zahnfehlstellungen...", "isPathological": true },
        { "value": "ueberzaehlig", "text": "Überzählige Zähne / Mehranlagen", "needsDetails": true, "detailsType": "zahnschema", "placeholderDetails": "Lokalisation/Beschreibung überzählige Zähne...", "isPathological": true },
        { "value": "verlagert_retiniert", "text": "Verlagerte / Retinierte Zähne", "needsDetails": true, "detailsType": "zahnschema", "placeholderDetails": "Beschreibung verlagerte/retinierte Zähne...", "isPathological": true }
      ],
      "ParoZustandOptions": [
        { "value": "kamm_ohne_abbau", "text": "Alveolarkamm ohne eindeutige Zeichen eines generalisierten oder lokalisierten signifikanten Knochenabbaus", "isDefault": true },
        { "value": "knochenabbau", "text": "Hinweise auf horizontalen/vertikalen Knochenabbau", "needsDetails": true, "placeholderDetails": "Lokalisation/Ausmaß approx. Knochenabbau ( nur bedingt geeignet!)...", "isPathological": true }
      ],
      "ProcCoronoideusOptions": [
        { "value": "unauffaellig", "text": "unauffällig dargestellt", "isDefault": true },
        { "value": "pathologisch", "text": "Pathologischer Befund / Auffälligkeit", "needsDetails": true, "placeholderDetails": "z.B. Elongation, Fraktur Kieferwinkel V.a....", "isPathological": true }
      ],
      "CanalisMandOptions": [
        { "value": "gut_abgrenzbar", "text": "gut abgrenzbar, symmetrischer Verlauf", "isDefault": true },
        { "value": "verlaufsvariante", "text": "Verlaufsvariante / Asymmetrie", "needsDetails": true, "placeholderDetails": "Beschreibung Verlaufsvariante...", "isPathological": true },
        { "value": "enge_lagebeziehung", "text": "Enge Lagebeziehung zu Zahnwurzeln/Pathologien", "needsDetails": true, "placeholderDetails": "Zahn/Lokalisation enge Lagebeziehung...", "isPathological": true },
        { "value": "path_veraenderung", "text": "Pathologische Veränderung Kanal/Foramen", "needsDetails": true, "placeholderDetails": "Beschreibung path. Veränderung Kanal...", "isPathological": true }
      ],
      "KnochenstrukturUKOptions": [
        { "value": "regelhaft", "text": "Regelhafte Spongiose-/Kompaktastruktur, keine Osteolysen oder Sklerosierungen", "isDefault": true },
        { "value": "osteolyse", "text": "Umschriebene Osteolyse(n)", "needsDetails": true, "placeholderDetails": "Lokalisation/Beschreibung Osteolyse...", "isPathological": true },
        { "value": "sklerosierung", "text": "Umschriebene Sklerosierung(en)", "needsDetails": true, "placeholderDetails": "Lokalisation/Beschreibung Sklerosierung...", "isPathological": true },
        { "value": "generalisiert", "text": "Verdacht auf generalisierte Knochenstrukturveränderung", "needsDetails": true, "placeholderDetails": "Beschreibung generalisierte Veränderung...", "isPathological": true }
      ],
      "BasaleKompaktaUKOptions": [
        { "value": "intakt", "text": "intakt und durchgehend sichtbar", "isDefault": true },
        { "value": "unterbrechung", "text": "Unterbrechung / Kortikalisdestruktion / Usurierung", "needsDetails": true, "placeholderDetails": "Lokalisation Unterbrechung...", "isPathological": true }
      ],
      "KondylenOptions": [
        { "value": "symmetrisch", "text": "symmetrisch, regelrechte Form und Lage in der Fossa, Gelenkflächen glatt begrenzt", "isDefault": true },
        { "value": "asymmetrie", "text": "Asymmetrie / Formveränderung / Deformität", "needsDetails": true, "placeholderDetails": "Seite/Beschreibung Asymmetrie...", "isPathological": true },
        { "value": "degenerativ", "text": "Degenerative Veränderungen (Osteophyten, Sklerosierung, Usuren)", "needsDetails": true, "placeholderDetails": "Seite/Beschreibung degenerative Veränderungen...", "isPathological": true },
        { "value": "lageanomalie", "text": "Lageanomalie (Luxation/Subluxation)", "needsDetails": true, "placeholderDetails": "Seite/Beschreibung Lageanomalie...", "isPathological": true }
      ],
      "GelenkspalteOptions": [
        { "value": "regelrecht", "text": "Regelrecht weit, keine pathologischen Veränderungen", "isDefault": true },
        { "value": "veraendert", "text": "Gelenkspalt verschmälert/erweitert", "needsDetails": true, "placeholderDetails": "Seite Veränderung Gelenkspalt...", "isPathological": true }
      ],
      "ZungenbeinGaumenOptions": [
        { "value": "physiologisch", "text": "Physiologische Darstellung, ohne pathologische Auffälligkeiten", "isDefault": true },
        { "value": "pathologisch", "text": "Pathologische Verschattung/Veränderung", "needsDetails": true, "placeholderDetails": "Beschreibung path. Verschattung...", "isPathological": true }
      ],
      "PharynxOptions": [
        { "value": "physiologisch", "text": "Physiologisch weit, Symmetrisch, kein pathologischer Befund", "isDefault": true },
        { "value": "einengung", "text": "Einengung / Raumforderung im Pharynxbereich V.a.", "needsDetails": true, "placeholderDetails": "Beschreibung Einengung/Raumforderung...", "isPathological": true }
      ],
      "ProcStyloideiOptions": [
        { "value": "normale_laenge", "text": "Normale Länge (ca. < 25-30mm), keine pathologischen Verkalkungen", "isDefault": true },
        { "value": "verlaengerung", "text": "Verlängerung / V.a. Eagle-Syndrom", "needsDetails": true, "placeholderDetails": "Seite/Länge approx. Verlängerung...", "isPathological": true },
        { "value": "fraktur", "text": "Fraktur Proc. styloideus", "needsDetails": true, "placeholderDetails": "Seite Fraktur Proc. styloideus...", "isPathological": true },
        { "value": "verkalkung_lig", "text": "Pathologische Verkalkung Lig. stylohyoideum", "needsDetails": true, "placeholderDetails": "Seite Verkalkung Lig. stylohyoideum...", "isPathological": true }
      ],
      "HalsgefaesseOptions": [
        { "value": "nicht_beurteilbar", "text": "Nicht sicher beurteilbar / Keine eindeutigen pathologischen Verkalkungen im Projektionsbereich", "isDefault": true },
        { "value": "verkalkung_carotiden", "text": "Verdacht auf Sklerosierungen/Verkalkungen im Projektionsbereich der Carotiden", "needsDetails": true, "placeholderDetails": "Seite/Lokalisation Verkalkung (Hinweis: Klinische Korrelation!)...", "isPathological": true },
        { "value": "fremdmaterial", "text": "Fremdmaterial (Clips, Stents) im Projektionsbereich", "needsDetails": true, "placeholderDetails": "Beschreibung Fremdmaterial...", "markAsFinding": true }
      ],
      "SonstigeBefundeOptions": [
        { "value": "keine", "text": "Keine weiteren relevanten pathologischen Befunde", "isDefault": true },
        { "value": "roentgendicht", "text": "Röntgendichte Strukturen überlagernd (V.a. Speichelstein, Tonsillenstein, Phlebolith, etc.)", "needsDetails": true, "placeholderDetails": "Lokalisation/Beschreibung röntgendichte Struktur...", "isPathological": true },
        { "value": "fremdkoerper", "text": "Fremdkörper (nicht dental/ossär)", "needsDetails": true, "placeholderDetails": "Lokalisation/Beschreibung Fremdkörper...", "isPathological": true },
        { "value": "auffaelligkeiten", "text": "Sonstige Auffälligkeiten", "needsDetails": true, "placeholderDetails": "Beschreibung sonstige Auffälligkeiten...", "isPathological": true }
      ],
      "DiagnoseGesamtbeurteilungOptions": [
        { "value": "altersentsprechend", "text": "Altersentsprechender Normalbefund im Rahmen der -Beurteilbarkeit", "isDefault": true },
        { "value": "suffizientkons", "text": "konservativ suffizient versorgtes Gebiss" },
        { "value": "suffizientprot", "text": "prothetisch suffizient versorgtes Gebiss" },
        { "value": "suffizientkonsprot", "text": "konservativ und prothetisch suffizient versorgtes Gebiss" },
        { "value": "geringfuegig", "text": "Geringfügige Abweichungen ohne sicheren Krankheitswert", "needsDetails": true, "placeholderDetails": "Zusammenfassung der geringfügigen Abweichungen..." },
        { "value": "pathologisch", "text": "Pathologische(r) Befund(e) siehe oben", "needsDetails": true, "placeholderDetails": "Kurze Zusammenfassung der Hauptpathologien...", "isPathological": true }
      ],
      "EmpfehlungOptions": [
        { "value": "keine_weitere", "text": "Keine weitere Diagnostik/Behandlung aufgrund des -Befundes indiziert", "isDefault": true },
        { "value": "klinische_korrelation", "text": "Klinische Korrelation empfohlen / Kontrolle nach Klinik", "needsDetails": true, "placeholderDetails": "Bitte angeben..." },
        { "value": "zahnarzt_detail", "text": "Zahnärztliche Detailuntersuchung / Behandlung empfohlen (z.B. bei Karies-/Paro-Verdacht)", "needsDetails": true, "placeholderDetails": "Bitte angeben..." },
        { "value": "gezielte_roentgen", "text": "Gezielte zahnärztliche Röntgenaufnahme(n) empfohlen für", "needsDetails": true, "placeholderDetails": "Region/Fragestellung für gezielte Röntgenaufnahme..." },
        { "value": "weiterfuehrende_bildgebung", "text": "Weiterführende Bildgebung empfohlen", "needsDetails": true, "placeholderDetails": "z.B. DVT, CT, MRT für spezifische Fragestellung..." },
        { "value": "verlaufskontrolle", "text": "Verlaufskontrolle  empfohlen nach", "needsDetails": true, "placeholderDetails": "Zeitraum für Verlaufskontrolle..." },
        { "value": "spezifisch", "text": "Spezifische Empfehlung / Überweisung an", "needsDetails": true, "placeholderDetails": "Fachdisziplin/Maßnahme für Überweisung..." },
        { "value": "sonstiges_empf", "text": "Sonstige Empfehlung:", "needsDetails": true, "placeholderDetails": "Spezifische Maßnahme..." }
      ],
      "kariestiefeOptionen": {
        "placeholder": "opB.",
        "items": [
          { "value": "d0", "text": "D0", "isPathological": true, "isDefault": true },
          { "value": "d1", "text": "D1", "isPathological": true, "isDefault": false },
          { "value": "d2", "text": "D2", "isPathological": true, "isDefault": false },
          { "value": "d3", "text": "D3", "isPathological": true, "isDefault": false },
          { "value": "d4", "text": "D4", "isPathological": true, "isDefault": false }

        ]
      },
      "kariesOptionen": {
        "placeholder": "opB.",
        "items": [
          { "value": "m", "text": "mesial", "needsDetails": true, "placeholderDetails": "Tiefe", "isPathological": true, "detailsType": "select", "optionsKey": "kariestiefeOptionen" },
          { "value": "d", "text": "distal", "needsDetails": true, "placeholderDetails": "Tiefe", "isPathological": true, "detailsType": "select", "optionsKey": "kariestiefeOptionen" },
          { "value": "b", "text": "buccal", "needsDetails": true, "placeholderDetails": "Tiefe", "isPathological": true, "detailsType": "select", "optionsKey": "kariestiefeOptionen" },
          { "value": "l", "text": "lingual", "needsDetails": true, "placeholderDetails": "Tiefe", "isPathological": true, "detailsType": "select", "optionsKey": "kariestiefeOptionen" },
          { "value": "o", "text": "occlusal", "needsDetails": true, "placeholderDetails": "Tiefe", "isPathological": true, "detailsType": "select", "optionsKey": "kariestiefeOptionen" },

        ]
      },
      "kroneOptionen": {
        "placeholder": "opB.",
        "items": [
          { "value": "krs", "text": "suffizient", "needsDetails": false, "isPathological": true, "color": "black" },
          { "value": "krg", "text": "Gold", "needsDetails": false, "isPathological": true, "color": "black" },
          { "value": "krn", "text": "NEM", "needsDetails": false, "isPathological": true, "color": "black" },
          { "value": "krk", "text": "Keramik", "needsDetails": false, "isPathological": true, "color": "black" },
          { "value": "krvb", "text": "verblendet", "needsDetails": false, "isPathological": true, "color": "red" },
          { "value": "krp", "text": "insuffizient", "needsDetails": false, "isPathological": true, "color": "red" },

        ]
      },
      "WurzelfuellungOptionen": [

        // Länge
        { "value": "wf_randstaendig", "text": "Randständig bis Apex", "isDefault": true, "color": "green" }, // Positiv
        { "value": "wf_zu_kurz", "text": "Zu kurz", "isPathological": true, "color": "red", "needsDetails": true, "placeholderDetails": "Abstand zum Apex in mm..." },
        { "value": "wf_zu_lang", "text": "Zu lang / Überpresst", "isPathological": true, "color": "red", "needsDetails": true, "placeholderDetails": "Material und Lokalisation der Überpressung..." },

        // Dichtigkeit/Homogenität
        { "value": "wf_dicht_homogen", "text": "Dicht und homogen", "isDefault": true, "color": "green" }, // Positiv
        { "value": "wf_undicht_inhomogen", "text": "Undicht / Inhomogen / Leerraum", "isPathological": true, "color": "red" },

        // Komplikationen/Besonderheiten
        { "value": "wf_stufe", "text": "Stufenbildung", "isPathological": true },
        { "value": "wf_via_falsa", "text": "V.a. Via Falsa", "isPathological": true },
        { "value": "wf_instrumentenfraktur", "text": "V.a. Instrumentenfraktur", "isPathological": true, "needsDetails": true, "placeholderDetails": "Lokalisation..." },
        { "value": "wf_perforation", "text": "V.a. Perforation", "isPathological": true, "needsDetails": true, "placeholderDetails": "Lokalisation..." },
        { "value": "wf_resorption_assoziiert", "text": "Assoziiert mit Resorption (intern/extern)", "isPathological": true },

        // Zustand des periapikalen Gewebes (falls direkt mit WF zu bewerten)
        // Oft wird dies separat als "Apikale Parodontitis" erfasst, aber hier als Option für Vollständigkeit
        { "value": "wf_mit_apikaler_aufhellung", "text": "Mit apikaler Aufhellung assoziiert", "isPathological": true, "needsDetails": true, "placeholderDetails": "Beschreibung..." },
        { "value": "wf_ohne_apikale_aufhellung", "text": "Ohne apikale Aufhellung assoziiert", "isDefault": true, "color": "green" }, // Positiv

        // Art der Füllung
        { "value": "wf_orthograd", "text": "Orthograd", "isDefault": false },
        { "value": "wf_retrograd", "text": "Retrograd (WSR)", "isDefault": false },
        { "value": "wf_teilfuellung", "text": "Teilfüllung/Pulpotomie", "isDefault": false },
        // Sonstiges
        { "value": "wf_sonstiges", "text": "Sonstige Bemerkung zur WF", "needsDetails": true, "placeholderDetails": "Beschreibung..." }
      ],
      "pathologischeZahnBefundeOptionen": {
        "placeholder": "opB.",
        "items": [
          { "value": "k", "text": "Karies", "needsDetails": true, "placeholderDetails": "Lokalisation/Tiefe", "isPathological": true, "detailsType": "multiselect", "optionsKey": "kariestiefeOptionen", "color": "red" },
          { "value": "f", "text": "Füllung", "needsDetails": true, "placeholderDetails": "Material, Randspalt?", "isPathological": true, "color": "blue" },
          { "value": "kr", "text": "Krone", "needsDetails": true, "placeholderDetails": "Material, Randspalt?", "isPathological": true, "detailsType": "multiselect", "optionsKey": "kroneOptionen", "color": "black" },
          { "value": "br", "text": "Brücke", "needsDetails": true, "placeholderDetails": "Material, Randspalt?", "isPathological": true, "detailsType": "multiselect", "optionsKey": "kroneOptionen", "color": "black" },

          { "value": "wf", "text": "Wurzelfüllung", "needsDetails": true, "placeholderDetails": "Länge, Dichtigkeit?", "isPathological": true, "detailsType": "multiselect", "optionsKey": "WurzelfuellungOptionen", "color": "black"},
                    { "value": "pa", "text": "Periapikale Aufhellung", "needsDetails": true, "placeholderDetails": "Größe?", "isPathological": true },
          { "value": "kn", "text": "Knochenabbau", "needsDetails": true, "placeholderDetails": "Horizontal/Vertikal, Grad?", "isPathological": true },
          { "value": "fu", "text": "Furkationsbefall (V.a.)", "needsDetails": true, "placeholderDetails": "Grad?", "isPathological": true },
          { "value": "res_int", "text": "Interne Resorption", "isPathological": true, "needsDetails": false },
          { "value": "res_ext", "text": "Externe Resorption", "isPathological": true, "needsDetails": false },
          { "value": "wfx_l", "text": "V.a. Längsfraktur Wurzel", "isPathological": true, "needsDetails": false },
          { "value": "wfx_q", "text": "V.a. Querfraktur Wurzel", "isPathological": true, "needsDetails": false }, { "value": "ret", "text": "Retiniert", "needsDetails": false, "isPathological": true },
          { "value": "imp", "text": "Implantat", "needsDetails": true, "placeholderDetails": "Osseointegration? Periimplantitis?" },
          { "value": "st", "text": "Stiftaufbau", "needsDetails": false },
          { "value": "fe", "text": "Fehlend", "isDefault": false, "markAsFinding": true },
          { "value": "milchzahn_persistent", "text": "Persist. Milchzahn (an Dauerzahnstelle)", "isPathological": true, "appliesToPermanent": true },
          { "value": "milchzahn_fruehverlust", "text": "Frühverlust Milchzahn (Lücke vorhanden)", "isPathological": true, "appliesToMilk": true }
        ]
      },
      "implantatplanungsOptionen": {
        "placeholder": "Messung",
        "items": [
          { "value": "tiefe", "text": "Tiefe", "needsDetails": true, "placeholderDetails": "in mm", "isPathological": true },
          { "value": "breite", "text": "Breite", "needsDetails": true, "placeholderDetails": "in mm", "isPathological": true },
          { "value": "entfernung", "text": "Abstand", "needsDetails": true, "placeholderDetails": "Abstand zu Nachbarstruktur in mm", "isPathological": true },
          { "value": "qualität", "text": "Knochenqualität", "needsDetails": true, "placeholderDetails": "Qualität des Knochens", "isPathological": true },
          { "value": "sonstiges", "text": "sonstiges", "needsDetails": true, "placeholderDetails": "", "isPathological": true },
          { "value": "mesiodistal", "text": "Knochenlänge (mesiodistal) (mm)", "needsDetails": true, "placeholderDetails": "", "isPathological": true },
          { "value": "knochenqualitaet", "text": "Knochenqualität (nach Misch)", "needsDetails": true, "placeholderDetails": "", "isPathological": true, "detailsType": "multiselect", "optionsKey": "KnochenqualitaetOptions" },

        ]
      },
      "KnochenqualitaetOptions": {
        "placeholder": "Knochenqualität",
        "items": [
          { "value": "d1", "text": "D1 (Homogen kortikal)", "isDefault": false },
          { "value": "d2", "text": "D2 (Dick kortikal, dicht spongiös)", "isDefault": false },
          { "value": "d3", "text": "D3 (Dünn kortikal, dicht spongiös)", "isDefault": false },
          { "value": "d4", "text": "D4 (Dünn kortikal, locker spongiös)", "isDefault": false },
          { "value": "nicht_beurteilbar", "text": "Nicht sicher beurteilbar", "isDefault": false }
        ]
      },
    },

    formSections: [
      {
        "id": "indikation_section",
        "legend": "Indikationen",
        "description": "Wählen Sie bitte die Indikation für die -Aufnahme aus.",
        "type": "collapsible_section", // ADDED TYPE
        "initiallyExpanded": true, // Optional: decide if it should be open by default
        "fields": [
          {
            "id": "indikation_auswahl_multiselect",
            "label": "Indikation",
            "type": "multiselect",
            "optionsKey": "IndikationOptions",
            "buttonTextConfig": { "placeholder": "Auswählen..." }
          }
        ]
      },
      {
        "id": "befund_main_section",
        "legend": "Befund",
        "type": "collapsible_section",
        "initiallyExpanded": true,
        "subSections": [
          {
            "id": "technik_subsection",
            "legend": "Technische Qualität, Limitationen & Abbildungsfenster",
            "type": "collapsible_section",
            "initiallyExpanded": false,
            "fields": [
              {
                "id": "limitationen_display",
                "type": "static_text_display",
                "text": "- Projektionsbedingte Verzeichnung und Vergrößerung, keine exakte Metrik möglich.\n- Überlagerungseffekte (z.B. Wirbelsäule, Zungenbein, Weichteile).\n- Darstellung primär auf die fokussierte Schichtebene beschränkt (Strukturen außerhalb können unscharf/verzerrt sein).\n- Eingeschränkte Detailerkennbarkeit (z.B. feine parodontale Strukturen, initiale Karies approximal nur bedingt sicher beurteilbar)."
              },
              {
                "id": "tech_qualitaet_haupt_select",
                "label": "Technische Qualität",
                "type": "select",
                "optionsKey": "TechQualitaetOptions",
                "prefix": "Technische Qualität: "
              },
              {
                "id": "tech_einschraenkungen_multiselect",
                "label": "Details Einschränkungen",
                "type": "multiselect",
                "optionsKey": "TechEinschraenkungenOptions",
                "buttonTextConfig": { "placeholder": "Auswählen..." }
              },
              {
                "id": "abbildungsfenster_multiselect",
                "label": "Abbildungsfenster",
                "type": "multiselect",
                "optionsKey": "AbbildungsfensterOptions",
                "prefix": "Abbildungsfenster: ",
                "buttonTextConfig": { "placeholder": "Auswählen..." }
              }
            ]
          },
          {
            "id": "anatomie_mittelgesicht_ok_subsection",
            "legend": "Mittelgesicht & Oberkiefer",
            "type": "collapsible_section",
            "initiallyExpanded": false,
            "fields": [
              {
                "id": "orbitaboeden_paired_group",
                "type": "paired_multiselect_group",
                "groupLabel": "Orbitaböden",
                "baseName": "orbitaboeden_paired",
                "leftConfig": { "id": "orbitaboeden_links", "label": "Links", "prefix": "Orbitaboden links: ", "optionsKey": "OrbitaboedenOptions", "buttonTextConfig": { "placeholder": "Links..." } },
                "rightConfig": { "id": "orbitaboeden_rechts", "label": "Rechts", "prefix": "Orbitaboden rechts: ", "optionsKey": "OrbitaboedenOptions", "buttonTextConfig": { "placeholder": "Rechts..." } }
              },
              {
                "id": "jochbeine_paired_group",
                "type": "paired_multiselect_group",
                "groupLabel": "Jochbeine/Jochbogen",
                "baseName": "jochbeine_paired",
                "leftConfig": { "id": "jochbeine_links", "label": "Links", "prefix": "Jochbein/Jochbogen links: ", "optionsKey": "JochbeineOptions", "buttonTextConfig": { "placeholder": "Links..." } },
                "rightConfig": { "id": "jochbeine_rechts", "label": "Rechts", "prefix": "Jochbein/Jochbogen rechts: ", "optionsKey": "JochbeineOptions", "buttonTextConfig": { "placeholder": "Rechts..." } }
              },
              {
                "id": "nasenhoehle_multiselect",
                "label": "Nasenhöhle (inkl. Septum, Conchae)",
                "type": "multiselect",
                "optionsKey": "NasenhoehleOptions",
                "prefix": "Nasenhöhle: ",
                "buttonTextConfig": { "placeholder": "Auswählen..." }
              },
              {
                "id": "sinus_maxillares_paired_group",
                "type": "paired_multiselect_group",
                "groupLabel": "Sinus maxillares (Kieferhöhlen)",
                "baseName": "sinus_maxillares_paired",
                "leftConfig": { "id": "sinus_maxillares_links", "label": "Links", "prefix": "Sinus maxillaris links: ", "optionsKey": "SinusMaxillaresOptions", "buttonTextConfig": { "placeholder": "Links..." } },
                "rightConfig": { "id": "sinus_maxillares_rechts", "label": "Rechts", "prefix": "Sinus maxillaris rechts: ", "optionsKey": "SinusMaxillaresOptions", "buttonTextConfig": { "placeholder": "Rechts..." } }
              },
              {
                "id": "recessus_alveolares_multiselect",
                "label": "Recessus alveolares der Kieferhöhlen",
                "type": "multiselect",
                "optionsKey": "RecessusAlveolaresOptions",
                "prefix": "Recessus alveolares: ",
                "buttonTextConfig": { "placeholder": "Auswählen..." }
              },
              {
                "id": "canalis_infraorbitale_paired_group",
                "type": "paired_multiselect_group",
                "groupLabel": "Canalis/Foramen infraorbitale",
                "baseName": "canalis_infraorbitale_paired",
                "leftConfig": { "id": "canalis_infraorbitale_links", "label": "Links", "prefix": "Can./For. infraorbitale links: ", "optionsKey": "CanalisInfraorbitaleOptions", "buttonTextConfig": { "placeholder": "Links..." } },
                "rightConfig": { "id": "canalis_infraorbitale_rechts", "label": "Rechts", "prefix": "Can./For. infraorbitale rechts: ", "optionsKey": "CanalisInfraorbitaleOptions", "buttonTextConfig": { "placeholder": "Rechts..." } }
              },
              {
                "id": "nasenboden_gaumen_multiselect",
                "label": "Nasenboden/Harter Gaumen/Canalis incisivus",
                "type": "multiselect",
                "optionsKey": "NasenbodenGaumenOptions",
                "prefix": "Nasenboden/Gaumen: ",
                "buttonTextConfig": { "placeholder": "Auswählen..." }
              }
            ]
          },
          {
            "id": "dentoalveolaer_subsection",
            "legend": "Zahnstatus & dentaler Befund",
            "type": "collapsible_section",
            "initiallyExpanded": true,
            "fields": [
              {
                "id": "zahnstatus_multiselect",
                "label": "Zahnstatus Generell",
                "type": "multiselect",
                "optionsKey": "ZahnstatusOptions",
                "prefix": "Zahnstatus: ",
                "buttonTextConfig": { "placeholder": "Auswählen..." }
              },
              {
                "id": "paro_zustand_multiselect",
                "label": "Grober parodontaler Zustand",
                "type": "multiselect",
                "optionsKey": "ParoZustandOptions",
                "prefix": "Paro-Zustand: ",
                "buttonTextConfig": { "placeholder": "Auswählen..." }
              },
              {
                "id": "pathologische_zahnbefunde_container",
                "type": "inline_zahnschema",
                "label": "Pathologische Zahnbefunde (pro Zahn)",
                "description": "Spezifische pathologische Befunde für einzelne Zähne. Fehlende Zähne werden berücksichtigt.",
                "optionsKey": "pathologischeZahnBefundeOptionen",
                "placeholderOptionText": "Befund...",
                "displayAllAdultTeeth": true
              },


              {
                "id": "implantatplanungs_container",
                "type": "inline_zahnschema",
                "condition": { "field": "indikation_auswahl_multiselect", "optionValue": "implantatplanung" },

                "legendText": "Messungen pro Zahn/Region",
                "description": "Messungen für Implantatplanung.",
                "optionsKey": "implantatplanungsOptionen",
                "placeholderOptionText": "Messung...",
                "displayAllAdultTeeth": true
              }
            ]
          },
          {
            "id": "unterkiefer_subsection",
            "legend": "Unterkiefer",
            "type": "collapsible_section",
            "initiallyExpanded": false,
            "fields": [
              {
                "id": "knochenstruktur_uk_multiselect",
                "label": "Knochenstruktur Unterkiefer",
                "type": "multiselect",
                "optionsKey": "KnochenstrukturUKOptions",
                "prefix": "Knochenstruktur UK: ",
                "buttonTextConfig": { "placeholder": "Auswählen..." }
              },
              {
                "id": "basale_kompakta_uk_multiselect",
                "label": "Basale Kompakta Unterkiefer",
                "type": "multiselect",
                "optionsKey": "BasaleKompaktaUKOptions",
                "prefix": "Basale Kompakta UK: ",
                "buttonTextConfig": { "placeholder": "Auswählen..." }
              },
              {
                "id": "canalis_mand_paired_group",
                "type": "paired_multiselect_group",
                "groupLabel": "Canalis mandibulae & Foramen mentale",
                "baseName": "canalis_mand_paired",
                "leftConfig": { "id": "canalis_mand_links", "label": "Links", "prefix": "Canalis mandibulae links: ", "optionsKey": "CanalisMandOptions", "buttonTextConfig": { "placeholder": "Links..." } },
                "rightConfig": { "id": "canalis_mand_rechts", "label": "Rechts", "prefix": "Canalis mandibulae rechts: ", "optionsKey": "CanalisMandOptions", "buttonTextConfig": { "placeholder": "Rechts..." } }
              },
              {
                "id": "proc_coronoideus_paired_group",
                "type": "paired_multiselect_group",
                "groupLabel": "Processus coronoideus",
                "baseName": "proc_coronoideus_paired",
                "leftConfig": { "id": "proc_coronoideus_links", "label": "Links", "prefix": "Proc. coronoideus links: ", "optionsKey": "ProcCoronoideusOptions", "buttonTextConfig": { "placeholder": "Links..." } },
                "rightConfig": { "id": "proc_coronoideus_rechts", "label": "Rechts", "prefix": "Proc. coronoideus rechts: ", "optionsKey": "ProcCoronoideusOptions", "buttonTextConfig": { "placeholder": "Rechts..." } }
              }
            ]
          },
          {
            "id": "kiefergelenke_subsection",
            "legend": "Kiefergelenke",
            "type": "collapsible_section",
            "initiallyExpanded": false,
            "fields": [
              {
                "id": "kondylen_paired_group",
                "type": "paired_multiselect_group",
                "groupLabel": "Kondylen",
                "baseName": "kondylen_paired",
                "leftConfig": { "id": "kondylen_links", "label": "Links", "prefix": "Kondylus links: ", "optionsKey": "KondylenOptions", "buttonTextConfig": { "placeholder": "Links..." } },
                "rightConfig": { "id": "kondylen_rechts", "label": "Rechts", "prefix": "Kondylus rechts: ", "optionsKey": "KondylenOptions", "buttonTextConfig": { "placeholder": "Rechts..." } }
              },
              {
                "id": "gelenkspalte_paired_group",
                "type": "paired_multiselect_group",
                "groupLabel": "Gelenkspalte",
                "baseName": "gelenkspalte_paired",
                "leftConfig": { "id": "gelenkspalte_links", "label": "Links", "prefix": "Gelenkspalte links: ", "optionsKey": "GelenkspalteOptions", "buttonTextConfig": { "placeholder": "Links..." } },
                "rightConfig": { "id": "gelenkspalte_rechts", "label": "Rechts", "prefix": "Gelenkspalte rechts: ", "optionsKey": "GelenkspalteOptions", "buttonTextConfig": { "placeholder": "Rechts..." } }
              }
            ]
          },
          {
            "id": "weichteile_subsection",
            "legend": "Weichteile und angrenzende Strukturen",
            "type": "collapsible_section",
            "initiallyExpanded": false,
            "fields": [
              {
                "id": "zungenbein_gaumen_multiselect",
                "label": "Zungenbein/Weicher Gaumen/Zungenschatten",
                "type": "multiselect",
                "optionsKey": "ZungenbeinGaumenOptions",
                "prefix": "Zungenbein/Gaumen: ",
                "buttonTextConfig": { "placeholder": "Auswählen..." }
              },
              {
                "id": "pharynx_multiselect",
                "label": "Luft-/Weichteilschatten (Oropharynx/Nasopharynx)",
                "type": "multiselect",
                "optionsKey": "PharynxOptions",
                "prefix": "Pharynx: ",
                "buttonTextConfig": { "placeholder": "Auswählen..." }
              },
              {
                "id": "proc_styloidei_paired_group",
                "type": "paired_multiselect_group",
                "groupLabel": "Processus styloidei",
                "baseName": "proc_styloidei_paired",
                "leftConfig": { "id": "proc_styloidei_links", "label": "Links", "prefix": "Proc. styloideus links: ", "optionsKey": "ProcStyloideiOptions", "buttonTextConfig": { "placeholder": "Links..." } },
                "rightConfig": { "id": "proc_styloidei_rechts", "label": "Rechts", "prefix": "Proc. styloideus rechts: ", "optionsKey": "ProcStyloideiOptions", "buttonTextConfig": { "placeholder": "Rechts..." } }
              },
              {
                "id": "halsgefaesse_paired_group",
                "type": "paired_multiselect_group",
                "groupLabel": "Halsgefäße (Projektionsort)",
                "baseName": "halsgefaesse_paired",
                "leftConfig": { "id": "halsgefaesse_links", "label": "Links", "prefix": "Halsgefäße links (Projektion): ", "optionsKey": "HalsgefaesseOptions", "buttonTextConfig": { "placeholder": "Links..." } },
                "rightConfig": { "id": "halsgefaesse_rechts", "label": "Rechts", "prefix": "Halsgefäße rechts (Projektion): ", "optionsKey": "HalsgefaesseOptions", "buttonTextConfig": { "placeholder": "Rechts..." } }
              }
            ]
          },
          {
            "id": "weitere_auffaelligkeiten_subsection",
            "legend": "Weitere Auffälligkeiten (Allgemein)",
            "type": "collapsible_section",
            "initiallyExpanded": false,
            "fields": [
              {
                "id": "sonstige_befunde_multiselect",
                "label": "Sonstige Befunde",
                "type": "multiselect",
                "optionsKey": "SonstigeBefundeOptions",
                "prefix": "Sonstige Befunde: ",
                "buttonTextConfig": { "placeholder": "Auswählen..." }
              }
            ]
          }
        ]
      },
      {
        "id": "zusammenfassung_diagnose_empfehlung_section",
        "legend": "Zusammenfassung, Diagnose & Empfehlung",
        "type": "collapsible_section",
        "initiallyExpanded": true,
        "fields": [{
          "type": 'textarea_summary',
          "id": 'mySummaryTextarea',
          "label": 'Automatische Zusammenfassung',
          "sourceTextareaIds": [], // IDs of the textareas to summarize
          "summaryPrompt": "Basierend auf den folgenden Eingaben:", // Optional: Text to prepend
          "placeholder": 'Zusammenfassung wird hier generiert...',
          "rows": 8,
          "tooltip": "Diese Zusammenfassung wird automatisch aus den oben genannten Feldern erstellt."
        },
        {
          "id": "toggleNormalBefundeButton",
          "type": "button_toggle_normalbefunde",
          "textAddKey": "addNormalFindingsBtn",
          "textAddDefault": "Regelbefunde zur Zusammenfassung hinzufügen",
          "textRemoveKey": "removeNormalFindingsBtn",
          "textRemoveDefault": "Regelbefunde aus Zusammenfassung entfernen",
          "cssClass": "secondary mt-2 text-sm py-1 px-2"
        },
        {
          "id": "diagnose_gesamtbeurteilung_select",
          "label": "Gesamtbeurteilung",
          "type": "select",
          "optionsKey": "DiagnoseGesamtbeurteilungOptions",
          "cssClass": "mt-4"
        },
        {
          "id": "empfehlung_select",
          "label": "Empfehlung",
          "type": "select",
          "optionsKey": "EmpfehlungOptions"
        }
        ]
      }
    ]
  };

  // --- End of Original File Content (with modifications) ---

  // Assign the main configuration object to a global variable.
  // This makes it accessible to other scripts loaded via <script> tags.
  // Choose a descriptive and unique name to avoid conflicts.
  window.StandardFormConfiguration = formConfig;

  // Optional: Log to console if debugLog is made global and available
  // if (typeof window.debugLog === 'function' && typeof window.LOG_LEVELS === 'object') {
  //    window.debugLog('Config', window.LOG_LEVELS.INFO, ' form configuration (StandardFormConfiguration) is now globally available.', window.StandardFormConfiguration);
  // } else {
  //    console.log('[Config]  form configuration (StandardFormConfiguration) is now globally available.');
  // }

})(); // End of IIFE
