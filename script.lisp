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
     ((@ ,item css) "display" status)))

(defmacro $append (sel item)
  `($prop ($ ,sel) "append" ,item))

(defmacro $click (item &body body)
  `((@ ,item click) (lambda () ,@body)))

;; (defmacro $click (item &body body)
;;   `($prop ,item "click"
;;           (lambda () ,@body)))

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
                              (@ data "token"))
                        (adjust-visibility)
                        (update-podcasts))
            "error" (lambda (jqXhr textStatus errorMessage)
                      ((@ ($ "#auth-error") html) "Incorrect login credentials. Please try harder.")
                      ($display ($ "#auth-error") t)
                      (chain console (log "FAIL" errorMessage))))))

(defun login-form-submit ()
  (when (or (not ((@ ($ "#email") val)))
            (not ((@ ($ "#password") val))))
    ((@ ($ "#auth-error") html) "Please fill out both your username and password.")
    ($display ($ "#auth-error") t)
    (return))

  (let ((email ((@ ($ "#email") val)))
        (password ((@ ($ "#password") val))))
    ($display ($ "#auth-error") nil)

    (login email
           password)

    ((@ ($ "#email") val) "")
    ((@ ($ "#password") val) "")
    ((chain ($ "#email") (parent) "removeClass") "is-dirty")
    ((chain ($ "#password") (parent) "removeClass") "is-dirty")))

(defun thumbnail-url (uuid)
  (concatenate 'string
               "https://static2.pocketcasts.com/discover/images/130/"
               uuid
               ".jpg"))

(defun clear-podcasts-list ()
  ((@ ($ "#podcast-list") html) ""))

(defun add-podcast (&optional
                      (uuid -1)
                      (name "Untitled Podcast")
                      (thumbnail "https://placekitten.com/50/50"))
  (let ((new-item ($ "<div>")))
    ($prop new-item "html" (template-html "list-item"))
    ((@ new-item "appendTo") ($ "#podcast-list"))
    ($attr ($prop new-item "find" "meta[name='podcast-id']") "value" uuid)
    ($attr ($prop new-item "find" "#podcast-checkbox-container") "for" (concatenate 'string
                                                                                    "podcast-"
                                                                                    uuid
                                                                                    "-checkbox"))
    ($attr ($prop new-item "find" "#podcast-checkbox") "id" (concatenate 'string
                                                                          "podcast-"
                                                                          uuid
                                                                          "-checkbox"))
    ($prop ($prop new-item "find" ".podcast-name") "html" name)
    ($attr ($prop new-item "find" ".podcast-thumbnail") "src" thumbnail)

    new-item))

(defun adjust-visibility ()
  (if (@ local-storage token)
      (progn
        ($display ($ "#login-box") nil)
        ($display ($ "#screenshot") nil)
        ($display ($ "#logout-button") t)
        ($display ($ "#podcast-list") t)
        ($display ($ "#bulk-header") t)
        ($display ($ "#header-sep") t))
      (progn
        ($display ($ "#login-box") t)
        ($display ($ "#screenshot") t)
        ($display ($ "#logout-button") nil)
        ($display ($ "#podcast-list") nil)
        ($display ($ "#bulk-header") nil)
        ($display ($ "#header-sep") nil))))

(defun get-selected-podcasts ()
  (loop for ticked in
       (chain ($ "#podcast-list") (find "input:checked") (to-array))
       collect (chain ($ ticked) (parent) (parent))))

(defun event--checkbox-ticked ()
  (let ((podcasts-checked (chain ($ "#podcast-list") (find "input:checked") (to-array) length)))
    (if (> podcasts-checked 0)
        (chain ($ "#mass-actions") (css "opacity" "1"))
        (chain ($ "#mass-actions") (css "opacity" "0")))))

(defun api-request (url &key
                          (method "GET")
                          (data (create))
                          (success (lambda (data status xhr)))
                          (error (lambda (jqXhr textStatus errorMessage))))
  (when (@ local-storage token)
    (setf (@ data "v") 1)
    (chain $ (ajax (create
                    "method" method
                    "contentType" "application/json"
                    "url" url
                    "data" (chain *json* (stringify data))
                    "beforeSend" (lambda (xhr)
                                   ((@ xhr "setRequestHeader")
                                    "Authorization"
                                    (+ "Bearer "
                                       (@ local-storage token))))

                    "success" success
                    "error" error)))))

(defun update-podcasts ()
  (clear-podcasts-list)
  (api-request "https://api.pocketcasts.com/user/podcast/list"
               :method "POST"
               :success (lambda (data status xhr)
                          (let ((podcasts (@ data podcasts)))
                            (setq *your-podcasts* podcasts)
                            (for-in (i podcasts)
                                    (let* ((podcast (elt podcasts i))
                                           (uuid (@ podcast uuid))
                                           (name (@ podcast title))
                                           (thumb (thumbnail-url (@ podcast uuid))))
                                      (add-podcast uuid
                                                   name
                                                   thumb)))

                            ;;; Unsubscribe button clicked
                            ($click ($ ".podcast-subscribe-button")
                                    (chain console (log "hhh"))
                                    (let ((unsubscribe-action (chain ($ this) (has-class "red")))
                                          (uuid (chain ($ this) (parent) (parent) (find "meta[name='podcast-id']") (attr "value"))))
                                      (if unsubscribe-action
                                          (unsubscribe-podcast uuid)
                                          (subscribe-podcast uuid))
                                      ))

                            ;;; Checkbox event
                            (chain ($ "input[type=\"checkbox\"]") (change
                                                        (lambda ()
                                                          (event--checkbox-ticked))))))


               :error (lambda (jqXhr textStatus errorMessage)
                        (chain console (log "FAIL" errorMessage)))))

(defun update-sub-button-state (subscribed uuid)
  (loop for li in (chain ($ "#podcast-list") (find ".row") (to-array)) do
       (let ((cur-uuid (chain ($ li) (find "meta[name='podcast-id']") (attr "value"))))
         (when (eq cur-uuid uuid)
           (if subscribed
               (progn
                 (chain ($ li) (find ".podcast-subscribe-button") (text "Unsubscribe"))
                 (chain ($ li) (find ".podcast-subscribe-button") (add-class "red")))
               (progn
                 (chain ($ li) (find ".podcast-subscribe-button") (text "Subscribe"))
                 (chain ($ li) (find ".podcast-subscribe-button") (remove-class "red"))))
           ))))

(defun unsubscribe-podcast (uuid)
  (api-request "https://api.pocketcasts.com/user/podcast/unsubscribe"
               :method "POST"
               :data (create "uuid" uuid)
               :success (lambda (data status xhr)
                          (update-sub-button-state nil uuid))
               :error (lambda (jqXhr textStatus errorMessage)
                        (chain console (log "FAILURE to del")))))

(defun subscribe-podcast (uuid)
  (api-request "https://api.pocketcasts.com/user/podcast/subscribe"
               :method "POST"
               :data (create "uuid" uuid)
               :success (lambda (data status xhr)
                          (update-sub-button-state t uuid))
               :error (lambda (jqXhr textStatus errorMessage)
                        (chain console (log "FAILURE to del")))))


($init (update-podcasts)
       (adjust-visibility)

       ($click ($ "#login-button")
               (login-form-submit))

       (chain ($ "#email, #password")
              (keypress
               (lambda (e)
                 (when (eq (@ e which) 13)
                   (login-form-submit)))))

       ($click ($ "#logout-button")
               ((@ local-storage "removeItem") "token")
               (adjust-visibility))

       ($click ($ "#select-all-podcasts")
               (var is-checked
                    (chain ($ this) (is ":checked")))

               (let ((podcasts (chain ($ "#podcast-list")
                                      (find ".row")
                                      (to-array))))

                 (loop for podcast in podcasts do
                      (let ((podcast-checkbox
                             (chain ($ podcast)
                                    (find "input[type=\"checkbox\"]"))))
                        (if is-checked
                            (chain podcast-checkbox (prop "checked" true))
                            (chain podcast-checkbox (prop "checked" false)))))
                 (adjust-visibility)))

       ($click ($ "#podcast-unsubscribe-selected-button")
               (loop for podcast in (get-selected-podcasts)
                  do (unsubscribe-podcast
                      (chain ($ podcast) (find "meta[name='podcast-id']") (attr "value")))))

       ($click ($ "#podcast-subscribe-selected-button")
               (loop for podcast in (get-selected-podcasts)
                  do (subscribe-podcast
                      (chain ($ podcast) (find "meta[name='podcast-id']") (attr "value"))))))
