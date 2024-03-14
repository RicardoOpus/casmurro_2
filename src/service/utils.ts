/* eslint-disable class-methods-use-this */
class Utils {
  constructor() {
    // Vincula o método ao objeto da classe para garantir que 'this' seja referenciado corretamente
    this.convertBase64 = this.convertBase64.bind(this);
    this.resizeImage = this.resizeImage.bind(this);
  }

  convertDateBR(timestamp: number): string | null {
    const date = new Date(timestamp);
    if (date instanceof Date) {
      const result = date.toLocaleDateString('pt-br');
      return result;
    }
    return null;
  }

  convertDateBRhm(timestamp: number): string | null {
    const date = new Date(timestamp);
    if (date instanceof Date) {
      const options = {
        year: 'numeric' as const,
        month: '2-digit' as const,
        day: '2-digit' as const,
        hour: '2-digit' as const,
        minute: '2-digit' as const,
        hour12: false,
      };
      const result = date.toLocaleString('pt-BR', options);
      return result;
    }
    return null;
  }

  convertToTime(timestamp: number): string {
    const date = new Date(timestamp);
    const result = `${date.getHours()}h ${date.getMinutes()}m`;
    return result;
  }

  convertDatePTBR(dateUS: string | undefined) {
    let dateBR = '';
    if (dateUS) {
      const date = dateUS;
      const [year, month, day] = date.split('-');
      dateBR = [day, month, year].join('/');
    }
    return dateBR;
  }

  abreviarString(str: string | undefined, maxLenght: number): string | undefined {
    if (str && str.length > maxLenght) {
      return `${str.substring(0, maxLenght)}…`;
    }
    return str;
  }

  removeHTMLtags(stringHTML: string | undefined) {
    if (stringHTML) {
      const text = stringHTML.replace(/<[^>]*>/g, '');
      const textShort = this.abreviarString(text, 300);
      return textShort;
    }
    return null;
  }

  removeHTMLtagsNoShort(stringHTML: string | undefined) {
    if (stringHTML) {
      const text = stringHTML.replace(/<[^>]*>/g, '');
      return text;
    }
    return null;
  }

  countWords(text: string | undefined) {
    if (text) {
      const textoLimpo = text.trim().replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
      const palavras = textoLimpo.split(/\s+/);
      return palavras.length - 2;
    }
    return 0;
  }

  autoGrowAllTextareas() {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach((textarea) => {
      const scrollHeight = `${textarea.scrollHeight}px`;
      // eslint-disable-next-line no-param-reassign
      textarea.style.height = 'auto';
      // eslint-disable-next-line no-param-reassign
      textarea.style.height = scrollHeight;
    });
  }

  randomColor() {
    const color = Math.floor(Math.random() * 16777215).toString(16);
    const colorNew = `#${color}`;
    if (colorNew.length > 6) {
      return colorNew;
    }
    return '#0099ff';
  }

  resizeImage(imageData: string, width: number, height: number) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const newWidth = width;
        const newHeight = height;
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx?.drawImage(img, 0, 0, newWidth, newHeight);
        const resizedImageData = canvas.toDataURL();
        resolve(resizedImageData);
      };
      img.onerror = () => {
        reject(new Error('Erro ao carregar a imagem.'));
      };
      img.src = imageData;
    });
  }

  convertBase64(file: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result?.toString());
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }

  isImageFile = (fileName: string) => fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.webp');

  isValideURL = (str: string) => str.startsWith('http://') || str.startsWith('https://');

  toggleFullscreen() {
    if (
      document.fullscreenElement
    ) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    } else if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  }

  getCurrentDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const pad = (num: number) => (num < 10 ? `0${num}` : num);
    return {
      toFileName: `${year}-${pad(month)}-${pad(day)}-${pad(hours)}-${pad(minutes)}-${pad(seconds)}`,
      toBackup: `\n\nEste backup foi criado em ${pad(day)}/${pad(month)}/${year} às ${pad(hours)}:${pad(minutes)}:${pad(seconds)}\n`,
      toDraft: `Este rascunho foi exportado em ${pad(day)}/${pad(month)}/${year} às ${pad(hours)}:${pad(minutes)}:${pad(seconds)}\n`,
    };
  }

  removeAccents(str: string) {
    const accents: Array<[string, RegExp]> = [
      ['a', /[àáâãä]/g],
      ['e', /[éèêẽë]/g],
      ['i', /[íìîï]/g],
      ['o', /[óòôõö]/g],
      ['u', /[úùûũü]/g],
      ['c', /[ç]/g],
      ['n', /[ñ]/g],
      ['A', /[ÀÁÂÃÄÅ]/g],
      ['E', /[ÈÉÊË]/g],
      ['I', /[ÌÍÎÏ]/g],
      ['O', /[ÒÓÔÕÖ]/g],
      ['U', /[ÙÚÛÜ]/g],
      ['C', /[Ç]/g],
      ['N', /[Ñ]/g],
    ];
    let result = str;
    for (let i = 0; i < accents.length; i += 1) {
      result = result.replace(accents[i][1], accents[i][0]);
    }
    return result;
  }

  sanitizeFilename(filename: string) {
    const noAcents = this.removeAccents(filename);
    const forbiddenChars = /[\\/:"*?<>.|]/g;
    return noAcents.replace(forbiddenChars, ' ');
  }

  calculateTimeElapsed(date1: string, date2: string) {
    const date1Obj = new Date(date1);
    const date2Obj = new Date(date2);
    const timeElapsed = Math.abs(date2Obj.getTime() - date1Obj.getTime());
    const yearInMs = 1000 * 60 * 60 * 24 * 365;
    const monthInMs = 1000 * 60 * 60 * 24 * 30;
    const dayInMs = 1000 * 60 * 60 * 24;
    const yearsElapsed = Math.floor(timeElapsed / yearInMs);
    const monthsElapsed = Math.floor((timeElapsed % yearInMs) / monthInMs);
    const daysElapsed = Math.floor(((timeElapsed % yearInMs) % monthInMs) / dayInMs);
    return {
      years: yearsElapsed,
      months: monthsElapsed,
      days: daysElapsed,
    };
  }
}

const utils = new Utils();

export default utils;
