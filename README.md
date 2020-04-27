# Typescript AVL Ternary search trie

This is an attempt at implementing an AVL ternary search trie in typescript. This has the advantage of offering a wildcard-based API in an efficient way.
Code is highly inspired from the ASD2 course given at HEIG-VD, Yverdon-Les-Bains, Switzerland.

```typescript
const trie = new AVLTernarySearchTrie<number>();
trie.set('aaa', 1);
trie.set('aba', 2);
trie.set('abc', 3);
trie.set('aac', 4);

trie.get('aaa'); // 1
trie.wildcardGet('a_a'); // [1, 2]
trie.wildcardGet('ab_'); // [2, 3]
trie.wildcardGet('aa*'); // [1, 4]

trie.remove('aba');
trie.wildcardGet('ab_'); // [3]
```

## Wildcards
the `.wildcardGet(key: string)` method supports the following wildcards:
- `_` which match any character
- `*` which can only be used at the end of the key and will match anything after

As such, based on trie from the upper example:
```typescript
'a__' = 'a*' // [aaa, aba, abc, aac]
'ab*' //[aba, abc]
'a*' // [aaa, aba, abc, aac]
'__c' // [abc, aac]
'a*a' // ERROR
```

## API
- `new AVLTernarySearchTrie(singleWildcard: string = '_', restWildcard: string = '*')` constructor, you can configure the two available wildcards here.
- `.size` returns the number of inserted values
- `.count` returns the number of nodes in the tree
- `.has(key: string)` checks if given key exists in the tree (has a value associated)
- `.set(key: string, value: T)` sets the given value at the given key
- `.get(key: string)` returns the value associated to the given key or null if nothing found
- `.wildcardGet(key: string)` returns all values associated to keys matching given wildcard key
- `.remove(key: string)` removes any value associated with the given key
- `.print()` prints the tree in its current state
