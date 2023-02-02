// a list interface
public interface List {

    public boolean isEmpty();
// returns true if the list is empty, false otherwise

    public int size();
// returns the number of items in the list

    public void add(Object item);
// adds an item to the list Assignment 9
// precondition: none
// postcondition: item is added at the end of the list

    public void add(int index, Object item);
// adds an item to the list at the given index
// precondition: none
// postcondition: item is added at the given index; // the indices of following items are increased by 1.

    public void remove(int index);
// removes the item from the list that has the given index
// precondition: none
// postcondition: removes the first item in the list whose equal method
// matches that of the given item

    public void remove(Object item);
// removes an item from the list
// precondition: none
// postcondition: removes the first item in the list whose equal method
// matches that of the given item; the indices of the following items are
// decreased by 1

    public List duplicate();
// creates a duplicate of the list
// precondition: none
// postcondition: returns a copy of the linked list

    public List duplicateReversed();
// creates a duplicate of the list with the nodes in reverse order
// precondition: none
// postcondition: returns a copy of the linked list with the nodes in // reverse order

}