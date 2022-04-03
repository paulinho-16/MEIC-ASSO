const puppeteer = require("puppeteer");
const fs = require("fs");

interface Association {
  name: String,
  information: Object
}

function parseAssociationBody(association) {
  const parsedAssociation: Association = { name: association.name, information: {} };

  const lines = association.body.split("\n");
  let body = {};

  for (let line of lines) {
    if (line === "") continue;

    line = line.replaceAll(/(<([^>]+)>)|(\s)|(&[a-z]+;)/gi, "");

    const colonIndex = line.indexOf(":");

    let datapointName = line.substring(0, colonIndex),
      datapointValue = line.substring(colonIndex + 1, line.length);

    switch (datapointName) {
      case "Horário":
        datapointName = "timetable";
        break;
      case "Telefone":
        datapointName = "phone";
        break;
      case "Email":
        datapointName = "email";
        break;
      case "Site":
        datapointName = "website";
        break;
      case "Facebook":
        datapointName = "facebook";
        break;
      case "Instagram":
        datapointName = "instagram";
        break;
    }

    body = Object.assign(body, { [datapointName]: datapointValue });
  }

  parsedAssociation.information = body;

  return parsedAssociation;
}

async function scrap() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://paginas.fe.up.pt/~estudar/vida-na-feup/associacoes-de-estudantes/"
  );

  const parseAssociations = function (associations) {
    let results = [];

    for (const association of associations) {
      const name = association.querySelector(
        "span.fusion-toggle-heading"
      ).textContent;
      const body = association.querySelector("div.panel-body").innerHTML;
      results.push({ name, body });
    }
    return results;
  };

  const associations1 = await page.$$eval(
    "#accordion-37-1 > div",
    parseAssociations
  );

  const associations2 = await page.$$eval(
    "#accordion-37-2 > div",
    parseAssociations
  );

  const associations = associations1.concat(associations2);

  const parsedAssociations = associations.map(parseAssociationBody);

  fs.writeFileSync("data.json", JSON.stringify(parsedAssociations), {
    flag: "a",
  });

  await browser.close();
}

scrap();
