import Node from './Node';

class AVLTST<T> {

  private root: Node<T> | null = null;

  private N: number = 0;

  private cnt: number = 0;

  constructor(private singleWildcard: string = '_', private restWildcard: string = '*') {}

  get size() {
    return this.N;
  }

  get count() {
    return this.cnt;
  }

  has(key: string) {
    return this.get(key) !== null;
  }

  set(key: string, value: T) {
    this.root = this.put(this.root, key, value, 0);
  }

  get(key: string) {
    return this.retrieve(this.root, this.validateKey(key), 0);
  }

  wildcardGet(key: string) {
    const cleanKey = this.validateKey(key);
    if (cleanKey.includes(this.restWildcard)
      && (cleanKey[cleanKey.length - 1] !== this.restWildcard
        || [...cleanKey].filter(c => c === this.restWildcard).length > 1))
      throw new Error(`Invalid wildcard key, "${this.restWildcard}" can only be used once at end of string`);
    return this.collect(this.root, '', cleanKey, 0);
  }

  remove(key: string) {
    return this.delete(this.root, key);
  }

  print(x: Node<T> | null = this.root, prefix: string = '') {
    let str = '';
    if (x) {
      str += prefix + x.c + (x.value ? `(${x.value})` : '') + ' {\n';
      if (x.left) str += prefix + '  left {\n' + this.print(x.left, prefix + '   ') + prefix + '  }\n';
      if (x.mid) str += prefix + '  mid {\n' + this.print(x.mid, prefix + '   ') + prefix + '  }\n';
      if (x.right) str += prefix + '  right {\n' + this.print(x.right, prefix + '  ') + prefix + '  }\n';
      str += prefix + '}\n';
    }
    return str;
  }

  private put(x: Node<T> | null, key: string, value: T, d: number) {

    const c = key.charAt(d);
    if (x === null) {
      x = new Node(c);
      this.cnt += 1;
    }

    if (c < x.c) x.left = this.put(x.left, key, value, d);
    else if (c > x.c) x.right = this.put(x.right, key, value, d);
    else if (d < key.length - 1) x.mid = this.put(x.mid, key, value, d + 1);
    else if (!x.ends) {
      this.N += 1;
      x.value = value;
    }

    return this.restoreBalance(x);
  }

  private delete(x: Node<T> | null, key: string) {
    const path: Node<T>[] = [];
    const found = this.retrieve(x, key, 0, (n) => {
      path.push(n);
    });

    const pathRev = path.reverse();
    let node = pathRev.shift();

    if (found === null || !node) return;

    // Remove value if found
    if (node.ends) {
      node.value = null;
      this.N -= 1;
    }

    // Proceed with deletion progressively
    while (node && node.mid === null) {
      // @ts-ignore
      this.restoreBalance(node);
      if (node.value) return;
      else if (node.mid === null && node.left === null && node.right === null) {
        const cur = pathRev.shift();
        if (!cur) this.root = null;
        else if (cur.left === node) cur.left = null;
        else if (cur.right === node) cur.right = null;
        else if (cur.mid === node) cur.mid = null;
        this.cnt -= 1;
        node = cur;
      } else return;
    }
  }

  private collect(x: Node<T> | null, prefix: string, key: string, d: number): T[] {
    if (x === null) return [];

    let list: T[] = [];
    const c = key.charAt(d);

    if (c === this.restWildcard) {
      list = this.discover(x).map(n => n.value) as T[];
    } else {
      if (c === this.singleWildcard || c < x.c) list = [...list, ...this.collect(x.left, prefix, key, d)];
      if (c === this.singleWildcard || c === x.c) {
        let cle = prefix;
        cle += x.c;

        if (d === key.length -1 && x.ends) {
          list.push(x.value as T);
        }
        if (d < key.length -1) {
          list = [...list, ...this.collect(x.mid, cle, key, d + 1)];
        }
      }
      if (c === this.singleWildcard || c > x.c) list = [...list, ...this.collect(x.right, prefix, key, d)];
    }
    return list;
  }

  private discover(x: Node<T> | null): Node<T>[] {
    if (x === null) return [];
    const base = [
      ...this.discover(x.left),
      ...this.discover(x.right),
      ...this.discover(x.mid)
    ];
    return x.ends ? [x, ...base] : base;
  }

  private retrieve(x: Node<T> | null, key: string, d: number, callback: (n: Node<T>) => any = () => null): T | null {
    if (x === null) return null;

    callback(x);

    const c = key.charAt(d);
    if (c < x.c) return this.retrieve(x.left, key, d, callback);
    if (c > x.c) return this.retrieve(x.right, key, d, callback);
    if (d < key.length - 1) return this.retrieve(x.mid, key, d + 1, callback);
    return x.value;
  }

  private updateNodeHeight(node: Node<T>) {
    node.nodeHeight = Math.max(this.height(node.right), this.height(node.left)) + 1;
  }

  private height(node: Node<T> | null) {
    return node === null ? -1 : node.nodeHeight;
  }

  private balance(node: Node<T> | null) {
    return node === null ? 0 : this.height(node.left) - this.height(node.right);
  }

  private restoreBalance(node: Node<T>) {
    if (this.balance(node) < -1) {
      if (this.balance(node.right) > 0) {
        // @ts-ignore
        node.right = this.rotateRight(node.right);
      }

      node = this.rotateLeft(node);
    }
    else if (this.balance(node) > 1) {
      if (this.balance(node.left) < 0) {
        // @ts-ignore
        node.left = this.rotateLeft(node.left);
      }
      node = this.rotateRight(node);
    }
    else {
      this.updateNodeHeight(node);
    }

    return node;
  }

  private rotateRight(x: Node<T>): Node<T> {
    const y = x.left as Node<T>;
    x.left = y.right;
    y.right = x;

    this.updateNodeHeight(x);
    this.updateNodeHeight(y);
    return y;
  }

  private rotateLeft(x: Node<T>): Node<T> {
    const y = x.right as Node<T>;
    x.right = y.left;
    y.left = x;

    this.updateNodeHeight(x);
    this.updateNodeHeight(y);
    return y;
  }

  private validateKey(key: string) {
    if (typeof key !== 'string') throw new Error('Given key is not a string');
    if (key.trim().length === 0) throw new Error('Invalid key given of length 0');
    return key.trim();
  }
}

export default AVLTST;
