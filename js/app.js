document.onreadystatechange = function() {
    var state = document.readyState;
    var dimgTag = document.getElementById('flickrPhoto'),
        dlinkTag = document.getElementById('flickrLink');
    if (state === 'complete') {
        if (localStorage.getItem('nextFlickrImage') !== null) {
            dimgTag.setAttribute('src', localStorage.getItem('nextFlickrImage'));

            if (dlinkTag) {
                dlinkTag.setAttribute('href', 'http://flickr.com/photos/' + localStorage.getItem('nextOwner') + '/' + localStorage.getItem('nextId'));
            }
        }
    }
}