all:
	sbcl --noinform --load compile.lisp

livereload:
	browser-sync docs/ --files "docs/index.html,docs/script.js"
