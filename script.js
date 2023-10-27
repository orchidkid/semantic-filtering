// JavaScript код тут

const phrasesInput = document.getElementById('phrases');
const loadButton = document.getElementById('loadButton');
const phrasesOutput = document.getElementById('phrasesOutput');

const searchInput = document.getElementById('searchPhrases');
const searchType = document.getElementById('searchType');
const searchButton = document.getElementById('searchButton');

const minusWordInput = document.getElementById('minusWord');
const minusWordType = document.getElementById('minusWordType');
const addButton = document.getElementById('addButton');
const minusWordsOutput = document.getElementById('minusWordsOutput');
const minusWords = [];

const highlightButton = document.getElementById('highlightButton');
const filteredPhrases = [];
const removedPhrases = [];

const filterButton = document.getElementById('filterButton');
const filteredOutput = document.getElementById('filteredOutput');
const removedOutput = document.getElementById('removedOutput');

const exportButton = document.getElementById('exportButton'); // Added this line

loadButton.addEventListener('click', () => {
    phrasesOutput.innerHTML = phrasesInput.value.split('\n').map(line => `<span>${line.toLowerCase()}</span><br>`).join('');
});

function containsCyrillic(text) {
    return /[а-яёіїєґ]/i.test(text);
}

addButton.addEventListener('click', () => {
    const minusWord = minusWordInput.value;
    const type = minusWordType.value;
    minusWords.push({ word: minusWord, type });
    updateMinusWordsOutput();
    clearMinusWord();
});

searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    const type = searchType.value;
    const phrases = phrasesInput.value.split('\n');

    let filteredPhrasesForSearch;

    if (!searchTerm) { // Check if search term is empty
        filteredPhrasesForSearch = phrases;
    } else {
        filteredPhrasesForSearch = phrases.filter(phrase => {
            const words = phrase.split(/\s+/);
            if (type === 'Часткове входження' && phrase.includes(searchTerm)) {
                return true;
            } else if (type === 'Точне входження' && words.includes(searchTerm)) {
                return true;
            }
            return false;
        });
    }

    phrasesOutput.innerHTML = filteredPhrasesForSearch.map(phrase => {
        if (removedPhrases.includes(phrase)) {
            return `<span class="removed">${phrase}</span><br>`;
        }
        return `<span>${phrase}</span><br>`;
    }).join('');
});

highlightButton.addEventListener('click', () => {
    const phrases = phrasesInput.value.split('\n');
    filteredPhrases.length = 0;
    removedPhrases.length = 0;
    phrases.forEach((phrase) => {
        const highlighted = minusWords.some(({ word, type }) => {
            if (type === 'Часткове входження' && phrase.includes(word)) {
                return true;
            } else if (type === 'Містить тільки дане слово' && phrase.split(' ').length === 1 && phrase.includes(word)) {
                return true;
            } else if (type === 'Фразове входження' && phrase.includes(word)) {
                return true;
            } else if (type === 'Точне входження' && phrase.split(' ').includes(word)) {
                return true;
            }
            return false;
        });

        if (highlighted) {
            removedPhrases.push(phrase);
        } else {
            filteredPhrases.push(phrase);
        }
    });
    updatePhrasesOutput();
});

filterButton.addEventListener('click', () => {
    updateFilteredOutput();
    updateRemovedOutput();
});

exportButton.addEventListener('click', () => {
    exportToCsv();
});

function updateMinusWordsOutput() {
    const outputHtml = minusWords.map(({ word, type }, index) => {
        return `
          <div class="minus-word-container">
            <span class="styled-minus-word">${word} &nbsp; (${type.toLowerCase()})</span>
            <div class="remove-button-container"><span class="remove-button" data-index="${index}" onclick="removeMinusWord(${index})">✖</span></div>
          </div>`;
    }).join('');
    minusWordsOutput.innerHTML = outputHtml;
}

function updatePhrasesOutput() {
    let outputHtml = '';

    phrasesInput.value.split('\n').forEach((phrase) => {
        if (removedPhrases.includes(phrase)) {
            outputHtml += `<span class="removed">${phrase}</span><br>`;
        } else {
            outputHtml += `<span>${phrase}</span><br>`;
        }
    });

    phrasesOutput.innerHTML = outputHtml;
}

function updateFilteredOutput() {
    const outputHtml = filteredPhrases.map((phrase) => `<span>${phrase}</span><br>`).join('');
    filteredOutput.innerHTML = outputHtml;
}

function updateRemovedOutput() {
    const outputHtml = removedPhrases.map((phrase) => `<span>${phrase}</span><br>`).join('');
    removedOutput.innerHTML = outputHtml;
}

function removeMinusWord(index) {
    if (index >= 0 && index < minusWords.length) {
        minusWords.splice(index, 1);
        updateMinusWordsOutput();
    }
}

function clearMinusWord() {
    minusWordInput.value = '';
}

function exportToCsv() {
    const csvData = [];
    const maxLen = Math.max(filteredPhrases.length, removedPhrases.length);
    for (let i = 0; i < maxLen; i++) {
        const filteredPhrase = i < filteredPhrases.length ? `"${filteredPhrases[i]}"` : '""';
        const removedPhrase = i < removedPhrases.length ? `"${removedPhrases[i]}"` : '""';
        csvData.push([filteredPhrase, removedPhrase]);
    }

    const csvContent = csvData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtered_phrases.csv';
    a.click();

    URL.revokeObjectURL(url);
}

const exportMinusWordsButton = document.getElementById('exportMinusWordsButton');

exportMinusWordsButton.addEventListener('click', () => {
    const csvContent = minusWords.map(({ word, type }) => `${word},${type}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'minus_words.csv';
    a.click();

    URL.revokeObjectURL(url);
});

const importMinusWordsInput = document.getElementById('importMinusWordsInput');
const importMinusWordsButton = document.getElementById('importMinusWordsButton');

importMinusWordsButton.addEventListener('click', () => {
    importMinusWordsInput.click();
});

importMinusWordsInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    const content = await file.text();
    const lines = content.split('\n');
    minusWords.length = 0;
    lines.forEach(line => {
        const [word, type] = line.split(',');
        minusWords.push({ word, type });
    });
    updateMinusWordsOutput();
});
