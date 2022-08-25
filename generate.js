// Swear word parsing from https://2yxa.ru/mat/
const axios = require("axios");
const { parse } = require("node-html-parser");
const fs = require("fs/promises");

async function getJokes() {
  const html = (await axios.get(`https://www.anekdot.ru/random/anekdot/`)).data;
  const document = parse(html);
  const jokes = document
    .querySelectorAll(".text")
    .map(({ innerText }) => innerText);
  return jokes;
}

async function f() {
  const promises = Array(300)
    .fill(0)
    .map(() => getJokes());
  const jokes = (await Promise.all(promises)).flat();
  //console.log(words)
  await fs.writeFile(
    "./jokes.txt",
    jokes.map((joke) => (/[.?!]$/.test(joke) ? joke : joke + ".")).join("\n")
  );
}
f();
