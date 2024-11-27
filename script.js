let editor = document.querySelector('#editor');
let makeHeaders = document.querySelector('#make-heading');
let makeParagraph = document.querySelector('#make-paragraph');
let insertImage = document.querySelector('#insert-image'); 
let copyHtml = document.querySelector('#copy-html'); 
let undo = document.querySelector('#undo');
let redo = document.querySelector('#redo');

let undoStack = [];
let redoStack = [];

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function saveState() {
    undoStack.push(editor.innerHTML);
    redoStack = []; 
}

// Создать заголовок

makeHeaders.addEventListener('click', function () {
    saveState();
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    const isInsideEditor = editor.contains(range.commonAncestorContainer);

    if (!isInsideEditor) {
        alert("Выделение происходит вне редактора!");
        return;
    }

    const node = range.startContainer;
    const isElementNode = node.nodeType === Node.ELEMENT_NODE;
    
    const heading = isElementNode && node.nodeName === 'H3'
        ? node
        : node.parentElement?.nodeName === 'H3'
        ? node.parentElement
        : null;    

    if (heading) {
        alert("Выделенный текст уже является заголовком!");
        return;
    }

    if (selectedText.trim() !== '') {
        const heading = document.createElement('h3');
        heading.textContent = selectedText;

        range.deleteContents();
        range.insertNode(heading);

        selection.removeAllRanges();
    }
});

// Создать абзац

makeParagraph.addEventListener('click', function () {
    saveState();
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    const isInsideEditor = editor.contains(range.commonAncestorContainer);

    if (!isInsideEditor) {
        alert("Выделение происходит вне редактора!");
        return;
    }

    const node = range.startContainer;

    const isElement = node.nodeType === Node.ELEMENT_NODE;
    
    const heading = isElement && node.nodeName === 'H3'
        ? node
        : node.parentElement?.nodeName === 'H3'
            ? node.parentElement
            : null;
    
    const paragraph = isElement && node.nodeName === 'P'
        ? node
        : node.parentElement?.nodeName === 'P'
            ? node.parentElement
            : null;
    
            

    if (paragraph) {
        const fullText = paragraph.textContent.trim();

        if (fullText === selectedText.trim()) {
            alert("Выделенный текст уже является абзацем!");
            return;
        }

        if (selectedText.trim() !== '') {
            const newParagraph = document.createElement('p');
            newParagraph.textContent = selectedText;

            range.deleteContents();
            range.insertNode(newParagraph);

            selection.removeAllRanges();
        }
        return;
    }

    if (heading) {
        const paragraph = document.createElement('p');
        paragraph.textContent = heading.textContent;

        heading.replaceWith(paragraph);
        selection.removeAllRanges();
    } else if (selectedText.trim() !== '') {
        const paragraph = document.createElement('p');
        paragraph.textContent = selectedText;

        range.deleteContents();
        range.insertNode(paragraph);

        selection.removeAllRanges();
    }
});



// Добавить изображение

insertImage.addEventListener('click', function() {
    saveState();
    const selection = window.getSelection();
    
    if (!selection || !selection.rangeCount) {
        alert("Необходимо выбрать место для вставки изображения");
        return;
    }

    const range = selection.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) {
        alert("Курсор должен находиться внутри редактора");
        return;
    }

    const imageUrl = prompt('Введите URL изображения:');

    if (!imageUrl || !isValidUrl(imageUrl)) {
        alert('Пожалуйста, введите корректный URL изображения.');
        return;
    }

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Вставленное изображение'; 
    img.width = 300; 


    range.deleteContents(); 
    range.insertNode(img); 
    selection.removeAllRanges();
});

// Скопировать HTML

copyHtml.addEventListener('click', function() {

    if (editor) {
        const htmlContent = editor.innerHTML; 

        navigator.clipboard.writeText(htmlContent).then(() => {
            alert('HTML-код скопирован в буфер обмена!');
        }).catch(err => {
            alert('Ошибка при копировании: ' + err);
        });
    } else {
        alert('Редактор не найден!');
    }
});



// undo redo



undo.addEventListener('click', () => {
    if (undoStack.length > 0) {
        const previousState = undoStack.pop();
        redoStack.push(editor.innerHTML);
        editor.innerHTML = previousState;
    } else {
        alert('Нет изменений для отмены');
    }
});
redo.addEventListener('click', () => {
    if (redoStack.length > 0) {
        const nextState = redoStack.pop();
        undoStack.push(editor.innerHTML);
        editor.innerHTML = nextState;
    } else {
        alert('Нет изменений для повтора');
    }
});
