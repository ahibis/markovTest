// Swear word parsing from https://2yxa.ru/mat/
const axios = require("axios");
const { parse } = require("node-html-parser");
const fs = require("fs/promises");
/* get Day after "offsetDay" at format YYMMDD from "fromDay"*/
function getDate(offsetDay,fromDay = "2020-03-01"){
  const startDayUNIX = (new Date(fromDay)).getTime();
  const msPerDay = 24* 60 * 60 * 1000;
  const date = new Date(startDayUNIX + offsetDay*msPerDay)
  const [_,yy,mm,dd] = /^..(..)-(..)-(..)/.exec(date.toISOString())
  return `${yy}${mm}${dd}`
}
async function getJokes(date) {
  const html = (await axios.get(`https://www.anekdot.ru/an/an2108/j${date};100.html`)).data;
  const document = parse(html);
  const jokes = document
    .querySelectorAll(".text")
    .map(({ innerText }) => innerText);
  return jokes;
}

async function f() {
  const promises = Array(300)
    .fill(0)
    .map((v,i) => getJokes(getDate(i)));
  const jokes = (await Promise.all(promises)).flat();
  //console.log(words)
  await fs.writeFile(
    "./jokes.txt",
    jokes.map((joke) => (/[.?!]$/.test(joke) ? joke : joke + ".")).join("\n")
  );
}
f();
