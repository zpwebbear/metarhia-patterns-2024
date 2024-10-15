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


function convertCSVToTable(csvString) {
  const tableStringRows = csvString.split('\n');
  const normalizedTable = tableStringRows.map((row) => row.split(','));
  const parsedTable = normalizedTable.map((row) => row.map((cell) => {
    const parsedValue = Number(cell);
    if (!isNaN(parsedValue)) {
      return parsedValue;
    }
    return cell.trim();
  }));

  const tableHeader = parsedTable[0];
  const tableBody = parsedTable.slice(1);

  const table = new Array(tableBody.length);
  for (let rowIndex = 0; rowIndex < tableBody.length; rowIndex++) {
    const bodyRow = tableBody[rowIndex];
    const row = {};
    for (let columnIndex = 0; columnIndex < bodyRow.length; columnIndex++) {
      const column = tableHeader[columnIndex];
      row[column] = bodyRow[columnIndex];
    }
    table[rowIndex] = row;
  }

  return table;
}

function findMaxValueInColumn({ table, column }) {
  let max = 0;

  for (const row of table) {
    const value = row[column];
    if (value > max) {
      max = value;
    }
  }

  return max;
}

const createComputedDensityRankCallback =
 (max) => (row) => Math.round(row['density'] * 100 / max);

function addComputedColumn({ table, column, callback = () => undefined }) {
  const updatedTable = new Array(table.length);

  for (let i = 0; i < table.length; i++) {
    const row = table[i];
    const updatedRow = Object.assign({}, row);
    updatedRow[column] = callback(row);
    updatedTable[i] = updatedRow;
  }

  return updatedTable;
}

function sortTableByColumn({
  table, column, sortFunction = (row1, row2) => row2[column] - row1[column],
}) {
  return table.toSorted(sortFunction);
}

function convertTableToPrintableString({
  table, gap = 4, leftAlignedColumns = [],
}) {
  const sampleRow = table[0];
  const columns = Object.keys(sampleRow);

  const columnPaddings = columns.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {});

  for (const row of table) {
    const rowEntries = Object.entries(row);
    for (const entries of rowEntries) {
      const key = entries[0];
      const value = entries[1].toString();
      const padding = value.length + gap;
      const existingPadding = columnPaddings[key];
      columnPaddings[key] = padding > existingPadding
        ? padding : existingPadding;
    }
  }

  let result = '';
  for (const row of table) {
    for (const column of columns) {
      const columnPadding = columnPaddings[column];
      if (leftAlignedColumns.includes(column)) {
        result += row[column].toString().padEnd(columnPadding);
      } else {
        result += row[column].toString().padStart(columnPadding);
      }
    }
    result += '\n';
  }

  return result;
}

function funcSolution(data) {
  const table = convertCSVToTable(data);

  const maxDensity = findMaxValueInColumn({ table, column: 'density' });

  const callback = createComputedDensityRankCallback(maxDensity);
  const tableWithDensityRank = addComputedColumn({
    table,
    column: 'rank',
    callback,
  });

  const sortedTable = sortTableByColumn({
    table: tableWithDensityRank,
    column: 'rank',
  });

  const tableString = convertTableToPrintableString({
    table: sortedTable, gap: 2, leftAlignedColumns: ['city'],
  });

  console.log(tableString);
}

funcSolution(data);


module.exports = {
  convertCSVToTable,
  findMaxValueInColumn,
  addComputedColumn,
  sortTableByColumn,
  convertTableToPrintableString,
  createComputedDensityRankCallback,
};
