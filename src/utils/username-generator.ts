import {
  uniqueNamesGenerator,
  colors,
  adjectives,
  starWars,
  NumberDictionary,
  names,
} from 'unique-names-generator';

export function generateUsername() {
  const numberDictionary = NumberDictionary.generate({ min: 10, max: 99 });

  let uniqueUsername: string;

  const dictionaries = [adjectives, colors, starWars, names, numberDictionary];

  for (let i = dictionaries.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [dictionaries[i], dictionaries[rand]] = [
      dictionaries[rand],
      dictionaries[i],
    ];
  }

  uniqueUsername = uniqueNamesGenerator({
    dictionaries,
    length: 2,
    separator: '-',
    style: 'lowerCase',
  });

  uniqueUsername = uniqueUsername.replace(/\s+/g, '-');

  return uniqueUsername;
}
