// Swear word parsing from https://2yxa.ru/mat/
const axios = require("axios");
const { parse } = require("node-html-parser");
const fs = require("fs/promises");
/* get Day after "offsetDay" at format YYMMDD from "fromDay"*/
async function getUrls(){
  const html = (await axios.get(`https://teksty-pesenok.ru/rus-dora/`)).data
  const document = parse(html);
  return document
    .querySelectorAll("td>a")
    .map(e=>e.attrs?.href)
}
async function getLyrics(url){
  const html = (await axios.get(url)).data
  const document = parse(html);
  return document.querySelector(".textPesni")?.innerText
}

async function f() {
  const urls = await getUrls()
  console.log(urls)
  const promises = urls
    .map(url => "https://teksty-pesenok.ru/" + url)
    .map(url => getLyrics(url));
  const lyrics = (await Promise.all(promises)).flat().map(text=>text);
  console.log(lyrics[0])
  await fs.writeFile(
      "./dora.txt",
      lyrics.map((joke) => (/[.?!]$/.test(joke) ? joke : joke + ".")).join("\n")
  );
}
f();
