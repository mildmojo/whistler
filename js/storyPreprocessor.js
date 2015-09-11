// Expects passage object e.g. {name: 'Passage Name', body: 'Passage Body'}
module.exports = function preprocessor(passageObj) {
  preprocessors.forEach(function(proc) {
    passageObj = proc.call(null, passageObj);
  });

  return passageObj;
};

var preprocessors = [
  function addLinks(passage) {
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
  },

  function addStructure(passage) {
    passage.body = '<div class="passage ' + clean(passage.name) + '">' +
      '<div class="passage-body">' + passage.body + '</div>' +
      '</div>';

    return passage;
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
