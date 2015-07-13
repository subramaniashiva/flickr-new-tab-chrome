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
      var deleteButton = document.getElementById('delete');
      var setTag = function(value) {
        localStorage.setItem('flickrTag', value);
        document.getElementById('currentTag').innerText = value;
        localStorage.setItem('flickrRecrawl', 'true');
        inputTag.value = '';
      }
      var deleteTags = function() {
        localStorage.removeItem('flickrTag');
        document.getElementById('currentTag').innerText = defaultTag;
        localStorage.setItem('flickrRecrawl', 'true');
      }
      submitButton.addEventListener('click', function() {
        if(inputTag.value) {
          setTag(inputTag.value);
        }
      });
      inputTag.addEventListener('keypress', function(event) {
        if(event.keyCode === 13 && inputTag.value) {
          setTag(inputTag.value);
        }
      });
      clearButton.addEventListener('click', deleteTags);
      deleteButton.addEventListener('click', deleteTags);
    }
}