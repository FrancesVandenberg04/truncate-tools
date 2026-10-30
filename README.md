# truncate-tools

Cut strings at word edges, never inside a word. Three functions, no dependencies, ESM only.

```js
import { truncateWords, truncateWordsEnd, countWords } from 'truncate-tools';

truncateWords('the quick brown fox jumps over the lazy dog', 4);
// => 'the quick brown fox…'

truncateWordsEnd('the quick brown fox jumps over the lazy dog', 3);
// => '…over the lazy dog'

countWords('the quick brown fox');
// => 4
```

## Why this exists

Plain `String.prototype.slice(0, n)` cuts in the middle of a word and leaves
an ugly fragment. This library truncates by word count instead: you ask for at
most N words and you get a clean boundary plus an ellipsis (or any suffix/prefix
you pass).

A "word" here is a maximal run of non-whitespace characters, and whitespace
means the ASCII set (space, tab, newline, carriage return, form feed,
vertical tab). We deliberately do NOT use `\s`, because `\s` also matches
Unicode category "Zs" separators and the goal is predictable plain-text
truncation, not Unicode segmentation. If you need grapheme-aware or
locale-aware word boundaries this is the wrong library.

## Edge you will hit

Whitespace is normalised. Because the library splits on runs of whitespace
and rejoins with single spaces, the returned string collapses any original
internal spacing, tabs, or newlines to single spaces — even when no
truncation occurs. `truncateWords('one  two', 5)` returns `'one two'`, not
`'one  two'`. This is intentional and keeps the output shape stable regardless
of input spacing.

Exports:

- `truncateWords(input, maxWords, suffix?)` — keep the first `maxWords`, append `suffix` (default `…`) when truncated.
- `truncateWordsEnd(input, maxWords, prefix?)` — keep the last `maxWords`, prepend `prefix` (default `…`) when truncated.
- `countWords(input)` — count words using the same definition as above.

## Performance

The window keeps a bounded buffer, so `push` is constant time and memory does not
grow with the length of the stream. `peak` and `trough` are linear in the window
size, which is the trade that keeps `push` cheap.

