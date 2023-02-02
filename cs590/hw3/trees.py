from enum import Enum
import re
from subprocess import run


executable = './CS590_HW03_code/hw3'

class Tree(Enum):
    BST = 0
    RB  = 1
    

class Data(Enum):
    DESC = -1
    RAND = 0
    ASC  = 1
    

def parse_output(output: str):
    raw_result = dict()
    result = dict()
    
    for line in output.split('\n'):
        line = line.strip()
        key, *val = line.split(':', 1)
        raw_result[key] = re.sub(r"\s+", " ", val[0].strip()) if val else None
    
    for key, val in raw_result.items():
        if '(generate)' in key:
            real, user, sys = val.split()[::2]
            result['generate_real'] = int(real[:-2])
            result['generate_user'] = int(user[:-2])
            result['generate_sys'] = int(sys[:-2])
        elif '(sort)' in key:
            real, user, sys = val.split()[::2]
            result['sort_real'] = int(real[:-2])
            result['sort_user'] = int(user[:-2])
            result['sort_sys'] = int(sys[:-2])
        elif 'black height test' in key:
            real, user, sys = val.split()[::2]
            result['bh_test_real'] = int(real[:-2])
            result['bh_test_user'] = int(user[:-2])
            result['bh_test_sys'] = int(sys[:-2])
        elif 'The output is' in key:
            assert key == "The output is sorted!"
        elif 'Running sort using' in key:
            continue
        elif key:
            result[key.lower().replace(' ', '_')] = int(val)
    return result
        

def run_tree_sort(num_nodes: int, data_type: Data, algorithm: Tree, *args):
    args = list(map(str, [executable, num_nodes, data_type.value, algorithm.value]))
    result = run(args, capture_output=True)
    return parse_output(result.stdout.decode())


# Timer (generate): 50ms real     40ms user       0ms sys
# Running sort using BS trees: 
# Timer (sort): 7759ms real       7380ms user     220ms sys
# New size: 4997077
# Duplicates: 2923
# The output is sorted!"""

# Timer (generate): 49ms real     40ms user       0ms sys
# Running sort using RB trees: 
# Timer (sort): 6984ms real       6710ms user     180ms sys
# New size: 4997097
# Black height: 15
# Time (black height test): 338ms real    330ms user      10ms sys
# Case 1: 2565756
# Case 2: 970624
# Case 3: 1941159
# Left Rotate: 1456015
# Right Rotate: 1455768
# Duplicates: 2903
# The output is sorted!