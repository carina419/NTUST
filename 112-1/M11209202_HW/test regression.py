import pandas as pd
from scipy.optimize import curve_fit
import numpy as np

#step1載入資料
# 從 CSV 文件中讀取數據
data = pd.read_csv('data.csv')

# 確認數據格式和列名
print(data.head())

#step2 設置指數模型 y = α * e^(β * x)，其中 β < 0
# 定義指數函數模型
def exponential_func(x, alpha, beta):
    return alpha * np.exp(beta * x)

# 提取輸入和輸出
x_data = data['input']
y_data = data['output']

# 使用 curve_fit 適應指數模型
popt, pcov = curve_fit(exponential_func, x_data, y_data)

# 提取最佳 α 和 β
alpha_optimal, beta_optimal = popt
print(f"Optimal parameters: alpha = {alpha_optimal}, beta = {beta_optimal}")

# 評估回歸模型評估其預測值與實際值的差異
# 計算指數回歸模型的預測值
y_pred_exponential = exponential_func(x_data, alpha_optimal, beta_optimal)

# 計算預測誤差
mse_exponential = np.mean((y_data - y_pred_exponential) ** 2)
print(f"Mean Squared Error (Exponential Regression): {mse_exponential}")
