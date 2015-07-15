// Function that process data from Flickr
function processOutput(data) {
        if (data) {
            data = JSON.parse(data);
            if (data.stat != 'fail' && data.photos.total !== "0") {
                displayedImages = 0;
                setNextPhoto(data);
            } else {
                console.log('No data. Fall back to default');
                localStorage.setItem('flickrTag', null);
                localStorage.setItem('flickrRecrawl', 'true');
            }
        } else {
            console.log('Crawl error from Flickr');
        }
    }
    // Get the image URL of item to be crawled
function getImageUrl(photoObject) {
        if (photoObject && photoObject.url_l) {
            return photoObject.url_l;
        }
    }
    // Gets the next image to be displayed
function getNextPhotoIndex(dataObject) {
        if (displayedImages < dataObject.photos.photo.length) {
            displayedImages += 1;
            return displayedImages;
        } else {
            displayedImages = 0;
            return displayedImages;
        }
    }
    // Sets the details about next image to be crawled
function setNextPhoto(dataObject) {
        var nextPhotoIndex = getNextPhotoIndex(dataObject),
            nextPhoto = dataObject.photos.photo[nextPhotoIndex];
            console.log('next phot is ', getImageUrl(nextPhoto));
        if (getImageUrl(nextPhoto) !== '' || getImageUrl(nextPhoto) !== undefined) {
            localStorage.setItem('nextFlickrImage', getImageUrl(nextPhoto));
            localStorage.setItem('nextOwner', nextPhoto.owner);
            localStorage.setItem('nextId', nextPhoto.id);
            localStorage.setItem('flickrData', JSON.stringify(dataObject));
        } else {
            setNextPhoto(dataObject);
        }
    }
    // AJAX crawling
function callAjax(url, callback, params) {
    var xmlhttp;
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

function setNextItem() {
    console.log('Next item called');
    var recrawl, data;
    currentTag = localStorage.getItem('flickrTag');
    // If there is no tag, set the query to crawl latest images from Flickr
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
            //prefetchImg = new Image();
            var nextPhotoIndex = getNextPhotoIndex(data),
                nextPhoto = data.photos.photo[nextPhotoIndex];
            // Logic needs fixing
            if (getImageUrl(nextPhoto) !== '' || getImageUrl(nextPhoto) !== undefined) {
                prefetchImg = document.getElementById('nextImg');
                prefetchImg.src = getImageUrl(nextPhoto);
                prefetchImg.style.display = 'none';
            }
        } else {
            callAjax(queryString, processOutput);
        }
    } else {
        callAjax(queryString, processOutput);
    }
}
chrome.tabs.onCreated.addListener(function(tab) {
    //setNextItem();
});

// Start our listener
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request.method === 'setNextItem') {
        setNextItem();
    }
});