console.log('app here');
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
document.onreadystatechange = function() {
    var state = document.readyState;
    var dimgTag = document.getElementById('flickrPhoto'),
        dlinkTag = document.getElementById('flickrLink');
    if (state === 'complete') {
        console.log('app ready');
        if (localStorage.getItem('nextFlickrImage') !== null) {
            var imgLoaded = false;
            dimgTag.setAttribute('src', localStorage.getItem('nextFlickrImage'));
            var index = getRandomInt(1,7);
            dimgTag.onload = function() {
                imgLoaded = true;
                if (dlinkTag) {
                    dlinkTag.setAttribute('href', 'http://flickr.com/photos/' + localStorage.getItem('nextOwner') + '/' + localStorage.getItem('nextId'));
                }
            }
            dimgTag.onerror = function() {
                console.log('error');
            }
            setTimeout(function() {
              if(!imgLoaded) {
                dimgTag.setAttribute('src', 'img/default_'+index+'.jpg');
              }
            }, 1000);
        }
    }
}