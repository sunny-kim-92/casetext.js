const cheerio = require("cheerio");
const rp = require("request-promise");
const converter = require("json-2-csv");

const allJudges = {
  IRIZARRY: true,
  AMON: true,
  AZRACK: true,
  BLOCK: true,
  BRODIE: true,
  CHEN: true,
  COGAN: true,
  HALL: true,
  DEARIE: true,
  DONNELLY: true,
  FEUERSTEIN: true,
  GARAUFIS: true,
  GERSHON: true,
  GLASSER: true,
  HURLEY: true,
  JOHNSON: true,
  KORMAN: true,
  KUNTZ: true,
  MATSUMOTO: true,
  MAUSKOPF: true,
  ROSS: true,
  SEYBERT: true,
  SPATT: true,
  VITALIANO: true,
  WEINSTEIN: true,
  MANN: true,
  BROWN: true,
  BULSARA: true,
  GOLD: true,
  LEVY: true,
  LINDSAY: true,
  LOCKE: true,
  POLLAK: true,
  REYES: true,
  SCANLON: true,
  SHIELDS: true,
  TISCIONE: true,
  TOMLINSON: true,
  BIANCO: true
};

const links = [
  "http://casetext.com/case/saint-louis-v-cent-transp",
  "http://casetext.com/case/deaton-v-napoli",
  "http://casetext.com/case/katz-v-travelers-prop-cas-co",
  "http://casetext.com/case/best-v-ditech-holding-corp",
  "http://casetext.com/case/juzumas-v-nassau-cnty",
  "http://casetext.com/case/j-j-sports-prods-v-boodram",
  "http://casetext.com/case/la-barbera-v-r-rio-trucking",
  "http://casetext.com/case/del-priore-v-commr-of-soc-sec",
  "http://casetext.com/case/eliya-inc-v-steven-madden-ltd-4",
  "http://casetext.com/case/carl-v-hamann-1",
  "http://casetext.com/case/johnson-v-city-of-ny-44",
  "http://casetext.com/case/lugo-v-saul",
  "http://casetext.com/case/singh-v-a-a-mkt-plaza-inc",
  "http://casetext.com/case/mccluskey-v-imhof-1",
  "http://casetext.com/case/gil-v-frantzis",
  "http://casetext.com/case/silverstein-v-massapequa-union-free-sch-dist",
  "http://casetext.com/case/wexler-v-att-corp-2",
  "http://casetext.com/case/buckskin-realty-inc-v-greenberg-3",
  "http://casetext.com/case/lobo-v-commr-of-soc-sec",
  "http://casetext.com/case/nicholas-v-miller-4",
  "http://casetext.com/case/portal-v-saul",
  "http://casetext.com/case/trs-of-local-813-ins-tr-fund-v-all-cnty-funeral-serv-inc",
  "http://casetext.com/case/williams-v-suffolk-cnty-corr-facility",
  "http://casetext.com/case/burns-v-medgar-evers-coll-of-univ",
  "http://casetext.com/case/porter-v-hladky",
  "http://casetext.com/case/paracha-v-mrs-bpo-llc",
  "http://casetext.com/case/strujan-v-storage-fox-self-storage",
  "http://casetext.com/case/ak-v-westhampton-beach-sch-dist",
  "http://casetext.com/case/marrero-v-clemmons",
  "http://casetext.com/case/ross-v-city-of-ny-3",
  "http://casetext.com/case/grosz-v-cavalry-portfolio-servs",
  "http://casetext.com/case/melamed-v-commr-of-soc-sec",
  "http://casetext.com/case/bell-v-granada-towers-condo",
  "http://casetext.com/case/meo-v-lane-bryant-inc",
  "http://casetext.com/case/cantelmo-v-united-airlines-inc",
  "http://casetext.com/case/higueral-produce-inc-v-ckf-produce-corp",
  "http://casetext.com/case/j-j-sports-prods-inc-v-gomez-1",
  "http://casetext.com/case/cao-v-miyama-inc",
  "http://casetext.com/case/chauca-v-advantagecare-physicians-pc",
  "http://casetext.com/case/barrios-v-thai",
  "http://casetext.com/case/martinez-v-griffin-2",
  "http://casetext.com/case/paguirigan-v-prompt-nursing-empt-agency-llc-2",
  "http://casetext.com/case/flagstar-bank-fsb-v-caribbean-mortg-corp-1",
  "http://casetext.com/case/advanced-fresh-concepts-franchise-corp-v-nayyarsons-deli-bakery-corp-2",
  "http://casetext.com/case/gonzalez-v-trees-r-us-inc",
  "http://casetext.com/case/williams-v-ponte-4",
  "http://casetext.com/case/golub-v-swaaley-2",
  "http://casetext.com/case/smith-v-factory-direct-enters-llc",
  "http://casetext.com/case/aguilar-v-ham-n-eggery-deli-inc",
  "http://casetext.com/case/choi-v-home-home-corp"
];

const finalArr = [];

links.forEach(link => {
  rp(link)
// rp("https://casetext.com/case/young-v-town-of-islip")
// rp("https://casetext.com/case/buckskin-realty-inc-v-greenberg-3")
  .then(res => {
    return cheerio.load(res);
  })
  .then($ => {
    let author = "";
    const authorObj = $(`p.byline`);
    const opinionObj = $(`section.decision.opinion`);
    const opinionStr = opinionObj.text().trim();
    let wordCount = opinionObj.text().split(" ").length;

    const opinionArr = [];
    opinionObj.children().each(function(i, el) {
      opinionArr.push(
        $(this)
          .text()
          .trim()
      );
    });

    const citation = $(`span.citation`).text();
    const caseTitle = $(`.title-text.text-truncate`).text();
    let outcome = "";

    let pOffice = "";
    let dOffice = "";
    let pAttorney = [];
    let dAttorney = [];

    //Judges

    //Author
    authorObj
      .text()
      .trim()
      .replace(/[, ]+/g, " ")
      .toUpperCase()
      .split(" ")
      .forEach(el => {
        Object.keys(allJudges).forEach(word => {
          if (el === word) {
            author = word;
          }
        });
      });

    //Attorneys
    let attorneyBlock = [];
    let attorneyFlag = false;

    opinionObj.children().each(function(i, el) {
      // console.log(i)
      // console.log($(this).text())
      // $(this).children().each(function(j, ell) {
        // console.log($(this).get(0).tagName)
      // })
      attorneyBlock.push($(this).text());
      if (
        $(this)
          .text()
          .toUpperCase()
          .indexOf("APPEARANCES:") != -1
      ){
        attorneyFlag = true
      }
        if (
          $(this)
            .text()
            .indexOf(authorObj.text().trim()) != -1 &&
          i != 0
        ) {
          return false;
        }
    });
    let attorneyStr = ''
    if (attorneyFlag) attorneyStr = attorneyBlock.join(' ')

    // console.log(attorneyBlock)
    //Bolded
    // $(`b`).each(function(i, el) {
    //   if (
    // $(this)
    //   .text()
    //   .toUpperCase()
    //   .indexOf("APPEARANCE") != -1
    //   ) {
    //     attorneyFlag = true;
    //   }
    //   if (attorneyFlag && i === 1) {
    //     pOffice = $(this)
    //       .text()
    //       .trim();
    //   } else if (attorneyFlag && i === 2) {
    //     dOffice = $(this)
    //       .text()
    //       .trim();
    //     return false;
    //   }
    //   if (dOffice != "") {
    //     return false;
    //   }
    // });
    //Not bolded
    if (attorneyFlag) {
      let pFlag = false;
      if (attorneyBlock.length > 1) {
        attorneyBlock.forEach(el => {
          if (
            $(this).text() ===
            $(this)
              .text()
              .toUpperCase()
          ) {
            !pFlag
              ? pAttorney.push($(this).text())
              : dAttorney.push($(this).text());
          }
          if (
            $(this)
              .text()
              .indexOf("For the ") != -1 ||
            $(this)
              .text()
              .indexOf("for the ") != -1
          ) {
            pFlag = true;
          }
        });
      }
    }

    // Citations
    const citesArr = $(`.raw-ref`)
      .map(function(i, el) {
        return $(this).text();
      })
      .get();
    const cites = [...new Set(citesArr)];

    // Outcome
    let outcomeEnd = opinionArr.length - 1;
    let outcomeBeg = 0;
    let changeFlag = false;

    for (let j = opinionArr.length - 1; j > 0; j--) {
      if (opinionArr[j].indexOf("SO ORDERED") != -1) {
        outcomeEnd = j;
        //   changeFlag = true
      }
      if (opinionArr[j].indexOf("CONCLUSION") != -1) {
        outcomeBeg = j + 1;
        changeFlag = true;
        break;
      }
    }
    if (changeFlag === true) {
      outcome = opinionArr.slice(outcomeBeg, outcomeEnd).join(" ");
    }

    let obj = {
      citation,
      caseTitle,
      // outcome,
      author,
      cites,
      wordCount,
      // link,
      // pOffice,
      // pAttorney,
      // dOffice,
      // dAttorney,
      attorneyStr
    };
    // console.log(obj);
    finalArr.push(obj);
    if (finalArr.length === links.length) {
      converter.json2csv(finalArr, function(err, csv) {
        console.log(csv);
      });
    }
  });
});
