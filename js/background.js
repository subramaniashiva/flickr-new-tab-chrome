function processOutput(data) {
    var nextPhotoIndex, nextPhoto, newIndex, newPhoto;
    if (data) {
        data = JSON.parse(data);
        if (data.stat != 'fail' && data.photos.total !== "0") {
            displayedImages = 0;
            console.log('data is ', data);
            setNextPhoto(data);
        } else {
            console.log('No data. Fall back to default');
            localStorage.setItem('flickrTag', null);
            localStorage.setItem('flickrRecrawl', 'true');
        }
    } else {
        console.log('fail dude');
    }
}
function getImageUrl(photoObject) {
    var imageUrl;
    if (photoObject && photoObject.url_l) {
        //imageUrl = 'http://farm' + photoObject.farm + '.static.flickr.com/' + photoObject.server + '/' + photoObject.id + '_' + photoObject.secret + '_b.jpg';
        imageUrl = photoObject.url_l;
        //console.log('image url is ', imageUrl);
        //console.log('photo object is ', photoObject);
    }
    return imageUrl;
}

function getNextPhotoIndex(dataObject) {
    if (displayedImages < dataObject.photos.photo.length) {
        displayedImages += 1;
        return displayedImages;
    } else {
        displayedImages = 0;
        return displayedImages;
    }
}

function setNextPhoto(dataObject) {
    var nextPhotoIndex = getNextPhotoIndex(dataObject);
    var nextPhoto = dataObject.photos.photo[nextPhotoIndex];
    if(getImageUrl(nextPhoto) !== '' || getImageUrl(nextPhoto) !== undefined) {
      localStorage.setItem('nextFlickrImage', getImageUrl(nextPhoto));
      localStorage.setItem('nextOwner', nextPhoto.owner);
      localStorage.setItem('nextId', nextPhoto.id);
      localStorage.setItem('flickrData', JSON.stringify(dataObject));
    } else {
      setNextPhoto(dataObject);
    }
}

function callAjax(url, callback, params) {
    var xmlhttp;
    // compatible with IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            callback(xmlhttp.responseText, params);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
var apiKey = '',
    currentTag, recrawl, prefetchImg, queryString, displayedImages = 0;
chrome.tabs.onCreated.addListener(function(tab) {
    console.log('bg event fired');
    var recrawl, data;
    currentTag = localStorage.getItem('flickrTag');
    if (currentTag) {
        queryString = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + apiKey + '&tags=' + currentTag + '&format=json&nojsoncallback=1&safe_search=1&content_type=1&sort=interestingness-desc&extras=url_l';
    } else {
        queryString = 'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=' + apiKey + '&format=json&nojsoncallback=1&safe_search=1&content_type=1&sort=interestingness-desc&extras=url_l';
    }

    recrawl = localStorage.getItem('flickrRecrawl');
    if (recrawl === null || recrawl === 'true') {
        console.log('recrawl happening');
        callAjax(queryString, processOutput);
        localStorage.setItem('flickrRecrawl', 'false');
    } else if (localStorage.getItem('nextFlickrImage') === null || localStorage.getItem('nextFlickrImage') === 'undefined') {
        callAjax(queryString, processOutput);
    }

    data = localStorage.getItem('flickrData');
    if (data) {
        data = JSON.parse(data);
        if (data.photos.photo.length != displayedImages) {
            setNextPhoto(data);
            prefetchImg = new Image();
            prefetchImg.src = localStorage.getItem('nextFlickrImage');
        } else {
            callAjax(queryString, processOutput);
        }
    } else {
        callAjax(queryString, processOutput);
    }

});