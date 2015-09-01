var storyData = require('./story.js');
var ejsParse = require('./ejs.js');
var preprocessors = require('./storyPreprocessors.js');
var gameState = {};

storyData = preprocessor(storyData);
ready(visitPassage.bind(null, storyData));

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function visitPassage(storyData, passageName) {
  var container = document.querySelector('div.container');
  var passage = null;
  storyData.forEach(function(onePassage) {
    if (onePassage.name === passageName) {
      passage = onePassage;
    }
  });
  passage = passage || storyData[0];

  container.innerHTML = ejsParse(passage.body, gameState);
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

function preprocessor(storyData) {
  preprocessors.forEach(function(proc) {
    storyData = proc.call(null, storyData);
  });

  return storyData;
}

