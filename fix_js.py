#!/usr/bin/env python

from _tools.fixjsstyle import *

fix_js_style('js', ['deps.js', 'compiled.js'], ['closure-library', 'externs'])
