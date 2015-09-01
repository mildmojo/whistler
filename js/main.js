var storyData = require('./story.js');
var ejsParse = require('./ejs.js');

storyData = preprocessor(storyData);
// console.dir(storyData);
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
  for (var onePassage in storyData) {
    if (onePassage.name === passageName) {
      passage = onePassage;
    }
  }
  passage = passage || storyData[0];
console.dir(passage);

  container.innerHTML = JSON.stringify(passage.title) + JSON.stringify(passage.body);
  for (var node in document.querySelectorAll('a.passage')) {
    node.onclick = function(e) {
      visitPassage(storyData, this.getAttribute('passage'));
      e.stopPropagation();
      return false;
    };
  }
}

var preprocessors = [
  function addLinks(storyData) {
    return storyData.reduce(function(sum, passage) {
      var links = passage.match(/\[.*?\]\(.*?\)/g);
      for (var link in links) {
        var parts = link.match(/\[.*?\]\(.*?\)/);
        var name = parts[0];
        var target = parts[1];
        var anchor = '<a href="#" class="passage ' + name + '-link" passage="' + target + '">' + name + '</a>';
        // NOTE: XSS risk
        passage = passage.replace(link, anchor);
        return sum.concat(passage);
      }
    }, '');
  },

  function addStructure(storyData) {
    return storyData.reduce(function(sum, passage) {
      var lines = passage.split('\n');
      var name = lines.shift();
      var title = lines.shift();
      var body = lines.join('\n');

      passage = '<div class="passage ' + name + '">\n' +
        '  <h2 class="passage-head">' + title + '</h2>\n' +
        '  <div class="passage-body">' + body + '</div>' +
        '</div>';

      return sum.concat(passage);
    }, []);
  },

  function fixNewlines(storyData) {
    return storyData.reduce(function(sum, passage) {
      return passage.replace('\n\n', '<br><br>');
    }, '');
  },

  function createObjects(storyData) {
    return storyData.reduce(function(sum, passage) {
      var lines = passage.split('\n');
      var name = lines.shift();
      var title = lines.shift();
      var body = lines.join('\n');
      return sum.concat({name: name, title: title, body: body});
    });
  }
];

function preprocessor(storyData) {
  for (var proc in preprocessors) {
    storyData = proc.call(null, storyData);
  }

  return storyData;
}

