// Function that process data from Flickr
function processOutput(data) {
        if (data) {
            data = JSON.parse(data);
            if (data.stat != 'fail' && data.photos.total !== "0") {
                displayedImages = 0;
                localStorage.setItem('displayedImages', 0);
                localStorage.setItem('currentPage', data.photos.page);
                localStorage.setItem('flickrData', JSON.stringify(data));
                localStorage.setItem('totalPages', data.photos.pages);
                localStorage.setItem('flickrRecrawl', 'false');
                setNextPhoto(data);
                return;
            } else {
                console.log('No data. Fall back to default');
            }
        } else {
            console.log('Crawl error from Flickr');
        }
        // Since we have not received any data from Flickr,
        // set flickrRecrawl to true
        localStorage.setItem('flickrRecrawl', 'true')
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
        } else {
            displayedImages = 0;
            var currentPage = localStorage.getItem('currentPage');
            if (currentPage && currentPage !== '') {
                currentPage = parseInt(currentPage, 10);
                if (currentPage < dataObject.photos.pages) {
                    currentPage++;
                } else {
                    currentPage = 1;
                }
                localStorage.setItem('currentPage', currentPage);
                localStorage.setItem('flickrRecrawl', 'true');
            } else {
                localStorage.setItem('currentPage', 1);
            }
        }
        localStorage.setItem('displayedImages', displayedImages);
        return displayedImages;
    }
    // Sets the details about next image to be crawled
function setNextPhoto(dataObject) {
    var nextPhotoIndex = getNextPhotoIndex(dataObject),
        nextPhoto = dataObject.photos.photo[nextPhotoIndex];
    if (nextPhoto && nextPhoto.height_l && nextPhoto.width_l && parseInt(nextPhoto.height_l) < parseInt(nextPhoto.width_l)) {
        if (getImageUrl(nextPhoto) !== undefined && getImageUrl(nextPhoto) !== '' && getImageUrl(nextPhoto) !== 'undefined') {
            localStorage.setItem('nextFlickrImage', getImageUrl(nextPhoto));
            localStorage.setItem('nextOwner', nextPhoto.owner);
            localStorage.setItem('nextId', nextPhoto.id);
        } else {
            setNextPhoto(dataObject);
        }
    } else {
        setNextPhoto(dataObject);
    }
}

function setQueryString() {
    var pageNumber = localStorage.getItem('currentPage'),
        totalPages = localStorage.getItem('totalPages'),
        tagChanged = localStorage.getItem('tagChanged');
    if(tagChanged && tagChanged === 'true') {
        localStorage.setItem('tagChanged', 'false');
        pageNumber = 1;
    } else {
        if (pageNumber && pageNumber !== '') {
            pageNumber = parseInt(pageNumber, 10);
            if (totalPages && totalPages !== '' && pageNumber > totalPages) {
                pageNumber = 1;
            }
        } else {
            pageNumber = 1;
        }
    }
    currentTag = localStorage.getItem('flickrTag');

    // If there is no tag, set the query to crawl latest images from Flickr
    if (currentTag && currentTag !== 'null') {
        queryString = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + apiKey + '&tags=' + currentTag + '&format=json&nojsoncallback=1&safe_search=1&content_type=1&sort=interestingness-desc&extras=url_l&per_page=300&page=' + pageNumber;
    } else {
        queryString = 'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=' + apiKey + '&format=json&nojsoncallback=1&safe_search=1&content_type=1&sort=interestingness-desc&extras=url_l&per_page=300&page=' + pageNumber;
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
    currentTag, recrawl, prefetchImg, queryString,
    displayedImages = 0;

if (localStorage.getItem('displayedImages')) {
    displayedImages = parseInt(localStorage.getItem('displayedImages'), 10);
} else if (localStorage.getItem('flickrRecrawl') && localStorage.getItem('flickrRecrawl') === 'true') {
    displayedImages = 0;
}
// This function is called from index.html
// It sets the next item in the localStorage and requests for that image also
// So that it will be cached and when the next time the user opens a new tab, 
// it will load fast
function setNextItem() {
    var recrawl, data, ajaxRequested = false;
    
    recrawl = localStorage.getItem('flickrRecrawl');
    if (recrawl === null || recrawl === 'true') {
        console.log('recrawl happening');
        //localStorage.setItem('currentPage', 1);
        setQueryString();
        callAjax(queryString, processOutput);
        ajaxRequested = true;
    } else if (localStorage.getItem('nextFlickrImage') === null || localStorage.getItem('nextFlickrImage') === 'undefined') {
        setQueryString();
        callAjax(queryString, processOutput);
        ajaxRequested = true;
    }

    if (!ajaxRequested) {
        data = localStorage.getItem('flickrData');
        if (data) {
            data = JSON.parse(data);
            if (data.photos.photo.length != displayedImages) {
                setNextPhoto(data);
                if (localStorage.getItem('nextFlickrImage') && localStorage.getItem('nextFlickrImage') !== 'undefined') {
                    prefetchImg = new Image();
                    prefetchImg.src = localStorage.getItem('nextFlickrImage');
                }
            } else {
                callAjax(queryString, processOutput);
            }
        } else {
            callAjax(queryString, processOutput);
        }
    }
}

// Start our listener
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method === 'setNextItem') {
        setNextItem();
    }
});