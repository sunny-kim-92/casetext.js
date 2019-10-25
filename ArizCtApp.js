const cheerio = require("cheerio");
const rp = require("request-promise");
const converter = require("json-2-csv");

const links = [
  "http://casetext.com/case/state-v-tebaqui",
  "http://casetext.com/case/wilkins-v-indus-commn-of-ariz",
  "http://casetext.com/case/state-v-armenta-19",
  "http://casetext.com/case/state-v-valenzuela-77",
  "http://casetext.com/case/crystal-b-v-dept-of-child-safety",
  "http://casetext.com/case/state-v-hebner-2",
  "http://casetext.com/case/state-v-pena-2017",
  "http://casetext.com/case/in-re-marriage-of-tovar",
  "http://casetext.com/case/state-v-sims-102824",
  "http://casetext.com/case/aaron-w-v-dept-of-child-safety",
  "http://casetext.com/case/state-v-montano-vega",
  "http://casetext.com/case/state-v-gibler-3",
  "http://casetext.com/case/campbell-v-pfeifer",
  "http://casetext.com/case/woensdregt-v-handyman-connection",
  "http://casetext.com/case/juergen-m-v-dept-of-child-safety-lc",
  "http://casetext.com/case/state-v-daron-1",
  "http://casetext.com/case/state-v-byers-2014",
  "http://casetext.com/case/state-v-orduno-8",
  "http://casetext.com/case/moore-v-moore-in-re-marriage-of-moore",
  "http://casetext.com/case/state-v-garcia-102868",
  "http://casetext.com/case/state-v-knowlton-8",
  "http://casetext.com/case/state-v-bieganski",
  "http://casetext.com/case/marcellina-d-v-dept-of-child-safety-1",
  "http://casetext.com/case/state-v-lambert-2015",
  "http://casetext.com/case/sova-v-indus-commn",
  "http://casetext.com/case/ariz-dept-of-corr-v-butler",
  "http://casetext.com/case/peter-d-v-geetika-c-in-re-marriage-of-peter-d",
  "http://casetext.com/case/in-re-marriage-of-williams-2006",
  "http://casetext.com/case/state-v-villa-63",
  "http://casetext.com/case/state-v-hernandez-2046",
  "http://casetext.com/case/wheeler-v-deutsche-bank-natl-tr-co",
  "http://casetext.com/case/state-v-lowe-122212",
  "http://casetext.com/case/state-v-scroggins-32214",
  "http://casetext.com/case/state-v-schaffer-42",
  "http://casetext.com/case/state-v-watrous-1",
  "http://casetext.com/case/state-v-robinson-9222127",
  "http://casetext.com/case/kevin-a-v-shondell-h",
  "http://casetext.com/case/eugene-g-v-dept-of-child-safety",
  "http://casetext.com/case/islands-cmty-assn-v-daniels",
  "http://casetext.com/case/state-v-ocain-15",
  "http://casetext.com/case/state-v-aldava-2",
  "http://casetext.com/case/state-v-petri-19",
  "http://casetext.com/case/samantha-d-v-dept-of-child-safety-1",
  "http://casetext.com/case/durham-v-saber",
  "http://casetext.com/case/state-v-keeten-1",
  "http://casetext.com/case/state-v-holmes-121038",
  "http://casetext.com/case/holcomb-v-ariz-dept-of-real-estate-1",
  "http://casetext.com/case/doria-j-v-dept-of-child-safety",
  "http://casetext.com/case/state-v-smith-1282306",
  "http://casetext.com/case/michael-m-v-anita-mm"
];

const totalJudges = {
  SWANN: true,
  CATTANI: true,
  BROWN: true,
  CAMPBELL: true,
  CRUZ: true,
  HOWE: true,
  JOHNSEN: true,
  JONES: true,
  MCMURDIE: true,
  MORSE: true,
  PERKINS: true,
  THUMMA: true,
  WEINZWEIG: true,
  WINTHROP: true,
  ECKERSTROM: true,
  ESPINOSA: true,
  VASQUEZ: true,
  STARING: true,
  EPPICH: true,
  BREARCLIFFE: true
};

const finalArr = [];

links.slice(0, 40).forEach(link => {
  rp(link)
    // rp('https://casetext.com/case/in-re-marriage-of-tovar')
    // rp("https://casetext.com/case/potter-v-potter-64")
    // rp('https://casetext.com/case/state-v-sims-102824')
    .then(res => {
      return cheerio.load(res);
    })
    .then($ => {
      const opinionObj = $(`section.decision.opinion`);
      const opinionStr = opinionObj.text();
      const citation = $(`span.citation`).text();
      const caseTitle = $(`.title-text.text-truncate`).text();
    //   console.log(caseTitle)
      const authorStr = $(`p.byline`).text();

      let outcome = "";
      const judges = [];
      let author = "";

      let lCourt = "";
      let lJudge = "";

      let caseType = "";

      author = authorStr
        .replace(/[, ]+/g, " ")
        .split(" ")[0]
        .toUpperCase();

      if (author === "PER") {
        author = "PER CURIAM";
      }

      outcome = $(`h3`)
        .first()
        .text();

      let firstP = {};

      $(`p`).each(function(i, el) {
        if (i === 5) {
          firstP = $(this);
          return false;
        }
      });
      let firstPStr = "";

      if (firstP.text().indexOf("County") != -1) {
        lCourt = firstP.text().slice(
          firstP.text().indexOf("the") + 4,
          firstP.text().indexOf("County") + 6
        );
        const firstPArr = [];
        firstP
          .text()
          .split(" ")
          .forEach(word => {
            if (word != word.toUpperCase()) {
              firstPArr.push(word);
            }
          });
        firstPStr = firstPArr.join(" ");
      } else {
          firstPStr = firstP.next().text();
          lCourt = firstPStr.slice(
              firstPStr.indexOf("the") + 4,
              firstPStr.indexOf("County") + 6
              );
            //   console.log(lCourt)
      }

      caseType = firstPStr.slice(0, firstPStr.indexOf("from"));

      lJudge = firstPStr
        .slice(firstPStr.indexOf("Honorable ") + 10)
        .replace(/[, ]+/g, " ")
        .replace(/Judge/g, "")
        .trim();
        if (lJudge === lJudge.toUpperCase()){
            lJudge = 'ERROR'
        }
      let jText = ''
      $(`h3`).each(function(i, el) {
        if (i === 1) {
          jText = $(this).next().text();
          return false;
        }
      });

      jText
        .toUpperCase()
        .replace(/[, ]+/g, " ")
        .trim()
        .split(" ")
        .forEach(el => {
          Object.keys(totalJudges).forEach(j => {
            if (j === el) {
              judges.push(j);
            }
            if (judges.length > 2) return
          });
        });

      let attorneyStr = opinionStr
        .slice(outcome.length,
          opinionStr.indexOf("MEMORANDUM")
        )
        .trim();

      const citesArr = []
      $(`.raw-ref`)
        .each(function(i, el) {
        citesArr.push($(this).text())
        })
      const cites = [...new Set(citesArr)];

      let wordCount = opinionStr.split(" ").length;

      let obj = {
        citation,
        caseTitle,
        outcome,
        caseType,
        lCourt,
        lJudge,
        attorneyStr,
        author,
        judges,
        cites,
        wordCount,
        link
      };
    //   console.log(obj)
      finalArr.push(obj);
      if (finalArr.length === 20) {
        converter.json2csv(finalArr, function(err, csv) {
          console.log(csv);
        });
      }
    });
});
