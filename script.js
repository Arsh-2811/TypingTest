class Stack {
    constructor() {
        this.items = [];
    }

    push(element) {
        this.items.push(element);
    }

    pop() {
        if (this.isEmpty()) throw new Error("Stack is empty, cannot pop.");
        return this.items.pop();
    }

    peek() {
        if (this.isEmpty()) throw new Error("Stack is empty, cannot peek.");
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    print() {
        console.log(this.items.join(" -> "));
    }

    clear() {
        this.items = [];
    }
}

function printUserArray() {
    userArray.forEach((value, index) => {
        console.log(`Index ${index} : ${value}`);
    });
}

//let originalText = "hello world";
let originalText = "Morning walks are a refreshing way to start the day. The crisp air, chirping birds, and golden sunlight create a peaceful atmosphere. With every step, the mind clears, and energy builds for the day ahead. It's a simple yet effective ritual that nurtures both physical health and mental clarity.";
// TODO : This will be fetched using a an API call in future
let wordArray = originalText.split(' ');

let userArray = new Array(originalText.length);
const hotStack = new Stack();

let currentIndex = 0;
let cursorIndex = 0;
let hotIndex = 0;

let currentWord = "";
let prevWord = "";

let correct = 0;
let incorrect = 0;
let extra = 0;
let missed = 0;

const inputBox = document.getElementById('textInputBox');
const wpmDiv = document.getElementById('wpmDiv');
const wpmValue = document.getElementById('wpmValue');

function render() {
    const container = document.getElementById("container");
    container.innerHTML = "";

    for (let i = 0; i < wordArray.length; i++) {
        const originalWord = wordArray[i];
        const userWord = userArray[i] || '';

        const wordDiv = document.createElement('div');
        wordDiv.classList.add('word');

        const maxLength = Math.max(originalWord.length, userWord.length);
        for (let j = 0; j < maxLength; j++) {

            if (i === currentIndex && j === cursorIndex) {
                const cursorDiv = document.createElement('div');
                cursorDiv.classList.add('cursor');
                wordDiv.append(cursorDiv);
            }

            const originalLetter = originalWord[j] || '';
            const userLetter = userWord[j] || '';

            const letterDiv = document.createElement('div');
            letterDiv.classList.add('letter');

            if (userLetter === originalLetter) {
                letterDiv.classList.add('correct');
                letterDiv.textContent = originalLetter;
            } else if (j >= userWord.length) {
                letterDiv.textContent = originalLetter;
                // do nothing
            } else if (originalLetter === '') {
                letterDiv.classList.add('incorrectExtra');
                letterDiv.textContent = userLetter;
            } else {
                letterDiv.classList.add('incorrect');
                letterDiv.textContent = originalLetter;
            }

            //letterDiv.textContent = userLetter || originalLetter;
            wordDiv.appendChild(letterDiv);
        }

        if (i == currentIndex && cursorIndex >= originalText.length) {
            const cursorDiv = document.createElement('div');
            cursorDiv.classList.add('cursor');
            wordDiv.appendChild(cursorDiv);
        }

        container.appendChild(wordDiv);
    }
}

function trackInputBox() {
    inputBox.addEventListener("keydown", (event) => {
        prevWord = inputBox.value.trim();

        if (event.key === ' ') {
            //event.preventDefault();
            console.log('Space bar was pressed!');
            handleSpaceBar();
        }
    });

    inputBox.addEventListener("keyup", (event) => {
        if (currentIndex === wordArray.length) {
            inputBox.disabled = true;
            console.log('Typing test is over');
            
            const testingDuration = performance.now() - startTime;
            const wpm = (correct / 5) / (testingDuration / 60000);

            console.log(`Total Duration of testing : ${testingDuration} milliseconds`);
            console.log(`Correct characters typed : ${correct}`);
            console.log(`WPM : ${wpm}`);

            wpmValue.textContent = wpm.toFixed(2);
            wpmDiv.style.display = 'block';
  
            return;
        }

        currentWord = inputBox.value.trim();

        if (event.key === 'Meta') console.log('Command + backspace was pressed!');

        else if (event.altKey && event.key === 'Backspace') {
            //event.preventDefault();
            console.log('Option + Backspace was pressed!');
            handleAltPlusBackspace();
        }

        else if (event.key === 'Backspace') {
            //event.preventDefault();
            console.log('Backspce was pressed!');
            handleBackspace();
        }

        else if (/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]$/.test(event.key)) {
            //event.preventDefault();
            handleNormalInput();
        }

        // else console.log(`Key pressed : ${event.key}`);
        console.log('User array : ');
        printUserArray();

        console.log('Hot Stack : ');
        hotStack.print();

        console.log(`Current input value: ${currentWord}`);

        console.log('\n\n\n');
        render();
    });
}

function compareWords(originalWord, userWord) {
    if(originalWord === userWord){
        correct += (originalWord.length + 1);   // 1 is for the correct space character
        return true;
    } else {
        incorrect += originalWord.length;
        return false;
    }
}

function handleNormalInput() {
    userArray[currentIndex] = currentWord;

    cursorIndex = currentWord.length;
}

function handleSpaceBar() {
    if (currentWord.length === 0) {
        inputBox.value = '';
        return;
    }

    console.log(`Original Word : ${wordArray[currentIndex]} ; User Word : ${prevWord}`);

    if (compareWords(wordArray[currentIndex], prevWord)) {
        console.log('Hurray the words match!');
        hotStack.clear();
        hotIndex = currentIndex;
    } else {
        console.log('Aha the words do not match');
        hotStack.push(prevWord.trim());
    }
    inputBox.value = '';
    userArray[currentIndex] = prevWord;
    currentIndex++;

    currentWord = '';
    cursorIndex = 0;
}

function handleBackspace() {
    if (prevWord.length === 0) {
        if (hotStack.isEmpty()) {
            // Do nothing
        } else {
            inputBox.value = hotStack.pop();
            currentWord = inputBox.value;

            currentIndex--;
            cursorIndex = currentWord.length;
        }
    } else {
        handleNormalInput();
    }
}

function handleAltPlusBackspace() {
    console.log('lmao');
    if (prevWord.length === 0) {
        console.log('rofl');
        if (hotStack.isEmpty()) {
            // Do nothing
        } else {
            hotStack.pop();
            currentIndex--;
            userArray[currentIndex] = '';
        }
    } else {
        console.log('lol');
        userArray[currentIndex] = '';
    }

    cursorIndex = 0;
}

const startTime = performance.now();

render();
trackInputBox();