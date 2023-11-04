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

  abreviarString(str: string, maxLenght: number): string {
    if (str.length > maxLenght) {
      return `${str.substring(0, maxLenght)}…`;
    }
    return str;
  }
}

export default Utils;
