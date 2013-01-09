chrome.extension.onMessage.addListener(function onRequest(request, sender, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4)
           callback(xhr.response);
    }
    // Note that any URL fetched here must be matched by a permission in
    // themanifest.jsonfile!
    xhr.open(request.method, request.url);
    xhr.send(request.data || '');
    return true;
});

