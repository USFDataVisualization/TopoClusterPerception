import json
import sys

outdata = {}
for i in range( 1, len(sys.argv) ):
    with open(sys.argv[i]) as json_file:
        outdata[sys.argv[i]] = json.load(json_file)

print( json.dumps(outdata))
