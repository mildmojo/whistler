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
    '(function(context){',
    'var s = context;',
    'var _outStr = "";',
  ];

  while (str.length > 0) {
    var chunks = str.match(/([.\s\S]*?)<%([.\s\S]*?)%>\n*/);
    if (chunks) {
      var match = chunks[0];
      var text = chunks[1];
      var code = chunks[2];
      funcLines.push(prepareText(text));
      funcLines.push(prepareCode(code));
      str = str.substr(match.length);
    } else {
      funcLines.push(prepareText(str));
      str = '';
    }
  }

  funcLines.push('return _outStr; })');

  var ejsFunc = eval(funcLines.join('\n'));
  var output = ejsFunc(context);

  // for (var prop in output.context) {
  //   context[prop] = output.context[prop];
  // }

  return output;
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

function delay(id, delayMS) {
  setTimeout(function() {
    unhide(id);
  }, delayMS);
}

function emitHideStart(id) {
  return '<span id="' + id + '" class="hidden">';
}

function emitHideEnd(id) {
  return '</span>';
}

function hide(id) {
  setTimeout(function() {
    var el = document.querySelector('#' + id);
    el.classList.add('hidden');
  }, 0);
}

function unhide(id) {
  setTimeout(function() {
    var el = document.querySelector('#' + id);
    el.classList.remove('hidden');
  }, 0);
}

function once(gameState, id) {
  if (gameState.once[id]) {
    hide(id);
  } else {
    gameState.once[id] = true;
  }
}

function countdown(gameState, passageName, numTurns) {
  if (numTurns === 0) return delete gameState.countdowns[passageName];
  if (gameState.countdowns[passageName] > 0) return;
  gameState.countdowns[passageName] = numTurns + 1;
}
