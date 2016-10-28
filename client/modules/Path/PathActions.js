export const CREATE_PATH = 'CREATE_PATH';

let nextPathId = 5;

export function createPath(content, textContent) {
  return {
    type: CREATE_PATH,
    id: nextPathId++,
    content,
    textContent,
  };
}
