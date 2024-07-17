/**
 * Binary search
 *
 * How it works:
 * 1. Get length of array
 * 2. Find middle index of array
 * 3. Compare if middle index of array is lower or higher than searched number
 * 4. Slide off the unneeded side
 * 5. Repeat 1-4 until found
 * 6. Return index of found number
 * 7. If not found return -1
 */
export function binarySearch(
  numberArray: number[],
  searchNumber: number
): number {
  if (!numberArray.length) return -1;

  const middleArrayIndex = Math.floor(numberArray.length - 1 / 2);

  if (searchNumber > numberArray[middleArrayIndex])
    return binarySearch(numberArray.slice(middleArrayIndex + 1), searchNumber);

  if (searchNumber < numberArray[middleArrayIndex])
    return binarySearch(numberArray.slice(0, middleArrayIndex), searchNumber);

  return middleArrayIndex;
}
