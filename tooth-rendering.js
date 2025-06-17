// tooth-rendering.js
// Das Zahnschema-Modul als IIFE (Immediately Invoked Function Expression)
// Dies verhindert Konflikte mit globalen Variablen.
(function () {
    // Definition des Moduls 'dentalChartModule'
    const dentalChartModule = {
        /**
         * Erzeugt das HTML und die Event-Listener für einen einzelnen Zahn.
         * @param {Object} toothData - Das Datenobjekt für den zu rendernden Zahn.
         * @param {function} [onSurfaceLeftClick] - Callback für Linksklick.
         * @param {function} [onSurfaceRightClick] - Callback für Rechtsklick.
         * @returns {string} Das HTML-Markup für den einzelnen Zahn.
         */
        _createToothHtml: function (toothData) {
            if (!toothData) return '';

            const toothIdNum = parseInt(toothData.id);
            // Transform for the <g> element: Upper jaw (11-28, 51-65) is flipped vertically.
            const isUpperJaw = (toothIdNum >= 11 && toothIdNum <= 28) || (toothIdNum >= 51 && toothIdNum <= 65);
            const gTransform = isUpperJaw ? 'translate(0, 50) scale(1,-1)' : '';

            // Return only the SVG string, no extra div wrapper.
            // Add display: block to the SVG to avoid potential inline layout issues.
            let toothSvgHtml = `
                <svg width="30" height="50" viewBox="0 0 30 50" class="tooth-svg" data-tooth-id="${toothData.id}" style="display: block;">
                    <g transform="${gTransform}">
        `;
            toothData.surfaces.forEach(surface => {
                if (surface.id === 'crown_outline') {
                    toothSvgHtml += `<polygon id="tooth-${toothData.id}-${surface.id}" points="${surface.points}" class="crown-overlay" data-surface-id="${surface.id}" data-tooth-id="${toothData.id}" fill="none" stroke="none" stroke-width="1.5" />`;
                } else {
                    toothSvgHtml += `<polygon id="tooth-${toothData.id}-${surface.id}" points="${surface.points}" class="polygon" data-surface-id="${surface.id}" data-tooth-id="${toothData.id}" />`;
                }
            });
            toothSvgHtml += `</g></svg>`;
            return toothSvgHtml;
        },

        /**
         * Fügt Event-Listener zu den Oberflächen eines Zahns hinzu.
         * @param {Element} toothElementContainer - Das Container-Element des Zahns.
         * @param {string} schemaOptionsKey - Der OptionsKey des aktuellen Schemas.
         * @param {function} [onSurfaceLeftClick] - Callback für Linksklick.
         * @param {function} [onSurfaceRightClick] - Callback für Rechtsklick.
         */
        _addSurfaceEventListeners: function (svgElement, schemaOptionsKey, onSurfaceLeftClick, onSurfaceRightClick) { // schemaOptionsKey hinzugefügt
            if (!svgElement || !schemaOptionsKey) return;

            const surfaceTooltip = document.getElementById('surface-tooltip');
            // Add listeners only to actual surfaces, not overlays like crown_outline if it shouldn't be interactive
            svgElement.querySelectorAll('.polygon').forEach(polygon => {
                if (typeof onSurfaceLeftClick === 'function') {
                    polygon.addEventListener('click', function (event) {
                        // this.classList.toggle('selected'); // Transient selection is handled by the callback
                        const toothId = this.getAttribute('data-tooth-id');
                        const surfaceId = this.getAttribute('data-surface-id');
                        const isSelected = this.classList.contains('surface-selected-transient'); // Check against transient class
                        onSurfaceLeftClick(toothId, surfaceId, !isSelected, schemaOptionsKey, event); // schemaOptionsKey und event übergeben
                    });
                }
                if (typeof onSurfaceRightClick === 'function') {
                    polygon.addEventListener('contextmenu', function (event) {
                        event.preventDefault();
                        event.stopPropagation(); // Prevent event from bubbling to parent containers
                        const toothId = this.getAttribute('data-tooth-id');
                        const surfaceId = this.getAttribute('data-surface-id');
                        onSurfaceRightClick(toothId, surfaceId, event, schemaOptionsKey); // schemaOptionsKey übergeben
                    });
                }
                if (surfaceTooltip) { // Only add hover listeners if tooltip element exists
                    polygon.addEventListener('mouseover', function (event) {
                        const toothId = this.getAttribute('data-tooth-id');
                        const surfaceId = this.getAttribute('data-surface-id');
                        let tooltipText = '';

                        const surfaceData = inlineZahnschemaState[toothId]?.surfaceFindings?.[surfaceId];
                        if (surfaceData) {
                            const activeOptionsConfig = getDynamicElementOptions(schemaOptionsKey);
                            const activeOptions = activeOptionsConfig?.items || activeOptionsConfig || [];
                            let findingsOnSurface = [];
                            activeOptions.forEach(opt => {
                                const finding = surfaceData[opt.value];
                                if (finding && finding.checked) {
                                    let text = getTextResource(finding.text || opt.text, finding.text || opt.text);
                                    if (finding.details && typeof finding.details === 'string' && finding.details.trim() !== '') {
                                        text += `: ${finding.details.trim()}`;
                                    }
                                    // TODO: Handle complex details (select, multiselect) for tooltip if necessary
                                    findingsOnSurface.push(text);
                                }
                            });
                            if (findingsOnSurface.length > 0) {
                                tooltipText = `${getTextResource(surfaceId, surfaceId)}: ${findingsOnSurface.join('; ')}`;
                            }
                        }

                        if (tooltipText) {
                            surfaceTooltip.innerHTML = tooltipText;
                            surfaceTooltip.style.display = 'block';
                            surfaceTooltip.style.left = (event.pageX + 15) + 'px';
                            surfaceTooltip.style.top = (event.pageY + 15) + 'px';
                        } else {
                            surfaceTooltip.style.display = 'none';
                        }
                    });

                    polygon.addEventListener('mouseout', function () {
                        if (surfaceTooltip) {
                            surfaceTooltip.style.display = 'none';
                        }
                    });
                }
            });
        },

        /**
         * Rendert einen einzelnen Zahn in einem Zielcontainer und fügt Event-Listener hinzu.
         * @param {string} toothIdToRender - Die ID des zu rendernden Zahns.
         * @param {string|HTMLElement} targetContainerOrId - Die ID des Ziel-Containers oder das HTMLElement selbst.
         * @param {Array<Object>} teethConfiguration - Die Konfiguration aller Zähne.
         * @param {string} schemaOptionsKey - Der OptionsKey des aktuellen Schemas.
         * @param {function} [onSurfaceLeftClick] - Callback für Linksklick auf eine Oberfläche.
         * @param {function} [onSurfaceRightClick] - Callback für Rechtsklick auf eine Oberfläche.
         */
        renderSingleTooth: function (toothIdToRender, targetContainerOrId, teethConfiguration, schemaOptionsKey, onSurfaceLeftClick, onSurfaceRightClick) {
            let targetContainer;
            if (typeof targetContainerOrId === 'string') {
                targetContainer = document.getElementById(targetContainerOrId);
            } else if (targetContainerOrId instanceof HTMLElement) {
                targetContainer = targetContainerOrId;
            }

            if (!targetContainer) {
                console.error('Ziel-Container-Element nicht gefunden oder ungültig:', targetContainerOrId);
                return;
            }
            if (!teethConfiguration || !Array.isArray(teethConfiguration)) {
                console.error('Ungültige oder fehlende teethConfiguration für renderSingleTooth.', teethConfiguration);
                return;
            }

            const toothData = teethConfiguration.find(tooth => tooth.id === toothIdToRender);

            if (!toothData) {
                console.error(`Zahn mit ID ${toothIdToRender} nicht in teethConfiguration gefunden.`);
                targetContainer.innerHTML = `<p style="color: red;">Zahn ${toothIdToRender} nicht gefunden.</p>`;
                return;
            }

            const toothSvgDirectHtml = this._createToothHtml(toothData); // Returns only SVG string
            targetContainer.innerHTML = toothSvgDirectHtml; // targetContainer is the svgToothHostDiv

            // Event-Listener für den einzelnen Zahn hinzufügen
            const renderedSvgElement = targetContainer.querySelector(`.tooth-svg[data-tooth-id="${toothIdToRender}"]`);
            if (renderedSvgElement) {
                this._addSurfaceEventListeners(renderedSvgElement, schemaOptionsKey, onSurfaceLeftClick, onSurfaceRightClick);
            }
        }
     
    };
    window.DentalChartModule = dentalChartModule;
})();
