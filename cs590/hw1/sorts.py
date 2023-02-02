from enum import Enum
from subprocess import run


executable = './CS590_hw1_code/hw1'

class Sorts(Enum):
    INSERTION = 0
    INSERTION_IMPROVED = -1
    MERGE = 1
    
class Direction(Enum):
    RANDOM = 0
    SORTED = 1
    REVERSE = -1
    

def parse_output(output: str):
    result = dict()
    for line in output.split('\n'):
        line = line.strip()
        if '(generate)' in line:
            real, user, sys = line.split()[2::2]
            result['generate'] = (real, user, sys)
        elif '(sort)' in line:
            real, user, sys = line.split()[2::2]
            result['sort'] = (real, user, sys)
        elif line == "ERROR: The output is not sorted!":
            raise RuntimeError('output is not sorted!')
    return result
    

def run_sorts(num_vectors: int, vector_dimension: int, algorithm: Sorts, direction: Direction, *args):
    args = list(map(str, [executable, num_vectors, vector_dimension, algorithm.value, direction.value]))
    result = run(args, capture_output=True)
    return parse_output(result.stdout.decode())

def run_sorts_params(args):
    return run_sorts(*args)