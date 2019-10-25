const allJudges = {
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
module.exports = {
  parseFourSides: val => {
    let tempConcurI = Math.max(val.indexOf("CONCUR"),val.indexOf("JOINED"))
    let tempConcurInResultI = val.indexOf("CONCUR IN THE RESULT");
    let tempRecuseI = val.indexOf("RECUSE");
    let tempDissentI = val.indexOf("DISSENT");
    let concurJudges = [];
    let concurInResultJudges = [];
    let recuseJudges = [];
    let dissentJudges = [];
    if (tempConcurI != -1) {
      Object.keys(allJudges).forEach(word => {
        if (val.slice(0, tempConcurI).indexOf(word) != -1) {
          concurJudges.push(word);
        }
      });
    }
    if (val.indexOf("CONCUR") != -1 && val.indexOf("RESULT") != -1) {
      Object.keys(allJudges).forEach(word => {
        if (val.slice(tempConcurI, tempConcurInResultI).indexOf(word) != -1) {
          concurInResultJudges.push(word);
        }
      });
    }
    if (val.indexOf("DISSENT") != -1) {
      let tempN = tempConcurInResultI != -1 ? tempConcurInResultI : tempConcurI;
      Object.keys(allJudges).forEach(word => {
        if (val.slice(tempN, tempDissentI).indexOf(word) != -1) {
          dissentJudges.push(word);
        }
      });
    }
    if (val.indexOf("RECUSE") != -1) {
      let tempNu =
        tempDissentI != -1
          ? tempDissentI
          : tempConcurInResultI != -1
          ? tempConcurInResultI
          : tempConcurI;
      Object.keys(allJudges).forEach(word => {
        if (val.slice(tempNu, tempRecuseI).indexOf(word) != -1) {
          recuseJudges.push(word);
        }
      });
    }
    return {
      concurJudges,
      concurInResultJudges,
      recuseJudges,
      dissentJudges
    };
  }
};
