class Node<T> {

  public left: Node<T> | null = null;

  public right: Node<T> | null = null;

  public mid: Node<T> | null = null;

  public value: T | null = null;

  public nodeHeight: number = 0;

  constructor(public c: string) {
  }

  get ends() {
    return this.value !== null;
  }
}

export default Node;
