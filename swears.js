const axios = require("axios");
const { parse } = require("node-html-parser");
const fs = require("fs/promises");
const Letters = require("./letters.json");

async function getWords(letter, mst = 0) {
  const html = (
    await axios.get(`https://2yxa.ru/mat/bukva/${letter}/?mst=${mst}`)
  ).data;
  const document = parse(html);
  const words = document.querySelectorAll(".nl a").map((e) => e.innerText);
  const Mst = document.querySelector("input[name=mst]")?.attrs?.value;
  if (Mst) words.push(...(await getWords(letter, Mst)));
  return words;
}

async function f() {
  const promises = Letters.map(letter=>getWords(letter));
  const words = (await Promise.all(promises)).flat();
  //console.log(words)
  await fs.writeFile(
    "./swears.txt",
    words.filter(word=>/ /.test(word)).map(word=>word).join("\n")+"."
  );
}
f();