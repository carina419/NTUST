import pandas as pd # type: ignore
from sklearn.manifold import TSNE # type: ignore
import matplotlib.pyplot as plt # type: ignore

# 讀取 iris 數據集
data = pd.read_csv(r'C:\NTUST\112-2\MI5118701 人工智慧技術與商業應用\iris.csv')


# 提取特徵和標籤
features = data.iloc[:, :-1].values
labels = data.iloc[:, -1].values

# 使用 t-SNE 進行降維
tsne = TSNE(n_components=2, random_state=0)
tsne_results = tsne.fit_transform(features)

# 將 t-SNE 結果轉換為 DataFrame
tsne_df = pd.DataFrame(tsne_results, columns=['Dimension 1', 'Dimension 2'])
tsne_df['Label'] = labels

# 顏色字典
colors = {'setosa': 'red', 'versicolor': 'green', 'virginica': 'blue'}

# 繪製 t-SNE 結果
plt.figure(figsize=(10, 8))

for label in tsne_df['Label'].unique():
    subset = tsne_df[tsne_df['Label'] == label]
    plt.scatter(subset['Dimension 1'], subset['Dimension 2'], c=colors[label], label=label)

plt.legend()
plt.title('t-SNE visualization of Iris dataset')
plt.xlabel('Dimension 1')
plt.ylabel('Dimension 2')
plt.savefig('iris_tsne_visualization.png')
plt.show()
