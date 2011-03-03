#!/usr/bin/env python

from os import path
from _tools.Closure import Closure

js_path = "js"

closure_path = path.join(js_path, 'closure-library','closure')

js_dirs = map(lambda dir: path.join(js_path, dir), ['box2d','demo','pixelLab'])
application_js_path = path.join(js_path, 'application.js')
deps_js_path = path.join(js_path, "deps.js")
compiled_js_path = path.join(js_path, "compiled.js")

externs = [path.join(js_path, 'externs', 'jquery-1.5.js')]

Closure(
  closure_path = closure_path,
  application_js_path = application_js_path,
  root_symbol = None,
  closure_dependencies = js_dirs + [application_js_path],
  deps_js_path = deps_js_path,
  compiled_js_path = compiled_js_path,
  extern_files = externs
).build_and_process('index_source.html', 'index.html', debug = False, skip_build = False)
