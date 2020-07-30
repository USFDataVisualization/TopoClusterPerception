import os
import pandas as pd
import json

from scipy.io import loadmat
from sklearn.decomposition import PCA


mnist = loadmat("data/mnist/mnist-original.mat")

x = mnist["data"].T / 255.0
y = mnist["label"][0]
# print(x.shape, y.shape)

feat_cols = ['pixel' + str(i) for i in range(x.shape[1])]
df = pd.DataFrame(x, columns=feat_cols)
df['y'] = y
df['label'] = df['y'].apply(lambda i: str(i))
# print('Size of the dataframe: {}'.format(df.shape))

pca = PCA(n_components=2)
pca_result = pca.fit_transform(df[feat_cols].values)
df['pca-one'] = pca_result[:, 0]
df['pca-two'] = pca_result[:, 1]
# print('Explained variation per principal component: {}'.format(pca.explained_variance_ratio_))

with open("data/mnist/pca.json", "w") as outfile:
    json.dump({"x": df['pca-one'].tolist(), "y": df['pca-two'].tolist()}, outfile)

print("results written to data/mnist/pca.json")
