#include <iostream>

using namespace std;

int main() {
    int i = 74;
    string msg;
    while (i <= 291) {
        msg = "";
        bool div_by_3 = (i % 3) == 0;
        bool div_by_5 = (i % 5) == 0;
        if (div_by_3) {
            msg += "Buzz";
        }
        if (div_by_5) {
            msg += "Fizz";
        }
        if (msg.length() > 0) {
            cout << msg << endl;
        }
        else {
            cout << i << endl;
        }
        i++;
    }
    return 0;
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
