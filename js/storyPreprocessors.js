module.exports = [
  function createObjects(storyData) {
    return storyData.map(function(passage) {
      var lines = passage.split('\n');
      var name = lines.shift();
      var title = lines.shift();
      var body = lines.join('\n');
      return {name: name, title: title, body: body};
    });
  },

  function addLinks(storyData) {
    return storyData.map(function(passage) {
      var links = [].concat(passage.body.match(/\[.*?\]\(.*?\)/g));
      if (links.length === 0) return sum;
      links.forEach(function(link) {
        var parts = link.match(/\[(.*?)\]\((.*?)\)/);
        var name = parts[1];
        var target = parts[2];
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
        '  <h2 class="passage-head">' + passage.title + '</h2>\n' +
        '  <div class="passage-body">' + passage.body + '</div>' +
        '</div>';

      return passage;
    });
  },

  function fixNewlines(storyData) {
    return storyData.map(function(passage) {
      passage.title = passage.title.replace(/\n\n/g, '<br><br>');
      passage.body = passage.body.replace(/\n\n/g, '<br><br>');
      return passage;
    });
  }
];
