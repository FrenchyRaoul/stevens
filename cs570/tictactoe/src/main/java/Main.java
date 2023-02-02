import java.util.*;

public class Main {
    /*
    * The game is broken into several steps. Take a turn, print the board, remove combinations, check for a winner,
    * and check for a tie game.
    *
    * board: array keeping track of moves
    * turn: A simple way of keeping track of whose turn it is
    * open: how many spaces were still open on the board
    * tie_game: is the game currently in a tied state
    * combo_array: only used for initializing "combos" (java ignorance on initializing an ArrayList with vals)
    * combos: collection of all the remaining, possible winning combinations (by either player)
     */

    private static String[] board = {"1", "2", "3", "4", "5", "6", "7", "8", "9"};
    private static boolean turn = true;
    private static int open = 9;
    private static boolean tie_game = false;

    // Two options to check win 1) hard-code the combos, 2) have three checkers (check row, check col, check diagonals)
    private static int[][] combo_array = {{0, 1, 2}, {3, 4, 5}, {6, 7, 8}, {0, 3, 6}, {1, 4, 7}, {2, 5, 8},
            {0, 4, 8}, {2, 4, 6}};
    private static List<int[]> combos = new ArrayList<>(Arrays.asList(combo_array));

    public static void main(String[] args) {
        while (!tie_game) {

            print_board();
            tie_game = true;

            take_turn();
            int[] moves = {(open + 1) / 2, open/2};
            int i = 0;
            List<Integer> impossible_combo = new ArrayList<>();

            for (int[] combo : combos) {
                List<String> to_check = new ArrayList<>(Arrays.asList(board[combo[0]],
                        board[combo[1]],
                        board[combo[2]]));
                if (check_impossible_combo(to_check)) {
                    impossible_combo.add(i);
                }
                else {
                    check_winner(to_check);
                    if (tie_game) {
                        tie_game = tie_game & check_tie(to_check, moves);
                    }
                }
                i++;
            }
            // Remove impossible winning combinations.
            if (impossible_combo.size() > 0) {
                impossible_combo.sort(Collections.reverseOrder());
                for (int idx: impossible_combo) {
                    combos.remove(idx);
                }
            }
            if (combos.size() == 0) {
                break;
            }
            }
        System.out.print("Players X and O have tied.");
        System.out.print('\n');
    }

    private static void print_board() {
        /*
        * @param template string template that represents the tic-tac-toe board
         */
        String template = " %s | %s | %s\n---+---+---\n %s | %s | %s\n---+---+---\n %s | %s | %s\n";
        System.out.printf(template, (Object[]) board);
    }

    private static void check_winner(List<String> to_check) {
        // System.out.print("checking for winnders...");
        if ((to_check.get(0).equals(to_check.get(1))) & (to_check.get(1).equals(to_check.get(2)))) {
            System.out.printf("Player %s has won the game!", turn ? "O" : "X");
            System.out.print('\n');
            System.exit(0);
        }
    }

    private static boolean check_impossible_combo(List<String> to_check) {
        /*
        * i: counter for locating winning combination indices
        * impossible_combo: array of indices of combinations that are not longer winnable by either player
         */
        return (to_check.contains("X") & to_check.contains("O"));
    }

    private static boolean check_tie(List<String> to_check, int[] moves) {
        /*
        * Check to make sure at least one of the possible winning combinations has fewer (or equal) free spaces than
        * remaining moves to be made, for each of the two players. If neither player has a possible winning combination,
        * then the game must be a tie.
        *
        * still_winnable: array indicating if the game is winnable by each player
        * moves: array of remaining moves for each player
        * free: array of open moves for any given winning combination
         */

        boolean[] winnable = {false, false};
        int[] free = {0, 0};
        free[0] = 3 - Collections.frequency(to_check, turn ? "X" : "O");
        free[1] = 3 - Collections.frequency(to_check, turn ? "O" : "X");


        // Debugging code
        //if (combos.size() <= 3) {
        //    System.out.printf("to_check: %s%n", to_check.size());
        //    System.out.printf("X has %s moves left%n", Integer.toString(moves[0]));
        //    System.out.printf("O has %s moves left%n", Integer.toString(moves[1]));
        //}

        if ((free[0] <= moves[0]) & (free[1] == 3)) {
            winnable[0] = true;
        }
        if ((free[1] <= moves[1]) & free[0] == 3) {
            winnable[1] = true;
        }
        return !(winnable[0] | winnable[1]);
    }

    private static void take_turn() {
        /*
        * marker: player piece of the current player
        * template: string template for next turn prompt
        * scan: scanner for reading input
         */
        String marker = turn ? "X" : "O";
        String template = "Please enter a box number for player %s, or -1 to quit:";
        Scanner scan = new Scanner(System.in);
        System.out.printf(template, marker);
        System.out.print('\n');
        String input = scan.next();
        int idx;
        try {
            idx = Integer.parseInt(input) - 1;
        }

        // if the user enters a string, we throw an error converting to an int
        catch (NumberFormatException e) {
            take_turn();
            return;
        }

        // if the user entered -1 (which is now -2 as we are subtracting 1 to 0-index), we quit
        if (idx == -2) {
            System.exit(0);
        }

        // if the user's int is outside of the playable range, a turn is not taken, markers not updated
        if ((idx < 0) | (idx > 8)) {
            take_turn();
            return;
        }

        // otherwise, we need to check to see if that marker location has already been used. no turn is taken if so
        String val = board[idx];
        if (val.equals("X") | val.equals("O")) {
            take_turn();
            return;
        }

        // if we are here, then the user entered a valid marker location. update the board and tracking variables.
        else {
            board[idx] = marker;
            turn = !turn;
            open--;
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