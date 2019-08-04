import { getData } from "../common/api";
import * as fs from "fs";

const YEAR = 2019;
const dir = `${__dirname}/data`;

getData(YEAR)
  .then(data => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.writeFile(`${dir}/${YEAR}.json`, data, err => {
      if (err) throw err;
      else throw "Unknown file write error";
    });
  })
  .then(() => console.log("done"))
  .catch(err => console.error(err));
