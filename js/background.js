(function() {
    var API_KEY = '',
        currentTag, recrawl,
        prefetchImg, queryString,
        displayedImages = 0;
    var SETTINGS_QUERY = '&format=json&nojsoncallback=1&safe_search=1&content_type=1&sort=interestingness-desc&extras=url_l&per_page=300',
        PARTIAL_QUERY_TAG = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + API_KEY + SETTINGS_QUERY,
        PARTIAL_QUERY_GENERAL = 'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=' + API_KEY + SETTINGS_QUERY;

    // AJAX crawling
    function callAjax(url, callback, params) {
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                callback(xmlhttp.responseText, params);
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }
    // Function that process data from Flickr
    function processOutput(data) {
        if (data) {
            data = JSON.parse(data);
            if (data.stat != 'fail' && data.photos.total !== "0") {
                displayedImages = 0;
                localStorage.setItem('displayedImages', 0);
                localStorage.setItem('flickrData', JSON.stringify(data));
                localStorage.setItem('currentPage', data.photos.page);
                localStorage.setItem('totalPages', data.photos.pages);
                localStorage.setItem('flickrRecrawl', 'false');
                setNextPhoto(data);
                return;
            }
        }
        // Since we have not received any data from Flickr,
        // set flickrRecrawl to true
        localStorage.removeItem('nextFlickrImage');
        localStorage.setItem('flickrRecrawl', 'true');
    }
    // This function sets the queryString along with the correct page number
    function setQueryString() {
        var pageNumber = localStorage.getItem('currentPage'),
            totalPages = localStorage.getItem('totalPages'),
            tagChanged = localStorage.getItem('tagChanged');
        if (tagChanged && tagChanged === 'true') {
            localStorage.setItem('tagChanged', 'false');
            pageNumber = 1;
        } else {
            if (pageNumber && pageNumber !== '') {
                pageNumber = parseInt(pageNumber, 10);
                if (totalPages && totalPages !== '' && pageNumber > totalPages) 
                {
                    pageNumber = 1;
                }
            } else {
                pageNumber = 1;
            }
        }
        currentTag = localStorage.getItem('flickrTag');

        // If there is no tag, set the query to crawl latest images from Flickr
        if (currentTag && currentTag !== 'null') {
            queryString = PARTIAL_QUERY_TAG + '&tags=' + currentTag +
                '&page=' + pageNumber;
        } else {
            queryString = PARTIAL_QUERY_GENERAL + '&page=' + pageNumber;
        }
    }
    // Function to set the query string and initiate crawl
    function recrawlFlickrData() {
        setQueryString();
        callAjax(queryString, processOutput);
    }
    // Get the image URL of item to be crawled
    function getImageUrl(photoObject) {
        if (photoObject && photoObject.url_l) {
            return photoObject.url_l;
        }
    }
    // Gets the next image to be displayed
    function getNextPhotoIndex(dataObject) {
        var currentPage;
        if (displayedImages < dataObject.photos.photo.length) {
            displayedImages += 1;
        } else {
            displayedImages = 0;
            currentPage = localStorage.getItem('currentPage');
            if (currentPage && currentPage !== '') {
                currentPage = parseInt(currentPage, 10);
                // Current page with all the results has beeen exhausted
                // So set the next page
                if (currentPage < dataObject.photos.pages) {
                    currentPage++;
                } else {
                    currentPage = 1;
                }
                // Since we want a fresh page, set flickrRecrawl to be true
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
            nextPhoto = dataObject.photos.photo[nextPhotoIndex],
            nextImageUrl;
        // Get only landscape photos
        if (nextPhoto && nextPhoto.height_l && nextPhoto.width_l &&
            parseInt(nextPhoto.height_l) < parseInt(nextPhoto.width_l)) {
            nextImageUrl = getImageUrl(nextPhoto);
            if (nextImageUrl && nextImageUrl !== 'undefined') {

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

    if (localStorage.getItem('displayedImages')) {
        displayedImages = parseInt(localStorage.getItem('displayedImages'), 10);
    } else if (localStorage.getItem('flickrRecrawl') &&
        localStorage.getItem('flickrRecrawl') === 'true') {

        displayedImages = 0;
    }
    // This function is called from index.html
    // It sets the next item in the localStorage and requests for that image also.
    // So that it will be cached and when the next time the user opens a new tab, 
    // it will load fast
    function setNextItem() {
        var recrawl, data, nextImageUrl, ajaxRequested = false;

        recrawl = localStorage.getItem('flickrRecrawl');
        if (recrawl === null || recrawl === 'true') {
            recrawlFlickrData();
            ajaxRequested = true;
        } else if (localStorage.getItem('nextFlickrImage') === null ||
            localStorage.getItem('nextFlickrImage') === 'undefined') {
            recrawlFlickrData();
            ajaxRequested = true;
        }

        if (!ajaxRequested) {
            data = localStorage.getItem('flickrData');
            if (data) {
                data = JSON.parse(data);
                if (data.photos.photo.length != displayedImages) {
                    setNextPhoto(data);
                    nextImageUrl = localStorage.getItem('nextFlickrImage');
                    if (nextImageUrl && nextImageUrl !== 'undefined') {
                        prefetchImg = new Image();
                        prefetchImg.src = 
                        localStorage.getItem('nextFlickrImage');
                    }
                } else {
                    recrawlFlickrData();
                }
            } else {
                recrawlFlickrData();
            }
        }
    }

    // Start our listener
    chrome.extension.onRequest.addListener(function(request, sender, 
        sendResponse) {
        if (request.method === 'setNextItem') {
            setNextItem();
        }
    });
})();