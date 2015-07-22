document.onreadystatechange = function() {
    var state = document.readyState;
    if(state === 'complete') {
      var currentTag = localStorage.getItem('flickrTag'),
          defaultTag = 'No tag selected !';
      var dSubmitButton = document.getElementById('submit'),
          dInputTag = document.getElementById('tag'),
          dClearButton = document.getElementById('clear'),
          dErrMsg = document.getElementById('errorMsg'),
          tagsArray = [],
          defaultTagCount = 6,
          valuesArray;
      // Function to set the tags entered by the user
      function setTag(value) {
        var valuesArray = value.split(',');
        if(currentTag && currentTag !== 'null') {
          tagsArray = currentTag.split(',');
          if(tagsArray.length + valuesArray.length < defaultTagCount + 1) {
            tagsArray = tagsArray.concat(valuesArray);
            localStorage.setItem('flickrTag', tagsArray.join(','));
          } else {
            dErrMsg.style.display = 'block';
            return;
          }
        } else {
          valuesArray.length = Math.min(valuesArray.length, defaultTagCount);
          localStorage.setItem('flickrTag', valuesArray.join(','));
        }
        dErrMsg.style.display = 'none';
        addTagsUI();
        localStorage.setItem('flickrRecrawl', 'true');
      }
      // Function to delete all tags
      function deleteTags() {
        var currentTagCont = document.getElementById('currentTagCont'),
            defaultTagText = document.getElementById('currentTag');
        localStorage.removeItem('flickrTag');
        localStorage.setItem('flickrRecrawl', 'true');
        currentTagCont.innerHTML = '';
        defaultTagText.style.display = 'block';
      }
      // Function to delete a single tag
      function deleteSingleTag(event) {
        var grandParent = this.parentNode.parentNode,
            parent = this.parentNode,
            childNode = parent.querySelectorAll('.tagValue'),
            tagValue = childNode[0].innerHTML,
            currentTags = localStorage.getItem('flickrTag').
            defaultTagText;

        grandParent.removeChild(parent);
        if(currentTags && currentTags !== 'null') {
          currentTags = currentTags.split(',');
          if(currentTags.length === 1 && currentTags[0] === tagValue) {
            localStorage.removeItem('flickrTag');
            defaultTagText = document.getElementById('currentTag');
            defaultTagText.style.display = 'block';
          } else {
            currentTags.splice(currentTags.indexOf(tagValue), 1);
            localStorage.setItem('flickrTag', currentTags.join(','));
          }
          localStorage.setItem('flickrRecrawl', 'true');
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
      dSubmitButton.addEventListener('click', function() {
        if(dInputTag.value) {
          setTag(dInputTag.value);
          dInputTag.value = '';
        }
      });
      // When enter is pressed in the text box, set the tags with value
      dInputTag.addEventListener('keypress', function(event) {
        if(event.keyCode === 13 && dInputTag.value) {
          setTag(dInputTag.value);
          dInputTag.value = '';
        }
      });

      dClearButton.addEventListener('click', deleteTags);
      addTagsUI();
    }
}