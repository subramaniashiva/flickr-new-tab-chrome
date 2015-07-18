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
      //var storedTags = 
      var submitButton = document.getElementById('submit'),
      inputTag = document.getElementById('tag'),
      clearButton = document.getElementById('clear'),
      deleteButton = document.getElementById('delete'),
      tagsArray, valuesArray, defaultTagCount = 6;
      // Function to set the tags entered by the user
      var setTag = function(value) {
        var currentTag = localStorage.getItem('flickrTag');
        if(currentTag && currentTag !== 'null') {
          tagsArray = localStorage.getItem('flickrTag').split(',');
          valuesArray = value.split(',');
          if(tagsArray.length + valuesArray.length < defaultTagCount + 1) {
            tagsArray = tagsArray.concat(valuesArray);
          } else {
            [].unshift.apply(tagsArray, valuesArray);
            tagsArray.length = defaultTagCount;
          }
          localStorage.setItem('flickrTag', tagsArray.join(','));
        } else {
          localStorage.setItem('flickrTag', value);
        }

        document.getElementById('currentTag').innerText = localStorage.getItem('flickrTag');
        localStorage.setItem('flickrRecrawl', 'true');
      }
      // Function to delete all tags
      var deleteTags = function() {
        localStorage.removeItem('flickrTag');
        document.getElementById('currentTag').innerText = defaultTag;
        localStorage.setItem('flickrRecrawl', 'true');
      }
      // When submit button is clicked, set the tags
      submitButton.addEventListener('click', function() {
        if(inputTag.value) {
          setTag(inputTag.value);
        }
      });
      // When enter is pressed in the text box, set the tags with value
      inputTag.addEventListener('keypress', function(event) {
        if(event.keyCode === 13 && inputTag.value) {
          setTag(inputTag.value);
          inputTag.value = '';
        }
      });

      clearButton.addEventListener('click', deleteTags);
      deleteButton.addEventListener('click', deleteTags);
    }
}