import random
import matplotlib.pyplot as plt
import TopoClusterPerception.ClusterModels as ClusterModels


testDistThreshold = 91
testClusterCount = 7

points = []

area = testDistThreshold * testDistThreshold / 4

for i in range(0, 12):
    points.append({ 'index': i, 'data':[random.uniform(100, 500), random.uniform(100, 500)], 'time':0} )

mt = ClusterModels.distance_model(points)

print()
print("Cluster count by threshold")
print("t=" + str(testDistThreshold) + " -> " + str(mt.get_cluster_count_at_threshold(testDistThreshold)))
print()
print("Threshold by cluster count")
print("c=" + str(1) + " -> " + str(mt.get_threshold_at_cluster_count(1)))
print("c=" + str(testClusterCount) + " -> " + str(mt.get_threshold_at_cluster_count(testClusterCount)))
print()

dmin, dmax = mt.get_threshold_at_cluster_count(testClusterCount)

thrshold = (dmax + dmin) / 2

area = thrshold * thrshold / 4

x = list(map((lambda p: p['data'][0]), points))
y = list(map((lambda p: p['data'][1]), points))
r = list(map((lambda p: area), points))

plt.figure(1)
plt.scatter(x, y, s=r)
plt.scatter(x, y, c='black')
plt.axis([0, 600, 0, 600])
plt.suptitle('Plot of input points (black) with threshold t=' + ('%.2f' % thrshold) + " c=" + str(testClusterCount))

plt.figure(2)
threshold, clusters = mt.threshold_plot()
threshold[-1] = threshold[-2]*1.1

plt.plot(threshold, clusters)
plt.xlabel('threshold')
plt.ylabel('cluster count')
plt.suptitle('Plot of threshold vs. cluster count')
plt.show()