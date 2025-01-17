document.addEventListener('DOMContentLoaded', () => {
    const colorPalette = document.getElementById('color-palette');
    const generateButton = document.getElementById('generate-palette');
    const saveButton = document.getElementById('save-palette');
    const savedPalettesGrid = document.getElementById('saved-palettes-grid');

    let currentPalette = [];

    function generateRandomColor() {
        return chroma.random();
    }

    function generatePalette() {
        colorPalette.innerHTML = '';
        currentPalette = [];

        for (let i = 0; i < 5; i++) {
            const color = generateRandomColor();
            currentPalette.push(color);

            const swatch = document.createElement('div');
            swatch.classList.add('color-swatch');
            swatch.style.backgroundColor = color.hex();

            const colorInfo = document.createElement('div');
            colorInfo.classList.add('color-info');
            colorInfo.innerHTML = `
                <span class="color-hex">${color.hex()}</span>
                <span class="color-name">${color.name()}</span>
            `;

            swatch.appendChild(colorInfo);

            swatch.addEventListener('click', () => {
                navigator.clipboard.writeText(color.hex());
                showNotification(`Copied ${color.hex()} to clipboard!`);
            });

            colorPalette.appendChild(swatch);
            setTimeout(() => swatch.style.opacity = 1, 50 * i);
        }
    }

    function savePalette() {
        let paletteName = prompt('Enter a name for this palette:');
        if (!paletteName) return;

        let savedPalettes = JSON.parse(localStorage.getItem('savedPalettes')) || [];
        const originalName = paletteName;
        let counter = 1;

        // Check for existing palette names and modify the name if necessary
        while (savedPalettes.some(palette => palette.name === paletteName)) {
            paletteName = `${originalName} (${counter})`;
            counter++;
        }

        const paletteData = {
            name: paletteName,
            colors: currentPalette.map(color => color.hex())
        };

        // Save to local storage
        savedPalettes.push(paletteData);
        localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));

        displaySavedPalette(paletteData);
        showNotification('Palette saved!');
    }

    function displaySavedPalette(paletteData) {
        const paletteContainer = document.createElement('div');
        paletteContainer.classList.add('saved-palette');

        const paletteColors = document.createElement('div');
        paletteColors.classList.add('saved-palette-colors');

        paletteData.colors.forEach(colorHex => {
            const swatch = document.createElement('div');
            swatch.classList.add('saved-palette-color');
            swatch.style.backgroundColor = colorHex;
            swatch.title = colorHex;

            swatch.addEventListener('click', () => {
                navigator.clipboard.writeText(colorHex);
                showNotification(`Copied ${colorHex} to clipboard!`);
            });

            paletteColors.appendChild(swatch);
        });

        const paletteInfo = document.createElement('div');
        paletteInfo.classList.add('saved-palette-info');

        const paletteNameElement = document.createElement('span');
        paletteNameElement.classList.add('saved-palette-name');
        paletteNameElement.textContent = paletteData.name;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-palette');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.addEventListener('click', () => {
            paletteContainer.style.opacity = 0;
            setTimeout(() => savedPalettesGrid.removeChild(paletteContainer), 300);
            removePaletteFromStorage(paletteData.name);
        });

        paletteInfo.appendChild(paletteNameElement);
        paletteInfo.appendChild(deleteButton);

        paletteContainer.appendChild(paletteColors);
        paletteContainer.appendChild(paletteInfo);
        savedPalettesGrid.appendChild(paletteContainer);

        setTimeout(() => paletteContainer.style.opacity = 1, 50);
    }

    function removePaletteFromStorage(paletteName) {
        let savedPalettes = JSON.parse(localStorage.getItem('savedPalettes')) || [];
        savedPalettes = savedPalettes.filter(palette => palette.name !== paletteName);
        localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
    }

    function loadSavedPalettes() {
        const savedPalettes = JSON.parse(localStorage.getItem('savedPalettes')) || [];
        savedPalettes.forEach(paletteData => {
            displaySavedPalette(paletteData);
        });
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.classList.add('notification');
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }, 10);
    }

    generateButton.addEventListener('click', generatePalette);
    saveButton.addEventListener('click', savePalette);

    // Load saved palettes on page load
    loadSavedPalettes();

    // Generate initial palette
    generatePalette();
});