import os
import random as r
import numpy as np
import pandas as pd
import time


from scipy.io import loadmat
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE

import matplotlib.pyplot as plt

n_datasets = 1
#n_points = 70000


mnist = loadmat("dataset/mnist-original.mat")
X = mnist["data"].T / 25.0
y = mnist["label"][0]
print(X.shape, y.shape)

feat_cols = [ 'pixel'+str(i) for i in range(X.shape[1]) ]
df = pd.DataFrame(X, columns=feat_cols)
df['y'] = y
df['label'] = df['y'].apply(lambda i: str(i))
mnist, X, y = None, None, None
print('Size of the dataframe: {}'.format(df.shape))

data_subset = df[feat_cols].values

time_start = time.time()
pca_50 = PCA(n_components=50)
pca_result_50 = pca_50.fit_transform(data_subset)
tsne = TSNE(n_components=2, verbose=1, perplexity=50, n_iter=300)
tsne_pca_results = tsne.fit_transform(pca_result_50)
print('t-SNE done! Time elapsed: {} seconds'.format(time.time()-time_start))

df['tsne-pca50-one'] = tsne_pca_results[:,0]
df['tsne-pca50-two'] = tsne_pca_results[:,1]

tsne_features = ['tsne-pca50-one', 'tsne-pca50-two','y']
df = df[tsne_features].copy()

dataset_id = "{:03d}".format(idx)
dataset_directory = "dataset/"+dataset_id
point_directory = dataset_directory+"/points"
image_directory = dataset_directory+"/images"

os.mkdir(dataset_directory)
os.mkdir(point_directory)
os.mkdir(image_directory)

n_clusters = len(df['y'].unique())
#n_clusters = r.randint(4, n_clusters)
n_clusters=5

valid_labels = list(df['y'].unique())
r.shuffle(valid_labels)
valid_labels = valid_labels[:n_clusters]

label_mask = df.y.isin(valid_labels)
df_subset = df[label_mask].copy()
df_subset = df_subset.reset_index(drop=True)

rndperm = np.random.permutation(df_subset.shape[0])

if not os.path.exists("points"):
	os.mkdir("points")

with open("points/points.json", "w") as outfile:
	json.dump({"x": df['tsne-pca50-one'].tolist(), "y": df['tsne-pca50-two'].tolist()}, outfile)

for n_points in [500,2500,12500]:    ##[70000]
	df_subset = df_subset.loc[rndperm[:n_points],:].copy()

	sigma = 0

	output_name = '_'.join([
		str(dataset_id),
		str(n_clusters),
		str(n_points),
		str(sigma),
	])

#		with open(point_directory+'/'+output_name+'.csv', 'w') as f:
#			for row in df_subset.iterrows():
#				f.write(str(row[1]["tsne-pca50-one"])+', '+str(row[1]["tsne-pca50-two"])+'\n')


	for p_size in [7]:
		for opacity in [1.0]:

			img_name = output_name+'_'+str(p_size)+'_'+str(int(opacity*100))+'.png'
			print('Creating:',img_name)

			plt.figure(figsize=(7, 7))
			ax=plt.subplot(111)
			plt.axis('on')
			plt.scatter(df_subset["tsne-pca50-one"].values, df_subset["tsne-pca50-two"].values, s=p_size, alpha=opacity, lw=0,color='black')
			ax.spines['top'].set_visible(False)
			ax.spines['right'].set_visible(False)
			plt.xticks([])
			plt.yticks([])
			plt.setp( ax.get_xticklabels(), visible=False)
			plt.setp( ax.get_yticklabels(), visible=False)
			plt.savefig(image_directory+'/'+img_name)
			plt.close()
