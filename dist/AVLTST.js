"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("./Node"));
class AVLTST {
    constructor(singleWildcard = '_', restWildcard = '*') {
        this.singleWildcard = singleWildcard;
        this.restWildcard = restWildcard;
        this.root = null;
        this.N = 0;
        this.cnt = 0;
    }
    get size() {
        return this.N;
    }
    get count() {
        return this.cnt;
    }
    has(key) {
        return this.get(key) !== null;
    }
    set(key, value) {
        this.root = this.put(this.root, key, value, 0);
    }
    get(key) {
        return this.retrieve(this.root, this.validateKey(key), 0);
    }
    wildcardGet(key) {
        const cleanKey = this.validateKey(key);
        if (cleanKey.includes(this.restWildcard)
            && (cleanKey[cleanKey.length - 1] !== this.restWildcard
                || [...cleanKey].filter(c => c === this.restWildcard).length > 1))
            throw new Error(`Invalid wildcard key, "${this.restWildcard}" can only be used once at end of string`);
        return this.collect(this.root, '', cleanKey, 0);
    }
    remove(key) {
        return this.delete(this.root, key);
    }
    print(x = this.root, prefix = '') {
        let str = '';
        if (x) {
            str += prefix + x.c + (x.value ? `(${x.value})` : '') + ' {\n';
            if (x.left)
                str += prefix + '  left {\n' + this.print(x.left, prefix + '   ') + prefix + '  }\n';
            if (x.mid)
                str += prefix + '  mid {\n' + this.print(x.mid, prefix + '   ') + prefix + '  }\n';
            if (x.right)
                str += prefix + '  right {\n' + this.print(x.right, prefix + '  ') + prefix + '  }\n';
            str += prefix + '}\n';
        }
        return str;
    }
    put(x, key, value, d) {
        const c = key.charAt(d);
        if (x === null) {
            x = new Node_1.default(c);
            this.cnt += 1;
        }
        if (c < x.c)
            x.left = this.put(x.left, key, value, d);
        else if (c > x.c)
            x.right = this.put(x.right, key, value, d);
        else if (d < key.length - 1)
            x.mid = this.put(x.mid, key, value, d + 1);
        else if (!x.ends) {
            this.N += 1;
            x.value = value;
        }
        return this.restoreBalance(x);
    }
    delete(x, key) {
        const path = [];
        const found = this.retrieve(x, key, 0, (n) => {
            path.push(n);
        });
        const pathRev = path.reverse();
        let node = pathRev.shift();
        if (found === null || !node)
            return;
        // Remove value if found
        if (node.ends) {
            node.value = null;
            this.N -= 1;
        }
        // Proceed with deletion progressively
        while (node && node.mid === null) {
            // @ts-ignore
            this.restoreBalance(node);
            if (node.value)
                return;
            else if (node.mid === null && node.left === null && node.right === null) {
                const cur = pathRev.shift();
                if (!cur)
                    this.root = null;
                else if (cur.left === node)
                    cur.left = null;
                else if (cur.right === node)
                    cur.right = null;
                else if (cur.mid === node)
                    cur.mid = null;
                this.cnt -= 1;
                node = cur;
            }
            else
                return;
        }
    }
    collect(x, prefix, key, d) {
        if (x === null)
            return [];
        let list = [];
        const c = key.charAt(d);
        if (c === this.restWildcard) {
            list = this.discover(x).map(n => n.value);
        }
        else {
            if (c === this.singleWildcard || c < x.c)
                list = [...list, ...this.collect(x.left, prefix, key, d)];
            if (c === this.singleWildcard || c === x.c) {
                let cle = prefix;
                cle += x.c;
                if (d === key.length - 1 && x.ends) {
                    list.push(x.value);
                }
                if (d < key.length - 1) {
                    list = [...list, ...this.collect(x.mid, cle, key, d + 1)];
                }
            }
            if (c === this.singleWildcard || c > x.c)
                list = [...list, ...this.collect(x.right, prefix, key, d)];
        }
        return list;
    }
    discover(x) {
        if (x === null)
            return [];
        const base = [
            ...this.discover(x.left),
            ...this.discover(x.right),
            ...this.discover(x.mid)
        ];
        return x.ends ? [x, ...base] : base;
    }
    retrieve(x, key, d, callback = () => null) {
        if (x === null)
            return null;
        callback(x);
        const c = key.charAt(d);
        if (c < x.c)
            return this.retrieve(x.left, key, d, callback);
        if (c > x.c)
            return this.retrieve(x.right, key, d, callback);
        if (d < key.length - 1)
            return this.retrieve(x.mid, key, d + 1, callback);
        return x.value;
    }
    updateNodeHeight(node) {
        node.nodeHeight = Math.max(this.height(node.right), this.height(node.left)) + 1;
    }
    height(node) {
        return node === null ? -1 : node.nodeHeight;
    }
    balance(node) {
        return node === null ? 0 : this.height(node.left) - this.height(node.right);
    }
    restoreBalance(node) {
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
    rotateRight(x) {
        const y = x.left;
        x.left = y.right;
        y.right = x;
        this.updateNodeHeight(x);
        this.updateNodeHeight(y);
        return y;
    }
    rotateLeft(x) {
        const y = x.right;
        x.right = y.left;
        y.left = x;
        this.updateNodeHeight(x);
        this.updateNodeHeight(y);
        return y;
    }
    validateKey(key) {
        if (typeof key !== 'string')
            throw new Error('Given key is not a string');
        if (key.trim().length === 0)
            throw new Error('Invalid key given of length 0');
        return key.trim();
    }
}
exports.default = AVLTST;
