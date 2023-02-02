import java.util.ArrayList;
import java.util.Scanner;

public class Database<D extends Comparable<D>> {
    /*
     * A database that contains records of populations, economies, and names. Splays for performance.
     */
    private SplayTree<Integer> populations;
    private SplayTree<Integer> economies;
    private SplayTree<String> names;

    private Database() {
        this.populations = new SplayTree<>();
        this.economies = new SplayTree<>();
        this.names = new SplayTree<>();
    }

    private String execute(String command) throws NumberFormatException{
        /*
         * Given a string (likely from stdin), pass the input parameters to the appropriate function to handle it.
         */
        String[] split = command.trim().split("\\s+");
        Integer nargs = split.length;
        switch (split[0]) {
            case "insert":
                if (nargs.equals(4)) {
                    try {
                        return this.insert_record(Integer.parseInt(split[1]), Integer.parseInt(split[2]), split[3]);
                    }
                    catch (NumberFormatException nfe) {
                        return "Error: invalid argument type. args should be 'insert <Integer> <Integer> <String>'";
                    }
                }
                return "Error: invalid number of args. command should be in form 'insert <pop> <econ> <name>'";
            case "find":
                if (nargs.equals(3)) {
                    try {
                        return this.find_value(Integer.parseInt(split[1]), split[2]);
                    }
                    catch (NumberFormatException nfe) {
                        return "Error: invalid argument type. args should be 'find <Integer> <Object>'";
                    }
                }
                return "Error: invalid number of args. command should be in form 'find <field> <value>'";
            case "remove":
                if (nargs.equals(3)) {
                    try {
                        return this.remove_value(Integer.parseInt(split[1]), split[2]);
                    }
                    catch (NumberFormatException nfe) {
                        return "Error: invalid argument type. args should be 'remove <Integer> <Object>'";
                    }
                }
                return "Error: invalid number of args. command should be in form 'remove <field> <value>'";
            case "list":
                if (nargs.equals(2)) {
                    try {
                        return this.list_records(Integer.parseInt(split[1]));
                    }
                    catch (NumberFormatException nfe) {
                        return "Error: invalid argument type. args should be 'list <Integer>'";
                    }
                }
                return "Error: invalid number of args. command should be in form 'list <field>'";
            case "makenull":
                return this.makenull();
            default:
                return "Error: invalid command. available commands are insert/find/remove/list/makenull";
        }
    }

    private String insert_record(Integer population, Integer economy, String name) {
        /*
         * Check all three trees if the record already exists before splaying. As all three trees need to be searched,
         * it does not make sense to splay before checking them. If the record is not a duplicate, add it to all three.
         * It also does not make sense to traverse each tree twice, so we save the last node we traversed to
         * make insertion faster.
         */
        Record record = new Record(population, economy, name);
        SplayTree.SearchResult s1 = this.populations.find_node(population);
        SplayTree.SearchResult s2 = this.economies.find_node(economy);
        SplayTree.SearchResult s3 = this.names.find_node(name);

        if (!(s1.found | s2.found | s3.found)) {
            this.populations.Add_at_node(s1.node, record.population, record);
            this.economies.Add_at_node(s2.node, record.economy, record);
            this.names.Add_at_node(s3.node, record.name, record);
            return "Success: record inserted into database";
        }
        return "Error: record already exists";
    }

    private String remove_value(Integer field, String value) {
        /*
         * Search the tree given in field, and remove the record matching value if it is found.
         */
        SplayTree.SearchResult result;
        switch (field) {
            case 1:
                result = this.populations.find_node(Integer.parseInt(value));
                break;
            case 2:
                result = this.economies.find_node(Integer.parseInt(value));
                break;
            case 3:
                result = this.names.find_node(value);
                break;
            default:
                return "Error: invalid field value. valid options are 1, 2, 3";
        }
        return this.remove_record(result);
    }

    private String find_value(Integer field, String value) {
        /*
         * Search the tree given in field (which splays that tree), and return the record matching value if it is found.
         */
        Record search;
        switch (field) {
            case 1:
                search = this.populations.Search(Integer.parseInt(value));
                break;
            case 2:
                search = this.economies.Search(Integer.parseInt(value));
                break;
            case 3:
                search = this.names.Search(value);
                break;
            default:
                return "Error: invalid field value. valid options are 1, 2, 3";
        }
        if (search != null) {
            return search.toString();
        }
        return "Error: record does not exist in the database";
    }

    private String list_records(Integer field) {
        /*
         * print out the appropriate tree
         */
        switch (field) {
            case 1:
                return this.populations.toString();
            case 2:
                return this.economies.toString();
            case 3:
                return this.names.toString();
            default:
                return "Error: invalid field value. valid options are 1, 2, 3";
        }
    }

    private String remove_record(SplayTree.SearchResult result) {
        /*
         * If a result is found (indicated by the SearchResult object), then remove it from all three splay trees.
         */
        if (result.found) {
            Record record = result.node.record;
            this.populations.Remove(record.population);
            this.economies.Remove(record.economy);
            this.names.Remove(record.name);
            return "Success: record removed from database";
        }
        return "Error: record does not exist in database";
    }

    private String makenull() {
        /*
         * Empty out the database
         */
        this.populations = new SplayTree<>();
        this.economies = new SplayTree<>();
        this.names = new SplayTree<>();
        return "Database has been cleared";
    }

    private class Record {
        /**
         * A basic class that stores all three fields of a database entry
         */
        private Integer population;
        private Integer economy;
        private String name;

        private Record(Integer population, Integer economy, String name) {
            this.population = population;
            this.economy = economy;
            this.name = name;
        }

        public String toString() {
            String template = "%s %s %s";
            return String.format(template, this.population, this.economy, this.name);
        }
    }

    private class Node<E> {
        /**
         * Object that represents a node in a tree. Node objects store information about their parent, which direction
         * they are under their parent (used for splaying operations), as well as their left and right children.
         * Alternatively to the 'type' member, we could have implemented this during the actual splay operation, but
         * this worked well.
         */
        private Node<E> parent;
        private Node<E> left;
        private Node<E> right;
        private Integer type;  // -1 = left, 0 = root, 1 = right

        E key;
        private Record record;

        private Node(E key, Record record) {
            /*
             * Instantiate a new Node object with no children or parent.
             */
            this.parent = null;
            this.left = null;
            this.right = null;
            this.type = 0;

            this.key = key;
            this.record = record;
        }

        private Node(E key, Integer type, Record record) {
            /*
             * Instantiate a child Node object, the direction (from the parent) is stored in the 'type' member
             */
            this.parent = null;
            this.left = null;
            this.right = null;
            this.type = type;

            this.key = key;
            this.record = record;
        }

        private void setLeft(Node<E> left) {
            /*
             * Use this method to set the left child of a node. This function is a convenience function, setting the
             * appropriate type/parent values.
             */
            if (left == null) {
                this.left = null;
                return;
            }
            this.left = left;
            left.type = -1;
            left.parent = this;
        }


        private void setRight(Node<E> right) {
            /*
             * Use this method to set the right child of a node. This function is a convenience function, setting the
             * appropriate type/parent values.
             */
            if (right == null) {
                this.right = null;
                return;
            }
            this.right = right;
            right.type = 1;
            right.parent = this;
        }

        private void fix_parent(Node<E> node) {
            /*
             * When rotating/splaying on nodes, this is a convenience function to set the appropriate type/parent
             * member values.
             */
            if (this.type.equals(-1)) {
                this.parent.setLeft(node);
            }
            else if (this.type.equals(1)) {
                this.parent.setRight(node);
            }
        }

        private void rotate_right() {
            /*
             * Rotate nodes clockwise, about "this" node's left child. Note, this.left will not ever be null when
             * running rotate right, as we are only rotating right if the left child is the child we want to be in the
             * root position.
             */
            Node<E> pivot = this.left;
            this.setLeft(pivot.right);
            pivot.parent = this.parent;
            this.fix_parent(pivot);
            pivot.setRight(this);
        }

        private void rotate_left() {
            /*
             * Rotate nodes counter-clockwise, about "this" node's right child. Note, this.right will not ever be null
             * when running rotate left, as we are only rotating right if the left child is the child we want to be in
             * the root position.
             */
            Node<E> pivot = this.right;
            this.setRight(pivot.left);
            pivot.parent = this.parent;
            this.fix_parent(pivot);
            pivot.setLeft(this);
        }

        public String toString() {
            /*
             * print the Record associated with this node.
             */
            String template = "%s: (%s, %s)";
            return String.format(template, this.key, this.left, this.right);
        }

    }

    private class SplayTree<E extends Comparable<E>> {
        /**
         * Splay tree implementation.
         *
         * "Node" objects represent nodes in the tree, and contain a key and a Record
         *
         * "Records" are values of population, economy, and node, and are associated with every node.
         *
         * "SearchResults" are simple objects used to indicate success when searching the tree for a node with a
         * specified key
         */
        Node<E> root;

        private SplayTree() {
            /*
             * Main tree instantiation.
             */
            this.root = null;
        }

        private SplayTree(Node<E> root) {
            /*
             * Subtree instantiation, located at a specified 'root'
             */
            this.root = root;
        }

        private Node<E> insert(E key, Record record) {
            /*
             * The base insertion code. This function recursively traverses the tree to find the correct insertion point.
             * If the tree's root is null, insert immediately. Otherwise, check the left or right child. If they are
             * null, insert the node there. If left or right is not null, create a child tree at the appropriate node,
             * and run the insert function on the child tree.
             *
             * Return the newly added node to the caller, so it may be splayed. If the node already exists, return null.
             */
            Node<E> newnode;
            if (this.root == null) {
                newnode = new Node<>(key, record);
                this.root = newnode;
                return newnode;
            }
            if (key.equals(this.root.key)) {
                return null;
            }

            SplayTree<E> subtree;
            if (key.compareTo(this.root.key) < 0) {
                if (this.root.left == null) {
                    newnode = new Node<>(key, -1, record);
                    this.root.setLeft(newnode);
                    return newnode;
                }
                subtree = new SplayTree<>(this.root.left);
            }
            else {
                if (this.root.right == null) {
                    newnode = new Node<>(key, 1, record);
                    this.root.setRight(newnode);
                    return newnode;
                }
                subtree = new SplayTree<>(this.root.right);
            }
            return subtree.insert(key, record);
        }

        private void Add(E key, Record record) {
            /*
             * Add a node to the tree, and then splay on that node. This function does not care about duplicate values,
             * duplicate handling is done in the parent 'Database' class.
             *
             * For optimization, this was replaced by the "Add_at_node" function below, which adds a new record at an
             * already located node in the tree.
             */
            Node<E> newnode = this.insert(key, record);
            if (newnode != null) {
                this.Splay(newnode);
            }
        }

        private void Add_at_node(Node<E> root, E key, Record record) {
            /*
             * This method is for performance. Rather than traverse a tree twice, we can insert a record at a subtree.
             */
            SplayTree<E> subtree;
            if (root == null) {
                subtree = this;
            }
            else {
                subtree = new SplayTree<>(root);
            }
            Node<E> newnode = subtree.insert(key, record);
            if (newnode == null) {
                System.out.println("CRITICAL: NODE SHOULD NEVER BE NULL");
                return;
            }
            this.Splay(newnode);
        }

        private void Splay(Node<E> node) {
            /*
             * Recursively splay the tree on the given node. First, check to see if this node is a child of the root. If
             * so, Zig or Zag on that node. Otherwise, this node is a grandchild of some other node. Apply the
             * appropriate rotations on each subtree, until the splayed node is the root of the tree. Make sure to set
             * the Tree's new 'root' member appropriately.
             */
            if (node.type.equals(0)) {
                return;
            }
            if (node.parent.type.equals(0)) {
                if (node.type.equals(-1)) {
                    // "Zig"
                    node.parent.rotate_right();
                    this.root = node;
                    node.type = 0;
                    return;
                }
                // "Zag"
                node.parent.rotate_left();
                this.root = node;
                node.type = 0;
                return;
            }
            Node<E> parent = node.parent;
            Node<E> grandparent = parent.parent;

            // If this splay sets the node to the root of the tree, we want to set the SplayTree.root member
            boolean set_root = grandparent.type.equals(0);

            if (parent.type.equals(-1)) {
                if (node.type.equals(-1)) {
                    // "Zig-Zig"
                    grandparent.rotate_right();
                    if (set_root) {
                        this.root = parent;
                        parent.type = 0;
                    }
                    parent.rotate_right();
                    if (set_root) {
                        this.root = node;
                        node.type = 0;
                    }
                }
                else {
                    // "Zag-Zig"
                    parent.rotate_left();
                    grandparent.rotate_right();
                    if (set_root) {
                        this.root = node;
                        node.type = 0;
                    }

                }
            }
            else if (parent.type.equals(1)) {
                if (node.type.equals(1)) {
                    // "Zag-Zag"
                    grandparent.rotate_left();
                    if (set_root) {
                        this.root = parent;
                        parent.type = 0;
                    }
                    parent.rotate_left();
                    if (set_root) {
                        this.root = node;
                        node.type = 0;
                    }
                }
                else {
                    // "Zig-Zag"
                    parent.rotate_right();
                    grandparent.rotate_left();
                    if (set_root) {
                        this.root = node;
                        node.type = 0;
                    }

                }
            }
            if (this.root.key != node.key) {
                this.Splay(node);
            }
        }

        private void Remove(E key) {
            /*
             * Remove a key from the splay tree. First check if the record exists. If it does not, immediately return
             * and do not splay. If it does exist, splay on that key, and then remove it and re-form the tree.
             */
            SearchResult result = this.find_node(key);
            if (!result.found) {
                return;  // note, we do not splay if it is not found, unlike the 'Search' operation (we could, though).
            }
            this.Splay(result.node);
            Node<E> left = root.left;
            Node<E> right = root.right;
            if (left == null) {
                this.root = right;
                if (this.root != null) {
                    this.root.parent = null;
                    this.root.type = 0;
                }
                return;
            }
            Node<E> max = left;
            while (max.right != null) {
                max = max.right;
            }
            SplayTree<E> left_tree = new SplayTree<>(left);
            left.type = 0;
            left_tree.Splay(max);
            left.setRight(right);
            this.root = left_tree.root;
        }

        private class SearchResult {
             /**
              * Small object that contains a boolean to indicate if a record was found, and a node object that is
              * either the 'found' node, or if False, the last traversed node (so we can splay it)
              */
            boolean found;
            Node<E> node;
            private SearchResult(boolean found, Node<E> node) {
                this.found = found;
                this.node = node;
            }
        }

        private SearchResult find_node(E key) {
            /*
             * Recursive search function to look for a key in the Splay tree. This does not splay, so we can control
             * whether or not we want to. For instance, it is easier to search all of the tables first when doing an
             * insert, so we don't have to try and splay and unsplay all of the trees.
             */
            if (this.root != null) {
                Node<E> node = this.root;
                if (node.key.equals(key)) {
                    return new SearchResult(true, node);
                }

                while (!(node.key.equals(key))) {
                    if (key.compareTo(node.key) < 0) {
                        if (node.left == null) {
                            return new SearchResult(false, node);
                        }
                        node = node.left;
                        continue;
                    }
                    if (node.right == null) {
                        return new SearchResult(false, node);
                    }
                    node = node.right;
                }
                return new SearchResult(true, node);
            }
            return new SearchResult(false, null);
        }

        private Record Search(E key) {
            /*
             * A simple search function that splays the tree on the found record, or the last traversed record
             */
            SearchResult result = this.find_node(key);
            if (result.node != null) {
                this.Splay(result.node);
                if (result.found) {
                    return result.node.record;
                }
            }
            return null;
        }

        private ArrayList<String> Walk() {
            /*
             * Recursively traverse the tree in order, padding records with spaces as we go. Used to convert the tree
             * structure into a printable string (see toString)
             */
            ArrayList<String> output_list = new ArrayList<>();
            if (this.root.left != null)  {
                SplayTree<E> subtree = new SplayTree<>(this.root.left);
                for (String line: subtree.Walk()) {
                    output_list.add("    " + line);
                }
            }
            output_list.add(this.root.record.toString());
            if (this.root.right != null)  {
                SplayTree<E> subtree = new SplayTree<>(this.root.right);
                for (String line: subtree.Walk()) {
                    output_list.add("    " + line);
                }
            }
            return output_list;
        }

        public String toString() {
            /*
             * Convert the "walked" tree into a printable string
             */
            if (this.root != null) {
                ArrayList<String> records = this.Walk();
                return String.join("\n", records);
            }
            return "(Database is empty)";
        }
    }

    public static void main(String[] args) {
        Database<Integer> db = new Database<>();
        Scanner scanner = new Scanner(System.in);
        System.out.print(">>> ");
        String command = scanner.nextLine();
        while (!(command.equals("quit"))) {
            System.out.println(db.execute(command));
            System.out.print(">>> ");
            command = scanner.nextLine();
        }
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
