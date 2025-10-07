import { Position } from 'vscode-languageserver';

/**
 * Converts a string index into a VS Code `Position` (line and character).
 *
 * @param text The full text content.
 * @param index The zero-based character index in the text.
 * @returns A `Position` object with `line` and `character` properties.
 *
 * @example
 * const text = "hello\nworld";
 * console.log(getPositionFromIndex(text, 7)); // { line: 1, character: 1 }
 */
function getPositionFromIndex(text: string, index: number): Position {
    const lines = text.slice(0, index).split(/\r?\n/);
    const line = lines.length - 1;
    const character = lines[lines.length - 1].length;
    return { line, character };
}

export { getPositionFromIndex };
