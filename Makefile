all:
	sbcl --noinform --load compile.lisp

livereload:
	browser-sync dist/ --files "index.html,script.js"
