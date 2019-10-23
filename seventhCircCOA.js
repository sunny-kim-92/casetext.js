const cheerio = require("cheerio");
const rp = require("request-promise");
const converter = require("json-2-csv");

const links = [
  "http://casetext.com/case/united-states-v-truitt-6",
  "http://casetext.com/case/first-midwest-bank-v-reinbold-in-re-i80-equip-llc",
  "http://casetext.com/case/karma-intl-v-indianapolis-motor-speedway",
  "http://casetext.com/case/united-states-v-khan-95",
  "http://casetext.com/case/senegal-ex-rel-a-class-v-jpmorgan-chase-bank-na",
  "http://casetext.com/case/riley-v-ewing",
  "http://casetext.com/case/aguero-v-bd-of-trs-of-univ-of-ill",
  "http://casetext.com/case/buford-v-laborers-intl-union-local-1",
  "http://casetext.com/case/united-states-v-veras-6",
  "http://casetext.com/case/gross-v-bell-1",
  "http://casetext.com/case/united-states-v-adams-2026",
  "http://casetext.com/case/united-states-v-woodward-18",
  "http://casetext.com/case/annan-v-benignetti-1",
  "http://casetext.com/case/united-states-v-carpenter-144",
  "http://casetext.com/case/owens-v-duncan-14",
  "http://casetext.com/case/united-states-v-pineda-sanchez-3",
  "http://casetext.com/case/camm-v-faith",
  "http://casetext.com/case/marx-v-richland-cnty-1",
  "http://casetext.com/case/brooks-ngwenya-v-indianapolis-pub-sch-1",
  "http://casetext.com/case/luster-malone-v-cook-cnty-3",
  "http://casetext.com/case/odei-v-us-dept-of-homeland-sec",
  "http://casetext.com/case/united-states-v-segal-17",
  "http://casetext.com/case/jkj-v-polk-cnty-7",
  "http://casetext.com/case/weinhaus-v-cohen-1",
  "http://casetext.com/case/williams-v-saul-20",
  "http://casetext.com/case/united-states-v-collins-422",
  "http://casetext.com/case/united-states-v-gardner-164",
  "http://casetext.com/case/weiland-v-loomis-1",
  "http://casetext.com/case/stone-v-signode-indus-grp-1",
  "http://casetext.com/case/osorio-v-tile-shop-llc-5",
  "http://casetext.com/case/novotny-v-plexus-corp-2",
  "http://casetext.com/case/united-states-v-yates-73",
  "http://casetext.com/case/vergara-v-city-of-chi",
  "http://casetext.com/case/mcgarry-mcgarry-llc-v-bankr-mgmt-sols-inc",
  "http://casetext.com/case/mountain-crest-srl-v-anheuser-busch-inbev-sanv",
  "http://casetext.com/case/crum-forster-specialty-ins-co-v-dvo-inc",
  "http://casetext.com/case/franklin-v-bowens-1",
  "http://casetext.com/case/hye-young-park-v-secolsky",
  "http://casetext.com/case/balsewicz-v-blumer-3",
  "http://casetext.com/case/estate-of-her-v-hoeppner",
  "http://casetext.com/case/koehn-v-delta-outsource-grp-inc-1",
  "http://casetext.com/case/washington-v-chi-bd-of-educ",
  "http://casetext.com/case/leibundguth-storage-van-serv-v-vill-of-downers-grove",
  "http://casetext.com/case/leeper-v-hamilton-cnty-coal-llc",
  "http://casetext.com/case/bertha-v-hain",
  "http://casetext.com/case/linder-v-united-states-11",
  "http://casetext.com/case/williams-v-kelly-30",
  "http://casetext.com/case/weiland-v-loomis",
  "http://casetext.com/case/lexington-ins-co-v-hotai-ins-co",
  "http://casetext.com/case/cohen-v-minneapolis-jewish-fedn-6",
  "http://casetext.com/case/stallings-v-best-1",
  "http://casetext.com/case/united-states-v-greco-10",
  "http://casetext.com/case/bush-v-united-states-79",
  "http://casetext.com/case/chazen-v-marske",
  "http://casetext.com/case/united-states-v-navarro-106",
  "http://casetext.com/case/davis-v-kayira",
  "http://casetext.com/case/wakley-v-city-of-indianapolis"
];

const allJudges = {
  WOOD: true,
  BAUER: true,
  FLAUM: true,
  EASTERBROOK: true,
  RIPPLE: true,
  MANION: true,
  KANNE: true,
  ROVNER: true,
  SYKES: true,
  HAMILTON: true,
  BARRETT: true,
  BRENNAN: true,
  SCUDDER: true,
  EVE: true
};

let finalArr = [];

// links.forEach(link => {
  // rp(link)
    rp("http://casetext.com/case/riley-v-ewing")

    // rp("https://casetext.com/case/chazen-v-marske")
    // rp("https://casetext.com/case/united-states-v-navarro-106")
    .then(res => {
      return cheerio.load(res);
    })
    .then($ => {
      const introObj = $(`p#pa5`);
      const caseTitle = $(`.title-text.text-truncate`).text();
      const petitionerName = caseTitle.split(" v. ")[0];
      const respondantName = caseTitle.split(" v. ")[1];
      const citation = $(`span.citation`).text();
      let author = $(`p.byline`).text();
      const judges = [];
      let lCourt = "";
      let lJudge = "";
      let outcome = "";
      const concurJudges = [];
      const dissentJudges = [];
      let flag = false;
      let wordCount = opinionObj.text().split(" ").length;
      const otherWordCounts = []


      let titleStr = introObj
        .text()
        .replace(/[, ]+/g, " ")
        .trim();

      // Author + Lower Court Judge
      let titleBody = titleStr
        .replace(/Chief/g, "")
        .replace(/Judge/g, "")
        .replace(/Circuit/g, "")
        .replace(/Magistrate/g, "")
        .replace(/ORDER/g, "")
        .trim()
        .split(" ")
        .filter(word => word != "" && word != ".")

      if (author.indexOf("PER CURIAM") != -1) {
        author = "PER CURIAM";
        lJudge = introObj.children(`b`).text();
      } else if (author === "") {
        if (typeof titleBody[titleBody.length - 2] === "string") {
          !titleBody[titleBody.length - 2].endsWith(".")
            ? (lJudge = titleBody
                .slice(titleBody.length - 2, titleBody.length)
                .join(" "))
            : !titleBody[titleBody.length - 3].endsWith(".")
            ? (lJudge = titleBody
                .slice(titleBody.length - 3, titleBody.length)
                .join(" "))
            : (lJudge = titleBody
                .slice(titleBody.length - 4, titleBody.length)
                .join(" "));
        } else {
          lJudge = titleBody
            .slice(titleBody.length - 3, titleBody.length - 1)
            .join(" ");
        }
      } else {
        author = author.replace(/[, ]+/g, " ").split(" ")[0];
        lJudge = introObj.children(`b`).text();
      }

      // Lower Court Name
      if (titleStr.indexOf("Western District") != -1) {
        lCourt = "US District Court for the Western District of Wisconsin";
      }
      if (titleStr.indexOf("Central District") != -1) {
        lCourt = "US District Court for the Central District of Illinois";
      }
      if (titleStr.indexOf("Southern District") != -1) {
        if (titleStr.indexOf("Illinois") != -1) {
          lCourt = "US District Court for the Southern District of Illinois";
        } else {
          lCourt = "US District Court for the Western District of Wisconsin";
        }
      }
      if (titleStr.indexOf("Northern District") != -1) {
        if (titleStr.indexOf("Illinois") != -1) {
          lCourt = "US District Court for the Northern District of Illinois";
        } else {
          lCourt = "US District Court for the Western District of Wisconsin";
        }
      } else {
        lCourt = "US District Court for the Eastern District of Wisconsin";
      }

      // All Judges
      introObj
        .text()
        .replace(/[, ]+/g, " ")
        .trim()
        .split(" ")
        .forEach(word => {
          if (word === word.toUpperCase()) {
            if (allJudges[word]) {
              word === "EVE" ? judges.push("ST EVE") : judges.push(word);
            }
          }
        });

      const opinionObj = $(`section.decision.opinion`);

      const opinionArr = [];
      opinionObj.children().each(function(i, el) {
        opinionArr.push(
          $(this)
            .text()
            .trim()
        );
      });
      // console.log(opinionArr)

      // Outcome (rough)
      const decisionStr = opinionObj
        .children()
        .last()
        .text();
      if (
        decisionStr.indexOf("REVERSE") != -1 ||
        decisionStr.indexOf("AFFIRM") != -1 ||
        decisionStr.indexOf("REMAND") != -1 ||
        decisionStr.indexOf("VACATE") != -1 ||
        decisionStr.indexOf("GRANT") != -1 ||
        decisionStr.indexOf("DENIED") != -1
      ) {
        outcome = decisionStr.replace(/[, ]+/g, " ").trim();
      } else {
        for (let u = opinionArr.length - 1; u > 0; u--) {
          if (
            opinionArr[u].indexOf("Judge, dissent") != -1 ||
            opinionArr[u].indexOf("Judge, concur") != -1
          ) {
            outcome = opinionArr[u - 1].trim();
            break;
            flag = true;
          }
        }
      }

      // Dissenting/Concurring Judges & Word Counts(rough)
      opinionArr.forEach(el => {
        if (el.indexOf("Judge, concur") != -1) {
          dissentJudges.push(el.split(" ")[0].replace(/[, ]+/g, " "));
          let opinionStr = opinionObj.text()
          otherWordCounts.push(wordCount - opinionStr.indexOf("el"))
          wordCount = opinionStr.indexOf("el")
        } else if (el.indexOf("Judge, dissent") != -1) {
          let opinionStr = opinionObj.text()
          if (otherWordCounts.length != 0){
            otherWordCounts.push(wordCount+otherWordCounts[0]-el.indexOf("Judge, dissent"))
            otherWordCounts[0] = el.indexOf("Judge, dissent") - wordCount
          }
          else{
            otherWordCounts.push(wordCount - opinionStr.indexOf("el"))
            wordCount = opinionStr.indexOf("el")
          }
          otherWordCounts.push(wordCount - opinionStr.indexOf("el"))
          concurJudges.push(el.split(" ")[0].replace(/[, ]+/g, " "));
        }
      });

      // Citations
      const citesArr = $(`.raw-ref`)
        .map(function(i, el) {
          return $(this).text();
        })
        .get();
      const cites = [...new Set(citesArr)];

      // Word Count

      let obj = {
        citation,
        caseTitle,
        outcome,
        author,
        lCourt,
        lJudge,
        judges,
        dissentJudges,
        concurJudges,
        cites,
        wordCount,
        link,
        flag
      };
      console.log(obj)
      finalArr.push(obj);
      if (finalArr.length === links.length) {
        converter.json2csv(finalArr, function(err, csv) {
          console.log(csv);
        });
      }
    });
// });
