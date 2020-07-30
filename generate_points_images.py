import os
import numpy as np
import json


import matplotlib.pyplot as plt


with open("data/mnist/tsne0.json") as json_file:
    data = json.load(json_file)

if not os.path.exists("demo/data/points"):
    os.mkdir("demo/data/points")

rndperm = np.random.RandomState(seed=0).permutation(len(data['x']))

for n_points in range(500,70001,500):

    img_name = "demo/data/points/points" + '_' + str(n_points) + '.png'

    if not os.path.exists(img_name):
        print('Creating:', img_name)

        subset_x = [data['x'][i] for i in rndperm[0:n_points]]
        subset_y = [data['y'][i] for i in rndperm[0:n_points]]

        plt.figure(figsize=(7, 7))
        ax = plt.subplot(111)
        plt.axis('off')
        # plt.scatter(data['x'], data['y'], s=7, alpha=1, lw=0, color='black')
        plt.scatter(subset_x, subset_y, s=20, alpha=1, lw=0, color='black')
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        plt.xticks([])
        plt.yticks([])
        plt.setp(ax.get_xticklabels(), visible=False)
        plt.setp(ax.get_yticklabels(), visible=False)
        plt.savefig(img_name)
        plt.close()


