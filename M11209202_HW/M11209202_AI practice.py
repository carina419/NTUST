import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import time
from matplotlib.animation import FuncAnimation
from sklearn.neighbors import NearestNeighbors

# 產生100個隨機點的座標
num_points = 100
random_points = np.random.rand(num_points, 2) * 1000

# 將隨機點資料轉換為 NumPy 陣列
random_points_array = np.array(random_points)

# 初始化 NearestNeighbors 物件，設置要找尋的最近鄰居數量 k
k = 5
nn = NearestNeighbors(n_neighbors=k)

# 將資料分配到 NearestNeighbors 物件中
nn.fit(random_points_array)

# 初始化新的空陣列，用於存儲每個點的平均移動向量
mean_movement_vectors = np.zeros_like(random_points_array)
num_iterations = 100

# 儲存移動歷史的DataFrame
movement_history = []

start_time = time.time()

# 初始化動畫時圖形元素
fig, ax = plt.subplots()
scatter = ax.scatter(random_points_array[:, 0], random_points_array[:, 1], c=np.arange(num_points), cmap='viridis', label='Updated Points')
ax.set_title('Updated Random Points')
ax.set_xlabel('X')
ax.set_ylabel('Y')
ax.legend()
ax.grid(True)

# 文字物件用於顯示迭代次數
text = ax.text(0.5, 0.5, '', horizontalalignment='center', verticalalignment='center', transform=ax.transAxes)

def update(frame):
    global random_points_array
    global movement_history

    # 如果已達到指定迭代次數，停止更新
    if frame >= num_iterations:
        ani.event_source.stop()  # 停止動畫
        return

    # 找到每個點的 k 個最近鄰居的索引和距離
    distances, indices = nn.kneighbors(random_points_array)

    # 計算平均移動向量
    for i in range(len(random_points_array)):
        neighbor_indices = indices[i]
        neighbors = random_points_array[neighbor_indices]
        mean_movement_vector = np.mean(neighbors, axis=0)
        mean_movement_vectors[i] = mean_movement_vector

    # 移動每個點
    movement_step_size = 0.01  # 調整移動步長
    random_points_array += movement_step_size * (mean_movement_vectors - random_points_array)

    # 更新移動歷史
    movement_history.append(random_points_array.copy())

    # 更新點的位置
    scatter.set_offsets(random_points_array)

    # 更新迭代次數文字
    text.set_text(f"Iteration: {frame+1}")

    # 更新畫面
    fig.canvas.draw()
    fig.canvas.flush_events()

# 創建動畫
ani = FuncAnimation(fig, update, frames=num_iterations+10, interval=200)
plt.show()
