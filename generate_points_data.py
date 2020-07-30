import os
import pandas as pd
import time
import json

from scipy.io import loadmat
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE

import multiprocessing

mnist = loadmat("data/mnist/mnist-original.mat")

X = mnist["data"].T / 25.0
y = mnist["label"][0]
#print(X.shape, y.shape)

feat_cols = ['pixel' + str(i) for i in range(X.shape[1])]
df = pd.DataFrame(X, columns=feat_cols)
df['y'] = y
df['label'] = df['y'].apply(lambda i: str(i))
#print('Size of the dataframe: {}'.format(df.shape))

data_subset = df[feat_cols].values

pca_50 = PCA(n_components=50)
pca_result_50 = pca_50.fit_transform(data_subset)


def __generate_tsne(currJobID):
    print("Starting Job " + str(currJobID))

    for iter in range(5):
        if not os.path.exists("data/mnist/tsne" + str(iter * 4 + currJobID) + ".json"):
            print("Processing: " + str(iter * 4 + currJobID))

            time_start = time.time()
            tsne = TSNE(n_components=2, verbose=1, perplexity=50, n_iter=300, random_state=(iter * 4 + currJobID))
            tsne_pca_results = tsne.fit_transform(pca_result_50)
            print('t-SNE done! Time elapsed: {} seconds'.format(time.time() - time_start))

            xResult = tsne_pca_results[:, 0]
            yResult = tsne_pca_results[:, 1]

            with open("data/mnist/tsne" + str(iter * 4 + currJobID) + ".json", "w") as outfile:
                json.dump({"x": xResult.tolist(), "y": yResult.tolist()}, outfile)


jobs = []

# Create the processes
for jobID in range(4):
    jobs.append(multiprocessing.Process(target=__generate_tsne, args=[jobID]))

# Start the processes
for j in jobs:
    j.start()

# Ensure all of the processes have finished
for j in jobs:
    j.join()
