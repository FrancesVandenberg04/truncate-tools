import { test } from 'node:test';
import assert from 'node:assert/strict';
import { truncateWords, truncateWordsEnd, countWords } from '../src/core.js';

test('truncateWords keeps within-limit input verbatim (modulo whitespace collapse)', () => {
  assert.equal(truncateWords('one two three', 5), 'one two three');
  assert.equal(truncateWords('one two three', 3), 'one two three');
});

test('truncateWords keeps exactly maxWords', () => {
  assert.equal(truncateWords('one two three four five', 3), 'one two three…');
  assert.equal(truncateWords('one two three four five', 1), 'one…');
});

test('truncateWords respects a custom suffix', () => {
  assert.equal(truncateWords('one two three four', 2, '...'), 'one two...');
  assert.equal(truncateWords('one two three four', 2, ' [more]'), 'one two [more]');
});

test('truncateWords returns empty string for empty input', () => {
  assert.equal(truncateWords('', 3), '');
});

test('truncateWords returns empty string for non-positive maxWords', () => {
  assert.equal(truncateWords('one two three', 0), '');
  assert.equal(truncateWords('one two three', -2), '');
});

test('truncateWords collapses internal whitespace runs on return', () => {
  assert.equal(truncateWords('one  two   three', 10), 'one two three');
  assert.equal(truncateWords('  leading and trailing  ', 10), 'leading and trailing');
});

test('truncateWords handles tabs and newlines as separators', () => {
  assert.equal(truncateWords('one\ttwo\nthree', 2), 'one two…');
});

test('truncateWordsEnd keeps the last maxWords', () => {
  assert.equal(truncateWordsEnd('one two three four five', 3), '…three four five');
  assert.equal(truncateWordsEnd('one two three four five', 1), '…five');
});

test('truncateWordsEnd respects a custom prefix', () => {
  assert.equal(truncateWordsEnd('one two three four', 2, '...'), '...three four');
});

test('truncateWordsEnd returns within-limit input verbatim', () => {
  assert.equal(truncateWordsEnd('one two three', 5), 'one two three');
});

test('truncateWordsEnd empty and non-positive guards', () => {
  assert.equal(truncateWordsEnd('', 3), '');
  assert.equal(truncateWordsEnd('one two', 0), '');
});

test('countWords counts non-empty whitespace-separated tokens', () => {
  assert.equal(countWords('one two three'), 3);
  assert.equal(countWords('  one  two  '), 2);
  assert.equal(countWords(''), 0);
  assert.equal(countWords('one\ttwo\nthree'), 3);
});
