# zahnaerztliches-Roentgenbefundungstool
Vereinfachung des Workflows bei der Befundung von zahnärztlichen und kieferchirurgischen Röntgenaufnahmen
##Grundsätzliches
Führe ein logging über Consolenausgaben, aber mach dieses nicht zu kleinteilig, da sonst zuviel in der Console steht.
Verzichte auf nicht wichtige Kommentare im Code
Halte den Progress in dieser Readme fest.

aktuelle ToDo:
- Befunde aus den nested Options der Multiselects (kommen vor allem beim multiselect der Zahncontainer vor) speichern noch nicht alle Befunde bzw zeigen diese in der Befundzusammenfassung nicht richtig an
- die SVG surfaces ermöglichen die Befundung pro Teil eines Zahnes. Diese Surfaces sollen beim Multiselect des Multiselects des Containers als Option + ganzer Zahn für jeden Befund erscheinen. Wenn nun verschiedene oder einzelne Surfaces ausgewählt wurden muss das Element Zahn zu den bestimmten Flächen im Dropdownmenü Befunde erhalten. Dies klappt so aktuell leider noch nicht