#include <iostream>
#include <set>
#include <queue>

#include "graph.h"

const int NO_EDGE = 0;

using namespace std;

Graph::Graph(int nodes)
{
    this->nodes = nodes;
    this->matrix = new int*[nodes];

    for (int i = 0; i < nodes; ++i) {
        (this->matrix)[i] = new int[nodes];

        for (int j = 0; j < nodes; ++j) {
            (this->matrix)[i][j] = NO_EDGE;
        }
    }
}

Graph::Graph(int **matrix, int nodes) {
    this->nodes = nodes;
    this->matrix = new int*[nodes];

    for (int i = 0; i < nodes; ++i) {
        (this->matrix)[i] = new int[nodes];

        for (int j = 0; j < nodes; ++j) {
            (this->matrix)[i][j] = matrix[i][j];
        }
    }
}

Graph::~Graph()
{
    for (int i = 0; i < this->nodes; ++i) {
        delete[] (this->matrix)[i];
    }
    delete[] this->matrix;
}

bool Graph::set_edge(int i, int j, int edge)
{
    if (i < this->nodes && j < this->nodes && i >= 0 && j >= 0) {
        (this->matrix)[i][j] = edge;
        return true;
    }

    return false;
}

void Graph::dfs()
{
    set<int> visited;
    for (int node = 0; node < this->nodes; node++) {
        if (visited.find(node) != visited.end()) {
            continue;
        }
        else {
            this->dfs(node, &visited);
        }
    }
    cout << endl;
}

void Graph::dfs(int start, set<int> *visited)
{
    int adj_val;

    cout << start << ",";
    visited->insert(start);
    bool is_visited;
    for (int j = 0; j < this->nodes; j++) {
        adj_val = this->matrix[start][j];
        is_visited = (visited->find(j) != visited->end());
        if ((adj_val == 1) and !(is_visited)) {
            this->dfs(j, visited);
        }
    }
}

void Graph::bfs(int start)
{
    set<int> visited;
    this->bfs(start, &visited);
}

void Graph::bfs(int start, set<int> *visited)
{
    int current;
    int adj_val;
    queue<int> bfs_queue;

    bfs_queue.push(start);

    while (!(bfs_queue.empty())) {
        current = bfs_queue.front();
        bfs_queue.pop();

        if (visited->find(current) != visited->end()) {
            continue;
        }

        visited->insert(current);
        for (int j = 0; j < this->nodes; j++) {
            adj_val = this->matrix[current][j];
            if (adj_val == 1) {
                bfs_queue.push(j);
            }
        }
        cout << current << ",";
    }
    cout << endl;
}

