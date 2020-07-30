import json
import sys
import ntpath

outdata = {}
for i in range(1, len(sys.argv)):
    with open(sys.argv[i]) as json_file:
        outdata[ntpath.basename(sys.argv[i])] = json.load(json_file)

print(json.dumps(outdata))
