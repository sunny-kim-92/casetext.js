const cheerio = require("cheerio");
const rp = require("request-promise");

rp("https://casetext.com/cases/7cir/7cirapp/2019/9")
.then(res => {
    return cheerio.load(res);
  })
  .then($ => {
      let arr = $(`a.item-content`).map(function(i, el) {
          return 'http://casetext.com' + $(this).attr(`href`)
      }).get()
      console.log(arr)
  })
