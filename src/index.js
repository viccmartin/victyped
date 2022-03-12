import words from "./scripts/words";

// ||  GLOBAL VARIABLES
// - constants
const d = document;
const typingWords = d.getElementById("typing-words"),
    input = d.getElementById("input"),
    langEls = d.querySelectorAll("input[name='lang']"),
    testDurationEls = d.querySelectorAll("input[name='test-duration']"),
    mistakeEl = d.getElementById("mistake"),
    accuracyEl = d.getElementById("accuracy"),
    timeEl = d.querySelector("#time div"),
    wpmEl = d.getElementById("wpm"),
    cpmEl = d.getElementById("cpm"),
    resetBtn = d.getElementById("reset");

// - variables
/* indicates the current character that must be typed */
let charIndex = 0,
    /* indicates the characters typed -> It is mutable on backspace  */
    totalChars = 0,
    /* wrong typed character -> It is updated if the error is fixed */
    mistake = 0,
    /* wrong typed character -> It isn't updated if the error is fixed */
    accuracyMistake = 0,
    /* indicates the characters typed -> It is immutable on backspace  */
    accuracyChars = 0,
    /*  */
    isTyping = false,
    /* amount of word that are displayed in the web */
    amountWords = 30,
    /* current words in the array that will be displayed in the web */
    currentWords = amountWords,
    /* store the array unsorted */
    randomWords,
    /* before new words are display it must be a space */
    lastSpan = d.createElement("span"),
    // lang
    wordsLang = words.en,
    // timer
    /* store the setInterval */
    timer,
    maxTime = 60,
    timeLeft = maxTime;

// || FUNCTIONS
const changeLang = (e) => {
    timer, (maxTime = 60);
    timeLeft = maxTime;
    resetTest();
    wordsLang = words[`${e.target.value}`];
    getRandomWords();
};
/* Changes the test duration -> It could be 15s, 30s or 60s */
const changeTestDuration = (e) => {
    resetTest();
    maxTime = parseFloat(e.target.value);
    timeLeft = maxTime;
    timeEl.innerHTML = maxTime;
};
/* Unsorted the words array and display new 30 words */
const getRandomWords = () => {
    typingWords.innerHTML = "";
    randomWords = wordsLang.sort(() => Math.random() - Math.random());
    randomWords
        .slice(0, currentWords)
        .join(" ")
        .split("")
        .forEach((word) => {
            let span = `<span>${word}</span>`;
            typingWords.innerHTML += span;
        });
    typingWords.insertAdjacentElement("beforeend", lastSpan);
};
/* Will load more words once the first 30 words were typed */
const loadMoreWords = () => {
    typingWords.innerHTML = "";
    input.value = "";
    charIndex = 0;
    randomWords
        .slice(currentWords, currentWords + amountWords)
        .join(" ")
        .split("")
        .forEach((word) => {
            let span = `<span>${word}</span>`;
            typingWords.innerHTML += span;
        });
    currentWords = currentWords + amountWords;
    a;
    typingWords.insertAdjacentElement("beforeend", lastSpan);
};
const initTyping = () => {
    /* characters displayed on the web */
    let characters = typingWords.querySelectorAll("span");
    /* character typed on the input */
    let typedChar = input.value.split("")[charIndex];
    if (timeLeft > 0) {
        if (!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
        /* 
            Check the typed letter
            - If is null (it means a backspace) it will: 
                                                - decrease the amount of totalChars
                                                - decrease the position of the current character
                                                - check if the current character has the incorrect class it'll decrease the mistake
                                                - remove the classes of the current character
            - If is a valid letter it will: 
                                        - check if the current character is the same as the current 
                                        typed character it will add the correct class, otherwise, it will add the 
                                        incorrect class, increase the mistakes, and decrease the accuracy
                                        - increase the accuracy
                                        - increase the total characters
                                        - increase the character position
                                        
        */
        if (typedChar == null) {
            totalChars--;
            charIndex--;
            if (characters[charIndex].classList.contains("incorrect"))
                mistake--;
            characters[charIndex].classList.remove("correct", "incorrect");
        } else {
            if (characters[charIndex].innerHTML === typedChar) {
                characters[charIndex].classList.add("correct");
            } else {
                mistake++;
                accuracyMistake++;
                characters[charIndex].classList.add("incorrect");
            }
            accuracyChars++;
            totalChars++;
            charIndex++;
        }
        /* Words will be loaded if all the character were typed */
        if (charIndex > characters.length - 1) loadMoreWords();
        /* active class will be removed from the previous character */
        characters.forEach((character) => character.classList.remove("active"));
        /* active class will be added to the new character */
        characters[charIndex].classList.add("active");
        let wpm = Math.round(
            ((totalChars - mistake) / 5 / (maxTime - timeLeft)) * 60
        );
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        let accuracy = Math.round(
            ((accuracyChars - accuracyMistake) / accuracyChars) * 100
        );
        mistakeEl.innerHTML = mistake;
        accuracyEl.innerHTML = `${accuracy}%`;
        wpmEl.innerHTML = wpm;
        cpmEl.innerHTML = totalChars - mistake;
    } else {
        input.value = "";
        clearInterval(timer);
    }
};
const initTimer = () => {
    if (timeLeft > 0) {
        timeLeft--;
        timeEl.innerHTML = timeLeft;
    } else {
        clearInterval(timer);
    }
};
const resetTest = () => {
    input.value = "";
    charIndex = 0;
    mistake = 0;
    accuracyMistake = 0;
    accuracyChars = 0;
    isTyping = false;
    amountWords = 30;
    currentWords = amountWords;
    randomWords;
    totalChars = 0;
    timeEl.innerHTML = timeLeft;
    mistakeEl.innerHTML = mistake;
    accuracyEl.innerHTML = 0;
    wpmEl.innerHTML = 0;
    cpmEl.innerHTML = 0;
    getRandomWords();
    clearInterval(timer);
};

// || STARTERS
// - functions
getRandomWords();

// - listeners
d.addEventListener("keydown", () => input.focus());
typingWords.addEventListener("click", () => input.focus());
input.addEventListener("input", initTyping);
resetBtn.addEventListener("click", resetTest);
langEls.forEach((el) => el.addEventListener("input", changeLang));
testDurationEls.forEach((el) =>
    el.addEventListener("input", changeTestDuration)
);
