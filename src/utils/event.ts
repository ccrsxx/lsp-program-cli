import { state } from './state.js';

process.stdin.on('keypress', (_, key: { name: string }) => {
  if (key.name === 'escape') state.cancelablePrompt?.cancel();
});
