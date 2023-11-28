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
}

const utils = new Utils();

export default utils;
