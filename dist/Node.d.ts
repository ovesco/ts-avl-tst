declare class Node<T> {
    c: string;
    left: Node<T> | null;
    right: Node<T> | null;
    mid: Node<T> | null;
    value: T | null;
    nodeHeight: number;
    constructor(c: string);
    get ends(): boolean;
}
export default Node;
