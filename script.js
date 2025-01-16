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
        const paletteName = prompt('Enter a name for this palette:');
        if (!paletteName) return;

        const paletteContainer = document.createElement('div');
        paletteContainer.classList.add('saved-palette');

        const paletteColors = document.createElement('div');
        paletteColors.classList.add('saved-palette-colors');

        currentPalette.forEach(color => {
            const swatch = document.createElement('div');
            swatch.classList.add('saved-palette-color');
            swatch.style.backgroundColor = color.hex();
            swatch.title = `${color.name()} - ${color.hex()}`;

            swatch.addEventListener('click', () => {
                navigator.clipboard.writeText(color.hex());
                showNotification(`Copied ${color.hex()} to clipboard!`);
            });

            paletteColors.appendChild(swatch);
        });

        const paletteInfo = document.createElement('div');
        paletteInfo.classList.add('saved-palette-info');

        const paletteNameElement = document.createElement('span');
        paletteNameElement.classList.add('saved-palette-name');
        paletteNameElement.textContent = paletteName;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-palette');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.addEventListener('click', () => {
            paletteContainer.style.opacity = 0;
            setTimeout(() => savedPalettesGrid.removeChild(paletteContainer), 300);
        });

        paletteInfo.appendChild(paletteNameElement);
        paletteInfo.appendChild(deleteButton);

        paletteContainer.appendChild(paletteColors);
        paletteContainer.appendChild(paletteInfo);
        savedPalettesGrid.appendChild(paletteContainer);

        setTimeout(() => paletteContainer.style.opacity = 1, 50);
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
    saveButton.addEventListener('click', () => {
        savePalette();
        showNotification('Palette saved!');
    });

    // Generate initial palette
    generatePalette();
});

