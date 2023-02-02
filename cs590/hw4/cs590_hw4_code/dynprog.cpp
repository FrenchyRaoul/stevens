#include <cstring>
#include <iostream>
#include <limits.h>
#include <stdexcept>

#include "dynprog.h"

using namespace std;

const char LEFT     = 'l';
const char UP       = 'u';
const char DIAGONAL = 'd';

/*
 * Bottom up implementation of Smith-Waterman algorithm
 * H: table of values
 * P: table of directions
 * n: num rows
 * m: num columns
 */
void SW_bottomUp(char* X, char* Y, char** P, int** H, int n, int m){
    int p1, p2, p3, max_p;
    for (int i = 0; i <= n; i++) {
        H[i][0] = 0;
        P[i][0] = 0;
        //P[i][0] = UP;
    }
    for (int j = 0; j <= m; j++) {
        H[0][j] = 0;
        P[0][j] = 0;
        //P[0][j] = LEFT;
    }
    P[0][0] = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (X[i-1] == Y[j-1]) {
                p1 = H[i-1][j-1] + 2;
            }
            else {
                p1 = H[i-1][j-1] - 1;
            }
            p2 = H[i-1][j] - 1;
            p3 = H[i][j-1] - 1;
            max_p = max(max(p1, p2), p3);
            H[i][j] = max(max_p, 0);
            if (max_p == p1) {
                P[i][j] = DIAGONAL;
            }
            else if (max_p == p2) {
                P[i][j] = UP;
            }
            else if (max_p == p3){
                P[i][j] = LEFT;
            }
            else {
                throw std::invalid_argument("bad value found");
            }
        }
    }
}

/*
 * Top-down with memoization implementation of Smith-Waterman algorithm
 */
void memoized_SW(char* X, char* Y, char** P, int** H, int n, int m){
    // initializing with INT_MIN, a sentinel for whether or not a cell has been processed
    for (int i = 0; i <= n; i++) {
        H[i][0] = 0;
        P[i][0] = 0;
    }
    for (int j = 0; j <= m; j++) {
        H[0][j] = 0;
        P[0][j] = 0;
    }
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            H[i][j] = INT_MIN;
        }
    }
    memoized_SW_AUX(X, Y, P, H, n, m);
}

/*
 * Auxilary recursive function of top-down with memoization implementation of Smith-Waterman algorithm
 */
void memoized_SW_AUX(char* X, char* Y, char** P, int** H, int n, int m){
    int p1, p2, p3, max_p;

    if (H[n-1][m-1] == INT_MIN) {
        memoized_SW_AUX(X, Y, P, H, n-1, m-1);
    }
    if (H[n-1][m] == INT_MIN) {
        memoized_SW_AUX(X, Y, P, H, n-1, m);
    }
    if (H[n][m-1] == INT_MIN) {
        memoized_SW_AUX(X, Y, P, H, n, m-1);
    }


    if (X[n-1] == Y[m-1]) {
        p1 = H[n-1][m-1] + 2;
    }
    else {
        p1 = H[n-1][m-1] - 1;
    }
    p2 = H[n-1][m] - 1;
    p3 = H[n][m-1] - 1;
    max_p = max(max(p1, p2), p3);

    H[n][m] = max(max_p, 0);
    if (max_p == p1) {
        P[n][m] = DIAGONAL;
    }
    else if (max_p == p2) {
        P[n][m] = UP;
    }
    else if (max_p == p3){
        P[n][m] = LEFT;
    }
    else {
        throw std::invalid_argument("bad value found");
    }

}

/*
 * Print X'
 */
void print_Seq_Align_X(char* X, char** P, int n, int m){
    switch(P[n][m]) {
        case 0:
            break;
        case DIAGONAL:
            print_Seq_Align_X(X, P, n-1, m-1);
            cout << X[n-1];
            break;
        case LEFT:
            print_Seq_Align_X(X, P, n, m-1);
            cout << "-";
            break;
        case UP:
            print_Seq_Align_X(X, P, n-1, m);
            cout << X[n-1];
            break;
        default:
            throw std::invalid_argument("bad table value found");
    }
}

/*
 * Print Y'
 */
void print_Seq_Align_Y(char* Y, char** P, int n, int m) {
    char val = P[n][m];
    switch(val) {
        case 0:
            break;
        case DIAGONAL:
            print_Seq_Align_Y(Y, P, n-1, m-1);
            cout << Y[m-1];
            break;
        case LEFT:
            print_Seq_Align_Y(Y, P, n, m-1);
            cout << Y[m-1];
            break;
        case UP:
            print_Seq_Align_Y(Y, P, n-1, m);
            cout << "-";
            break;
        default:
            throw std::invalid_argument("bad table value found");
    }
}

