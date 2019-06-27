all:
	sbcl --noinform --load compile.lisp

livereload:
	browser-sync dist/ --files "docs/index.html,docs/script.js"
