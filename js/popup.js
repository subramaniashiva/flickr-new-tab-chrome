document.onreadystatechange = function() {
    var state = document.readyState;
    if(state === 'complete') {
      var currentTag = localStorage.getItem('flickrTag'),
          defaultTag = 'No tag selected !';
      if(currentTag && currentTag !== 'null') {
        document.getElementById('currentTag').innerText = currentTag;
      } else {
        document.getElementById('currentTag').innerText = defaultTag;
      }
      var submitButton = document.getElementById('submit');
      var inputTag = document.getElementById('tag');
      var clearButton = document.getElementById('clear');
      var setTag = function(value) {
        localStorage.setItem('flickrTag', value);
        document.getElementById('currentTag').innerText = value;
        localStorage.setItem('flickrRecrawl', 'true');
        inputTag.value = '';
      }
      submitButton.addEventListener('click', function() {
        if(inputTag.value) {
          setTag(inputTag.value);
        }
      });
      inputTag.addEventListener('keypress', function(event) {
        console.log(event);
        if(event.keyCode === 13 && inputTag.value) {
          setTag(inputTag.value);
        }
      });
      clearButton.addEventListener('click', function() {
        localStorage.removeItem('flickrTag');
        document.getElementById('currentTag').innerText = defaultTag;
        localStorage.setItem('flickrRecrawl', 'true');
      });
    }
}