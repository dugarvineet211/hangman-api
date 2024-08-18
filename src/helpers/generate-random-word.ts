const words = [
  'apple',
  'banana',
  'cherry',
  'date',
  'fig',
  'grape',
  'kiwi',
  'lemon',
  'mango',
  'nectarine',
  'orange',
  'papaya',
  'peach',
  'pear',
  'plum',
  'quince',
  'raspberry',
  'strawberry',
  'watermelon',
  'blueberry',
  'lion',
  'tiger',
  'elephant',
  'giraffe',
  'zebra',
  'kangaroo',
  'koala',
  'panda',
  'rhinoceros',
  'hippopotamus',
  'crocodile',
  'alligator',
  'monkey',
  'gorilla',
  'chimpanzee',
  'lemur',
  'wolf',
  'bear',
  'fox',
  'deer',
  'red',
  'blue',
  'green',
  'yellow',
  'purple',
  'orange',
  'pink',
  'black',
  'white',
  'brown',
  'cyan',
  'magenta',
  'teal',
  'maroon',
  'navy',
  'gold',
  'silver',
  'bronze',
  'turquoise',
  'beige',
  'argentina',
  'brazil',
  'canada',
  'denmark',
  'egypt',
  'france',
  'germany',
  'hungary',
  'india',
  'japan',
  'kenya',
  'luxembourg',
  'mexico',
  'netherlands',
  'oman',
  'portugal',
  'qatar',
  'russia',
  'spain',
  'turkey',
  'doctor',
  'engineer',
  'teacher',
  'nurse',
  'pilot',
  'firefighter',
  'police',
  'chef',
  'artist',
  'musician',
  'lawyer',
  'scientist',
  'journalist',
  'actor',
  'writer',
  'architect',
  'plumber',
  'electrician',
  'carpenter',
  'driver',
  'soccer',
  'basketball',
  'cricket',
  'tennis',
  'baseball',
  'rugby',
  'hockey',
  'golf',
  'volleyball',
  'badminton',
  'swimming',
  'boxing',
  'cycling',
  'gymnastics',
  'skiing',
  'skating',
  'surfing',
  'fencing',
  'archery',
  'rowing',
  'car',
  'truck',
  'motorcycle',
  'bicycle',
  'scooter',
  'bus',
  'train',
  'airplane',
  'helicopter',
  'submarine',
  'yacht',
  'canoe',
  'kayak',
  'ship',
  'boat',
  'tractor',
  'bulldozer',
  'crane',
  'ambulance',
  'firetruck',
  'pizza',
  'burger',
  'pasta',
  'sushi',
  'taco',
  'sandwich',
  'salad',
  'soup',
  'steak',
  'fries',
  'cake',
  'cookie',
  'brownie',
  'muffin',
  'pancake',
  'waffle',
  'omelette',
  'bacon',
  'sausage',
  'meatball',
  'inception',
  'titanic',
  'avatar',
  'gladiator',
  'godfather',
  'rocky',
  'matrix',
  'jaws',
  'goodfellas',
  'casablanca',
  'aladdin',
  'frozen',
  'up',
  'coco',
  'shrek',
  'toy',
  'lionking',
  'bambi',
  'moana',
  'zootopia',
  'guitar',
  'piano',
  'violin',
  'drums',
  'flute',
  'trumpet',
  'saxophone',
  'clarinet',
  'harp',
  'trombone',
  'cello',
  'banjo',
  'accordion',
  'harmonica',
  'xylophone',
  'bagpipes',
  'oboe',
  'mandolin',
  'sitar',
  'tabla',
];

export function generateRandomWords() {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}
