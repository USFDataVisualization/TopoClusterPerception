import os
import random as r
import numpy as np
import pandas as pd
import time
import json

from scipy.io import loadmat
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE

import sklearn
import matplotlib.pyplot as plt
import multiprocessing

n_datasets = 1
#n_points = 70000


mnist = loadmat("mnist-original.mat")
X = mnist["data"].T / 25.0
y = mnist["label"][0]
print(X.shape, y.shape)


feat_cols = [ 'pixel'+str(i) for i in range(X.shape[1]) ]
df = pd.DataFrame(X, columns=feat_cols)
df['y'] = y
df['label'] = df['y'].apply(lambda i: str(i))

print('Size of the dataframe: {}'.format(df.shape))

data_subset = df[feat_cols].values

pca_50 = PCA(n_components=50)
pca_result_50 = pca_50.fit_transform(data_subset)
#pca_result_50[0] = pca_result_50[0][1:1000]
#pca_result_50[1] = pca_result_50[1][1:1000]
#pca_result_50 = pca_result_50[0:1000]
#print( pca_result_50.shape )


def __generate_tsne(jobID):
    print( "Starting Job " + str(jobID))
    



    for iter in range(1000):
        if not os.path.exists( "points/points" + str(iter*4+jobID) + ".json" ):
            print(str(iter*4+jobID))

            time_start = time.time()
            tsne = TSNE(n_components=2, verbose=1, perplexity=50, n_iter=300, random_state=(iter*4+jobID))
            tsne_pca_results = tsne.fit_transform(pca_result_50)
            print('t-SNE done! Time elapsed: {} seconds'.format(time.time()-time_start))

            xResult = tsne_pca_results[:,0]
            yResult = tsne_pca_results[:,1]

            #tsne_features = ['tsne-pca50-one', 'tsne-pca50-two','y']
            #df = df[tsne_features].copy()

            #n_clusters = len(df['y'].unique())
            #n_clusters = r.randint(4, n_clusters)
            #n_clusters=5

            #valid_labels = list(df['y'].unique())
            #r.shuffle(valid_labels)
            #valid_labels = valid_labels[:n_clusters]

            #label_mask = df.y.isin(valid_labels)
            #df_subset = df[label_mask].copy()
            #df_subset = df_subset.reset_index(drop=True)

            rndperm = np.random.permutation(xResult.shape[0])

            if not os.path.exists("points"):
                os.mkdir("points")

            with open("points/points" + str(iter*4+jobID) + ".json", "w") as outfile:
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
