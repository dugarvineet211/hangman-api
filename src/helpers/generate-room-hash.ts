export function generateRandomHash() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const getRandomChars = () =>
    Array.from(
      { length: 3 },
      () => characters[Math.floor(Math.random() * characters.length)],
    ).join('');

  const part1 = getRandomChars();
  const part2 = getRandomChars();
  const part3 = getRandomChars();

  return `${part1}-${part2}-${part3}`;
}
