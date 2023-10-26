export function convertDateBR(timestamp: number) {
  const date = new Date(timestamp);
  if (date instanceof Date) {
    const result = date.toLocaleDateString('pt-br');
    return result;
  }
  return null;
}

export function convertToTime(timestamp: number) {
  const date = new Date(timestamp);
  const result = `${date.getHours()}h ${date.getMinutes()}m`;
  return result;
}
