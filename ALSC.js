const cheerio = require("cheerio");
const rp = require("request-promise");
const converter = require("json-2-csv");

const helpers = require("./helpers.js");

const totalJudges = {
  PARKER: true,
  BOLIN: true,
  SHAW: true,
  WISE: true,
  BRYAN: true,
  SELLERS: true,
  MENDHEIM: true,
  STEWART: true,
  MITCHELL: true
};
let links = [
  "https://casetext.com/case/wright-v-sanders-1",
  "https://casetext.com/case/ex-parte-keeton-4",
  "https://casetext.com/case/agee-v-williams-2",
  "https://casetext.com/case/startley-gen-contractors-inc-v-water-works-bd-of-birmingham",
  "https://casetext.com/case/ex-parte-gray-2014",
  "https://casetext.com/case/ex-parte-hernandez-2015",
  "https://casetext.com/case/ex-parte-stimpson-2",
  "https://casetext.com/case/ex-parte-kelly-2028",
  "https://casetext.com/case/ex-parte-dickerson-18",
  "https://casetext.com/case/imperial-aluminum-scottsboro-llc-v-taylor-2",
  "https://casetext.com/case/ex-parte-matthews-2014",
  "https://casetext.com/case/ex-parte-sls",
  "https://casetext.com/case/ex-parte-ab-2011",
  "https://casetext.com/case/ex-parte-city-of-tuskegee-2",
  "https://casetext.com/case/zieman-v-zieman-speegle-llc",
  "https://casetext.com/case/ex-parte-cenlar-fsb",
  "https://casetext.com/case/murphy-v-forney",
  "https://casetext.com/case/ex-parte-mitchell-2028",
  "https://casetext.com/case/ex-parte-rose-2015",
  "https://casetext.com/case/ex-parte-msl",
  "https://casetext.com/case/blair-v-blair-66",
  "https://casetext.com/case/wiggins-v-city-of-evergreen",
  "https://casetext.com/case/ex-parte-tmw",
  "https://casetext.com/case/pate-v-warner-lodge-llc",
  "https://casetext.com/case/ex-parte-carty-6",
  "https://casetext.com/case/regions-bank-v-pittman",
  "https://casetext.com/case/hudson-v-sandlin",
  "https://casetext.com/case/ex-parte-carroll-2012",
  "https://casetext.com/case/ex-parte-garrett-2018",
  "https://casetext.com/case/ex-parte-smith-2114",
  "https://casetext.com/case/ex-parte-thrasher-5",
  "https://casetext.com/case/wright-v-sanders-2",
  "https://casetext.com/case/byrd-v-spencer",
  "https://casetext.com/case/ex-parte-kke-llc",
  "https://casetext.com/case/ex-parte-p-c",
  "https://casetext.com/case/ex-parte-hunter-2014",
  "https://casetext.com/case/ex-parte-dean-35",
  "https://casetext.com/case/blanks-v-tds-telecomms",
  "https://casetext.com/case/ex-parte-taylor-2036",
  "https://casetext.com/case/patel-v-shah-9",
  "https://casetext.com/case/ex-parte-booth-18",
  "https://casetext.com/case/ex-parte-reed-2017",
  "https://casetext.com/case/ex-parte-lee-2087",
  "https://casetext.com/case/belle-v-goldasich",
  "https://casetext.com/case/mckenzie-v-janssen-biotech-inc-1",
  "https://casetext.com/case/zimmerman-v-dealnewscom-inc",
  "https://casetext.com/case/ex-parte-brocato",
  "https://casetext.com/case/jamison-v-bbh-bmc-llc",
  "https://casetext.com/case/ex-parte-coleman-2016",
  "https://casetext.com/case/ex-parte-washington-2012",
  "https://casetext.com/case/ex-parte-carty-5",
  "https://casetext.com/case/elliott-law-grp-pa-v-five-star-credit-union"
];

const finalArr = [];

// links.forEach(link => {
  // rp(link)
    // rp('https://casetext.com/case/ex-parte-city-of-tuskegee-2')
    // rp("https://casetext.com/case/startley-gen-contractors-inc-v-water-works-bd-of-birmingham")
    rp('https://casetext.com/case/weiland-v-loomis')

    .then(res => {
      return cheerio.load(res);
    })
    .then($ => {
      let allJudges = totalJudges;
      const citation = $(`span.citation`).text();
      const caseTitle = $(`.title-text.text-truncate`).text();
      let authorStr = $(`p.byline`).text();
      let concurJudges = [];
      let dissentJudges = [];
      let recuseJudges = [];
      let concurInResultJudges = [];
      let outcome = "";
      let judges = [];
      let author = "";
      let caseType = "";
      let lCourt = "";
      const opinionObj = $(`section.decision.opinion`);
      const opinionStr = opinionObj.text();
      if (authorStr === "") {
        author = "ERROR";
      } else {
        author = authorStr
          .replace(/[, ]+/g, " ")
          .split(" ")[0]
          .toUpperCase();
        if (author === "PER") {
          author = "PER CURIAM";
        }
      }

      const firstParObj = $(`p#pa5`);
      const firstParStr = firstParObj.text().trim();
      const firstID = firstParStr.split(" ")[0];
      if (firstID === "Notice:") {
        if (opinionStr.indexOf("PETITION FOR WRIT OF MANDAMUS" != -1)) {
          caseType = "Writ of Mandamus";
          opinionObj.find(`b`).each(function(i, el) {
            if ($(this).text()[0] === "(") {
              lCourt =
                $(this)
                  .text()
                  .slice(
                    1,
                    $(this)
                      .text()
                      .indexOf(`,`)
                  ) + "t";
            }
          });
        }
        firstParObj.children(`b`).each(function(i, el) {
          if (
            $(this)
              .text()
              .indexOf("Appeal from") != -1
          ) {
            lCourt = $(this)
              .text()
              .replace("Appeal from ", "");
          }
        });
        let hold = [];
        let next = [];
        opinionObj.children().each(function(i, el) {
          hold.push(
            $(this)
              .text()
              .trim()
          );
        });
        for (let k = hold.length - 1; k > 0; k--) {
          if (
            hold[k].indexOf("REVERSE") != -1 ||
            hold[k].indexOf("AFFIRM") != -1 ||
            hold[k].indexOf("GRANT") != -1 ||
            hold[k].indexOf("DENIED") != -1 ||
            hold[k].indexOf("REMAND") != -1 ||
            hold[k].indexOf("VACATE") != -1
          ) {
            outcome = hold[k];
            next = hold.slice(k + 1, hold.length);
            // console.log("k: ", k, " hold.length: ", hold.length);
            break;
          }
        }
        next.forEach(val => {
          val = val.replace(/[, ]+/g, " ").toUpperCase();
          if (val.indexOf("CONCUR") != -1 && val.indexOf("RESULT") === -1) {
            Object.keys(allJudges).forEach(word => {
              if (val.indexOf(word) != -1 && allJudges[word]) {
                concurJudges.push(word);
                allJudges[word] = false;
              }
            });
          } else if (
            val.indexOf("CONCUR") != -1 &&
            val.indexOf("RESULT") != -1
          ) {
            Object.keys(allJudges).forEach(word => {
              if (val.indexOf(word) != -1 && allJudges[word]) {
                concurInResultJudges.push(word);
                allJudges[word] = false;
              }
            });
          } else if (val.indexOf("RECUSE") != -1) {
            Object.keys(allJudges).forEach(word => {
              if (val.indexOf(word) != -1 && allJudges[word]) {
                recuseJudges.push(word);
                allJudges[word] = false;
              }
            });
          } else if (val.indexOf("DISSENT") != -1) {
            Object.keys(allJudges).forEach(word => {
              if (val.indexOf(word) != -1 && allJudges[word]) {
                dissentJudges.push(word);
                allJudges[word] = false;
              }
            });
          }
        });
      } else if (firstID === "PETITION") {
        let tFlag = false;
        if (firstParStr.indexOf("CERTIORARI") != -1) {
          caseType = "Writ of Certiorari";
          const writStr = opinionObj
            .children(`h3`)
            .text()
            .trim()
            .replace(/[, ]+/g, " ");
          const parseY = helpers.parseFourSides(writStr.toUpperCase());
          concurJudges = parseY.concurJudges;
          concurInResultJudges = parseY.concurInResultJudges;
          recuseJudges = parseY.recuseJudges;
          dissentJudges = parseY.dissentJudges;
          outcome = writStr;
        } else if (firstParStr.indexOf("MANDAMUS") != -1) {
          caseType = "Writ of Mandamus";
          let jStr = "";
          let jFlag = false;
          opinionObj.children().each(function(i, el) {
            if (
              $(this)
                .text()
                .toUpperCase()
                .indexOf(author) != -1 &&
              !jFlag &&
              $(this).attr(`class`) != "byline"
            ) {
              jStr = $(this)
                .text()
                .toUpperCase();
              jFlag = true;
            }
          });
          //   console.log(jStr)
          let parseO = helpers.parseFourSides(jStr);
          concurJudges = parseO.concurJudges;
          concurInResultJudges = parseO.concurInResultJudges;
          recuseJudges = parseO.recuseJudges;
          dissentJudges = parseO.dissentJudges;
        } else caseType = "ERROR";
        for (let i = 0; i < firstParStr.length; i++) {
          if (firstParStr[i] === "(") {
            for (let j = i; j < firstParStr.length - i; j++) {
              if (firstParStr[j] === ":" && !tFlag) {
                lCourt = firstParStr
                  .substr(i + 1, j - i - 1)
                  .replace("Appeal from ", "");
                tFlag = true;
              }
            }
          }
        }
      } else {
        //simple
        firstParStr.indexOf('Appeal') != -1 || firstParStr.indexOf('APPEAL') != -1
        ? caseType = "Appeal"
        : caseType = "ERROR"
        thisFlag = false;
        opinionObj.children().each(function(i, el) {
          // console.log($(this).text());
          if (
            $(this)
              .text()
              .toUpperCase()
              .indexOf("AFFIRM") != -1 ||
            $(this)
              .text()
              .toUpperCase()
              .indexOf("GRANT") != -1 ||
            $(this)
              .text()
              .toUpperCase()
              .indexOf("DENIED") != -1 ||
            ($(this)
              .text()
              .toUpperCase()
              .indexOf("REJECT") != -1 &&
              !thisFlag)
          ) {
            outcome = $(this).text();
            thisFlag = true;
          }
        });
        let tempJStr = "";
        tempArr = [];
        let sFlag = false;
        opinionObj.children().each(function(i, el) {
          if (
            $(this)
              .text()
              .toUpperCase()
              .indexOf("CONCUR") != -1 &&
            !sFlag
          ) {
            tempJStr = $(this)
              .text()
              .replace(/[, ]+/g, " ")
              .trim()
              .toUpperCase();
            sFlag = true;
          }
        });
        let parseT = helpers.parseFourSides(tempJStr);

        concurJudges = parseT.concurJudges;
        concurInResultJudges = parseT.concurInResultJudges;
        recuseJudges = parseT.recuseJudges;
        dissentJudges = parseT.dissentJudges;
        let colonFlag = false;
        for (let i = 0; i < firstParStr.length; i++) {
          if (firstParStr[i] === "(") {
            for (let j = i; j < firstParStr.length - i; j++) {
              if (firstParStr[j] === ":" && !colonFlag) {
                lCourt = firstParStr
                  .substr(i + 1, j - i - 1)
                  .replace("Appeal from ", "");
                colonFlag = true;
              }
            }
          }
        }
      }
      const citesArr = $(`.raw-ref`)
        .map(function(i, el) {
          return $(this).text();
        })
        .get();
      const cites = [...new Set(citesArr)];

      judges = concurJudges
        .concat(concurInResultJudges)
        .concat(recuseJudges)
        .concat(dissentJudges)

        if (author != 'PER CURIAM')
        {judges.concat(author)}


      judges = [...new Set(judges)]

      let wordCount = opinionStr.split(" ").length;
      let obj = {
        citation,
        caseTitle,
        outcome,
        author,
        caseType,
        lCourt,
        judges,
        concurJudges,
        concurInResultJudges,
        dissentJudges,
        recuseJudges,
        cites,
        wordCount,
        link
      };

      finalArr.push(obj);
      if (finalArr.length === links.length) {
        converter.json2csv(finalArr, function(err, csv) {
          console.log(csv);
        });
      }
    });
// });
