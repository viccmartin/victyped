import words from "./scripts/words";

// || GLOBAL VARIABLES
const d = document;
const typingWords = d.getElementById("typing-words"),
    input = d.getElementById("input"),
    mistakeEl = d.getElementById("mistake"),
    timeEl = d.querySelector("#time b"),
    wpmEl = d.getElementById("wpm"),
    cpmEl = d.getElementById("cpm"),
    resetBtn = d.getElementById("reset");

let charIndex = 0,
    mistake = 0,
    timer,
    maxTime = 60,
    timeLeft = maxTime,
    isTyping = false;

// || FUNTIONS
const getRandomWords = () => {
    let randomWords = words.en
        .sort(() => Math.random() - Math.random())
        .slice(0, 30);
    typingWords.innerHTML - "";
    randomWords
        .join(" ")
        .split("")
        .forEach((word) => {
            let span = `<span>${word}</span>`;
            typingWords.innerHTML += span;
        });
};

const initTyping = () => {
    let characters = typingWords.querySelectorAll("span");
    let typedLtr = input.value.split("")[charIndex];
    if (charIndex < characters.length - 1 && timeLeft > 0) {
        if (!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
        timer = setInterval(initTimer, 1000);
        if (typedLtr == null) {
            charIndex--;
            if (characters[charIndex].classList.contains("incorrect"))
                mistake--;
            characters[charIndex].classList.remove("correct", "incorrect");
        } else {
            if (characters[charIndex].innerHTML === typedLtr) {
                characters[charIndex].classList.add("correct");
            } else {
                mistake++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }
        characters.forEach((character) => character.classList.remove("active"));
        characters[charIndex].classList.add("active");

        let wpm = Math.round(
            ((charIndex - mistake) / 5 / (maxTime - timeLeft)) * 60
        );
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        mistakeEl.innerHTML = mistake;
        wpmEl.innerHTML = wpm;
        cpmEl.innerHTML = charIndex - mistake;
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
    getRandomWords();
    input.value = "";
    clearInterval(timer);
    mistake = 0;
    timeLeft = maxTime;
    isTyping = false;
    timeEl.innerHTML = timeLeft;
    mistakeEl.innerHTML = mistake;
    wpmEl.innerHTML = 0;
    cpmEl.innerHTML = 0;
};

// || STARTERS
// - funtions
getRandomWords();

// - listeners
d.addEventListener("keydown", () => input.focus());
typingWords.addEventListener("click", () => input.focus());
input.addEventListener("input", initTyping);
resetBtn.addEventListener("click", resetTest);
