export function moveElementToTopOfArray<T>(arr: T[], elem: T): void {
  arr.sort((e1, e2) => e1 === elem ? -1 : e2 === elem ? 1 : 0);
}

export function moveElementInArray<T>(arr: T[], fromIndex: number, toIndex: number) {
  if (toIndex >= 0 && toIndex <= arr.length) {
    const elem = arr.splice(fromIndex, 1)[0];
    arr.splice(toIndex, 0, elem);
  }
}

export function moveElementUpInArray<T>(arr: T[], elem: T): void {
  const index = arr.indexOf(elem);
  moveElementInArray(arr, index, index - 1);
}

export function moveElementDownInArray<T>(arr: T[], elem: T): void {
  const index = arr.indexOf(elem);
  moveElementInArray(arr, index, index + 1);
}

export function moveElementToBottomOfArray<T>(arr: T[], elem: T): void {
  arr.sort((e1, e2) => e1 === elem ? 1 : e2 === elem ? -1 : 0);
}
