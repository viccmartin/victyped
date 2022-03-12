import words from "./scripts/words";

// || GLOBAL VARIBLES
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

// let cache = [];
let charIndex = 0,
    mistake = 0,
    accuracyMistake = 0,
    isTyping = false,
    amountWords = 30,
    currentWords = amountWords,
    randomWords,
    lastSpan = d.createElement("span"),
    totalChars = 0,
    // lang
    wordsLang = words.en,
    // timer
    timer,
    maxTime = 60,
    timeLeft = maxTime;

// || FUNTIONS
// const memoizer = (func) => {
//     return (e) => {
//         const index = e.toString();
//         if (cache[index] == undefined) {
//             cache[index] = func(e);
//         }
//         return cache[index];
//     };
// };
const changeLang = (e) => {
    resetTest();
    wordsLang = words[`${e.target.value}`];
    getRandomWords();
};
const changeTestDuration = (e) => {
    resetTest();
    maxTime = parseFloat(e.target.value);
    timeLeft = maxTime;
    timeEl.innerHTML = maxTime;
};
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
    typingWords.insertAdjacentElement("beforeend", lastSpan);
};
const initTyping = () => {
    let characters = typingWords.querySelectorAll("span");
    let typedChar = input.value.split("")[charIndex];
    if (timeLeft > 0) {
        if (!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
        if (typedChar == null) {
            totalChars--;
            charIndex--;
            if (characters[charIndex].classList.contains("incorrect"))
                mistake--;
            characters[charIndex].classList.remove("correct", "incorrect");
        } else {
            totalChars++;
            if (characters[charIndex].innerHTML === typedChar) {
                characters[charIndex].classList.add("correct");
            } else {
                mistake++;
                accuracyMistake++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }
        if (charIndex > characters.length - 1) loadMoreWords();

        characters.forEach((character) => character.classList.remove("active"));
        characters[charIndex].classList.add("active");
        let wpm = Math.round(
            ((totalChars - mistake) / 5 / (maxTime - timeLeft)) * 60
        );
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        let accuracy = Math.round(
            ((totalChars - accuracyMistake) / totalChars) * 100
        );
        mistakeEl.innerHTML = mistake;
        console.log(totalChars);
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
    totalChars = 0;
    timeLeft = maxTime;
    isTyping = false;
    timeEl.innerHTML = timeLeft;
    mistakeEl.innerHTML = mistake;
    accuracyEl.innerHTML = 0;
    wpmEl.innerHTML = 0;
    cpmEl.innerHTML = 0;
    getRandomWords();
    clearInterval(timer);
};

// || STARTERS
// - funtions
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

// const cache = await caches.open("words");
if ("caches" in window) {
    caches.open("my-cache").then(function (cache_obj) {
        cache_obj.add("./scripts/words").then(function () {
            console.log("Cached!");
        });
    });
}
async function eee() {
    try {
        const data = await caches.open("my-cache");
        console.log({ data });
    } catch (error) {
        console.error({ error });
    }
}
eee();
