import java.util.ArrayList;

public class LinkedList implements List{
    private Node head;
    private Integer size;

    public LinkedList() {
        head = new Node(null);
        size = 0;
    }

    private static class Node {
        private Object data;
        private Node next;

        private Node(Object data) {
            this.data = data;
            this.next = null;
        }

        private Node(Object data, Node next) {
            this.data = data;
            this.next = next;
        }

        public String toString() {
            return this.data.toString();
        }
    }

    @Override
    public boolean isEmpty() {
        return this.size() == 0;
    }

    public int size() {
       return this.size;
    }

    public void add(Object item) {
        this.add(this.size, item);
    }

    public void add(int index, Object item) {
        if ((index < 0) | (index > this.size() + 1)) {
            throw new ArrayIndexOutOfBoundsException("invalid index, outside of list range");
        }
        Node node = this.head;
        for (int i = 0; i < index; i++){
            node = node.next;
        }
        node.next = new Node(item, node.next);
        this.size++;
    }

    public void remove(int index) {
        if ((index < 0) | (index > this.size() - 1)) {
            throw new ArrayIndexOutOfBoundsException("invalid index, outside of list range");
        }
        Node node = this.head;
        for (int i = 0; i < index; i++) {
            node = node.next;
        }
        node.next = node.next.next;
        this.size--;
    }

    public void remove(Object item) {
        Node node = this.head;
        for (int i = 0; i < this.size(); i++) {
            if (node.next.data.equals(item)) {
                node.next = node.next.next;
                this.size--;
                break;
            }
            node = node.next;
        }
    }

    public List duplicate() {
        LinkedList ll = new LinkedList();
        Node node = this.head;
        for (int i = 0; i < this.size; i++) {
            ll.add(new Node(node.next.data));
            node = node.next;
        }
        return ll;
    }

    public List duplicateReversed() {
        LinkedList ll = new LinkedList();
        Node node = this.head;
        for (int i = 0; i < this.size; i++) {
            ll.add(0, node.next.data);
            node = node.next;
        }
        return ll;
    }

    public String toString() {
        String output = String.format("[ size:%s ", this.size());
        ArrayList<String> strlst = new ArrayList<String>();
        Node node = this.head;
        for (int i = 0; i < this.size(); i++) {
            strlst.add(node.next.toString());
            node = node.next;
        }
        output = output.concat(String.format("%s ]", String.join(", ", strlst)));
        return output;
    }
}
