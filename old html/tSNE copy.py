import os
import random as r
import numpy as np
import pandas as pd
import time

from scipy.io import loadmat
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE

import matplotlib.pyplot as plt


with open('points/points.json') as json_file:
    data = json.load(json_file)

rndperm = np.random.permutation(len(data['x']))

for n_points in [500, 2500, 12500]:  ##[70000]

    subset_x = [data['x'][i] for i in rndperm[0:n_points]]
    subset_y = [data['y'][i] for i in rndperm[0:n_points]]

    with open("points/points_" + str(n_points) + ".json", "w") as outfile:
        json.dump({"x": subset_x, "y": subset_y}, outfile)

    img_name = 'points/points_' + str(n_points) + '.png'
    print('Creating:', img_name)

    plt.figure(figsize=(7, 7))
    ax = plt.subplot(111)
    plt.axis('off')
    plt.scatter(subset_x, subset_y, s=p_size, alpha=opacity, lw=0, color='black')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    plt.xticks([])
    plt.yticks([])
    plt.setp(ax.get_xticklabels(), visible=False)
    plt.setp(ax.get_yticklabels(), visible=False)
    plt.savefig(img_name)
    plt.close()
