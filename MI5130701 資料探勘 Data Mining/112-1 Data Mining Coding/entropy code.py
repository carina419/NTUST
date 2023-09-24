import numpy as np
def entropy(i, j):
    if i == 0 or j == 0:
        return 0
    p = i / (i + j)
    return - p*np.log2(p) - (1 - p)*np.log2((1 - p))

all_entropy = entropy(9,5)

print ("entropy =" + all_entropy)

print ('test') 
x=3 
y=8
print(x+y)
