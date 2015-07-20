document.onreadystatechange = function() {
    var state = document.readyState;
    if(state === 'complete') {
      var currentTag = localStorage.getItem('flickrTag'),
          defaultTag = 'No tag selected !';
      //var storedTags = 
      var submitButton = document.getElementById('submit'),
      inputTag = document.getElementById('tag'),
      clearButton = document.getElementById('clear'),
      tagsArray = [],
      defaultTagCount = 6,
      valuesArray;
      // Function to set the tags entered by the user
      function setTag(value) {
        var currentTag = localStorage.getItem('flickrTag');
        valuesArray = value.split(',');
        if(currentTag && currentTag !== 'null') {
          tagsArray = currentTag.split(',');
          if(tagsArray.length + valuesArray.length < defaultTagCount + 1) {
            tagsArray = tagsArray.concat(valuesArray);
          } else {
            [].unshift.apply(tagsArray, valuesArray);
            tagsArray.length = defaultTagCount;
          }
          localStorage.setItem('flickrTag', tagsArray.join(','));
        } else {
          valuesArray.length = Math.min(valuesArray.length, defaultTagCount);
          localStorage.setItem('flickrTag', valuesArray.join(','));
        }
        addTagsUI();
        localStorage.setItem('flickrRecrawl', 'true');
      }
      // Function to delete all tags
      function deleteTags() {
        localStorage.removeItem('flickrTag');
        localStorage.setItem('flickrRecrawl', 'true');
        var currentTagCont = document.getElementById('currentTagCont');
        currentTagCont.innerHTML = '';
        var defaultTagText = document.getElementById('currentTag');
        defaultTagText.style.display = 'block';
      }
      function deleteSingleTag(event) {
        var grandParent = this.parentNode.parentNode,
            parent = this.parentNode,
            childNode = parent.querySelectorAll('.tagValue');
        var tagValue = childNode[0].innerHTML;
        grandParent.removeChild(parent);
        var currentTags = localStorage.getItem('flickrTag');
        if(currentTags && currentTags !== 'null') {
          currentTags = currentTags.split(',');
          if(currentTags.length === 1 && currentTags[0] === tagValue) {
            localStorage.removeItem('flickrTag');
            localStorage.setItem('flickrRecrawl', 'true');
            var defaultTagText = document.getElementById('currentTag');
            defaultTagText.style.display = 'block';
          } else {
            currentTags.splice(currentTags.indexOf(tagValue), 1);
            localStorage.setItem('flickrTag', currentTags.join(','));
            localStorage.setItem('flickrRecrawl', 'true');
          }
        }

      }
      function addTagsUI() {
        var currentTagCont = document.getElementById('currentTagCont'),
            defaultTagText = document.getElementById('currentTag'),
            allTags,
            tagUnit, currentArray = localStorage.getItem('flickrTag');
        currentTagCont.innerHTML = '';
        if(currentArray && currentArray !== null) {
          currentArray = localStorage.getItem('flickrTag').split(',');
          for(var i = 0; i < currentArray.length; i++) {
            tagUnit = document.getElementById('template').innerHTML;
            tagUnit = tagUnit.replace('{{tag}}', currentArray[i]);
            currentTagCont.innerHTML += tagUnit;
            defaultTagText.style.display = 'none';
          }
          allTags = document.querySelectorAll('.delete');
          for(i = 0; i < allTags.length; i++) {
            allTags[i].addEventListener('click', deleteSingleTag);
          }
        } else {
          defaultTagText.style.display = 'block';
        }
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
      addTagsUI();
    }
}