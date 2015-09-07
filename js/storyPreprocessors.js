module.exports = [
  // function createObjects(storyData) {
  //   return storyData.map(function(passage) {
  //     var lines = passage.split('\n');
  //     var name = lines.shift();
  //     var body = lines.join('\n');
  //     return {name: name, body: body};
  //   });
  // },

  function addLinks(storyData) {
    return storyData.map(function(passage) {
      var links = [].concat(passage.body.match(/\[\[([^|]+)\|?(.*?)\]\]/g));
      if (links.length === 0 || links[0] === null) return passage;
      links.forEach(function(link) {
        var parts = link.match(/\[\[([^|]+)\|?(.*?)\]\]/);
        var name = parts[1];
        var target = parts[2] || name;
        var anchor = '<a href="#" class="passage ' + name + '-link" passage="' + target + '">' + name + '</a>';
        // NOTE: XSS risk
        passage.body = passage.body.replace(link, anchor);
      });
      return passage;
    });
  },

  function addStructure(storyData) {
    return storyData.map(function(passage) {
      passage.body = '<div class="passage ' + passage.name + '">\n' +
        '  <div class="passage-body">' + passage.body + '</div>' +
        '</div>';

      return passage;
    });
  },

  function fixNewlines(storyData) {
    return storyData.map(function(passage) {
      passage.body = passage.body.replace(/\n\n/g, '<br><br>');
      return passage;
    });
  }
];
