
// JavaScript код тут

const phrasesInput = document.getElementById('phrases');
const loadButton = document.getElementById('loadButton');
const phrasesOutput = document.getElementById('phrasesOutput');

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

const exportButton = document.getElementById('exportButton');

loadButton.addEventListener('click', () => {
    phrasesOutput.innerHTML = phrasesInput.value.split('\n').map(line => `<span class = "added">${line.toLowerCase()}</span>`).join('');
});

addButton.addEventListener('click', () => {
    const minusWord = minusWordInput.value;
    const type = minusWordType.value;
    minusWords.push({ word: minusWord, type });
    updateMinusWordsOutput();
    clearMinusWord(); // Очищення поля введення мінус-слова
});

highlightButton.addEventListener('click', () => {
    const phrases = phrasesInput.value.split('\n');
    filteredPhrases.length = 0;
    removedPhrases.length = 0;
    phrases.forEach((phrase) => {
        const highlighted = minusWords.some(({ word, type }) => {
            if (type === 'Часткове входження' && phrase.includes(word)) {
                return true;
            } else if (type === 'Містить тільки дане слово' && word === phrase) {
                return true;
            } else if (type === 'Фразове входження' && phrase.includes(word)) {
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
            ${word} (${type})
            <div class="remove-button-container"><span class="remove-button" data-index="${index}" onclick="removeMinusWord(${index})">✖</span></div>
          </div>`;
    }).join('');
    minusWordsOutput.innerHTML = outputHtml;
}

function updatePhrasesOutput() {
    const outputHtml = phrasesInput.value.split('\n').map((phrase) => {
        if (removedPhrases.includes(phrase)) {
            return `<span class="removed">${phrase}</span>`;
        } else if (filteredPhrases.includes(phrase)) {
            return `<span class="highlighted">${phrase}</span>`;
        }
        return `<span>${phrase}</span>`;
    }).join('');
    phrasesOutput.innerHTML = outputHtml;
}

function updateFilteredOutput() {
    const outputHtml = filteredPhrases.map((phrase) => `<span>${phrase}</span>`).join('');
    filteredOutput.innerHTML = `Відфільтровані фрази:<br>${outputHtml}`;
}

function updateRemovedOutput() {
    const outputHtml = removedPhrases.map((phrase) => `<span>${phrase}</span>`).join('');
    removedOutput.innerHTML = `Видалені фрази:<br>${outputHtml}`;
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
        const filteredPhrase = i < filteredPhrases.length ? filteredPhrases[i] : '';
        const removedPhrase = i < removedPhrases.length ? removedPhrases[i] : '';
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