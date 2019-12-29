#! /usr/bin/env node
/* 
Downloads and collates data from the Burningman API for use in BMApp

Syntax: getdata [year1] [year2] ...
Examples: getdata
          getdata 2015 2019 2020

[years] is optional, but must be year 2015 or later.
*/

import { getData } from "../common/api";
import * as fs from "fs";

const dir = `${process.cwd()}/app/data`.replace("\\", "/");

/* Write BM API output to file <year>.json */
const downloadSingleYear = (year: number) => getData(year)
  .then(data => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const fileName = `${dir}/${year}.json`
    fs.writeFile(fileName, data, err => {
      if (err) throw err;
    });
  })
  .then(() => console.info(`${year}.json done`))
  .catch(err => console.error(err));

/* Call downloadSingleYear in succession, given an array of years */
const downloadYears = (years: number[]) => {
  if (years.length) {
    downloadSingleYear(years[0]).then(() => downloadYears(years.slice(1)))
  } else console.info("All files written")
}
const noArgs = process.argv.length === 2;

if (noArgs) {
  // we want all of the years since and including 2015
  const thisYear = new Date().getFullYear();
  const getAllYears = (year: number, yearsArr: number[] = []): number[] => year >= 2015 ? getAllYears(year - 1, [...yearsArr, year]) : yearsArr
  const allYears = getAllYears(thisYear)
  downloadYears(allYears)
} else {
  const args = process.argv.slice(2)
  const isValid = args.every(arg => arg.match(/20\d{2}/) && parseInt(arg) >= 2015)
  if (!isValid) {
    const msg = `getdata arguments should be years since 2015, e.g. 2019, you have '${args.join(" ")}'`
    console.error(msg)
  }
  else {
    const years = args.map(y => parseInt(y))
    downloadYears(years)
  }
}
