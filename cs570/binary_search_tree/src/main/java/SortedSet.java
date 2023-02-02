import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Scanner;

public class SortedSet{

    private Node root;

    public static void main(String[] args) throws Exception{
        String filepath = "infile.dat";
        ArrayList<Integer> indata = read_file(filepath);
        Collections.shuffle(indata); // shuffle the data so the tree isn't terribly unbalanced because of sorted input

        SortedSet ss = new SortedSet();
        for (Integer i: indata) {
            ss.add(i);
        }

        Scanner scanner = new Scanner(System.in);
        System.out.printf("Sorted Set Contains: %s%n", ss.toString());
        System.out.print("User Input = ");
        Integer to_search = scanner.nextInt();
        System.out.println(ss.contains(to_search) ? "Yes": "No");

    }

    protected static class Node{
        private Integer data;
        private Node left;
        private Node right;

        private Node(Integer data) {
            this.data = data;
            left = null;
            right = null;
        }

        public String toString() {
            return String.format("%s: (%s, %s)", data.toString(),
                    (left == null) ? "null": left.toString(),
                    (right == null) ? "null": right.toString());
        }
    }

    public SortedSet() {
        this.root = null;
    }

    public SortedSet(Node rootnode) {
        this.root = rootnode;
    }

    public boolean isEmpty() {
        return (this.root == null);
    }

    public boolean add(Integer i) {
        if (this.isEmpty()) {
            this.root = new Node(i);
            return true;
        }
        else {
            Node node = this.root;
            while (node != null) {
                if (node.data > i) {
                    if (node.left == null) {
                        node.left = new Node(i);
                        return true;
                    }
                    node = node.left;
                }
                else if (node.data < i) {
                    if (node.right == null) {
                        node.right = new Node(i);
                        return true;
                    }
                    node = node.right;
                }
                else if (node.data == i) {
                    return false;
                }
            }
            return false;
        }
    }

    private Node delete(Node localroot, Integer item){
        if (localroot == null) {
            return localroot;
        }
        if (item < localroot.data) {
            localroot.left = delete(localroot.left, item);
            return localroot;
        }
        else if (item > localroot.data) {
            localroot.right = delete(localroot.right, item);
            return localroot;
        }
        else {
            if (localroot.left == null) {
                if (localroot.right == null) {
                    return null;
                }
                return localroot.right;
            }
            else if (localroot.left.right == null) {
                localroot.left.right = localroot.right;
                return localroot.left;
            }
            else { // get the rightmost node on the left branch
                Node parent = localroot;
                Node node = localroot.left;
                while (node.right != null) {
                   parent = node;
                   node = parent.right;
                }
                node.right = localroot.right;
                node.left = localroot.left;
                parent.right = null;
                return node;
            }

        }
    }

    public void remove(Integer item) {
        if (this.isEmpty()) {
            return;
        }
        else {
            this.root = delete(this.root, item);
        }
    }

    public boolean contains(Integer item) {
        if (this.isEmpty()) {
            return false;
        }
        else {
            Node node = this.root;
            while (node != null) {
                if (node.data == item) {
                    return true;
                }
                else if (item > node.data) {
                    node = node.right;
                }
                else {
                    node = node.left;
                }
            }
            return false;
        }
    }

    public String toString() {
        if (this.isEmpty()) {
            return "<empty>";
        }
        return this.root.toString();
    }

    private static ArrayList<Integer> read_file(String filepath) throws IOException, RuntimeException {
        FileReader fr = new FileReader(filepath);
        ArrayList<Integer> indata = new ArrayList<>();
        String rawdata = "";
        int i;
        while ((i=fr.read()) != -1) {
            char val = (char) i;
            if (Character.isDigit(val)) {
                rawdata = rawdata.concat(String.valueOf(val));
            }
            else if (val == ',') {
                indata.add(Integer.valueOf(rawdata));
                rawdata = "";
            }
            else if ((val != ' ') & (val != '\n')) {
                throw new RuntimeException("invalid character in infile.dat");
            }
        }
        indata.add(Integer.valueOf(rawdata));
        return indata;
    }
}

// On my honor:
//
// - I have not used code obtained from another student,
// or any other unauthorized source, either modified or unmodified.
//
// - All code and documentation used in my program is either my original
// work, or was derived, by me, from the source code provided by the assignment.
//
// - I have not discussed coding details about this project with anyone
// other than my instructor, teaching assistants assigned to this
// course, except via the message board for the course. I understand that I
// may discuss the concepts of this program with other students, and that
// another student may help me debug my program so long as neither of us
// writes anything during the discussion or modifies any computer file
// during the discussion. I have violated neither the spirit nor letter of this restriction.
//