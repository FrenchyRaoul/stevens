from enum import Enum
from subprocess import run


executable = './CS590_hw2_code/hw2'

class Sorts(Enum):
    RADIX_INSERTION = 0
    RADIX_COUNTING  = 1
    

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
    

def run_sorts(num_strings: int, string_length: int, algorithm: Sorts, *args):
    args = list(map(str, [executable, num_strings, string_length, algorithm.value]))
    result = run(args, capture_output=True)
    return parse_output(result.stdout.decode())

def run_sorts_params(args):
    return run_sorts(*args)