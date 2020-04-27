// @ts-ignore
import AVLTST from '../src/AVLTST';

describe('trie', () => {
  it('Should support inserting values', () => {
    const trie = new AVLTST();
    trie.set('abc', 1);
    trie.set('abd', 2);
    trie.set('yoyo', 3);
    expect(trie.size).toBe(3);
  });

  it('Should support removing values', () => {
    const trie = new AVLTST();
    const items = ['abcd', 'abcc', 'abdc', 'aaba', 'a', 'aabc', 'abcb'];
    items.forEach((k, v) => trie.set(k, v));

    expect(trie.size).toBe(items.length);
    trie.remove('abcb');
    items.forEach((k, v) => {
      if (k !== 'abcb') {
        expect(trie.get(k)).toBe(v);
      }
    });

    expect(trie.size).toBe(items.length - 1);
  });

  it('Should support retrieving single values', () => {
    const trie = new AVLTST();
    trie.set('abc', 1);
    trie.set('abd', 2);
    trie.set('aba', 3);
    expect(trie.get('aba')).toBe(3);
  });

  it('Should support retrieving using single wildcards', () => {
    const trie = new AVLTST();
    const items = ['abcd', 'abcc', 'abdc', 'aaba', 'a', 'aabc', 'abcb'];
    items.forEach((k, v) => trie.set(k, v));
    expect(trie.wildcardGet('ab_c')).toEqual([1,2]);
    expect(trie.wildcardGet('___c')).toEqual([5,1,2]);
    expect(trie.wildcardGet('a_b_')).toEqual([3,5]);
  });

  it('Should support retrieving using rest wildcards', () => {
    const trie = new AVLTST();
    const items = ['abcd', 'abcc', 'abdc', 'aaba', 'a', 'aabc', 'abcb'];
    items.forEach((k, v) => trie.set(k, v));
    expect(trie.wildcardGet('a*')).toEqual([3,5,2,1,6,0]);
    expect(trie.wildcardGet('ab*')).toEqual([2,1,6,0]);
    expect(trie.wildcardGet('_b*')).toEqual([2,1,6,0]);
  });
});
