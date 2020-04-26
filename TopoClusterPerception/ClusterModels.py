import math
from TopoClusterPerception.MergeTree import MergeTree
import matplotlib.pyplot as plt

class ClusterModel:
    """class that holds a cluster model"""
    def __init__(self, points, edges):
        self.mt = MergeTree( points, edges )

    #
    #
    # Calculate the number of clusters at a given threshold
    def get_cluster_count_at_threshold(self, threshold):

        subset = list(filter( (lambda h: h['persistence'] > threshold), self.mt.h0 ) )
        return len( subset )

    #
    #
    # Calculate the threshold for a given number of clusters
    def get_threshold_at_cluster_count(self, clusters):
        if clusters == len( self.mt.h0):
            return 0, self.mt.h0[0]['persistence']
        return self.mt.h0[-clusters-1]['persistence'], self.mt.h0[-clusters]['persistence']

    #
    #
    # Plot the threshold against the number of clusters
    def threshold_plot(self):
        clusters = [len(self.mt.h0)]
        threshold = [0]
        for h in range( len(self.mt.h0)-1 ):
            m = self.mt.h0[h]
            clusters.append(clusters[-1])
            clusters.append(clusters[-1] - 1)
            threshold.append(m['persistence'])
            threshold.append(m['persistence'])

        threshold.append( math.inf )
        clusters.append(1)

        return threshold, clusters


def distance_model( points ):
    edges = []
    for i in range(0, len(points)):
        for j in range(i + 1, len(points)):
            dx = points[i]['data'][0] - points[j]['data'][0]
            dy = points[i]['data'][1] - points[j]['data'][1]
            edges.append({'p0': points[i], 'p1': points[j], 'time': math.sqrt(dx * dx + dy * dy)})

    return ClusterModel(points, edges)


def density_model( bins ):

    w = len(bins)
    h = len(bins[0])
    res = [w,h]
    points = []
    points2d = [[None for i in range(res[1])] for j in range(res[0])]
    cur_idx = 0
    for i in range(w):
        for j in range(h):
            d = {'data': [i, j], 'time': bins[i][j], 'index': cur_idx}
            points2d[i][j] = d
            points.append(d)
            cur_idx += 1

    edges = []
    for i in range(0, w):
        for j in range(0, h):
            if i < w-1:
                edges.append({'p0': points2d[i][j], 'p1': points2d[i + 1][j]})
            if j < h-1:
                edges.append({'p0': points2d[i][j], 'p1': points2d[i][j+1]})
            if i < w-1 and j < h-1:
                edges.append({'p0': points2d[i][j], 'p1': points2d[i+1][j+1]})
            if i < w-1 and j > 0:
                edges.append({'p0': points2d[i][j], 'p1': points2d[i+1][j-1]})

    for e in edges:
        e['time'] = max(e['p0']['time'], e['p1']['time'])

    return ClusterModel(points, edges)


def histogram( img_data, bin_res=[20,20] ):

    bins = [[0 for i in range(bin_res[1])] for j in range(bin_res[0])]
    binN = [[0 for i in range(bin_res[1])] for j in range(bin_res[0])]

    for i in range(len(img_data)):
        bx = int(i * bin_res[0] / len(img_data))
        for j in range(len(img_data[i])):
            by = int(j * bin_res[1] / len(img_data[i]))
            val = sum(img_data[i][j]) / len(img_data[i][j])
            bins[bx][by] += val
            binN[bx][by] += 1

    for bx in range(bin_res[0]):
        for by in range(bin_res[1]):
            bins[bx][by] /= binN[bx][by]

    return bins
