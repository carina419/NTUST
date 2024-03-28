# 導入需要的套件/函式庫
import numpy as np          # NumPy庫來生成隨機座標
import pandas as pd         # Pandas庫將座標保存為CSV文件
import sklearn
import matplotlib.pyplot as plt
from sklearn.neighbors import NearestNeighbors
k=5

# 產生100個隨機點的座標
num_points = 100
random_points = np.random.rand(num_points, 2) * 1000  
# num_points是要生成點數的數量(這邊預設產生100個隨機點，括號中的2，是將數組設為二維(2 dimentions)座標(有(X,Y)，並將座標限制在 [0, 1000) 的範圍內


# 將隨機點的座標保存到CSV文件中
df = pd.DataFrame(random_points, columns=['X', 'Y']) # pd.DataFrame() 函數將這兩個維度的數據組合成一個 DataFrame 並且此dataframe 被命名為df
df.to_csv('random_points.csv', index=False)

"""在 Pandas 中，DataFrame 的行索引是指每一行的標識符號，通常是從 0 開始的整數，也可以是自訂的標籤
默認情況下，當你將 DataFrame 寫入 CSV 文件時，行索引會被寫入到文件中
如果你希望不將行索引寫入到 CSV 文件中，你可以設置 index 參數為 False
為了避免將 DataFrame 的行索引寫入 CSV 文件時產生多餘的索引列
"""
# 將隨機點資料轉換為 NumPy 陣列
random_points_array = np.array(random_points)   # 因為 NearestNeighbors 類僅接受 NumPy 陣列輸入


# 初始化 NearestNeighbors 物件，設置要找尋的最近鄰居數量 k
nn = NearestNeighbors(n_neighbors=k)    # K=5 這邊K-Means 演算法將資料分為 5 個集群

# 將資料分配到 NearestNeighbors 物件中
nn.fit(random_points_array)

# 初始化新的空陣列，用於存儲每個點的平均移動向量
mean_movement_vectors = np.zeros_like(random_points_array)
num_iterations = num_points

# 初始化移動歷史記錄列表
movement_history = []

# 找到每個點的 k 個最近鄰居的索引和距離
distances, indices = nn.kneighbors(random_points_array)    
# distances 變數是一個陣列，包含每個點到其 k 個最近鄰居的距離，indices 變數是一個陣列，包含每個點的 k 個最近鄰居的索引。

# 初始化新的空陣列，用於存儲每個點的平均移動向量
mean_movement_vectors = np.zeros_like(random_points_array)
num_iterations = num_points

for _ in range(num_iterations):
    # 找到每個點的 k 個最近鄰居的索引和距離
    distances, indices = nn.kneighbors(random_points_array)
    
    # 計算平均移動向量
    for i in range(len(random_points_array)):
        neighbor_indices = indices[i]                        # 獲取第 i 個點的 k 個最近鄰居的索引
        neighbors = random_points_array[neighbor_indices]    # 獲取這些最近鄰居的座標
        mean_movement_vector = np.mean(neighbors, axis=0)    # 計算這些最近鄰居的平均座標，作為平均移動向量
        mean_movement_vectors[i] = mean_movement_vector      # 將計算出的平均移動向量存儲到對應的位置

    # 移動每個點
        movement_step_size = 0.1  # 移動步長
        random_points_array += movement_step_size * (mean_movement_vectors - random_points_array)


# 更新隨機點資料
df_updated = pd.DataFrame(random_points_array, columns=['X', 'Y'])

# 將更新後的隨機點資料寫入到 CSV 文件中
df_updated.to_csv('random_points_updated.csv', index=False)

plt.scatter(random_points_array[:, 0], random_points_array[:, 1], color='blue', label='Updated Points')
plt.title('Updated Random Points')
plt.xlabel('X')
plt.ylabel('Y')
plt.legend()
plt.grid(True)
plt.show()

#將每次迭代的移動過程記錄為 DataFrame，並將其寫入到名為 'movement_history.csv' 的 CSV 檔案中，以便後續分析和檢視。
movements = pd.DataFrame(movement_history, columns=['Point', 'Iteration', 'Distance', 'Mean Movement Vector'])
movements.to_csv('movement_history.csv', index=False)


