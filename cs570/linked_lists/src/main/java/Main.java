public class Main {

    public static void main(String[] args) {
        LinkedList ll = new LinkedList();
        List ll3 = ll.duplicateReversed();
        ll.add(14);
        ll.add("asdf");
        ll.add(54);
        ll.add(23);
        List ll2 = ll.duplicateReversed();
        System.out.println(ll.toString());
        System.out.println(ll2.toString());
        System.out.println(ll3.toString());
        System.out.print(ll.isEmpty());
        System.out.print(ll3.isEmpty());
        ll3.remove(0);
    }
}
