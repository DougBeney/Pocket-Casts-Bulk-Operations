(ql:quickload "parenscript")

(defpackage :pocketcasts-batch
  (:use :cl :parenscript))

(in-package :pocketcasts-batch)

(with-open-file (stream "dist/script.js"
                     :direction :output
                     :if-exists :supersede
                     :if-does-not-exist :create)
  (format stream
          (ps-compile-file "script.lisp")))

;;; Exit the program
(uiop:quit)
