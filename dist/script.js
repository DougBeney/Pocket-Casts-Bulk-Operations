var YOURPODCASTS;
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
        console.log('visibile is', null);
        $('#login-box').css('display', status);
        var status1 = true ? 'inherit' : 'none';
        console.log('visibile is', true);
        $('#logout-button').css('display', status1);
        var status2 = true ? 'inherit' : 'none';
        console.log('visibile is', true);
        $('#podcast-list').css('display', status2);
        var status3 = true ? 'inherit' : 'none';
        console.log('visibile is', true);
        $('#bulk-header').css('display', status3);
        var status4 = true ? 'inherit' : 'none';
        console.log('visibile is', true);
        __PS_MV_REG = [];
        return $('#header-sep').css('display', status4);
    } else {
        var status5 = true ? 'inherit' : 'none';
        console.log('visibile is', true);
        $('#login-box').css('display', status5);
        var status6 = null ? 'inherit' : 'none';
        console.log('visibile is', null);
        $('#logout-button').css('display', status6);
        var status7 = null ? 'inherit' : 'none';
        console.log('visibile is', null);
        $('#podcast-list').css('display', status7);
        var status8 = null ? 'inherit' : 'none';
        console.log('visibile is', null);
        $('#bulk-header').css('display', status8);
        var status9 = null ? 'inherit' : 'none';
        console.log('visibile is', null);
        __PS_MV_REG = [];
        return $('#header-sep').css('display', status9);
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
            var podcasts10 = data.podcasts;
            YOURPODCASTS = podcasts10;
            for (var i in podcasts10) {
                var id = i;
                var podcast = podcasts10[i];
                var name = podcast.title;
                var thumb = thumbnailUrl(podcast.uuid);
                addPodcast(id, name, thumb);
            };
        },
                        'error' : function (jqxhr, textstatus, errormessage) {
            __PS_MV_REG = [];
            return console.log('FAIL', errormessage);
        }
                      });
    };
};
$(function () {
    updatePodcasts();
    __PS_MV_REG = [];
    return adjustVisibility();
});
