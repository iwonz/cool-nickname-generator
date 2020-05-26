import { DICTIONARY } from './dictionary';

export interface Letter {
  original: string;
  index: number;
  transformed: string;
  transformedIndex: number;
  prevTransformed: string;
  nextTransformed: number;
}

export interface Word {
  text: string;
  letters: Letter[];
  transform: Function;
}

function getRandomIndex(max: number): number {
  return Math.round(Math.random() * (max - 1));
}

export function getLetter(str: string, index: number): Letter {
  const letter = {
    original: str,
    index,
    transformed: str,
    transformedIndex: 0,
    get prevTransformed() {
      const letters = DICTIONARY[this.original.toLowerCase()];

      if (!letters) {
        return this.original;
      }

      if (this.transformedIndex === 0) {
        this.transformedIndex = letters.length - 1;
      } else {
        this.transformedIndex--;
      }

      this.transformed = letters[this.transformedIndex];

      return letters[this.transformedIndex];
    },
    get nextTransformed() {
      const letters = DICTIONARY[this.original.toLowerCase()];

      if (!letters) {
        return this.original;
      }

      if (this.transformedIndex === letters.length - 1) {
        this.transformedIndex = 0;
      } else {
        this.transformedIndex++;
      }

      this.transformed = letters[this.transformedIndex];

      return letters[this.transformedIndex];
    }
  };

  try {
    const letters = DICTIONARY[str.toLowerCase()];

    if (!letters) { return letter; }

    const transformedIndex = getRandomIndex(letters.length);
    const randomLetter = letters[transformedIndex];

    const isUpperCase = str.toUpperCase() === str;

    letter.original = str;
    letter.index = index;
    letter.transformed = isUpperCase ? randomLetter.toUpperCase() : randomLetter;
    letter.transformedIndex = transformedIndex;

    return letter;
  } catch(e) {
    return letter;
  }
}

export function transform(str: string): Word {
  const word: Word = {
    get text() {
      return this.letters.map((letter: Letter) => letter.transformed).join('');
    },
    letters: [],
    transform: function(str: string) {
      const letters: Letter[] = [];

      for (let i = 0; i < str.length; i++) {
        if (this.letters[i] && this.letters[i].original === str[i]) {
          letters.push(this.letters[i]);
        } else {
          letters.push(getLetter(str[i], i));
        }
      }

      this.letters = letters;
    }
  };

  for (let i = 0; i < str.length; i++) {
    word.letters.push(getLetter(str[i], i));
  }

  return word;
}

export function debounce(fn: Function, ms: number): Function {
  let timeout: any;

  return (...args: any[]) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn(...args)
    }, ms);
  };
}

export function canvasToDataUrlDebug(canvas: HTMLCanvasElement): void {
  const formats = [
    'apng',
    'bmp',
    'gif',
    'x-icon',
    'jpeg',
    'png',
    'svg+xml',
    'tiff',
    'webp'
  ].reduce((cases, format) => {
    for (let quality = 0.01; quality < 1; quality += 0.01) {
      cases.push({
        format,
        quality: +quality.toFixed(2)
      });
    }

    return cases;
  }, []);

  const results: any[] = [];

  formats.forEach((format, index, arr) => {
    setTimeout(() => {
      const data = canvas.toDataURL(`image/${format.format}`, format.quality);

      results.push({
        format: format.format,
        quality: format.quality,
        length: data.length,
        data,
      })

      if (index === arr.length - 1) {
        results.sort((a, b) => a.length - b.length);
        console.log(results);
      }
    }, index + 10);
  });
}
