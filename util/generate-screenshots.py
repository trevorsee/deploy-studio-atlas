from __future__ import (absolute_import, division,
                        print_function, unicode_literals)

import os
import sys
import tempfile
import urltools
import json
import requests

# customize these if you want (pixels)
WIDTH = 1024
THUMB_WIDTH = 400

RATIO = 3 / 2
HEIGHT = int(WIDTH / RATIO)
ROOT = os.path.dirname(os.path.abspath(__file__))
# enable JS execution:
RASTERIZE_SCRIPT = "{root}/assets/rasterize.js".format(root=ROOT)
# disable JS execution:
RASTERIZE_NOJS_SCRIPT = "{root}/assets/rasterize-nojs.js".format(root=ROOT)
# raterize script to use
# default: JS enabled
RASTERIZE_SCRIPT_TO_USE = RASTERIZE_SCRIPT

r = requests.get('https://sheetlabs.com/DV/studiolist', auth=('tcarr@mica.edu', 't_9e773033c7352d4e31ca378e0dc8cae7'))
main = r.json()


def window_screenshot(url, fname):
    return 'phantomjs {rast} "{url}" {out} "{w}px*{h}px"'.format(
        rast=RASTERIZE_SCRIPT_TO_USE, url=url, out=fname,
        w=WIDTH, h=HEIGHT
    )


for i, studio in enumerate(main):
    url = studio['url']
    fname = urltools.parse(url).domain + ".png"

    if os.path.isfile(fname):
        print(fname+    ' already exists')
    else:
        # script
        tmp = tempfile.NamedTemporaryFile(dir='.').name + ".png"
        cmd = window_screenshot(url, tmp)
        print('#', cmd)
        os.system(cmd)
        cmd = "convert -resize {w} {tmp} {out}".format(
            w=THUMB_WIDTH, tmp=tmp, out=fname
            )
        print('#', cmd)
        os.system(cmd)
        print('# remove', tmp)
        os.unlink(tmp)
