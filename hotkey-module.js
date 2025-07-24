// ========================================================================
// MODULE: HOTKEY AND CONTEXT MENU
// Datei: hotkey-module.js
// ========================================================================

(function(window) {
    'use strict';

    let lastFocusedElement = null;

    function init() {
        console.log('[HotkeyModule] Initializing...');
        document.addEventListener('keydown', handleHotkey);
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('focusin', handleFocusIn);
        document.addEventListener('click', () => {
            removeCustomContextMenu();
        });
    }

    function handleFocusIn(event) {
        if (event.target.matches('input[type="text"], textarea')) {
            lastFocusedElement = event.target;
            console.log('[HotkeyModule] Focused element:', lastFocusedElement);
        }
    }

    function handleHotkey(event) {
        // Ctrl+Shift+C
        if (event.ctrlKey && event.shiftKey && event.key === 'C') {
            event.preventDefault();
            console.log('[HotkeyModule] Hotkey pressed');
            pasteFromClipboard();
        }
    }

    function handleContextMenu(event) {
        if (event.target.matches('input[type="text"], textarea')) {
            event.preventDefault();
            lastFocusedElement = event.target;
            showCustomContextMenu(event.clientX, event.clientY);
        }
    }

    function showCustomContextMenu(x, y) {
        removeCustomContextMenu(); // Remove any existing menu

        const menu = document.createElement('div');
        menu.id = 'custom-context-menu';
        menu.style.position = 'absolute';
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
        menu.style.backgroundColor = 'white';
        menu.style.border = '1px solid #ccc';
        menu.style.padding = '8px';
        menu.style.zIndex = '10000';

        const pasteButton = document.createElement('button');
        pasteButton.textContent = 'Paste from Clipboard';
        pasteButton.style.display = 'block';
        pasteButton.style.width = '100%';
        pasteButton.style.textAlign = 'left';
        pasteButton.style.padding = '5px';
        pasteButton.style.border = 'none';
        pasteButton.style.backgroundColor = 'transparent';
        pasteButton.style.cursor = 'pointer';

        pasteButton.addEventListener('mouseover', () => {
            pasteButton.style.backgroundColor = '#f0f0f0';
        });
        pasteButton.addEventListener('mouseout', () => {
            pasteButton.style.backgroundColor = 'transparent';
        });

        pasteButton.addEventListener('click', () => {
            pasteFromClipboard();
            removeCustomContextMenu();
        });

        menu.appendChild(pasteButton);
        document.body.appendChild(menu);
    }

    function removeCustomContextMenu() {
        const menu = document.getElementById('custom-context-menu');
        if (menu) {
            menu.remove();
        }
    }

    async function pasteFromClipboard() {
        if (!lastFocusedElement) {
            console.warn('[HotkeyModule] No focused element to paste into.');
            return;
        }

        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                const start = lastFocusedElement.selectionStart;
                const end = lastFocusedElement.selectionEnd;
                const currentValue = lastFocusedElement.value;
                const newValue = currentValue.substring(0, start) + text + currentValue.substring(end);
                lastFocusedElement.value = newValue;
                lastFocusedElement.selectionStart = lastFocusedElement.selectionEnd = start + text.length;
                lastFocusedElement.focus();

                // Manually trigger input event to notify other parts of the application
                const event = new Event('input', { bubbles: true, cancelable: true });
                lastFocusedElement.dispatchEvent(event);

                console.log('[HotkeyModule] Pasted text:', text);
            }
        } catch (err) {
            console.error('[HotkeyModule] Failed to read clipboard contents: ', err);
        }
    }

    // Expose the init function to the global scope
    window.HotkeyModule = {
        init: init
    };

})(window);
