'use strict';
const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert').strict;
const {
  Table,
} = require('../../unit-1/1/1-soc-opt-oop');

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


describe('1-soc-opt-oop', () => {
  /**
   * @type {Table}
   */
  let table;

  beforeEach(() => {
    table = Table.fromCSVString(data);
  });

  it(`Table.fromCSVString should return instance of Table`, () => {
    assert(table instanceof Table, true);
  });

  it('Seventh row must contain data for the Mexico City', () => {
    const mexicoRow = table.getRow(6);

    const city = mexicoRow.getValue('city');
    const population = mexicoRow.getValue('population');
    const area = mexicoRow.getValue('area');
    const density = mexicoRow.getValue('density');
    const country = mexicoRow.getValue('country');

    assert(city, 'Mexico City');
    assert(population, 8874724);
    assert(area, 1486);
    assert(density, 5974);
    assert(country, 'Mexico');

  });

  it('Max density should be a largest number from a density column', () => {
    const maxDensity = table.getMaxValueByColumn('density');

    assert(maxDensity, 13712);
  });

  it('Density rank should be calculated properly', () => {

    const maxDensityValue = 13712;
    const callback = (row) => Math.round(
      row.getValue('density') * 100 / maxDensityValue,
    );
    const tableWithDensityRank = table.addComputedColumn({
      column: 'rank', callback,
    });

    assert(tableWithDensityRank.getRow(0).getValue('rank'), 100);
    assert(tableWithDensityRank.getRow(1).getValue('rank'), 83);
    assert(tableWithDensityRank.getRow(2).getValue('rank'), 79);
    assert(tableWithDensityRank.getRow(3).getValue('rank'), 58);
    assert(tableWithDensityRank.getRow(4).getValue('rank'), 45);
    assert(tableWithDensityRank.getRow(5).getValue('rank'), 44);
    assert(tableWithDensityRank.getRow(6).getValue('rank'), 40);
    assert(tableWithDensityRank.getRow(7).getValue('rank'), 38);
    assert(tableWithDensityRank.getRow(8).getValue('rank'), 28);
    assert(tableWithDensityRank.getRow(9).getValue('rank'), 19);
  });

  it('Table must be sorted by rank', () => {

    const maxDensityValue = 13712;
    const callback = (row) => Math.round(
      row.getValue('density') * 100 / maxDensityValue,
    );
    const sortedTable = table.addComputedColumn({
      column: 'rank', callback,
    }).sortBy('rank');

    assert(sortedTable.getRow(0).getValue('city'), 'Lagos');
    assert(sortedTable.getRow(1).getValue('city'), 'Delhi');
    assert(sortedTable.getRow(2).getValue('city'), 'New York City');
    assert(sortedTable.getRow(3).getValue('city'), 'Sao Paulo');
    assert(sortedTable.getRow(4).getValue('city'), 'Tokyo');
  });

  it('Table should be converted to pritable string', () => {

    const printableString = table.toPrintable({});

    assert(typeof printableString === 'string', true);
  });

  it('Table printable string must contain rows delimited by newlines', () => {
    const printableString = table.toPrintable({
      gap: 2, leftAlignedColumns: ['city'],
    });
    const rows = printableString.split('\n');
    const firstRow = rows[0];

    // eslint-disable-next-line
    const etalon = 'Lagos            16060303  1171  13712         Nigeria  100';
    assert(firstRow, etalon);
  });
});
