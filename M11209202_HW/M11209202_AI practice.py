import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from sklearn.neighbors import NearestNeighbors

# 生成隨機點集
num_points = 100
random_points = np.random.rand(num_points, 2) * 1000
random_points_index = np.arange(num_points)
original_coordinates = random_points.copy()

# 初始化 NearestNeighbors 物件
k = 5
nn = NearestNeighbors(n_neighbors=k)
nn.fit(random_points)

# 初始化畫布
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
        text.set_text("Done!")
        print("序號\t原始座標\t移動距離\t最後座標")
        for i in range(num_points):
            distance = np.linalg.norm(original_coordinates[i] - random_points[i])
            print(f"{i+1}\t{original_coordinates[i]}\t{distance}\t{random_points[i]}")
        ani.event_source.stop()  # 停止動畫
        return
    #μ=1/K ∑_(k=1)^K▒x_k .
    distances, indices = nn.kneighbors(random_points)

    """點的移動距離根據其K個(這邊預設k=5)最近鄰居的質心和自身當前位置之間的差距計算的。
        每個點的移動距離可以通過以下步驟計算：
        找到每個點的K個最近鄰居。
        計算這K個最近鄰居的平均位置，即質心。
        計算每個點與質心之間的差距。
        將每個點沿著與質心之間的差距方向移動一小步，步長由參數movement_step_size控制。
    """ 
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

# 創建動畫
ani = FuncAnimation(fig, update, frames=num_iterations+10, interval=200)
plt.show()