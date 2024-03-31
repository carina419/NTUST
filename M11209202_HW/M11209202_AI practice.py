import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from sklearn.neighbors import NearestNeighbors

# 生成隨機點集
num_points = 100
random_points = np.random.rand(num_points, 2) * 1000
random_points_index = np.arange(num_points)
original_coordinates = random_points.copy()

# 顯示為迭代前的隨機圖，方便後續做比較
plt.figure(figsize=(8, 6))
plt.scatter(random_points[:, 0], random_points[:, 1], c=random_points_index, cmap='viridis')
plt.title('Initial Random Points M11209202')
text = plt.text(0.5, 0.5, '', horizontalalignment='center', verticalalignment='center', transform=plt.transAxes)
text.set_text("Iteration = 0 ,Are you ready? ")
text.set_text("saving the initial random points image before the iteration starts:")
plt.xlabel('X')
plt.ylabel('Y')
plt.grid(True)
plt.show()

# 初始化 NearestNeighbors 物件
k = 5
nn = NearestNeighbors(n_neighbors=k)
nn.fit(random_points)

# 初始化動畫
fig, ax = plt.subplots()
scatter = ax.scatter(random_points[:, 0], random_points[:, 1], c=random_points_index, cmap='viridis')
ax.set_title('Updated Random Points M11209202')
ax.set_xlabel('X')
ax.set_ylabel('Y')
text = ax.text(0.5, 0.5, '', horizontalalignment='center', verticalalignment='center', transform=ax.transAxes)
ax.grid(True)

# 更新函數
mean_movement_vectors = np.zeros_like(random_points)
movement_history = []
num_iterations = 100

def update(frame):
    global random_points
    global movement_history
        
    if frame >= num_iterations:
        print("Iteration reached 100. Stopping animation.")
        text.set_text("Iteration =100 ,Done! ")
        ani.event_source.stop()  # 停止動畫
        return
    
    distances, indices = nn.kneighbors(random_points)

    for i in range(len(random_points)):
        neighbor_indices = indices[i]
        neighbors = random_points[neighbor_indices]
        
        # 計算鄰居的質心
        mean_movement_vector = np.mean(neighbors, axis=0)
        mean_movement_vectors[i] = mean_movement_vector

    movement_step_size = 0.01
    # 將粒子向鄰居質心移動
    # x' = x + ϵ(μ - x)
    random_points += movement_step_size * (mean_movement_vectors - random_points)
    movement_history.append(random_points.copy())
    
    scatter.set_offsets(random_points)
    text.set_text(f"Iteration: {frame+1}")
    
    if (frame + 1) % 10 == 0:  # 每10個迭代列印一次
        print(f"Iteration: {frame+1}")
        print("序號\t原始座標\t\t移動距離\t\t最後座標")
        for i in range(num_points):
            distance = np.linalg.norm(original_coordinates[i] - random_points[i])
            print(f"{i+1}\t{original_coordinates[i]}\t{distance}\t{random_points[i]}")
        print()

# 創建動畫
ani = FuncAnimation(fig, update, frames=num_iterations+10, interval=200)
plt.show()