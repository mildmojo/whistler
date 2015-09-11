/*

TODO:
- figure out how to do global functions like `restart()`
- add a `reset()` and `restart()`?
- figure out if eval code can `setTimeout` for delays


*/
var storyData = require('../tools/twine2-loader!./story.html');
var ejsParse = require('./ejs.js');
var preprocessor = require('./storyPreprocessor.js');
var gameState = {};

// storyData = preprocessor(storyData);
ready(visitPassage.bind(null, storyData, 'Test'));

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function visitPassage(storyData, passageName) {
  var container = document.querySelector('div.content');
  var passage = null;
  storyData.forEach(function(onePassage) {
    if (onePassage.name === passageName) {
      passage = onePassage;
    }
  });
  passage = passage || storyData[0];
  passage = preprocessor(passage);

  container.innerHTML = ejsParse(passage.body, gameState).replace(/\n/g, '<br>');
  var links = document.querySelectorAll('a.passage');
  links = Array.prototype.slice.call(links);
  links.forEach(function(node) {
    node.addEventListener('click', function(e) {
      visitPassage(storyData, this.getAttribute('passage'));
      e.stopPropagation();
      e.preventDefault();
      return false;
    });
  });
}

global.restart = function() {
  visitPassage(storyData, 'Start');
};

// function preprocessor(storyData) {
//   preprocessors.forEach(function(proc) {
//     storyData = proc.call(null, storyData);
//   });

//   return storyData;
// }

