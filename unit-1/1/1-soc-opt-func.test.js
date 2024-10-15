'use strict';
const { describe, it } = require('node:test');
const assert = require('node:assert').strict;
const {
  addDensityRankColumn,
  findMaxDensity,
  parseStringToTable,
  sortTableByDensityRank,
} = require('./1-soc-opt-func');

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


describe('1-soc-opt', () => {
  it('parseStringToTable should return array of arrays', () => {
    const table = parseStringToTable(data);

    assert(Array.isArray(table), true);
    const row = table[0];
    assert(Array.isArray(row), true);
  });

  it('Seventh row must contain data for the Mexico City', () => {
    const table = parseStringToTable(data);
    const mexicoRow = table[6];

    const city = mexicoRow[0];
    const population = mexicoRow[1];
    const area = mexicoRow[2];
    const density = mexicoRow[3];
    const country = mexicoRow[4];

    assert(city, 'Mexico City');
    assert(population, 8874724);
    assert(area, 1486);
    assert(density, 5974);
    assert(country, 'Mexico');

  });

  it('Max density should be a largest number from a density column', () => {
    const table = [
      ['1', 23, 344, 535, '1'],
      ['2', 23, 344, 535213, '2'],
      ['3', 23, 344, 1, '3'],
      ['4', 23, 344, 0, '4'],
    ];
    const maxDensity = findMaxDensity(table);

    assert(maxDensity, 535213);
  });

  it('Density rank should be calculated properly', () => {
    const table = [
      ['1', 23, 344, 535, '1'],
      ['2', 23, 344, 699, '2'],
      ['3', 23, 344, 200, '3'],
      ['4', 23, 344, 300, '4'],
    ];
    const maxDensity = 699;
    const tableWithDensityRank = addDensityRankColumn(table, maxDensity);

    assert(tableWithDensityRank[0][5], 77);
    assert(tableWithDensityRank[1][5], 100);
    assert(tableWithDensityRank[2][5], 29);
    assert(tableWithDensityRank[3][5], 43);
  });

  it('Table must be sorted by rank', () => {
    const table = [
      ['1', 23, 344, 535, '1', 77],
      ['2', 23, 344, 699, '2', 100],
      ['3', 23, 344, 200, '3', 29],
      ['4', 23, 344, 300, '4', 43],
    ];

    const sortedTable = sortTableByDensityRank(table);

    assert(sortedTable[0][0], '2');
    assert(sortedTable[1][0], '1');
    assert(sortedTable[2][0], '3');
    assert(sortedTable[3][0], '3');
  });
});
