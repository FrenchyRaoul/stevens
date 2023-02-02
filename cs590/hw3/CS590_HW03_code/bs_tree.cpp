
#include "bs_tree.h"
#include <list>
#include <iostream>

using namespace std;

/*
 * constructor/destructor
 */
bs_tree::bs_tree()
{
    T_nil = new bs_tree_node();
    T_nil->p = T_nil;
    T_nil->left = T_nil;
    T_nil->right = T_nil;

    T_root = T_nil;
    T_insertions = 0;
    T_duplicate_insertions = 0;
}

bs_tree::~bs_tree()
{
    remove_all(T_root);
    delete T_nil;
}

void bs_tree::insert(int key, bs_tree_i_info& t_info)
{
    bs_tree_node* z;

    z = new bs_tree_node;
    z->key = key;

    insert(z, t_info);
    T_insertions++;
}


void bs_tree::insert(bs_tree_node* z, bs_tree_i_info& t_info)
{
    bs_tree_node* x;
    bs_tree_node* y;

    y = T_nil;
    x = T_root;

    while (x != T_nil)
    {
        y = x;

        if (z->key < x->key)
            x = x->left;
        else
            x = x->right;
    }

    // set z's parent to y, because we found a nil spot on the tree (x)
    z->p = y;

    // if y is nil, then we must have an empty tree.
    if (y == T_nil)
        T_root = z;
    else
    {
        // put our new node as a child of y in the correct position (either left or right)
        if (z->key < y->key)
            y->left = z;
        else if (z->key > y->key)
            y->right = z;
        else
        {
            // keys must be equal, we dont add this node to the tree
            t_info.i_duplicate++;
            return;
        }
    }
    // the new node has no children, set them to nil
    z->left = T_nil;
    z->right = T_nil;
}

// TODO: modified inorder tree walk method to save the 
// sorted numbers in the first argument: int* array.
// question 2
int bs_tree::convert(int* array, int n)
{
    int num_copied = 0;
    //cout << "input array: [";
    //for (int i = n - 1; i >= 0; i--)
    //    cout << array[i] << ",";
    //cout << "]" << endl;
    //cout << "root node key: " << T_root->key << endl;
    inorder_tree_walk(array, &num_copied, T_root);
    return num_copied;
}

void bs_tree::inorder_tree_walk(int* array, int* n, bs_tree_node* z)
{
    //cout << "walking tree from node: " << z->key << " n=" << *n << endl;
    if (z->left != T_nil)
        inorder_tree_walk(array, n, z->left);
    array[*n] = z->key;
    //cout << "copied " << z->key << " into array position " << *n << endl;
    (*n)++;
    if (z->right != T_nil)
        inorder_tree_walk(array, n, z->right);
}



void bs_tree::remove_all(bs_tree_node* x)
{
    if (x != T_nil)
    {
        remove_all(x->left);
        remove_all(x->right);

        delete x;
    }
}

