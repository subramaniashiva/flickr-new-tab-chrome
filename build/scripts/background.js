/*! flickr-new-tab 2015-07-30 */
!function(){function a(a,b,c){var d;d=new XMLHttpRequest,d.onreadystatechange=function(){4==d.readyState&&200==d.status&&b(d.responseText,c)},d.open("GET",a,!0),d.send()}function b(a){return a&&(a=JSON.parse(a),"fail"!=a.stat&&"0"!==a.photos.total)?(m=0,localStorage.setItem("displayedImages",0),localStorage.setItem("flickrData",JSON.stringify(a)),localStorage.setItem("currentPage",a.photos.page),localStorage.setItem("totalPages",a.photos.pages),localStorage.setItem("flickrRecrawl","false"),void g(a)):(localStorage.removeItem("nextFlickrImage"),void localStorage.setItem("flickrRecrawl","true"))}function c(){var a=localStorage.getItem("currentPage"),b=localStorage.getItem("totalPages"),c=localStorage.getItem("tagChanged");c&&"true"===c?(localStorage.setItem("tagChanged","false"),a=1):a&&""!==a?(a=parseInt(a,10),b&&""!==b&&a>b&&(a=1)):a=1,i=localStorage.getItem("flickrTag"),k=i&&"null"!==i?o+"&tags="+i+"&page="+a:p+"&page="+a}function d(){c(),a(k,b)}function e(a){return a&&a.url_l?a.url_l:void 0}function f(a){var b;return m<a.photos.photo.length?m+=1:(m=0,b=localStorage.getItem("currentPage"),b&&""!==b?(b=parseInt(b,10),b<a.photos.pages?b++:b=1,localStorage.setItem("currentPage",b),localStorage.setItem("flickrRecrawl","true")):localStorage.setItem("currentPage",1)),localStorage.setItem("displayedImages",m),m}function g(a){var b,c=f(a),d=a.photos.photo[c];d&&d.height_l&&d.width_l&&parseInt(d.height_l)<parseInt(d.width_l)?(b=e(d),b&&"undefined"!==b?(localStorage.setItem("nextFlickrImage",e(d)),localStorage.setItem("nextOwner",d.owner),localStorage.setItem("nextId",d.id)):g(a)):g(a)}function h(){var a,b,c,e=!1;a=localStorage.getItem("flickrRecrawl"),null===a||"true"===a?(d(),e=!0):(null===localStorage.getItem("nextFlickrImage")||"undefined"===localStorage.getItem("nextFlickrImage"))&&(d(),e=!0),e||(b=localStorage.getItem("flickrData"),b?(b=JSON.parse(b),b.photos.photo.length!=m?(g(b),c=localStorage.getItem("nextFlickrImage"),c&&"undefined"!==c&&(j=new Image,j.src=localStorage.getItem("nextFlickrImage"))):d()):d())}var i,j,k,l="",m=0,n="&format=json&nojsoncallback=1&safe_search=1&content_type=1&sort=interestingness-desc&extras=url_l&per_page=300",o="https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+l+n,p="https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key="+l+n;localStorage.getItem("displayedImages")?m=parseInt(localStorage.getItem("displayedImages"),10):localStorage.getItem("flickrRecrawl")&&"true"===localStorage.getItem("flickrRecrawl")&&(m=0),chrome.extension.onRequest.addListener(function(a,b,c){"setNextItem"===a.method&&h()})}();