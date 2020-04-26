import math
from operator import itemgetter
from TopoClusterPerception.DisjointSet import DisjointSet


class MergeTree:
    """class that holds a merge tree"""

    def __init__(self, points, edges):

        self.h0 = {}
        for p in points:
            self.h0[p['index']] = {'index': p['index'], 'data': p, 'life': [p['time'], math.inf],
                                   'persistence': math.inf}

        djs = DisjointSet()
        edges.sort(key=itemgetter('time'))

        for d in edges:
            i0, i1 = d['p0']['index'], d['p1']['index']
            f0, f1 = djs.find(i0), djs.find(i1)
            if f0 != f1:

                #print( str(self.h0[f0]['life'][0]) + " " + str(self.h0[f1]['life'][0]) )
                if self.h0[f0]['life'][0] < self.h0[f1]['life'][0]:
                    djs.union(f1, f0)
                    self.h0[f1]['life'][1] = d['time']
                    self.h0[f1]['persistence'] = self.h0[f1]['life'][1] - self.h0[f1]['life'][0]
                else:
                    djs.union(f0, f1)
                    self.h0[f0]['life'][1] = d['time']
                    self.h0[f0]['persistence'] = self.h0[f0]['life'][1] - self.h0[f0]['life'][0]

                #print( str(self.h0[djs.find(i0)]['life'][0]) )
                #print( self.h0[f0] )
                #print( self.h0[f1] )

        self.h0 = list(map((lambda h: self.h0[h]),self.h0.keys()))
        # self.h0 = list(map((lambda h: {'index': h, 'life': self.h0[h]['life'], 'data': self.h0[h]['data'],
        #                                'persistence': (self.h0[h]['life'][1] - self.h0[h]['life'][0])}),
        #                    self.h0.keys()))
        self.h0 = list(filter((lambda h: h['persistence'] > 0), self.h0))
        self.h0.sort(key=itemgetter('persistence'))
