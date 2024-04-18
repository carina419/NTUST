import numpy as np  # 引入 NumPy 庫，用於數據處理
import matplotlib.pyplot as plt  # 引入 matplotlib 庫，用於數據可視化

class KMeans:
    def __init__(self, k, max_iters=100):
        """
        初始化 KMeans 物件。

        Args:
            k (int): 要分成的群數。
            max_iters (int): 最大迭代次數。
        """
        self.k = k  # 設置分群數量
        self.max_iters = max_iters  # 設置最大迭代次數

    def fit(self, data):
        """
        執行 KMeans 聚類。

        Args:
            data (ndarray): 要聚類的數據集。
        """
        # 初始化質心為隨機選取的 k 個點
        self.centroids = data[np.random.choice(data.shape[0], self.k, replace=False)]
        self.history = []  # 用於存儲每次迭代後的質心，以便後續繪圖比較

        for _ in range(self.max_iters):  # 開始迭代
            # 初始化每個群的點列表
            clusters = [[] for _ in range(self.k)]

            # 將每個點分配到最近的質心所屬的群
            for point in data:
                # 計算點與每個質心的距離
                distances = [np.linalg.norm(point - centroid) for centroid in self.centroids]  
                # 找到距離最近的質心的索引
                closest_cluster = np.argmin(distances)  
                # 將點分配到距離最近的質心所屬的群中
                clusters[closest_cluster].append(point)  

            # 更新質心為每個群的平均值
            new_centroids = [np.mean(cluster, axis=0) if cluster else centroid for centroid, cluster in zip(self.centroids, clusters)]
            # 如果新的質心和舊的質心相同，表示收斂，停止迭代
            if np.array_equal(self.centroids, new_centroids):
                break

            self.centroids = new_centroids
            self.history.append(self.centroids)  # 將更新後的質心添加到歷史記錄中

    def plot_clusters(self, data):
        """
        繪製分群結果。

        Args:
            data (ndarray): 要繪製的數據集。
        """
        # 創建一個新的圖形
        plt.figure(figsize=(12, 8))

        # 繪製未分群的數據
        plt.subplot(2, 1, 1)
        plt.scatter(data[:, 0], data[:, 1], color='gray', label='Unclustered Data')
        plt.title('Unclustered Data')
        plt.xlabel('X')
        plt.ylabel('Y')
        plt.legend()
        plt.grid(True)

        # 繪製分群後的結果
        plt.subplot(2, 1, 2)
        for i, centroid in enumerate(self.centroids):
            # 取得屬於該群的點
            cluster_data = np.array([point for point in data if np.argmin([np.linalg.norm(point - centroid) for centroid in self.centroids]) == i])
            plt.scatter(cluster_data[:, 0], cluster_data[:, 1], label=f'Cluster {i+1}')
        # 將質心繪製為黑色的 "x"
        plt.scatter([centroid[0] for centroid in self.centroids], [centroid[1] for centroid in self.centroids], color='black', marker='x', label='Centroids')
        plt.title('K-Means Clustering')
        plt.xlabel('X')
        plt.ylabel('Y')
        plt.legend()
        plt.grid(True)

        # 顯示圖形
        plt.tight_layout()
        plt.show()

def main():
    # 請求用戶輸入要隨機生成多少個點
    num_points = int(input("請輸入要隨機產生多少個點: "))
    # 在範圍[0, 1000)內產生隨機點
    data = np.random.rand(num_points, 2) * 1000  

    # 請求用戶輸入要分成幾個群
    k = int(input("請輸入要分成幾個群: "))

    # 創建 KMeans 物件並進行分群
    kmeans = KMeans(k)
    kmeans.fit(data)

    # 繪製分群結果
    kmeans.plot_clusters(data)

if __name__ == "__main__":
    main()