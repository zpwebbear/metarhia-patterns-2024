'use strict';

// Tasks for rewriting:
//   - Apply optimizations of computing resources: processor, memory
//   - Minimize cognitive complexity
//   - Respect SRP and SoC
//   - Improve readability (understanding), reliability
//   - Optimize for maintainability, reusability, flexibility
//   - Make code testable
//   - Implement simple unittests without frameworks
//   - Try to implement in multiple paradigms: OOP, FP, procedural, mixed

const data = `city,population,area,density,country
  Shanghai,24256800,6340,3826,China
  Delhi,16787941,1484,11313,India
  Lagos,16060303,1171,13712,Nigeria
  Istanbul,14160467,5461,2593,Turkey
  Tokyo,13513734,2191,6168,Japan
  Sao Paulo,12038175,1521,7914,Brazil
  Mexico City,8874724,1486,5974,Mexico
  London,8673713,1572,5431,United Kingdom
  New York City,8537673,784,10892,United States
  Bangkok,8280925,1569,5279,Thailand`;


function parseStringToTable(data) {
  const NUMBER_COLUMN_INDEXES = [1, 2, 3];
  const stringRows = data.split('\n');
  const table = new Array(stringRows.length - 1);

  for (let i = 1; i < stringRows.length; i++) {
    const rawRow = stringRows[i].split(',');
    const row = rawRow.map((rawColumn, index) => {
      if (NUMBER_COLUMN_INDEXES.includes(index)) {
        return parseInt(rawColumn);
      }

      return rawColumn.trim();
    });
    table[i - 1] = row;
  }

  return table;
}

function findMaxDensity(table) {
  let max = 0;

  for (const row of table) {
    const density = row[3];
    if (density > max) {
      max = density;
    }
  }

  return max;
}

function addDensityRankColumn(table, max) {
  const updatedTable = new Array(table.length);

  for (let i = 0; i < table.length; i++) {
    const row = table[i];
    const updatedRow = Array.from(row);
    const densityRank = Math.round(row[3] * 100 / max);
    updatedRow.push(densityRank);
    updatedTable[i] = updatedRow;
  }

  return updatedTable;
}

function sortTableByDensityRank(table) {
  const densityColumnIndex = 5;
  return table.toSorted(
    (row1, row2) => row2[densityColumnIndex] - row1[densityColumnIndex],
  );
}

function printTable(table) {
  for (const row of table) {
    let s = row[0].toString().padEnd(18);
    s += row[1].toString().padStart(10);
    s += row[2].toString().padStart(8);
    s += row[3].toString().padStart(8);
    s += row[4].toString().padStart(18);
    s += row[5].toString().padStart(6);
    console.log(s);
  }
}

function funcSolution(data) {
  const table = parseStringToTable(data);
  const maxDensity = findMaxDensity(table);
  const tableWithDensityRank = addDensityRankColumn(table, maxDensity);
  const sortedTable = sortTableByDensityRank(tableWithDensityRank);
  printTable(sortedTable);
}

funcSolution(data);


module.exports = {
  parseStringToTable,
  findMaxDensity,
  addDensityRankColumn,
  sortTableByDensityRank,
  printTable,
};
