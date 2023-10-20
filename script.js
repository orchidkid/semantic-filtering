document.addEventListener("DOMContentLoaded", function() {
    // Обработчики событий
    document.getElementById('loadKeywords').addEventListener('click', loadKeywords);
    document.getElementById('highlightMinusWordsBtn').addEventListener('click', highlightSelectedWords);
    document.getElementById('filterKeywordsBtn').addEventListener('click', filterKeywords);
    document.getElementById('downloadCSVBtn').addEventListener('click', downloadCSV);
});

function loadKeywords() {
    const keywordInput = document.getElementById('keywordsInput').value;
    const keywordsList = keywordInput.split('\n');
    const displayArea = document.getElementById('keywordsDisplay');
    displayArea.innerHTML = '';

    keywordsList.forEach(phrase => {
        const div = document.createElement('div');
        phrase.split(' ').forEach(word => {
            const span = document.createElement('span');
            span.innerText = word;
            span.classList.add('keyword');
            span.addEventListener('click', () => toggleKeywordSelection(word));
            div.appendChild(span);
        });
        displayArea.appendChild(div);
    });
}

function toggleKeywordSelection(word) {
    const minusWordsArea = document.getElementById('minusWords');
    let currentMinusWords = splitByNewline(minusWordsArea.value);

    if (currentMinusWords.includes(word)) {
        currentMinusWords = currentMinusWords.filter(w => w !== word);
    } else {
        currentMinusWords.push(word);
    }

    minusWordsArea.value = currentMinusWords.join('\n');
    highlightSelectedWords();
}

function highlightSelectedWords() {
    const minusWords = splitByNewline(document.getElementById('minusWords').value);
    const keywords = document.querySelectorAll('.keyword');
    
    keywords.forEach(kw => {
        const keywordText = kw.innerText.toLowerCase(); // Приводим текст ключевого слова к нижнему регистру
        const shouldHighlight = minusWords.some(mw => keywordText.includes(mw.toLowerCase())); // Проверяем вхождение
        if (shouldHighlight) {
            kw.classList.add('highlighted');
        } else {
            kw.classList.remove('highlighted');
        }
    });
}

function filterKeywords() {
    const keywords = splitByNewline(document.getElementById('keywordsInput').value);
    const minusWords = splitByNewline(document.getElementById('minusWords').value);
    const filtered = keywords.filter(kw => !minusWords.some(mw => kw.includes(mw)));
    document.getElementById('filteredKeywords').value = filtered.join('\n');
}

function downloadCSV() {
    const filteredKeywords = splitByNewline(document.getElementById('filteredKeywords').value);
    let csvContent = "data:text/csv;charset=utf-8,Ключові слова\n" + filteredKeywords.join('\n');
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "filtered_keywords.csv");
    document.body.appendChild(link);
    link.click();
}

function splitByNewline(str) {
    return str.split('\n').filter(line => line.trim() !== '');
}
