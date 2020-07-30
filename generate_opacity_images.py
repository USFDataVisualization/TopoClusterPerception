import matplotlib.pyplot as plt

import json

with open('dataset/opacity/opacity.json') as json_file:
    data = json.load(json_file)

for opacity in range(1, 401):
    img_name = 'dataset/opacity/opacity' + '_' + str(int(opacity)) + '.png'
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
