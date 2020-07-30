import os
import random as r
import numpy as np
import pandas as pd
import time
import json

from scipy.io import loadmat
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE

import matplotlib.pyplot as plt
import multiprocessing



for i in range(4001):
    if os.path.exists( "points/points" + str(i) + ".json" ):
    # and not os.path.exists( "points/points" + str(i) + ".png" ):
        with open("points/points" + str(i) + ".json") as json_file:
            data = json.load(json_file)

        rndperm = np.random.permutation(len(data['x']))

        for n_points in range(500,12500,500): # [500, 2500, 12500]:  ##[70000]
            #for opacity in range(1, 401):
            subset_x = [data['x'][i] for i in rndperm[0:n_points]]
            subset_y = [data['y'][i] for i in rndperm[0:n_points]]

            img_name = "points/points" + str(i) + '_' + str(n_points) + '.png'
            print('Creating:', img_name)

            plt.figure(figsize=(7, 7))
            ax = plt.subplot(111)
            plt.axis('off')
            # plt.scatter(data['x'], data['y'], s=7, alpha=1, lw=0, color='black')
            plt.scatter(subset_x, subset_y, s=7, alpha=1, lw=0, color='black')
            ax.spines['top'].set_visible(False)
            ax.spines['right'].set_visible(False)
            plt.xticks([])
            plt.yticks([])
            plt.setp(ax.get_xticklabels(), visible=False)
            plt.setp(ax.get_yticklabels(), visible=False)
            plt.savefig(img_name)
            plt.close()


