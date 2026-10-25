/**
 * Core implementation for truncate-tools.
 *
 * All truncation happens at word boundaries: a "word" is a maximal run of
 * non-space characters. We deliberately split on runs of ASCII whitespace
 * (space, tab, newline, carriage return, form feed, vertical tab) rather than
 * \s because \s also matches Unicode category "Zs" separators and the
 * intent here is plain-text truncation, not Unicode segmentation. Splitting
 * on ASCII whitespace keeps the behaviour predictable for the vast majority
 * of callers and avoids pulling in a Unicode property table.
 *
 * Because we split on / +/ we drop empty strings (the + consumes adjacent
 * whitespace), so leading/trailing/duplicated spaces simply vanish from the
 * returned string. This is the intended behaviour and is documented.
 */

/**
 * The exact whitespace class we treat as word separators.
 *
 * Using an explicit character class [ \t\n\r\f\v] instead of \s so that the
 * behaviour is identical regardless of the engine's Unicode flag state and
 * does not accidentally treat exotic separators as word breaks.
 */
const WS = /[ \t\n\r\f\v]+/;

/**
 * Split `input` into words, discarding empty segments so that runs of
 * whitespace collapse to nothing.
 *
 * @param {string} input
 * @returns {string[]}
 */
function splitWords(input) {
  if (typeof input !== 'string' || input.length === 0) return [];
  return input.split(WS).filter(Boolean);
}

/**
 * Join words with a single space.
 *
 * We normalise all inter-word whitespace to a single 0x20 space rather than
 * preserving the original separators, because once you have truncated the
 * list there is no sensible "original" separator to keep between the kept
 * words and the boundary word.
 */
function joinWords(words) {
  return words.join(' ');
}

/**
 * Truncate `input` to at most `maxWords` words, keeping the first words.
 *
 * If `input` contains more than `maxWords` words the result is the kept
 * words joined by single spaces followed by `suffix` (defaulting to
 * "…"). If `input` fits within the limit it is returned verbatim EXCEPT
 * that internal whitespace runs are collapsed to single spaces.
 *
 * Special cases:
 *   - input === ''  → ''
 *   - maxWords <= 0 → '' (the caller asked for zero words)
 *
 * @param {string} input
 * @param {number} maxWords
 * @param {string} [suffix='…']
 * @returns {string}
 */
export function truncateWords(input, maxWords, suffix = '…') {
  if (typeof input !== 'string' || input.length === 0) return '';
  if (!Number.isInteger(maxWords) || maxWords <= 0) return '';

  const words = splitWords(input);
  if (words.length === 0) return '';
  if (words.length <= maxWords) return joinWords(words);

  return joinWords(words.slice(0, maxWords)) + suffix;
}

/**
 * Truncate `input` to at most `maxWords` words, keeping the LAST words.
 *
 * When truncation occurs the result is `prefix` (default "…") followed by
 * the kept words joined by single spaces. The prefix has no leading space
 * by design — callers who want a space can pass one.
 *
 * Special cases:
 *   - input === ''  → ''
 *   - maxWords <= 0 → ''
 *
 * @param {string} input
 * @param {number} maxWords
 * @param {string} [prefix='…']
 * @returns {string}
 */
export function truncateWordsEnd(input, maxWords, prefix = '…') {
  if (typeof input !== 'string' || input.length === 0) return '';
  if (!Number.isInteger(maxWords) || maxWords <= 0) return '';

  const words = splitWords(input);
  if (words.length === 0) return '';
  if (words.length <= maxWords) return joinWords(words);

  return prefix + joinWords(words.slice(words.length - maxWords));
}

/**
 * Count the number of words in `input`.
 *
 * Uses the same definition of "word" as the truncation helpers, so the count
 * is consistent with what those functions keep.
 *
 * @param {string} input
 * @returns {number}
 */
export function countWords(input) {
  if (typeof input !== 'string' || input.length === 0) return 0;
  return splitWords(input).length;
}
