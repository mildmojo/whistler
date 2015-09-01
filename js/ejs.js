// if (process) {
//   var evalStr = '';

//   process.stdin.on('data', function(data) {
//     evalStr += data;
//   });
//   process.stdin.on('close', function() {
//     console.log(evalit(evalStr));
//   });
// }
module.exports = parse;

function parse(str, context) {
  var funcLines = [
    'var c = ' + JSON.stringify(context) + ';',
    '(function(){ var _outStr = "";',
  ];

  while (str.length > 0) {
    var chunks = str.match(/([.\s\S]*?)<%([.\s\S]*?)%>/);
    if (chunks) {
      var text = chunks[1];
      var code = chunks[2];
      funcLines.push(prepareText(text));
      funcLines.push(prepareCode(code));
      str = str.substr(text.length + code.length + 4);
    } else {
      funcLines.push(prepareText(str));
      str = '';
    }
  }

  funcLines.push('return {result: _outStr, context: c}; })()');

  var output = eval(funcLines.join('\n'));

  for (var prop in output.context) {
    context[prop] = output.context[prop];
  }

  return output.result;
}

function prepareText(text) {
  var cleanText = text.replace(/"/g, '\\"').replace(/\n/g, '\\n');
  return '_outStr += "' + cleanText + '";';
}

function prepareCode(code) {
  var cleanCode = code;
  if (cleanCode.match(/^=/)) {
    cleanCode = '_outStr += ' + cleanCode.substr(1) + ';';
  }
  return cleanCode;
}
