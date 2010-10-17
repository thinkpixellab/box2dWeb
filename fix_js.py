#!/usr/bin/env python

from _tools.fixjsstyle import *

fix_js_style('js', ['jquery-1.4.2.min.js', 'deps.js', 'compiled.js'], ['closure-library', 'externs'])
