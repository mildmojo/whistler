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

  return 'module.exports = ' + JSON.stringify(output, null, ' ');
};
