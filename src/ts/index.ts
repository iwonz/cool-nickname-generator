import './assets';

import copy from 'copy-text-to-clipboard';
import anime from 'animejs';

import {debounce, transform, Word} from './utils';

const resultElement: any = document.getElementById('result');
const copyButton: any = document.getElementById('copy');
const nicknameInput: any = document.getElementById('nickname');

const predefined = window.location.hash.substr(1);

if (predefined) {
  nicknameInput.value = decodeURI(predefined);
}

setTimeout(() => nicknameInput.focus(), 100);

declare module Ya {
  const share2: Function;
}

const shareWidget = Ya.share2(document.getElementById('share'), {
  theme: {
    services: 'vkontakte,facebook,twitter,reddit,evernote,linkedin,lj,tumblr,viber,whatsapp,skype,telegram'
  }
});

function getImageBlob() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 180;
  canvas.height = 84;

  ctx.fillStyle = 'rebeccapurple';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let fontSize = 1000;
  ctx.font = `${fontSize}px Tahoma`;

  while (ctx.measureText(word.text).width >= canvas.width * 0.75) {
    fontSize -= 20;
    ctx.font = `${fontSize}px Tahoma`;
  }

  ctx.fillStyle = '#ffffff';
  ctx.fillText(word.text, (canvas.width / 2) - ctx.measureText(word.text).width / 2, (canvas.height / 1.5));

  return canvas.toDataURL('image/webp', .01);
}

const updateWidget = debounce(function () {
  shareWidget.updateContent({
    url: `${window.location.origin}${window.location.pathname}#${nicknameInput.value}`,
    title: `My nickname ${nicknameInput.value} looks like ${word.text} if you write it in cool characters.`,
    description: `Cool Nickname Generator transform my nickname ${nicknameInput.value} to ${word.text} using cool characters. ${getImageBlob()}`,
    image: getImageBlob(),
  });
}, 300);

function process() {
  const animated: any = [];
  const letters = [...resultElement.querySelectorAll('.letter')].map((letter: HTMLElement) => letter.innerHTML);
  resultElement.innerHTML = '';

  word.letters.forEach((letter, index) => {
    const letterElement = document.createElement('span');
    letterElement.classList.add('letter');
    letterElement.setAttribute('data-origin-letter', letter.original);
    letterElement.setAttribute('data-letter-index', String(letter.index));
    letterElement.innerHTML = letter.transformed;

    resultElement.appendChild(letterElement);

    if (!letters[index] || letters[index] !== letter.transformed) {
      animated.push(letterElement);
    }
  });

  window.location.hash = nicknameInput.value;

  updateWidget();

  anime({
    targets: animated,
    translateY: [100, 0],
    delay: anime.stagger(50)
  });
}

let word: Word = transform(nicknameInput.value);

process();

copyButton.addEventListener('click', () => {
  copy(word.text);
  alert(`Your cool nickname ${word.text} was copied to the clipboard.`);
});

nicknameInput.addEventListener('keyup', () => {
  word.transform(nicknameInput.value);

  process();
});

resultElement.addEventListener('click', (event: any) => {
  if (!event.target.classList.contains('letter')) {
    return;
  }

  const letterIndex = Number(event.target.dataset.letterIndex);

  event.target.innerHTML = word.letters[letterIndex].nextTransformed;

  process();
});

resultElement.addEventListener('wheel', (event: any) => {
  if (!event.target.classList.contains('letter')) {
    return;
  }

  const isNext = event.deltaX > 0 || event.deltaY > 0;
  const letterIndex = Number(event.target.dataset.letterIndex);
  const letter = isNext ? word.letters[letterIndex].nextTransformed : word.letters[letterIndex].prevTransformed;

  event.target.innerHTML = letter;

  process();
});
