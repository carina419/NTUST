import numpy as np
def entropy(i, j):
    if i == 0 or j == 0:
        return 0
    p = i / (i + j)
    return - p*np.log2(p) - (1 - p)*np.log2((1 - p))

a = input ('請輸入全部的總數：')
b = input ('請輸入正確的總數：')

print('Informaiton Gain資訊獲得：')

print(entropy(a,b))

print ('test') 
x=3 
y=8
print(x+y)
