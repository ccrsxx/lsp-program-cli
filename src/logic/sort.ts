/**
 * Bubble sort
 *
 * How it works:
 * 1. Compare the first two elements of the array
 * 2. If the first element is greater than the second element, swap them
 * 3. Move to the next element and repeat step 1
 * 4. Continue this process until the last element
 * 5. Repeat steps 1-4 until the array is sorted
 * 6. Return the sorted array
 */
export function bubbleSort(
  numberArray: number[],
  direction: 'asc' | 'desc' = 'asc'
): number[] {
  const clonedNumberArray = [...numberArray];
  const clonedNumberArrayLength = clonedNumberArray.length;

  for (let i = 0; i < clonedNumberArrayLength - 1; i++) {
    for (let j = 0; j < clonedNumberArrayLength - 1 - i; j++) {
      const prevItem = clonedNumberArray[j];
      const nextItem = clonedNumberArray[j + 1];

      const sortCondition =
        direction === 'asc' ? prevItem > nextItem : prevItem < nextItem;

      if (sortCondition) {
        clonedNumberArray[j] = nextItem;
        clonedNumberArray[j + 1] = prevItem;
      }
    }
  }

  return clonedNumberArray;
}
