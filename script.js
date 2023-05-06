const words = [
    {
        word: 'book',
        translate: 'книга',
        example: 'This is my favorite book',
    },
    {
        word: 'music',
        translate: 'музыка',
        example: 'I listen to music all day',
    },
    {
        word: 'dog',
        translate: 'собака',
        example: 'I love my dog ​very much',
    },
    {
        word: 'husband',
        translate: 'муж',
        example: 'My husband is a doctor',
    },
    {
        word: 'fruits',
        translate: 'фрукты',
        example: 'Fruits is good',
    },
    {
        word: 'bed',
        translate: 'кровать',
        example: 'I have a big bed at home',
    },
]

const card = document.querySelector('.flip-card');
const mixing = document.querySelector('#shuffle-words');
const btnNext = document.querySelector('#next');
const btnBack = document.querySelector('#back');
const btnExam = document.querySelector('#exam');
const examCards = document.querySelector('#exam-cards');
const examTime = document.querySelector('#time');

card.onclick = function () {
    card.classList.toggle('active');
};

const currentWords = [...words];

function renderCard(arr) {
    arr.forEach((item) => {
        doCard(item);
    });
};
renderCard(currentWords);

function doCard({ word, translate, example }) {
    card.querySelector('#card-front h1').textContent = word;
    card.querySelector('#card-back h1').textContent = translate;
    card.querySelector('#card-back p span').textContent = example;
};

mixing.addEventListener('click', () => {
    doCard(getRandomCard(currentWords));
});

function getRandomCard(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
};

let current = 0;

btnNext.onclick = function () {
    current = ++current;
    btnBack.disabled = false;
    if (current == 4) {
        btnNext.disabled = true;
    }
    showProgress();
};

btnBack.onclick = function () {
    current = --current;
    if (current == 0) {
        btnBack.disabled = true;
    }
    if (current < 5) {
        btnNext.disabled = false;
    }
    showProgress();
};

function showProgress() {
    document.getElementById('words-progress').value = current * 25;
    document.getElementById('current-word').textContent = current + 1;
    doCard(currentWords[current]);
};

function mixCards(arr) {
    let newArr = [];
    arr.forEach((item) => {
        newArr.push(doExamCard(item.word));
        newArr.push(doExamCard(item.translate));
    })
    return shuffle(newArr);
};

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

function renderExamCard(arr) {
    arr.forEach((item) => {
        examCards.append(item);
    });
};

function doExamCard(key) {
    let item = document.createElement('div');
    item.classList.add('card');
    item.textContent = key;
    return item;
};

let sec = 0;
let min = 0;
let timer;
let firstCard = 0;
let secondCard = 0;
let firstCardIndex = 0;
let secondCardIndex = 0;
let size = Object.keys(words).length;
let endIndex = 0;
let click = false;

function getExampleProgress(value) {
    let result = (100 * (value + 1)) / size;
    return Math.round(result);
};

btnExam.addEventListener('click', () => {
    card.classList.add('hidden');
    btnBack.classList.add('hidden');
    btnExam.classList.add('hidden');
    btnNext.classList.add('hidden');
    document.getElementById('study-mode').classList.add('hidden');
    document.getElementById('exam-mode').classList.remove('hidden');
    renderExamCard(mixCards(currentWords));

    timer = setInterval(() => {
        sec++;
        if (sec === 60) {
            sec = 0;
            min++;
        }
        if (sec < 10) {
            time.textContent = min + `:0` + sec;
        } else {
            time.textContent = min + `:` + sec;
        }
    }, 1000)
});

examCards.addEventListener('click', (event) => {
    let card = event.target.closest('.card');
    if (click === false) {
        card.classList.add('correct');
        firstCard = card;
        firstCardIndex = currentWords.findIndex((it) => it.word === card.textContent);
        if (firstCardIndex === -1) {
            firstCardIndex = currentWords.indexOf((it) => it.translate === card.textContent);
        }
        click = true;
    } else if (click === true) {
        secondCard = card;
        secondCardIndex = currentWords.findIndex((it) => it.translate === card.textContent);
        if (secondCardIndex === -1) {
            secondCardIndex = currentWords.indexOf((it) => it.word === card.textContent);
        }
        if (firstCardIndex === secondCardIndex) {
            document.querySelector('#correct-percent').textContent = getExampleProgress(endIndex) + '%';
            document.querySelector('#exam-progress').value = getExampleProgress(endIndex);
            endIndex++;
            firstCard.classList.add('fade-out');
            secondCard.classList.add('correct')
            secondCard.classList.add('fade-out');
            if (endIndex === size) {
                clearInterval(timer);
                alert('Поздравляю! Все верно.');
            }
            click = false;
        } else if (firstCardIndex != secondCardIndex) {
            click = false;
            secondCard.classList.add('wrong');
            setTimeout(() => {
                firstCard.classList.remove('correct');
                secondCard.classList.remove('wrong');
            }, 500)
        }
    }
});