import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;

public class HashMap {

    private LinkedList[] table;
    private final Integer START_CAPACITY = 101;
    private double LOAD_THRESHOLD = 0.75;
    private Integer num_entries;
    private Integer size;


    private HashMap() {
        this.size = START_CAPACITY;
        this.table = new LinkedList[START_CAPACITY];
        this.num_entries = 0;
    }

    private HashMap(Integer initial_size) {
        this.size = initial_size;
        this.table = new LinkedList[initial_size];
        this.num_entries = 0;
    }

    private int get_loc(String key) {
        int hash = (int) (hash(key) % this.size);
        if (hash < 0) {
            hash = hash + this.size;
        }
        return hash;
    }

    private boolean contains(String key) {
        int loc = get_loc(key.toLowerCase());
        if (this.table[loc] == null) {
            return false;
        }
        LinkedList ll = this.table[loc];
        return ll.contains(key);
    }

    private void add_word(String value) {
        String lower = value.toLowerCase();
        //put(lower, value);
        put(lower, lower);
    }

    private void put(String key, String value) {
        int loc = get_loc(key);
        if (this.table[loc] == null) {
            this.table[loc] = new LinkedList();
        }
        LinkedList ll = this.table[loc];
        if (!ll.contains(value)) {
            ll.add(value);
            this.num_entries++;
        }
        double load = this.num_entries / (double) this.size;
        if (load > this.LOAD_THRESHOLD) {
            resize(this.size * 2);
        }
    }

    private void remove(String key) {
        String lower = key.toLowerCase();
        int loc = get_loc(lower);
        if (this.table[loc] == null) {
            return;
        }
        else {
            LinkedList ll = this.table[loc];
            if (ll.remove(lower)) {
                this.num_entries--;
                if (ll.size == 0) {
                }
            }
        }
    }

    private void resize(int new_size) {
        LinkedList[] oldtable = this.table;
        this.table = new LinkedList[new_size];
        this.size = new_size;
        this.num_entries =0;
        for (LinkedList ll: oldtable) {
            if (ll == null) {
                continue;
            }
            for (Object string: ll) {
                add_word((String) string);
            }

        }
    }

    public int size() {
        return this.num_entries;
    }

    private class LinkedList implements Iterable {
        private Entry root;
        private int size;

        private LinkedList() {
            root = null;
            size = 0;
        }

        private void add(String value) {
            if (size == 0) {
                this.root = new Entry(value);
            }
            else {
                Entry entry = this.root;
                while (!(entry.next == null)) {
                    entry = entry.next;
                }
                entry.next = new Entry(value);
            }
            this.size++;
        }

        private boolean remove(String value) {
            if (!contains(value)) {
                return false;
            }
            else {
                Entry entry = this.root;
                if (entry.getValue().equals(value)) {
                    this.root = entry.next;
                }
                else {
                    while (!entry.next.getValue().equals(value)) {
                        entry = entry.next;
                    }
                    entry.next = entry.next.next;
                }
            }
            this.size--;
            return true;
        }

        private boolean contains(String value) {
            if (this.size == 0) {
                return false;
            }
            Entry entry = this.root;
            if (this.root.getValue().equals(value)) {
                return true;
            }
            while (!(entry.next == null)) {
                entry = entry.next;
                if (entry.getValue().equals(value)) {
                    return true;
                }
            }
            return false;
        }

        public String toString() {
            ArrayList<String> list = new ArrayList<>();
            if (this.size == 0) {
                return "empty list";
            }
            else {
                Entry entry = this.root;
                list.add(entry.getValue());
                while (!(entry.next == null)) {
                    entry = entry.next;
                    list.add(entry.getValue());
                }
            }
            String result = String.join(", ", list);
            return result;
        }

        @Override
        public Iterator iterator() {
            return new LLIterator(this);
        }

        class LLIterator implements Iterator {
            Entry current;

            private LLIterator(LinkedList list) {
                current = list.root;
            }

            @Override
            public boolean hasNext() {
                return !(current == null);
            }

            public String next() {
                String data = current.getValue();
                current = current.next;
                return data;
            }
        }


        private class Entry {
            private String value;
            private Entry next;

            private Entry(String value){
                this.value = value;
                this.next = null;
            }

            public String getValue() {
                return this.value;
            }

            public String setValue(String value) {
                this.value = value;
                return this.value;
            }

        }
    }


    private static double hash(String string) {
        double hash = 0;
        int n = string.length();
        for (int i = 0; i < n; i++) {
            char character = string.charAt(i);
            double ascii = (double) character;
            hash = hash + ascii * Math.pow(31, n-1-i);
        }
        return hash;
    }

    private static TreeSet<String> near_miss(String input) {
        String string = input.toLowerCase();
        char[] alphabet = "abcdefghijklmnopqrstuvwxyz".toCharArray();
        //ArrayList<String> output = new ArrayList<>();
        TreeSet<String> output = new TreeSet<>();

        for (int n=0; n<string.length(); n++) {
            output.add(new StringBuilder(string).deleteCharAt(n).toString());

            for (char letter: alphabet) {
                output.add(new StringBuilder(string).deleteCharAt(n).insert(n, letter).toString());
            }
        }

        for (int n=0; n<=string.length(); n++) {
            for (char letter: alphabet) {
                output.add(new StringBuilder(string).insert(n, letter).toString());
            }
        }

        for (int n=1; n<string.length(); n++) {
            char character = string.charAt(n);
            output.add(new StringBuilder(string).deleteCharAt(n).insert(n-1, character).toString());
        }

        return output;
    }

    private static TreeSet<String> two_word_check(String input) {
        String string = input.toLowerCase();
        TreeSet<String> output = new TreeSet<>();

        for (int n=1; n<string.length(); n++) {
            String words = new StringBuilder(string).insert(n, " ").toString();
            output.add(words);
            }
        return output;
    }

    public static void main(String[] args) throws FileNotFoundException, IOException {
        HashMap hm = new HashMap(315389);
        BufferedReader reader = new BufferedReader(new FileReader("/usr/share/dict/words"));
        String line = reader.readLine().trim();
        while (line != null) {
             String word = line.trim();
                 hm.add_word(word);
             line = reader.readLine();
        }

        System.out.print("word: ");
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine();
        scanner.close();
        String[] split_string = input.trim().split("\\s+");
        for (String word: split_string) {
            if ((hm.contains(word) | hm.contains(word.toLowerCase()))) {
                System.out.println("ok");
            }
            else {
                ArrayList<String> hits = new ArrayList<>();
                System.out.println("not found");
                TreeSet<String> near_misses = HashMap.near_miss(word);
                for (String chance: near_misses) {
                    if (hm.contains(chance)) {
                        hits.add(chance);
                    }
                }
                TreeSet<String> two_word_check = HashMap.two_word_check(word);
                for (String two_words: two_word_check) {
                    String[] words = two_words.split("\\s+");
                    if (hm.contains(words[0]) & hm.contains(words[1])) {
                        hits.add(two_words);
                    }
                }
                if (hits.size() > 0) {
                    System.out.printf("how about: %s%n", String.join(", ", hits));
                }
            }
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