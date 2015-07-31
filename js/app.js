document.onreadystatechange = function() {
    // Function to generate random number.
    // Used for loading default images
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    var state = document.readyState;
    var dimgTag = document.getElementById('flickrPhoto'),
        dlinkTag = document.getElementById('flickrLink'),
        defaultLinkSet = false,
        index = getRandomInt(1, 7),
        imgLoaded = false,
        DEFAULT_LINKS = ['https://www.flickr.com/photos/premnath/7709816036/',
            'https://www.flickr.com/photos/104818937@N06/18607432546/',
            'https://www.flickr.com/photos/premnath/10073243713/',
            'https://www.flickr.com/photos/premnath/15125443389/',
            'https://www.flickr.com/photos/premnath/10456834124/',
            'https://www.flickr.com/photos/premnath/8693469848/',
            'https://www.flickr.com/photos/104818937@N06/16986756492/'
        ];
    if (state === 'complete') {
        // Load default image, since the image from flickr is taking long time
        var timeOut = setTimeout(function() {
            if (!imgLoaded) {
                dimgTag.setAttribute('src', 'img/default_' + index + '.jpg');
                dimgTag.style.visibility = 'visible';
                if (dlinkTag) {
                    defaultLinkSet = true;
                    dlinkTag.setAttribute('href', DEFAULT_LINKS[index - 1]);
                }
            }
        }, 1500);
        if (localStorage.getItem('nextFlickrImage') !== null &&
            localStorage.getItem('nextFlickrImage') !== 'undefined') {

            dimgTag.onload = function() {
                imgLoaded = true;
                dimgTag.style.visibility = 'visible';
                if (dlinkTag && !defaultLinkSet) {
                    dlinkTag.setAttribute('href', 'http://flickr.com/photos/' +
                        localStorage.getItem('nextOwner') + '/' +
                        localStorage.getItem('nextId'));

                    chrome.extension.sendRequest({
                        method: 'setNextItem'
                    }, function(response) {});
                }
            };
            // On error clear the time out function and load the default image
            dimgTag.onerror = function(e) {
                chrome.extension.sendRequest({
                    method: 'setNextItem'
                }, function(response) {});
            };
            dimgTag.setAttribute('src', localStorage.getItem('nextFlickrImage'));
        } else {
            chrome.extension.sendRequest({
                method: 'setNextItem'
            }, function(response) {});
        }
    }
};