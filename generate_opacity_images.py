import matplotlib.pyplot as plt

import json
import os

with open('data/mnist/pca.json') as json_file:
    data = json.load(json_file)

if not os.path.exists("demo/data/opacity"):
    os.mkdir("demo/data/opacity")

for opacity in range(1, 401):
    img_name = 'demo/data/opacity/opacity' + '_' + str(int(opacity)) + '.png'

    if not os.path.exists(img_name):
        print('Creating:', img_name)

        plt.figure(figsize=(7, 7))
        ax = plt.subplot(111)
        plt.axis('off')
        plt.scatter(data['x'], data['y'], s=7, alpha=opacity / 400, lw=0, color='black')
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        plt.xticks([])
        plt.yticks([])
        plt.setp(ax.get_xticklabels(), visible=False)
        plt.setp(ax.get_yticklabels(), visible=False)
        plt.savefig(img_name)
        plt.close()
