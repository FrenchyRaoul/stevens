import java.util.stream.IntStream;

public class Main {
    public static void main(String[] args) {
        IntStream.rangeClosed(74, 290).forEachOrdered(num -> {
            process_num(num);
            System.out.print("\n");
        });
        process_num(291);
    }

    private static void process_num(int num) {
        boolean div3 = num % 3 == 0;
        boolean div5 = num % 5 == 0;
        if (div3) {
            System.out.print("Buzz");
        }
        if (div5) {
            System.out.print("Fizz");
        }
        if (!(div3 | div5)) {
            System.out.print(num);
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