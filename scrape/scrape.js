var Nightmare = require('nightmare');
var vo = require('vo');
var cheerio = require('cheerio');

var url = '' + process.argv[2]
for (var i = 3; i < process.argv.length; i++) {
  url = url + '%20' + process.argv[i];
}

vo(function* () {
  var nightmare = Nightmare({ show: false });
  var link = yield nightmare
    .goto(url)
    .wait('.list-group-item')
    .evaluate(function () {
      var markup = document.documentElement.innerHTML;
      return markup;
    });
  yield nightmare.end();
  return link;
})(function (err, result) {
  if (err) return console.log(err);
  $ = cheerio.load(result);
  $('.').contents().each(function(i, elem) {
    console.log($(elem).text());
  });
});
