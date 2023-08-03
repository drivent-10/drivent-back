export default function createText(array: string[]) {
    switch (array.length) {
      case 1:
        return array[0];
      case 2:
        return `${array[0]} e ${array[1]}`;
      case 3:
        return `${array[0]}, ${array[1]} e ${array[2]}`;
    }
  }