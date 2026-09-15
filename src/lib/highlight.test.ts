import { describe, expect, it } from 'vitest';
import { commentStart, fillPlaceholders, tokenizeLines } from './highlight';

describe('commentStart', () => {
  it('finds a trailing shell comment', () => {
    expect(commentStart("uci set a='1'   # note")).toBe(16);
  });

  it('treats a leading # as a comment', () => {
    expect(commentStart('#!/bin/sh')).toBe(0);
  });

  it('ignores # inside quotes', () => {
    expect(commentStart('echo "a # b"')).toBe(-1);
    expect(commentStart("uci set x='!AA # BB'")).toBe(-1);
  });

  it('ignores # that is part of a word', () => {
    expect(commentStart('echo a#b')).toBe(-1);
  });
});

describe('tokenizeLines', () => {
  it('splits placeholders and comments', () => {
    expect(tokenizeLines("uci set k='<WIFI_NAME>' # ssid", 'sh')).toEqual([
      [
        { type: 'text', value: "uci set k='" },
        { type: 'placeholder', name: 'WIFI_NAME' },
        { type: 'text', value: "' " },
        { type: 'comment', value: '# ssid' },
      ],
    ]);
  });

  it('only highlights comments for shell-like languages', () => {
    expect(tokenizeLines('# not a comment', 'ini')).toEqual([[{ type: 'text', value: '# not a comment' }]]);
  });

  it('leaves unknown <TOKENS> as plain text', () => {
    expect(tokenizeLines('echo <SOMETHING>', 'sh')).toEqual([[{ type: 'text', value: 'echo <SOMETHING>' }]]);
  });

  it('keeps one token list per line', () => {
    expect(tokenizeLines('a\n\nb', 'text')).toHaveLength(3);
  });
});

describe('fillPlaceholders', () => {
  it('fills known values and keeps empty ones as placeholders', () => {
    expect(fillPlaceholders("a='<WIFI_NAME>' b='<WIFI_PASS>'", { WIFI_NAME: 'Home', WIFI_PASS: '' })).toBe(
      "a='Home' b='<WIFI_PASS>'",
    );
  });
});
