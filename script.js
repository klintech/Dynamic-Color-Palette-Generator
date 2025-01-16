document.addEventListener('DOMContentLoaded', () => {
    const colorPalette = document.getElementById('color-palette');
    const generateButton = document.getElementById('generate-palette');
    const saveButton = document.getElementById('save-palette');
    const savedPalettes = document.getElementById('saved-palettes');

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
            swatch.setAttribute('data-color', color.hex());

            swatch.addEventListener('click', () => {
                navigator.clipboard.writeText(color.hex());
                alert(`Copied ${color.hex()} to clipboard!`);
            });

            colorPalette.appendChild(swatch);
        }
    }

    function savePalette() {
        const paletteContainer = document.createElement('div');
        paletteContainer.classList.add('saved-palette');

        const paletteColors = document.createElement('div');
        paletteColors.classList.add('saved-palette-colors');

        currentPalette.forEach(color => {
            const swatch = document.createElement('div');
            swatch.classList.add('saved-palette-color');
            swatch.style.backgroundColor = color.hex();
            paletteColors.appendChild(swatch);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            savedPalettes.removeChild(paletteContainer);
        });

        paletteContainer.appendChild(paletteColors);
        paletteContainer.appendChild(deleteButton);
        savedPalettes.appendChild(paletteContainer);
    }

    generateButton.addEventListener('click', generatePalette);
    saveButton.addEventListener('click', savePalette);

    // Generate initial palette
    generatePalette();
});