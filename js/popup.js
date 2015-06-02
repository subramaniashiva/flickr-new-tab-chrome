document.onreadystatechange = function() {
    var state = document.readyState;
    if(state === 'complete') {
      var currentTag = localStorage.getItem('flickrTag');
      if(currentTag) {
        document.getElementById('currentTag').innerText = currentTag;
      }
      var submitButton = document.getElementById('submit');
      var inputTag = document.getElementById('tag');
      var clearButton = document.getElementById('clear');
      submitButton.addEventListener('click', function() {
        console.log(inputTag.value);
        if(inputTag.value) {
          localStorage.setItem('flickrTag', inputTag.value);
          document.getElementById('currentTag').innerText = inputTag.value;
          localStorage.setItem('flickrRecrawl', 'true');
          inputTag.value = '';
        }
      });
      clearButton.addEventListener('click', function() {
        localStorage.removeItem('flickrTag');
        document.getElementById('currentTag').innerText = 'No tag selected !';
        localStorage.setItem('flickrRecrawl', 'true');
      });
    }
}