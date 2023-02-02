#include <cstdio>
#include <cstdlib>
#include <iostream>

#include "sort.h"

using namespace std;

/* 
 * HW 2 part
 */
int string_compare(char* s1, char *s2)
{ 
/*
 * We assume that s1 and s2 are non-null pointers
 */
  int i;

  i = 0;
  while ((s1[i] != 0) && (s2[i] != 0) && (s1[i] == s2[i]))
    i++;

  if (s1[i] == s2[i])
    return 0;
  else
    {
      if (s1[i] < s2[i])
	return -1;
      else
          cout << "string s1=\"" << s1 << "\" > s2=\"" << s2 << "\"" << endl;
          cout << "i=" << i << " s1[i]=" << s1[i] << " s2[i]=" << s2[i] << endl;
          cout << s1[i] << " < " << s2[i] << " = " << (s1[i] < s2[i]) << endl;
	return 1;
    }
} /*>>>*/

void insertion_sort(char** A, int l, int r)
{ 
  int i;
  char* key;

  for (int j = l+1; j <= r; j++)
    {
      key = A[j];
      i = j - 1;

      while ((i >= l) && (string_compare(A[i], key) > 0))
        {
	  A[i+1] = A[i];
	  i = i - 1;
	}

      A[i+1] = key;
    }
}

/**
 * Sort an array of strings according to the character at position d
 *
 * @param A: array of strings
 * @param A_len: array of string lengths (each string may be a different length)
 * @param l: leftmost index of A
 * @param r: rightmost index of A
 * @param d: digit location to sort by
 *
 * Notes: if d+1 > A_len,
 * Example: if string j A_len[j]=2, d can be 0, 1
 */
void insertion_sort_digit(char** A, int* A_len, int l, int r, int d)
{
    int i;
    char* val;
    char* key;
    int current_length;
    char zero = '0';
    char* compare;

    for (int j = l+1; j < r; j++)
    {
        current_length = A_len[j];
        key = d+1 > current_length ? &zero : &A[j][d];  // if d is greater than our length, use 0 as the key to sort
        val = A[j];
        i = j - 1;

        compare = d+1 > A_len[i] ? &zero : &A[i][d];
        while ((i >= l) && (*compare > *key))
        {
            A[i+1] = A[i];
            A_len[i+1] = A_len[i];
            i = i - 1;
            compare = d+1 > A_len[i] ? &zero : &A[i][d];
        }
        A[i+1] = val;
        A_len[i+1] = current_length;
    }

}

/**
 * Sort an array of strings according to the character at position d
 *
 * @param A: array of strings
 * @param A_len: array of string lengths (each string may be a different length)
 * @param B:
 * @param B_len:
 * @param n: total number of strings in array A
 * @param d: digit location to sort by
 *
 * Notes: if d+1 > A_len,
 * Example: if string j A_len[j]=2, d can be 0, 1
 */
void counting_sort_digit(char** A, int* A_len, char** B, int* B_len, int n, int d)
{
    int idx;
    int a_idx;

    // count all the letters
    int C[27] = { 0 };  // note, 27 because 26 letters + blank (0)
    for (int i = 0; i < n; i++)
    {
        idx = d+1 > A_len[i] ? 0 : (int) A[i][d] - 96;
        C[idx]++;
    }

    // perform cumulative sum
    for (int i = 1; i < 27; i++)
    {
        C[i] = C[i] + C[i-1];
    }

    for (int j = n; j > 0; j--)
    {
        a_idx = d+1 > A_len[j-1] ? 0 : (int) A[j-1][d] - 96;
        B[C[a_idx] - 1] = A[j-1];
        B_len[C[a_idx]-1] = A_len[j-1];
        C[a_idx]--;
    }
}

/**
 *
 * @param A: array of strings to be sorted
 * @param A_len: array of string lengths
 * @param n: number of strings to be sorted
 * @param m: maximum string length
 */
void radix_sort_is(char** A, int* A_len, int n, int m)
{
    for (int d = m-2; d >= 0; d--)
    {
        insertion_sort_digit(A, A_len, 0, n, d);
    }

}

void radix_sort_cs(char** A, int* A_len, int n, int m)
{
    char** B;
    int* B_len;

    for (int d = m-2; d >= 0; d--)
    {
        B = new char*[n];
        B_len = new int[n];
        counting_sort_digit(A, A_len, B, B_len, n, d);

        // copy our results, B, back into A
        for (int i=0; i<n; i++)
        {
            A[i] = B[i];
            A_len[i] = B_len[i];
        }
    }
}

/*
 * Simple function to check that our sorting algorithm did work
 * -> problem, if we find position, where the (i-1)-th element is 
 *    greater than the i-th element.
 */
bool check_sorted(char** A, int l, int r)
{
  for (int i = l+1; i < r; i++)
    if (string_compare(A[i-1],A[i]) > 0)
      return false;
  return true;
}
