#include <cstdio>
#include <cstdlib>
#include <limits>
#include <iostream>

#include "sort.h"

using namespace std;

int ivector_length(int* v, int n)
{
  int sum;

  sum = 0;
  for (int i = 0; i < n; i++)
      sum += (v[i] < 0) ? -v[i] : v[i];

  return sum;
}

/*
 * insertion sort
 */
void insertion_sort(int** A, int n, int l, int r)
{
    int i;
    int* key;

    for (int j = l+1; j <= r; j++)
    {
        key = A[j];
        i = j - 1;

        while ((i >= l) && (ivector_length(A[i], n) > ivector_length(key, n)))
        {
            A[i+1] = A[i];
            i = i - 1;
        }
        A[i+1] = key;
    }
}

/*
*   TO IMPLEMENT: Improved Insertion Sort for problem 1.
*/
void insertion_sort_im(int** A, int n, int l, int r)
{
    int i;
    int* current_vector;
    int current_length;
    int lengths[l+r];  // this is the new addition, an array of calculated lengths

    lengths[0] = ivector_length(A[0], n);

    for (int j = l+1; j <= r; j++)
    {
        current_vector = A[j];
        i = j - 1;

        // we only need to calculate one length here, as all the values 'to the left' are already calculated
        // this is itself a loop invariant; all the lengths up to loop iteration j are calculated/initialized
        current_length = ivector_length(current_vector, n);
        lengths[j] = current_length;

        // the inner loop is very similar, but we are comparing lengths in the lengths vector
        while ((i >= l) && lengths[i] > current_length)
        {
            A[i+1] = A[i];
            lengths[i+1] = lengths[i];  // update the lengths as we shift values
            i = i - 1;
        }
        A[i+1] = current_vector;
        lengths[i+1] = current_length;  // update the final length
    }
}


void merge(int** A, int* size_array, int n, int p, int q, int r) {
    // function for merging arrays that already have precalculated sizes. I calculate size in the base case only, so
    // we only have to pay the cost of that calculation a single time

    int inf = numeric_limits<int>::max();  // this is our sentinel value
    int n1 = q - p + 1;
    int n2 = r - q;

    // These are two additional vectors for storing sizes. Note, this is +1 longer to make room for the sentinel
    int Lsize[n1+1];
    int Rsize[n2+1];

    // This code assigning L using 'new', because I was seg-faulting on huge inputs before
    int** L = new int*[n1];
    for(int i = 0; i < n1; ++i)
        L[i] = new int[n];


    // This code assigning R for the same reason as L
    int** R = new int*[n2];
    for(int i = 0; i < n2; ++i)
        R[i] = new int[n];

    // nested for loops to initialize our temporary arrays. Could also have been done using * vectors
    for (int i = 0; i < n1; i++) {
        for (int k = 0; k < n; k++) {
            L[i][k] = A[p+i][k];  // instead of A[], make it len(A[])
        }
        Lsize[i] = size_array[p+i];
    }
    Lsize[n1] = inf;

    // nested for loops to initialize our temporary arrays. Could also have been done using * vectors
    for (int i = 0; i < n2; i++) {
        for (int k = 0; k < n; k++) {
            R[i][k] = A[q+i+1][k];
        }
        Rsize[i] = size_array[q+1+i];
    }
    Rsize[n2] = inf;

    int i = 0;
    int j = 0;
    for (int k = p; k <= r; k++) {
        if (Lsize[i] <= Rsize[j]) {
            for (int nn = 0; nn < n; nn++)
            {
                A[k][nn] = L[i][nn];
            }
            size_array[k] = Lsize[i];
            i++;
        }
        else {
            for (int nn = 0; nn < n; nn++)
            {
                A[k][nn] = R[j][nn];
            }
            size_array[k] = Rsize[j];
            j++;
        }
    }
}

/*
*   TO IMPLEMENT: Improved Merge Sort for problem 2.
*/
void merge_sort(int** A, int* size_array, int n, int p, int r)
{
    // if we are not at the base case, we recursively call merge_sort and merge.
    int q;
    if (p < r) {
        q = floor((p + r) / 2);
        merge_sort(A, size_array, n, p, q);
        merge_sort(A, size_array, n, (q+1), r);
        merge(A, size_array, n, p, q, r);
    }
    else {
        size_array[p] = ivector_length(A[p], n); // base case! calculate the vector size here
    }

}


void merge_sort(int**A, int n, int p, int r) {
    // this function matches the given merge_sort prototype, and runs my custom version under the covers
    int size_array[r - p + 1];
    merge_sort(A, size_array, n, p, r);
}

/*
 * Simple function to check that our sorting algorithm did work
 * -> problem, if we find position, where the (i-1)-th element is 
 *    greater than the i-th element.
 */
bool check_sorted(int** A, int n, int l, int r)
{
  for (int i = l+1; i <= r; i++)
    if (ivector_length(A[i-1], n) > ivector_length(A[i], n))
      return false;
  return true;
}


/*
 * generate sorted/reverse/random arrays of type hw1type
 */
int** create_ivector(int n, int m)
{
  int** iv_array;

  iv_array = new int*[m];
  for (int i = 0; i < m; i++)
    iv_array[i] = new int[n];

  return iv_array;
}

void remove_ivector(int** iv_array, int m)
{
  for (int i = 0; i < m; i++)
    delete[] iv_array[i];
  delete[] iv_array;
}

int** create_sorted_ivector(int n, int m)
{
  int** iv_array;

  iv_array = create_ivector(n, m);
  for (int i = 0; i < m; i++)
    for (int j = 0; j < n; j++)
      iv_array[i][j] = (i+j)/n;

  return iv_array;
}

int** create_reverse_sorted_ivector(int n, int m)
{
  int** iv_array;

  iv_array = create_ivector(n, m);
  for (int i = 0; i < m; i++)
    for (int j = 0; j < n; j++)
      iv_array[i][j] = ((m-i)+j)/n;

  return iv_array;
}

int** create_random_ivector(int n, int m, bool small)
{
  random_generator rg;
  int** iv_array;

  iv_array = create_ivector(n, m);
  for (int i = 0; i < m; i++)
    for (int j = 0; j < n; j++)
      {
	rg >> iv_array[i][j];
	if (small)
	  iv_array[i][j] %= 100;
	else
	  iv_array[i][j] %= 65536;
      }

  return iv_array;
}

