all:
	sbcl --noinform --load compile.lisp

livereload:
	browser-sync dist/ --files "dist/index.html,dist/script.js"
