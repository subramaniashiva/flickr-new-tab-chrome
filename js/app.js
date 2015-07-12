// Function to generate random number.
// Used for loading default images
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
document.onreadystatechange = function() {
    var state = document.readyState;
    var dimgTag = document.getElementById('flickrPhoto'),
        dlinkTag = document.getElementById('flickrLink'),
        index = getRandomInt(1, 7),
        imgLoaded = false,
        defaultLinks = ['https://www.flickr.com/photos/premnath/7709816036/',
            'https://www.flickr.com/photos/104818937@N06/18607432546/',
            'https://www.flickr.com/photos/premnath/10073243713/',
            'https://www.flickr.com/photos/premnath/15125443389/',
            'https://www.flickr.com/photos/premnath/10456834124/',
            'https://www.flickr.com/photos/premnath/8693469848/',
            'https://www.flickr.com/photos/104818937@N06/16986756492/'
        ];
    if (state === 'complete') {
        if (localStorage.getItem('nextFlickrImage') !== null || localStorage.getItem('nextFlickrImage') !== undefined) {
            dimgTag.setAttribute('src', localStorage.getItem('nextFlickrImage'));
            dimgTag.onload = function() {
                imgLoaded = true;
                if (dlinkTag) {
                    dlinkTag.setAttribute('href', 'http://flickr.com/photos/' + localStorage.getItem('nextOwner') + '/' + localStorage.getItem('nextId'));
                }
            }
            dimgTag.onerror = function() {
                console.log('error');
            }
        }
        // Load default image, since the image from flickr is taking long time
        setTimeout(function() {
            if (!imgLoaded) {
                dimgTag.setAttribute('src', 'img/default_' + index + '.jpg');
                console.log('url is ', defaultLinks[index - 1]);
                //if (dlinkTag) {
                    dlinkTag.setAttribute('href', defaultLinks[index - 1]);
                //}
            }
        }, 1000);
    }
}