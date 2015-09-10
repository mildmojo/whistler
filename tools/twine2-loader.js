// var fs = require('fs');
var cheerio = require('cheerio');

module.exports = function(source) {
  this.cacheable();
  // var twineFile = process.argv[2];
  // var twineData = fs.readFileSync(twineFile);
  var $ = cheerio.load(source);
  //console.dir($('tw-passagedata')[0].children);
  var passages = $('tw-passagedata');
  var output = [];
  for (var i = 0; i < passages.length; i++) {
    var passage = passages[i];
    var name = passage.attribs.name;
    var body = passage.children[0].data;
    output.push({name: name, body: body});
  }

  output = preprocessor(output);
  return 'module.exports = ' + JSON.stringify(output, null, ' ');
};

function preprocessor(storyData) {
  preprocessors.forEach(function(proc) {
    storyData = proc.call(null, storyData);
  });

  return storyData;
}

var preprocessors = [
  function addLinks(storyData) {
    return storyData.map(function(passage) {
      var links = [].concat(passage.body.match(/\[\[([^|\]]+)\|?(.*?)\]\]/g));
      if (links.length === 0 || links[0] === null) return passage;
      links.forEach(function(link) {
        var parts = link.match(/\[\[([^|\]]+)\|?(.*?)\]\]/);
        var name = parts[1];
        var target = parts[2] || name;
        var cleanTarget = clean(target);
        var anchor = '<a href="#" class="passage ' + cleanTarget + '-link" passage="' + target + '">' + name + '</a>';
        // NOTE: XSS risk
        passage.body = passage.body.replace(link, anchor);
      });
      return passage;
    });
  },

  function addStructure(storyData) {
    return storyData.map(function(passage) {
      passage.body = '<div class="passage ' + clean(passage.name) + '">' +
        '<div class="passage-body">' + passage.body + '</div>' +
        '</div>';

      return passage;
    });
  },

  // function fixNewlines(storyData) {
  //   return storyData.map(function(passage) {
  //     passage.body = passage.body.replace(/\n\n/g, '<br>');
  //     return passage;
  //   });
  // }
];

// Replace non-word characters with hypens, trim hyphens from start/end, downcase.
function clean(str) {
  var cleanStr = str.replace(/[^\w]/g, '-').replace(/^-*/, '').replace(/-*$/, '').toLowerCase();
  return cleanStr;
}
