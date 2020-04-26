import matplotlib.image as mpimg
import matplotlib.pyplot as plt
import TopoClusterPerception.ClusterModels as ClusterModels
import argparse
import json
import time

# setup argument parser
parser = argparse.ArgumentParser(description='Process some integers.')
parser.add_argument('--histogram_res_x', metavar='X', type=int, nargs=1, required=True, help='x resolution of density plot')
parser.add_argument('--histogram_res_y', metavar='Y', type=int, nargs=1, required=True, help='y resolution of density plot')
parser.add_argument('--input', metavar='FILE', type=str, nargs=1, required=True, help='input image')
parser.add_argument('--show_plot', type=bool, default=False, help='show the threshold vs clusters plot')

args = parser.parse_args()

# Set grid resolution
res = [args.histogram_res_x[0], args.histogram_res_y[0]]

# Read Images
time_1 = time.time_ns()
img = mpimg.imread(args.input[0])

# Build histograms
time_2 = time.time_ns()
bins = ClusterModels.histogram(img, res)
mpimg.imsave(args.input[0] + ".hist.png", bins, cmap='Greys_r')

# Build model
time_3 = time.time_ns()
mt = ClusterModels.density_model(bins)
#print( json.dumps( mt.mt.h0, indent=2) )

# Plot the result
time_4 = time.time_ns()
threshold, clusters = mt.threshold_plot()
time_5 = time.time_ns()

if args.show_plot:
    threshold[-1] = threshold[-2] * 1.1

    plt.plot(threshold, clusters)
    plt.xlabel('threshold')
    plt.ylabel('cluster count')
    plt.suptitle('Plot of threshold vs. cluster count')
    plt.show()
else:
    threshold[-1] = 'inf'
    info = {'datafile': args.input[0],
            'histogram resolution': res,
            'time_load (ms)': (time_2 - time_1)/1000000,
            'time histogram (ms)': (time_3 - time_2)/1000000,
            'time MT (ms)': (time_4 - time_3)/1000000}

    print(json.dumps({'info': info, 'threshold': threshold, 'clusters': clusters}, indent=2))
