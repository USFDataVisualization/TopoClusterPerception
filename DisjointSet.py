

class DisjointSet:
    """class that holds a disjoint set"""

    def __init__(self, items=[]) -> None:
        self._data = dict()
        for item in items:
            self._data[item] = item

    def contains(self, item) -> bool:
        return item in self._data

    def put(self, item):
        self._data[item] = item

    def find(self, item):
        if item not in self._data:
            self._data[item] = item
        elif item != self._data[item]:
            self._data[item] = self.find( self._data[item] )
        return self._data[item]

    def union(self, item0, item1) -> None:
        parent0, parent1 = self.find(item0), self.find(item1)
        self._data[parent0] = parent1
        return parent1

