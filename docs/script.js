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
function addPodcast(uuid, name, thumbnail) {
    if (uuid === undefined) {
        uuid = -1;
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
    newItem['find']('meta[name=\'podcast-id\']')['attr']('value', uuid);
    newItem['find']('#podcast-checkbox-container')['attr']('for', 'podcast-' + uuid + '-checkbox');
    newItem['find']('#podcast-checkbox')['attr']('id', 'podcast-' + uuid + '-checkbox');
    newItem['find']('.podcast-name')['html'](name);
    newItem['find']('.podcast-thumbnail')['attr']('src', thumbnail);
    __PS_MV_REG = [];
    return newItem;
};
function adjustVisibility() {
    if (localStorage.token) {
        var status = null ? 'inherit' : 'none';
        $('#login-box').css('display', status);
        var status2 = null ? 'inherit' : 'none';
        $('#screenshot').css('display', status2);
        var status3 = true ? 'inherit' : 'none';
        $('#logout-button').css('display', status3);
        var status4 = true ? 'inherit' : 'none';
        $('#podcast-list').css('display', status4);
        var status5 = true ? 'inherit' : 'none';
        $('#bulk-header').css('display', status5);
        var status6 = true ? 'inherit' : 'none';
        __PS_MV_REG = [];
        return $('#header-sep').css('display', status6);
    } else {
        var status7 = true ? 'inherit' : 'none';
        $('#login-box').css('display', status7);
        var status8 = true ? 'inherit' : 'none';
        $('#screenshot').css('display', status8);
        var status9 = null ? 'inherit' : 'none';
        $('#logout-button').css('display', status9);
        var status10 = null ? 'inherit' : 'none';
        $('#podcast-list').css('display', status10);
        var status11 = null ? 'inherit' : 'none';
        $('#bulk-header').css('display', status11);
        var status12 = null ? 'inherit' : 'none';
        __PS_MV_REG = [];
        return $('#header-sep').css('display', status12);
    };
};
function getSelectedPodcasts() {
    __PS_MV_REG = [];
    return (function () {
        var _js13 = $('#podcast-list').find('input:checked').toArray();
        var _js15 = _js13.length;
        var collect16 = [];
        for (var _js14 = 0; _js14 < _js15; _js14 += 1) {
            var ticked = _js13[_js14];
            collect16.push($(ticked).parent().parent());
        };
        __PS_MV_REG = [];
        return collect16;
    })();
};
function eventcheckboxTicked() {
    var podcastsChecked = $('#podcast-list').find('input:checked').toArray().length;
    __PS_MV_REG = [];
    return podcastsChecked > 0 ? $('#mass-actions').css('opacity', '1') : $('#mass-actions').css('opacity', '0');
};
function apiRequest(url) {
    var _js18 = arguments.length;
    for (var n17 = 1; n17 < _js18; n17 += 2) {
        switch (arguments[n17]) {
        case 'method':
            method = arguments[n17 + 1];
            break;
        case 'data':
            data = arguments[n17 + 1];
            break;
        case 'success':
            success = arguments[n17 + 1];
            break;
        case 'error':
            error = arguments[n17 + 1];
        };
    };
    var method = 'undefined' === typeof method ? 'GET' : method;
    var data = 'undefined' === typeof data ? {  } : data;
    var success = 'undefined' === typeof success ? function (data, status, xhr) {
        return null;
    } : success;
    var error = 'undefined' === typeof error ? function (jqxhr, textstatus, errormessage) {
        return null;
    } : error;
    if (localStorage.token) {
        data['v'] = 1;
        return $.ajax({ 'method' : method,
                        'contentType' : 'application/json',
                        'url' : url,
                        'data' : JSON.stringify(data),
                        'beforeSend' : function (xhr) {
            __PS_MV_REG = [];
            return xhr['setRequestHeader']('Authorization', 'Bearer ' + localStorage.token);
        },
                        'success' : success,
                        'error' : error
                      });
    };
};
function updatePodcasts() {
    clearPodcastsList();
    __PS_MV_REG = [];
    return apiRequest('https://api.pocketcasts.com/user/podcast/list', 'method', 'POST', 'success', function (data, status, xhr) {
        var podcasts19 = data.podcasts;
        YOURPODCASTS = podcasts19;
        for (var i in podcasts19) {
            var podcast = podcasts19[i];
            var uuid20 = podcast.uuid;
            var name = podcast.title;
            var thumb = thumbnailUrl(podcast.uuid);
            addPodcast(uuid20, name, thumb);
        };
        $('.podcast-subscribe-button').click(function () {
            console.log('hhh');
            var unsubscribeAction = $(this).hasClass('red');
            var uuid = $(this).parent().parent().find('meta[name=\'podcast-id\']').attr('value');
            __PS_MV_REG = [];
            return unsubscribeAction ? unsubscribePodcast(uuid) : subscribePodcast(uuid);
        });
        __PS_MV_REG = [];
        return $('input[type=\"checkbox\"]').change(function () {
            __PS_MV_REG = [];
            return eventcheckboxTicked();
        });
    }, 'error', function (jqxhr, textstatus, errormessage) {
        return console.log('FAIL', errormessage);
    });
};
function updateSubButtonState(subscribed, uuid) {
    var _js20 = $('#podcast-list').find('.row').toArray();
    var _js22 = _js20.length;
    for (var _js21 = 0; _js21 < _js22; _js21 += 1) {
        var li = _js20[_js21];
        var curUuid = $(li).find('meta[name=\'podcast-id\']').attr('value');
        if (curUuid === uuid) {
            if (subscribed) {
                $(li).find('.podcast-subscribe-button').text('Unsubscribe');
                $(li).find('.podcast-subscribe-button').addClass('red');
            } else {
                $(li).find('.podcast-subscribe-button').text('Subscribe');
                $(li).find('.podcast-subscribe-button').removeClass('red');
            };
        };
    };
};
function unsubscribePodcast(uuid) {
    __PS_MV_REG = [];
    return apiRequest('https://api.pocketcasts.com/user/podcast/unsubscribe', 'method', 'POST', 'data', { 'uuid' : uuid }, 'success', function (data, status, xhr) {
        __PS_MV_REG = [];
        return updateSubButtonState(null, uuid);
    }, 'error', function (jqxhr, textstatus, errormessage) {
        return console.log('FAILURE to del');
    });
};
function subscribePodcast(uuid) {
    __PS_MV_REG = [];
    return apiRequest('https://api.pocketcasts.com/user/podcast/subscribe', 'method', 'POST', 'data', { 'uuid' : uuid }, 'success', function (data, status, xhr) {
        __PS_MV_REG = [];
        return updateSubButtonState(true, uuid);
    }, 'error', function (jqxhr, textstatus, errormessage) {
        return console.log('FAILURE to del');
    });
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
    $('#select-all-podcasts').click(function () {
        var isChecked = $(this).is(':checked');
        var podcasts = $('#podcast-list').find('.row').toArray();
        var _js24 = podcasts.length;
        for (var _js23 = 0; _js23 < _js24; _js23 += 1) {
            var podcast = podcasts[_js23];
            var podcastCheckbox = $(podcast).find('input[type=\"checkbox\"]');
            if (isChecked) {
                podcastCheckbox.prop('checked', true);
            } else {
                podcastCheckbox.prop('checked', false);
            };
        };
        __PS_MV_REG = [];
        return adjustVisibility();
    });
    $('#podcast-unsubscribe-selected-button').click(function () {
        var _js25 = getSelectedPodcasts();
        var _js27 = _js25.length;
        for (var _js26 = 0; _js26 < _js27; _js26 += 1) {
            var podcast = _js25[_js26];
            unsubscribePodcast($(podcast).find('meta[name=\'podcast-id\']').attr('value'));
        };
    });
    __PS_MV_REG = [];
    return $('#podcast-subscribe-selected-button').click(function () {
        var _js28 = getSelectedPodcasts();
        var _js30 = _js28.length;
        for (var _js29 = 0; _js29 < _js30; _js29 += 1) {
            var podcast = _js28[_js29];
            subscribePodcast($(podcast).find('meta[name=\'podcast-id\']').attr('value'));
        };
    });
});
