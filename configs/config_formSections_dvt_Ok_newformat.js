// configs/config_formSections_dvt_Ok_newformat.js
// Konfiguration für DVT Oberkiefer im neuen Format.
// Sections for teeth and implants adjusted to mirror OPG config structure.

(function () {
  const formConfig = {
    xRayTypeIdentifier: "dvt_Ok", // Eindeutiger Identifier für DVT Oberkiefer

    dynamicElementOptions: {
      "IndikationOptions": [
        { "value": "routine_uebersicht", "text": "Routinediagnostik / Übersicht", "isDefault": true },
        { "value": "implantatplanung", "text": "Implantatplanung" },
        { "value": "verlagerte_zaehne", "text": "Verlagerte/retinierte Zähne" },
        { "value": "zysten_tumoren", "text": "Zysten/Tumoren Abklärung" },
        { "value": "kfo", "text": "Kieferorthopädische Fragestellung" },
        { "value": "sinus_diagnostik", "text": "Kieferhöhlendiagnostik" },
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
        { "value": "vollstaendig", "text": "Vollständige Darstellung von Oberkiefer", "isDefault": true },
        { "value": "uebersichtlich", "text": "Übersichtliche Abbildung dentoalveolärer und benachbarter skelettaler Strukturen", "isDefault": true },
        { "value": "unvollstaendig", "text": "Abbildung unvollständig / Teilbereiche nicht beurteilbar", "needsDetails": true, "placeholderDetails": "Beschreibung unvollständige Abbildung..." }
      ],
      "JochbeinPairedOptions": [
        { "value": "unauffaellig", "text": "Unauffällig", "isDefault": true },
        { "value": "fraktur_jochbein", "text": "Fraktur Jochbein", "isPathological": true, "needsDetails": true, "placeholderDetails": "Beschreibung Fraktur..." },
        { "value": "asymmetrie_jochbein", "text": "Asymmetrie Jochbein", "isPathological": true, "needsDetails": true, "placeholderDetails": "Beschreibung Asymmetrie..." },
        { "value": "pathologie_jochbein", "text": "Sonstige Pathologie Jochbein", "isPathological": true, "needsDetails": true, "placeholderDetails": "Beschreibung Pathologie..." }
      ],
      "JochbogenPairedOptions": [
        { "value": "unauffaellig", "text": "Unauffällig", "isDefault": true },
        { "value": "fraktur_jochbogen", "text": "Fraktur Jochbogen", "isPathological": true, "needsDetails": true, "placeholderDetails": "Beschreibung Fraktur..." },
        { "value": "pathologie_jochbogen", "text": "Sonstige Pathologie Jochbogen", "isPathological": true, "needsDetails": true, "placeholderDetails": "Beschreibung Pathologie..." }
      ],
      "CanalisInfraorbitaleOptions": [
        { "value": "regelrecht", "text": "regelrecht abgrenzbar", "isDefault": true },
        { "value": "nicht_sicher", "text": "nicht sicher abgrenzbar" },
        { "value": "pathologisch", "text": "Pathologischer Befund / Auffälligkeit", "needsDetails": true, "placeholderDetails": "Beschreibung Pathologie Canalis infraorbitale...", "isPathological": true }
      ],
      "NasenbeinOptions": [
        { "value": "unauffaellig", "text": "Unauffällig", "isDefault": true },
        { "value": "fraktur_nasenbein", "text": "Fraktur Nasenbein", "isPathological": true, "needsDetails": true, "placeholderDetails": "Beschreibung Fraktur..." },
        { "value": "pathologie_nasenbein", "text": "Sonstige Pathologie Nasenbein", "isPathological": true, "needsDetails": true, "placeholderDetails": "Beschreibung Pathologie..." }
      ],
      "NasenseptumOptions": [
        { "value": "mittig", "text": "Mittig / Regelrecht", "isDefault": true },
        { "value": "deviierend", "text": "Deviierend", "isPathological": true, "needsDetails": true, "detailsType": "select", "optionsKey": "NasenseptumDeviationRichtungOptions" },
        { "value": "sporn", "text": "Septumsporn", "isPathological": true, "needsDetails": true, "detailsType": "select", "optionsKey": "NasenseptumSpornOptions" },
        { "value": "sonstiges", "text": "sonstiges", "isPathological": true, "needsDetails": true }
      ],
      "NasenseptumDeviationRichtungOptions": [
        { "value": "placeholder", "text": "", "isDefault": true },
        { "value": "links", "text": "Nach links", "isPathological": true },
        { "value": "rechts", "text": "Nach rechts", "isPathological": true },
        { "value": "s_foermig", "text": "S-förmig", "isPathological": true }
      ],
      "NasenseptumSpornOptions": [
        { "value": "placeholder", "text": "", "isDefault": true },
        { "value": "sporn_links", "text": "nach links", "isPathological": true },
        { "value": "sporn_rechts", "text": "nach rechts", "isPathological": true }
      ],
      "SinusEthmoidalisPairedOptions": [
        { "value": "frei_belueftet", "text": "Frei belüftet", "isDefault": true },
        { "value": "verschattet_eth", "text": "Verschattet / Pathologie", "isPathological": true, "needsDetails": true, "placeholderDetails": "Beschreibung Verschattung/Pathologie..." }
      ],
      "SinusMaxillarisPairedOptions": [
        { "value": "frei_belueftet", "text": "Frei belüftet", "isDefault": true },
        { "value": "nicht_frei_pathologisch", "text": "Nicht frei belüftet / Pathologie", "isPathological": true }
      ],
      "BefundSinusMaxillarisOptions": [
        { "value": "schleimhautschwellung_basal", "text": "Basale Schleimhautschwellung", "isPathological": true, "needsDetails": true, "placeholderDetails": "Lokalisation..." },
        { "value": "schleimhautschwellung_polypoes", "text": "Polypoide Schleimhautschwellung", "isPathological": true, "needsDetails": true, "placeholderDetails": "Beschreibung..." },
        { "value": "vollverschattung", "text": "Vollverschattung", "isPathological": true, "needsDetails": true, "placeholderDetails": "Beschreibung..." },
        { "value": "teilverschattung", "text": "Teilverschattung", "isPathological": true, "needsDetails": true, "placeholderDetails": "Beschreibung..." },
        { "value": "fluessigkeitsspiegel", "text": "Flüssigkeitsspiegel", "isPathological": true, "needsDetails": true, "placeholderDetails": "Beschreibung..." },
        { "value": "zyste_retention", "text": "Retentionszyste / Mukozele", "isPathological": true, "needsDetails": true, "placeholderDetails": "Beschreibung..." },
        { "value": "dentogene_ursache", "text": "V.a. dentogene Ursache", "placeholderDetails": "Zahn/Region...", "isPathological": true, "needsDetails": true, "placeholderDetails": "Beschreibung..." },
        { "value": "knochenwand_pathologie", "text": "Pathologie der Knochenwände", "isPathological": true, "needsDetails": true, "placeholderDetails": "Beschreibung..." },
        { "value": "path_rf_ok", "text": "Pathologische Raumforderung", "isPathological": true, "needsDetails": true, "detailsType": "multiselect", "optionsKey": "RaumforderungsbeschreibungOptionen", "placeholderDetails": "Lokalisation/Beschreibung..." }

      ],
      "RaumforderungsbeschreibungOptionen": [
        // Hauptausdehnungsrichtung (qualitativ) - NEU HINZUGEFÜGT
        { "value": "rf_ausdehnung_haupt_axial", "text": "Ausdehnung in axialer Ebene", "isPathological": true, "needsDetails": true, "placeholderDetails": "...in mm" },
        { "value": "rf_ausdehnung_haupt_koronal", "text": "Ausdehnung in koronaler Ebene", "isPathological": true, "needsDetails": true, "placeholderDetails": "...in mm" },
        { "value": "rf_ausdehnung_haupt_sagittal", "text": "Ausdehnung in sagittaler Ebene", "isPathological": true, "needsDetails": true, "placeholderDetails": "...in mm" },
        { "value": "rf_ausdehnung_entlang_struktur", "text": "Ausdehnung entlang anatomischer Struktur", "isPathological": true, "needsDetails": true, "placeholderDetails": "z.B. Nerv, Gefäß, Knochengrenze..." },

        // Dynamik (wenn bekannt)
        { "value": "rf_groessenprogredient", "text": "Größenprogredient (anamnestisch/Voraufnahmen)", "isPathological": true },
        // Begrenzung (Border)
        { "value": "rf_scharf_begrenzt", "text": "Scharf begrenzt", "isDefault": false },
        { "value": "rf_unscharf_infiltrativ", "text": "Unscharf/infiltrativ begrenzt", "isPathological": true },
        { "value": "rf_kapselbildung", "text": "Mit Kapselbildung (partiell/komplett)", "isPathological": true },
        { "value": "rf_kortikaler_randsaum", "text": "Mit kortikalem Randsaum", "isDefault": false },

        // Binnenstruktur/Dichte (Internal Structure/Density)
        { "value": "rf_zystisch_fluessig", "text": "Zystisch / flüssigkeitsisodens", "isPathological": true },
        { "value": "rf_solid_weichteildicht", "text": "Solid / weichteildicht", "isPathological": true },
        { "value": "rf_gemischt_zyst_sol", "text": "Gemischt zystisch-solide Anteile", "isPathological": true },
        { "value": "rf_verkalkungen_intern", "text": "Verkalkungen/hyperdense Areale intern", "isPathological": true, "needsDetails": true, "placeholderDetails": "Art/Muster der Verkalkungen..." },
        { "value": "rf_septierungen_intern", "text": "Septierungen intern (uni-/multilokulär)", "isPathological": true, "needsDetails": true, "placeholderDetails": "Beschreibung Septen..." },
        { "value": "rf_hypodens_fett", "text": "Hypodens (fettäquivalent)", "isPathological": true },

        // Auswirkungen auf Umgebung (Effects on Surroundings)
        { "value": "rf_knochendestruktion", "text": "Knochendestruktion (osteolytisch)", "isPathological": true, "needsDetails": true, "placeholderDetails": "Art der Destruktion (z.B. gürmörmig, mottenfrassähnlich)..." },
        { "value": "rf_knochenexpansion_arrosion", "text": "Knochenexpansion / -arrosion", "isPathological": true },
        { "value": "rf_verdr_nachbarstrukturen", "text": "Verdrängung von Nachbarstrukturen", "isPathological": true, "needsDetails": true, "placeholderDetails": "Welche Strukturen? Ausmaß?" },
        { "value": "rf_infiltration_nachbar", "text": "Infiltration von Nachbarstrukturen", "isPathological": true, "needsDetails": true, "placeholderDetails": "Welche Strukturen?" },
        { "value": "rf_resorption_zahnwurzeln", "text": "Resorption von Zahnwurzeln", "isPathological": true, "needsDetails": true, "placeholderDetails": "Betroffene Zähne..." },
        { "value": "rf_bezug_canalis_mand", "text": "Bezug zum Canalis mandibulae/mentale", "isPathological": true, "needsDetails": true, "placeholderDetails": "Art des Bezugs (Verlagerung, Ummauerung, Infiltration?)" },
        { "value": "rf_bezug_sinus_max", "text": "Bezug zum Sinus maxillaris", "isPathological": true, "needsDetails": true, "placeholderDetails": "Art des Bezugs (Verlagerung, Arrosion, Infiltration?)" },


        // Sonstiges
        { "value": "rf_sonstige_beschreibung", "text": "Sonstige Charakteristika", "needsDetails": true, "placeholderDetails": "Weitere Beschreibung..." }
      ]
      ,
      "AlveolarfortsatzOptions": [
        { "value": "regelrecht_ok", "text": "Alveolarfortsatz regelrecht konturiert und strukturiert", "isDefault": true },
        { "value": "atrophie_ok", "text": "Atrophie Alveolarfortsatz ", "isPathological": true, "needsDetails": true, "placeholderDetails": "Lokalisation/Ausmaß..." },
        { "value": "knochendefekt_ok", "text": "Knochendefekt Alveolarfortsatz", "isPathological": true, "needsDetails": true, "placeholderDetails": "Lokalisation/Beschreibung..." },
        { "value": "path_struktur_ok", "text": "Pathologische Knochenstruktur", "isPathological": true, "needsDetails": true, "placeholderDetails": "Lokalisation/Beschreibung..." },
        { "value": "path_rf_ok", "text": "Pathologische Raumforderung", "isPathological": true, "needsDetails": true, "detailsType": "multiselect", "optionsKey": "RaumforderungsbeschreibungOptionen", "placeholderDetails": "Lokalisation/Beschreibung..." }
      ],
      "KnochenqualitaetOptions": [ // Used by DvtImplantatplanungOkOptions
        { "value": "d1", "text": "D1 (Homogen kortikal)" },
        { "value": "d2", "text": "D2 (Dick kortikal, dicht spongiös)" },
        { "value": "d3", "text": "D3 (Dünn kortikal, dicht spongiös)" },
        { "value": "d4", "text": "D4 (Dünn kortikal, locker spongiös)" },
        { "value": "nicht_beurteilbar", "text": "Nicht sicher beurteilbar" }
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
          { "value": "k", "text": "Karies", "needsDetails": true, "placeholderDetails": "Lokalisation/Tiefe", "isPathological": true, "detailsType": "multiselect", "optionsKey": "kariesOptionen", "color": "red" },
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
      "SpezPathBefundVorhandenOptions": [
        { "value": "nein", "text": "Nein", "isDefault": true },
        { "value": "ja", "text": "Ja" }
      ],
      "PathBefundBegrenzung1Options": [
        { "value": "unscharf", "text": "Unscharf" },
        { "value": "scharf", "text": "Scharf" },
        { "value": "sklerosiert", "text": "Sklerosierter Randsaum" }
      ],
      "PathBefundBegrenzung2Options": [
        { "value": "glatt", "text": "Glatt" },
        { "value": "polyzyklisch", "text": "Polyzyklisch" },
        { "value": "irregulaer", "text": "Irregulär" }
      ],
      "PathBefundDichteOptions": [
        { "value": "hypodens", "text": "Hypodens (zystisch/weichteildicht)" },
        { "value": "isodens", "text": "Isodens zum Knochen" },
        { "value": "hyperdens", "text": "Hyperdens (verkalkt/ossär)" },
        { "value": "gemischt", "text": "Gemischt (hypo- und hyperdens)" }
      ]
      // Removed: BefundAuffaelligerZahnOkOptions, WurzelfuellungQualitaetOptions, WurzelfuellungInsuffizienzDetailsOptions
      // as their functionality is now integrated or simplified within PathologischeZahnBefundeOptionen for the inline_zahnschema
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
            "id": "mittelgesicht_schaedelbasis_subsection",
            "legend": "Mittelgesicht & Angrenzende Strukturen",
            "type": "collapsible_section",
            "initiallyExpanded": false,
            "fields": [
              {
                "id": "jochbein_paired_group",
                "type": "paired_multiselect_group",
                "groupLabel": "Jochbeine",
                "leftConfig": { "id": "jochbein_links", "label": "Jochbein Links", "optionsKey": "JochbeinPairedOptions", "buttonTextConfig": { "placeholder": "Links..." } },
                "rightConfig": { "id": "jochbein_rechts", "label": "Jochbein Rechts", "optionsKey": "JochbeinPairedOptions", "buttonTextConfig": { "placeholder": "Rechts..." } }
              },
              {
                "id": "jochbogen_paired_group",
                "type": "paired_multiselect_group",
                "groupLabel": "Jochbögen",
                "leftConfig": { "id": "jochbogen_links", "label": "Jochbogen Links", "optionsKey": "JochbogenPairedOptions", "buttonTextConfig": { "placeholder": "Links..." } },
                "rightConfig": { "id": "jochbogen_rechts", "label": "Jochbogen Rechts", "optionsKey": "JochbogenPairedOptions", "buttonTextConfig": { "placeholder": "Rechts..." } }
              },
              {
                "id": "nasenbein_multiselect",
                "label": "Nasenbein",
                "type": "multiselect",
                "optionsKey": "NasenbeinOptions",
                "buttonTextConfig": { "placeholder": "Nasenbein auswählen..." }
              },
              {
                "id": "nasenseptum_lage_select",
                "label": "Nasenseptum",
                "type": "select",
                "optionsKey": "NasenseptumOptions"
              }
            ]
          },
          {
            "id": "nasennebenhoehlen_subsection",
            "legend": "Nasennebenhöhlen",
            "type": "collapsible_section",
            "initiallyExpanded": false,
            "fields": [
              {
                "id": "sinus_ethmoidalis_paired_group",
                "type": "paired_multiselect_group",
                "groupLabel": "Sinus Ethmoidalis (Siebbeinzellen)",
                "leftConfig": { "id": "sinus_ethmoidalis_links", "label": "Ethmoidalis Links", "optionsKey": "SinusEthmoidalisPairedOptions", "buttonTextConfig": { "placeholder": "Links..." } },
                "rightConfig": { "id": "sinus_ethmoidalis_rechts", "label": "Ethmoidalis Rechts", "optionsKey": "SinusEthmoidalisPairedOptions", "buttonTextConfig": { "placeholder": "Rechts..." } }
              },
              {
                "id": "sinus_maxillaris_paired_group",
                "type": "paired_multiselect_group",
                "groupLabel": "Sinus Maxillaris (Kieferhöhlen)",
                "leftConfig": { "id": "sinus_maxillaris_links", "label": "Links", "optionsKey": "SinusMaxillarisPairedOptions", "buttonTextConfig": { "placeholder": "Links..." } },
                "rightConfig": { "id": "sinus_maxillaris_rechts", "label": "Rechts", "optionsKey": "SinusMaxillarisPairedOptions", "buttonTextConfig": { "placeholder": "Rechts..." } }
              }
            ]
          },
          {
            "id": "alveolarfortsatz_subsection",
            "legend": "Alveolarfortsatz Oberkiefer",
            "type": "collapsible_section",
            "initiallyExpanded": true, // Keep expanded as it's a key DVT area
            "fields": [
              {
                "id": "alveolarfortsatz_ok_multiselect",
                "label": "Alveolarfortsatz OK Allgemein",
                "type": "multiselect",
                "optionsKey": "AlveolarfortsatzOptions",
                "buttonTextConfig": { "placeholder": "Allgemein auswählen..." }
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


  // Globale Variable für diese Konfiguration setzen
  window.FormConfiguration = formConfig;

})();
