import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

public class Huffman {

    public static void main(String[] args) throws IOException {
        // Read the file, and count all of the characters. Only count letters and digits
        String raw_data = new String(Files.readAllBytes( Paths.get("infile.dat")));
        HashMap<Character, Integer> frequency = new HashMap<>();
        for (Character ch: raw_data.toCharArray()) {
            if ((Character.isLetterOrDigit(ch))) {
                Integer value = frequency.containsKey(ch) ? frequency.get(ch) : 0;
                frequency.put(ch, value + 1);
            }
        }

        // Add all characters to priority queue with their weight
        PriorityQueue<Tree> queue = new PriorityQueue<>();
        for (HashMap.Entry<Character, Integer> record : frequency.entrySet()) {
            queue.add(new Tree(record.getValue(), record.getKey()));
        }

        // Iteratively combine trees until one remains
        while (queue.size() >= 2) {
            Tree left = queue.poll();
            Tree right = queue.poll();
            Integer weight = left.weight + right.weight;
            queue.add(new Tree(weight, left, right));
        }

        // Get the codes, and sort everything
        HashMap<Character, String> huffman_code = queue.poll().getCodes();
        TreeMap<Character, String> sorted_huffman = sort_huffman(huffman_code);
        TreeMap<Character, Double> sorted_frequency = sort_frequency(frequency);

        // Calculate total bits
        Integer bits = 0;
        for (HashMap.Entry<Character, Integer> record : frequency.entrySet()) {
            bits = bits + (record.getValue() * huffman_code.get(record.getKey()).length());
        }

        // Write all values to the output file
        FileWriter fileWriter = new FileWriter("outfile.dat");
        PrintWriter printWriter = new PrintWriter(fileWriter);
        for (HashMap.Entry<Character, Double> record : sorted_frequency.entrySet()) {
            printWriter.printf("%s %.2f%%%n", record.getKey(), record.getValue());
        }
        printWriter.printf("%n");
        for (HashMap.Entry<Character, String> record : sorted_huffman.entrySet()) {
            printWriter.printf("%s %s%n", record.getKey(), record.getValue());
        }
        printWriter.printf("%nTotal Bits: %s%n", bits);
        printWriter.close();
    }

    private static TreeMap sort_frequency(HashMap<Character, Integer> frequency) {
        // Sort characters by frequency, and then alphanumerically
        FrequencyCompare compare = new FrequencyCompare(frequency);
        TreeMap<Character, Double> sorted_frequency = new TreeMap<>(compare);

        Double denom = 0.0;
        for (Integer value: frequency.values()) {
            denom = denom + value;
        }

        for (HashMap.Entry<Character, Integer> record : frequency.entrySet()) {
            Character key = record.getKey();
            sorted_frequency.put(key, Double.valueOf(record.getValue()) / denom * 100);

        }
        return sorted_frequency;
    }

    private static TreeMap sort_huffman(HashMap<Character, String> huffman_code) {
        // Sort huffman codes by integer value (which will serendipitously sort by length)
        HuffmanCompare compare = new HuffmanCompare(huffman_code);
        TreeMap<Character, String> sorted_huffman = new TreeMap<>(compare);
        sorted_huffman.putAll(huffman_code);
        return sorted_huffman;
    }

    public static class FrequencyCompare implements Comparator {
        // Custom sorter for character frequency
        HashMap frequency_map;

        private FrequencyCompare(HashMap frequency_map) {
            this.frequency_map = frequency_map;
        }

        @Override
        public int compare(Object a, Object b) {
            Comparable val_a = (Comparable) frequency_map.get(a);
            Comparable val_b = (Comparable) frequency_map.get(b);
            int compare = val_b.compareTo(val_a);
            if (compare == 0) {
                Comparable key_a = (Comparable) a;
                Comparable key_b = (Comparable) b;
                return key_a.compareTo(key_b);
            }
            else {
                return compare;
            }
        }
    }

   public static class HuffmanCompare<K, V> implements Comparator {
        // Custom sorter for huffman codes
        HashMap<Character, String> huffman_map;

        private HuffmanCompare(HashMap<Character, String> huffman_map) {
            this.huffman_map = huffman_map;
        }

        @Override
        public int compare(Object a, Object b) {
            String val_a = huffman_map.get(a);
            String val_b = huffman_map.get(b);
            Comparable comp_a = (Comparable) Integer.parseInt(val_a, 2);
            Comparable comp_b = (Comparable) Integer.parseInt(val_b, 2);
            int compare = comp_a.compareTo(comp_b);
            return compare;
        }
    }

    public static class Tree implements Comparable<Tree>{
        // Basic binary tree for huffman encoding.

        Integer weight;
        Character symbol;
        Tree left;
        Tree right;

        private Tree(Integer weight, Character symbol) {
            this.weight = weight;
            this.symbol = symbol;
            this.left = null;
            this.right = null;
        }

        private Tree(Integer weight, Tree left, Tree right) {
            this.weight = weight;
            this.left = left;
            this.right = right;
        }

        public String toString() {
            String left = this.left == null ? "" : this.left.toString();
            String right = this.right == null ? "" : this.right.toString();
            String a = String.format( "[ w: %s, s: %s, [%s, %s]]", this.weight, this.symbol, left, right);
            return a;
        }

        private HashMap<Character, String> getCodes() {
            // Recursive huffman code generator
            HashMap<Character, String> results = new HashMap<>();
            if (this.left != null) {
               if (this.left.symbol == null) {
                   HashMap<Character, String> left_result = this.left.getCodes();
                   for (HashMap.Entry<Character, String> record : left_result.entrySet()) {
                       results.put(record.getKey(), "0".concat(record.getValue()));
                   }
               }
               else {
                   results.put(this.left.symbol, "0");
               }
                if (this.right.symbol == null) {
                    HashMap<Character, String> left_result = this.right.getCodes();
                    for (HashMap.Entry<Character, String> record : left_result.entrySet()) {
                        results.put(record.getKey(), "1".concat(record.getValue()));
                    }
                }
                else {
                    results.put(this.right.symbol, "1");
                }
            }
            return results;
        }

        @Override
        public int compareTo(Tree other) {
            if (this.weight < other.weight) {
                return -1;
            }
            if (this.weight == other.weight) {
                return 0;
            }
            else {
                return 1;
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


