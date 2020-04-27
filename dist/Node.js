"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Node {
    constructor(c) {
        this.c = c;
        this.left = null;
        this.right = null;
        this.mid = null;
        this.value = null;
        this.nodeHeight = 0;
    }
    get ends() {
        return this.value !== null;
    }
}
exports.default = Node;
