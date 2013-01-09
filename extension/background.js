chrome.extension.onMessage.addListener(function onRequest(request, sender, callback) {
    var xhr = new XMLHttpRequest();
    if(request.method == 'GET')
        request.url += '?'+request.data;
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4)
           callback(xhr.response);
    }
    //xhr.setRequestHeader("Content-type", "multipart/form-data"); 
    xhr.open(request.method, request.url);
    xhr.send(request.data || '');
    return true;
});

