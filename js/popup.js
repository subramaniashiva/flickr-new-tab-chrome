document.onreadystatechange = function() {
    var state = document.readyState;
    if(state === 'complete') {
      var currentTag = localStorage.getItem('flickrTag'),
          defaultTag = 'No tag selected !';
      if(currentTag) {
        defaultTag = currentTag;
      }
      document.getElementById('currentTag').innerText = defaultTag;
      var submitButton = document.getElementById('submit');
      var inputTag = document.getElementById('tag');
      var clearButton = document.getElementById('clear');
      submitButton.addEventListener('click', function() {
        if(inputTag.value) {
          localStorage.setItem('flickrTag', inputTag.value);
          document.getElementById('currentTag').innerText = inputTag.value;
          localStorage.setItem('flickrRecrawl', 'true');
          inputTag.value = '';
        }
      });
      clearButton.addEventListener('click', function() {
        localStorage.removeItem('flickrTag');
        document.getElementById('currentTag').innerText = defaultTag;
        localStorage.setItem('flickrRecrawl', 'true');
      });
    }
}