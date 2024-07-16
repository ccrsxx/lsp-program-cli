import type { CancelablePromise } from '@inquirer/type';

type State = {
  numbers: number[];
  cancelablePrompt: CancelablePromise<unknown> | null;
};

export const state: State = {
  numbers: [],
  cancelablePrompt: null
};
