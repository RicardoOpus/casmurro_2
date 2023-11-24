/* eslint-disable class-methods-use-this */
class Utils {
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
