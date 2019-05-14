(defvar *your-podcasts*)

(defmacro $init (&body body)
  `($ (lambda () ,@body)))

(defmacro $prop (item prop &body body)
  `((@ ,item ,prop) ,@body))

(defmacro $attr (item attribute value)
  `($prop ,item "attr" ,attribute ,value))

(defmacro $display (item visible)
  `(let ((status (if ,visible
                     "inherit"
                     "none")))
     (console.log "visibile is" ,visible)

     ((@ ,item css) "display" status)
     ))

(defmacro $append (sel item)
  `($prop ($ ,sel) "append" ,item))

(defmacro $click (item &body body)
  `($prop ,item "click"
          (lambda () ,@body)))

(defmacro template-html (name)
  `($prop ($ ,(concatenate 'string
                           "#TEMPLATE_"
                           name))
          "html"))

(defmacro $post (url args callback)
  `($.post ,url ,args ,callback "json"))

(defmacro login (email password)
  `((@ $ ajax) (create
            "method" "POST"
            "contentType" "application/json"
            "url" "https://api.pocketcasts.com/user/login"
            "data" (+ "{ \"email\": \""
                      ((@, email "toString"))
                      "\", \"password\": \""
                      ((@, password "toString"))
                      "\"}")
            "success" (lambda (data status xhr)
                        (setf (@ local-storage token)
                              (@ data "token")))
            "error" (lambda (jqXhr textStatus errorMessage)
                      (console.log "FAIL" errorMessage)))))

(defun thumbnail-url (uuid)
  (concatenate 'string
               "https://static2.pocketcasts.com/discover/images/130/"
               uuid
               ".jpg"))

(defun clear-podcasts-list ()
  ((@ ($ "#podcast-list") html) ""))

(defun add-podcast (&optional
                      (id -1)
                      (name "Untitled Podcast")
                      (thumbnail "https://placekitten.com/50/50"))
  (let ((new-item ($ "<div>")))
    ($prop new-item "html" (template-html "list-item"))
    ((@ new-item "appendTo") ($ "#podcast-list"))
    ($attr ($prop new-item "find" "meta[name='podcast-id']") "value" id)
    ($prop ($prop new-item "find" ".podcast-name") "html" name)
    ($attr ($prop new-item "find" ".podcast-thumbnail") "src" thumbnail)
    new-item))

(defun adjust-visibility ()
  (if (@ local-storage token)
      (progn
        ($display ($ "#login-box") nil)
        ($display ($ "#logout-button") t)
        ($display ($ "#podcast-list") t)
        ($display ($ "#bulk-header") t)
        ($display ($ "#header-sep") t))
      (progn
        ($display ($ "#login-box") t)
        ($display ($ "#logout-button") nil)
        ($display ($ "#podcast-list") nil)
        ($display ($ "#bulk-header") nil)
        ($display ($ "#header-sep") nil))))

(defun update-podcasts ()
  (when (@ local-storage token)
    (clear-podcasts-list)
    ($.ajax (create
             "method" "POST"
             "contentType" "application/json"
             "url" "https://api.pocketcasts.com/user/podcast/list"
             "data" "{ \"v\": 1 }"
             "beforeSend" (lambda (xhr)
                            ((@ xhr "setRequestHeader")
                             "Authorization"
                             (+ "Bearer "
                                (@ local-storage token))))

             "success" (lambda (data status xhr)
                         (let ((podcasts (@ data podcasts)))
                           (setq *your-podcasts* podcasts)
                           (for-in (i podcasts)
                                   (let* ((id i)
                                          (podcast (elt podcasts i))
                                          (name (@ podcast title))
                                          (thumb (thumbnail-url (@ podcast uuid))))
                                     (add-podcast id
                                                  name
                                                  thumb)))))


             "error" (lambda (jqXhr textStatus errorMessage)
                       (console.log "FAIL" errorMessage))))))

($init (update-podcasts)
       (adjust-visibility))
