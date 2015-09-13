/*

TODO:
- figure out how to do global functions like `restart()`
- add a `reset()` and `restart()`?
- figure out if eval code can `setTimeout` for delays


*/
var storyData = require('../tools/twine2-loader!./Whistler.html');
var ejsParse = require('./ejs.js');
var preprocessor = require('./storyPreprocessor.js');
var gameState = {};

ready(restart);

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function visit(passageName) {
  var container = document.querySelector('div.content');

  // Get passage name, automatically switch to passage when countown runs out.
  passageName = passageName || window.location.search.substr(1).replace(/%20/g, ' ') || 'Start';
  Object.keys(gameState.countdowns).forEach(function(key) {
    if (gameState.countdowns[key]-- <= 0) {
      passageName = key;
      delete gameState.countdowns[key];
    }
  });

  gameState.lastPassage = gameState.currentPassage;
  gameState.currentPassage = passageName;

  storyData.forEach(function(onePassage) {
    if (onePassage.name === passageName) {
      passage = onePassage;
    }
  });
  if (!passage) return console.warn('Passage "' + passageName + '" not found!');

  passage = preprocessor(passage);
  var passageHTML = ejsParse(passage.body, gameState).replace(/\n/g, '<br>');

  if (gameState.location) {
    passageHTML = '<h4>' + gameState.location + '</h4>' + passageHTML;
  }

  container.innerHTML = passageHTML;

  var links = document.querySelectorAll('a.passage');
  links = Array.prototype.slice.call(links);
  links.forEach(function(node) {
    node.addEventListener('click', function(e) {
      var passageName = this.getAttribute('passage');
      if (passageName.substr(0, 3) === 'js:') {
        eval(passageName.substr(3));
      } else {
        visit(this.getAttribute('passage'));
      }
      e.stopPropagation();
      e.preventDefault();
      return false;
    });
  });

}

global.restart = restart;
function restart() {
  gameState = {
    lastPassage: '',
    currentPassage: '',
    once: {},
    knownWhistles: ['open', 'close'],
    countdowns: {}
  };
  visit();
};

global.back = back;
function back() {
  visit(gameState.lastPassage);
};

// function preprocessor(storyData) {
//   preprocessors.forEach(function(proc) {
//     storyData = proc.call(null, storyData);
//   });

//   return storyData;
// }

