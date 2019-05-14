var YOURPODCASTS;
function loginFormSubmit() {
    if (!$('#email').val() || !$('#password').val()) {
        $('#auth-error').html('Please fill out both your username and password.');
        var status = true ? 'inherit' : 'none';
        $('#auth-error').css('display', status);
        __PS_MV_REG = [];
        return null;
    };
    var email = $('#email').val();
    var password = $('#password').val();
    var status1 = null ? 'inherit' : 'none';
    $('#auth-error').css('display', status1);
    $.ajax({ 'method' : 'POST',
             'contentType' : 'application/json',
             'url' : 'https://api.pocketcasts.com/user/login',
             'data' : '{ \"email\": \"' + email['toString']() + '\", \"password\": \"' + password['toString']() + '\"}',
             'success' : function (data, status, xhr) {
        localStorage.token = data['token'];
        adjustVisibility();
        __PS_MV_REG = [];
        return updatePodcasts();
    },
             'error' : function (jqxhr, textstatus, errormessage) {
        $('#auth-error').html('Incorrect login credentials. Please try harder.');
        var status = true ? 'inherit' : 'none';
        $('#auth-error').css('display', status);
        __PS_MV_REG = [];
        return console.log('FAIL', errormessage);
    }
           });
    $('#email').val('');
    $('#password').val('');
    $('#email').parent()['removeClass']('is-dirty');
    __PS_MV_REG = [];
    return $('#password').parent()['removeClass']('is-dirty');
};
function thumbnailUrl(uuid) {
    return 'https://static2.pocketcasts.com/discover/images/130/' + uuid + '.jpg';
};
function clearPodcastsList() {
    __PS_MV_REG = [];
    return $('#podcast-list').html('');
};
function addPodcast(id, name, thumbnail) {
    if (id === undefined) {
        id = -1;
    };
    if (name === undefined) {
        name = 'Untitled Podcast';
    };
    if (thumbnail === undefined) {
        thumbnail = 'https://placekitten.com/50/50';
    };
    var newItem = $('<div>');
    newItem['html']($('#TEMPLATE_list-item')['html']());
    newItem['appendTo']($('#podcast-list'));
    newItem['find']('meta[name=\'podcast-id\']')['attr']('value', id);
    newItem['find']('.podcast-name')['html'](name);
    newItem['find']('.podcast-thumbnail')['attr']('src', thumbnail);
    __PS_MV_REG = [];
    return newItem;
};
function adjustVisibility() {
    if (localStorage.token) {
        var status = null ? 'inherit' : 'none';
        $('#login-box').css('display', status);
        var status2 = true ? 'inherit' : 'none';
        $('#logout-button').css('display', status2);
        var status3 = true ? 'inherit' : 'none';
        $('#podcast-list').css('display', status3);
        var status4 = true ? 'inherit' : 'none';
        $('#bulk-header').css('display', status4);
        var status5 = true ? 'inherit' : 'none';
        __PS_MV_REG = [];
        return $('#header-sep').css('display', status5);
    } else {
        var status6 = true ? 'inherit' : 'none';
        $('#login-box').css('display', status6);
        var status7 = null ? 'inherit' : 'none';
        $('#logout-button').css('display', status7);
        var status8 = null ? 'inherit' : 'none';
        $('#podcast-list').css('display', status8);
        var status9 = null ? 'inherit' : 'none';
        $('#bulk-header').css('display', status9);
        var status10 = null ? 'inherit' : 'none';
        __PS_MV_REG = [];
        return $('#header-sep').css('display', status10);
    };
};
function updatePodcasts() {
    if (localStorage.token) {
        clearPodcastsList();
        __PS_MV_REG = [];
        return $.ajax({ 'method' : 'POST',
                        'contentType' : 'application/json',
                        'url' : 'https://api.pocketcasts.com/user/podcast/list',
                        'data' : '{ \"v\": 1 }',
                        'beforeSend' : function (xhr) {
            __PS_MV_REG = [];
            return xhr['setRequestHeader']('Authorization', 'Bearer ' + localStorage.token);
        },
                        'success' : function (data, status, xhr) {
            var podcasts11 = data.podcasts;
            YOURPODCASTS = podcasts11;
            for (var i in podcasts11) {
                var id = i;
                var podcast = podcasts11[i];
                var name = podcast.title;
                var thumb = thumbnailUrl(podcast.uuid);
                addPodcast(id, name, thumb);
            };
        },
                        'error' : function (jqxhr, textstatus, errormessage) {
            return console.log('FAIL', errormessage);
        }
                      });
    };
};
$(function () {
    updatePodcasts();
    adjustVisibility();
    $('#login-button').click(function () {
        __PS_MV_REG = [];
        return loginFormSubmit();
    });
    $('#email, #password').keypress(function (e) {
        __PS_MV_REG = [];
        return e.which === 13 ? loginFormSubmit() : null;
    });
    $('#logout-button').click(function () {
        localStorage['removeItem']('token');
        __PS_MV_REG = [];
        return adjustVisibility();
    });
    __PS_MV_REG = [];
    return $('#select-all-podcasts-container').click(function () {
        var isChecked = !$(this).hasClass('is-checked');
        var podcasts = $('#podcast-list').find('li').toArray();
        var _js13 = podcasts.length;
        for (var _js12 = 0; _js12 < _js13; _js12 += 1) {
            var podcast = podcasts[_js12];
            var podcastCheckbox = $(podcast).find('#podcast-checkbox-container');
            if (isChecked) {
                podcastCheckbox.addClass('is-checked');
            } else {
                podcastCheckbox.removeClass('is-checked');
            };
        };
    });
});
