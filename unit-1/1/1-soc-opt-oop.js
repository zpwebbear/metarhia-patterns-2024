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

class Row {
  #row;

  constructor(rawRow = {}) {
    this.#row = rawRow;
  }

  getValue(column) {
    return this.#row[column];
  }

  addValue(column, value) {
    this.#row[column] = value;
  }

  toObject() {
    return this.#row;
  }

  toEntries() {
    return Object.entries(this.#row);
  }
}

class Column {

  #column;

  constructor(values) {
    this.#column = values;
  }

  addRow(value) {
    this.#column.push(value);
  }

  getRow(index) {
    return this.#column[index];
  }

  get maxValue() {
    return Math.max(...this.#column);
  }

  get maxLength() {
    const lengths = this.#column.map((v) => v.toString().length);
    return Math.max(...lengths);
  }
}

class Table {
  #rows = [];
  #columns = {};

  constructor(rawTable) {
    for (const rawRow of rawTable) {
      this.#rows.push(new Row(rawRow));
    }
    this.#recalculateColumns();
  }

  #recalculateColumns() {
    this.#columns = {};
    for (const row of this.#rows) {
      for (const entrie of row.toEntries()) {
        const key = entrie[0];
        const value = entrie[1];

        if (this.#columns[key] instanceof Column) {
          this.#columns[key].addRow(value);
        } else {
          this.#columns[key] = new Column([value]);
        }
      }
    }
  }

  get #columnNames() {
    return Object.keys(this.#columns);
  }

  getMaxValueByColumn(column) {
    return this.#columns[column].maxValue;
  }

  addComputedColumn({ column, callback = () => undefined }) {

    for (const row of this.#rows) {
      const computedValue = callback(row);
      row.addValue(column, computedValue);
    }

    this.#recalculateColumns();
    return this;
  }

  getRow(index) {
    return this.#rows[index];
  }

  getColumn(column) {
    return this.#columns[column];
  }

  sortBy(column, sortFn) {
    const sortingFunction = sortFn
      ? sortFn
      : (r1, r2) => r2.getValue(column) - r1.getValue(column);

    this.#rows.sort(sortingFunction);

    return this;
  }

  toPrintable({ gap = 4, leftAlignedColumns = [] }) {
    const paddings = {};
    for (const column of this.#columnNames) {
      paddings[column] = this.#columns[column].maxLength + gap;
    }

    let result = '';
    for (const row of this.#rows) {
      for (const column of this.#columnNames) {
        const padding = paddings[column];
        if (leftAlignedColumns.includes(column)) {
          result += row.getValue(column).toString().padEnd(padding);
        } else {
          result += row.getValue(column).toString().padStart(padding);
        }
      }
      result += '\n';
    }

    return result;
  }


  static fromCSVString(csvString) {
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

    return new Table(table);
  }
}

class Printer {
  #logger;
  constructor(logger) {
    this.#logger = logger;
  }

  log(message, ...values) {
    this.#logger.log(message, ...values);
  }
}


class App {
  printer;
  constructor(printer) {
    this.printer = printer;
  }

  run() {
    const table = Table.fromCSVString(data);
    const maxDensityValue = table.getMaxValueByColumn('density');

    const callback = (row) => Math.round(
      row.getValue('density') * 100 / maxDensityValue,
    );
    const result = table.addComputedColumn({ column: 'rank', callback })
      .sortBy('rank')
      .toPrintable({ gap: 2, leftAlignedColumns: ['city'] });

    this.printer.log(result);
  }
}

const printer = new Printer(console);
const app = new App(printer);
app.run();

module.exports = { Table };
