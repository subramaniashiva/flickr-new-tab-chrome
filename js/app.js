document.onreadystatechange = function() {
    var state = document.readyState;
    var apiKey,
        currentTag,
        queryString;
    var dimgTag = document.getElementById('flickrPhoto'),
        dlinkTag = document.getElementById('flickrLink');

    function processOutput(data, updateDom) {
        var nextPhotoIndex, nextPhoto, newIndex, newPhoto;
        if (data) {
            data = JSON.parse(data);
            if (data.stat != 'fail' && data.total !== 0) {
                nextPhotoIndex = getNextPhotoIndex(data);
                nextPhoto = data.photos.photo[nextPhotoIndex];
                localStorage.setItem('nextFlickrImage', getImageUrl(nextPhoto));
                localStorage.setItem('nextOwner', nextPhoto.owner);
                localStorage.setItem('nextId', nextPhoto.id);
                localStorage.setItem('flickrData', JSON.stringify(data));
                if(updateDom && updateDom === true) {
                  newIndex = getNextPhotoIndex(data);
                  newPhoto = data.photos.photo[newIndex];
                  dimgTag.setAttribute('src', getImageUrl(newPhoto));
                  if (dlinkTag) {
                      dlinkTag.setAttribute('href', 'http://flickr.com/photos/' + newPhoto.owner + '/' + newPhoto.id);
                  }
                }
            }
        } else {
            console.log('fail dude');
        }
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getImageUrl(photoObject) {
        var imageUrl = '';
        if (photoObject) {
            //imageUrl = 'http://farm' + photoObject.farm + '.static.flickr.com/' + photoObject.server + '/' + photoObject.id + '_' + photoObject.secret + '_b.jpg';
            imageUrl = photoObject.url_l;
            console.log('image url is ', imageUrl);
        }
        return imageUrl;
    }
    function getNextPhotoIndex(dataObject) {
      var nextPhotoIndex = getRandomInt(1, dataObject.photos.photo.length);
      var nextPhoto = dataObject.photos.photo[nextPhotoIndex];
      if(nextPhoto.url_l === null || nextPhoto.url_l === undefined || nextPhoto.url_l === 'undefined') {
        nextPhotoIndex = getNextPhotoIndex(dataObject);
      }
      return nextPhotoIndex;
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
    if (state === 'complete') {
        var recrawl, data, nextPhotoIndex, nextPhoto;
        apiKey = 'Your_API_Key';
        currentTag = localStorage.getItem('flickrTag');
        if (currentTag) {
            queryString = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + apiKey + '&tags=' + currentTag + '&format=json&nojsoncallback=1&safe_search=1&content_type=1&sort=interestingness-desc&extras=url_l';
        } else {
            queryString = 'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=' + apiKey + '&format=json&nojsoncallback=1&safe_search=1&content_type=1&sort=interestingness-desc&extras=url_l';
        }
        recrawl = localStorage.getItem('flickrRecrawl');
        if (recrawl && recrawl === 'true') {
            console.log('recrawl happening');
            callAjax(queryString, processOutput, true);
            localStorage.setItem('flickrRecrawl', 'false');
        }
        else if (localStorage.getItem('nextFlickrImage') === null || localStorage.getItem('nextFlickrImage') === 'undefined') {
            callAjax(queryString, processOutput, true);
        }
        else {
          dimgTag.setAttribute('src', localStorage.getItem('nextFlickrImage'));
          if (dlinkTag) {
              dlinkTag.setAttribute('href', 'http://flickr.com/photos/' + localStorage.getItem('nextOwner') + '/' + localStorage.getItem('nextId'));
          }
          data = localStorage.getItem('flickrData');
          if (data) {
              data = JSON.parse(data);
              nextPhotoIndex = getNextPhotoIndex(data);
              nextPhoto = data.photos.photo[nextPhotoIndex];
              localStorage.setItem('nextFlickrImage', getImageUrl(nextPhoto));
              localStorage.setItem('nextOwner', nextPhoto.owner);
              localStorage.setItem('nextId', nextPhoto.id);
          } else {
              callAjax(queryString, processOutput);
          }
        }
    }
}