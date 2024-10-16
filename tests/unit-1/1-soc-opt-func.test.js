'use strict';
const { describe, it } = require('node:test');
const assert = require('node:assert').strict;
const {
  convertCSVToTable,
  findMaxValueInColumn,
  addComputedColumn,
  sortTableByColumn,
  convertTableToPrintableString,
  createComputedDensityRankCallback,
} = require('../../unit-1/1/1-soc-opt-func');

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


describe('1-soc-opt-func', () => {
  it(`convertCSVToTable should return array of Rows. 
    Each Row is an object with named columns`, () => {
    const table = convertCSVToTable(data);

    assert(Array.isArray(table), true);
    const row = table[0];
    assert(row['city'], 'Shanghai');
  });

  it('Seventh row must contain data for the Mexico City', () => {
    const table = convertCSVToTable(data);
    const mexicoRow = table[6];

    const city = mexicoRow['city'];
    const population = mexicoRow['population'];
    const area = mexicoRow['area'];
    const density = mexicoRow['density'];
    const country = mexicoRow['country'];

    assert(city, 'Mexico City');
    assert(population, 8874724);
    assert(area, 1486);
    assert(density, 5974);
    assert(country, 'Mexico');

  });

  it('Max density should be a largest number from a density column', () => {
    const table = [
      { city: '1', area: 12, population: 2, density: 100, country: '1' },
      { city: '2', area: 12, population: 2, density: 200, country: '2' },
      { city: '3', area: 12, population: 2, density: 300, country: '3' },
      { city: '4', area: 12, population: 2, density: 500, country: '4' },
      { city: '5', area: 12, population: 2, density: 400, country: '5' },
    ];
    const maxDensity = findMaxValueInColumn({ table, column: 'density' });

    assert(maxDensity, 500);
  });

  it('Density rank should be calculated properly', () => {
    const table = [
      { city: '1', area: 12, population: 2, density: 100, country: '1' },
      { city: '2', area: 12, population: 2, density: 200, country: '2' },
      { city: '3', area: 12, population: 2, density: 300, country: '3' },
      { city: '4', area: 12, population: 2, density: 500, country: '4' },
      { city: '5', area: 12, population: 2, density: 400, country: '5' },
    ];
    const maxDensity = 500;
    const callback = createComputedDensityRankCallback(maxDensity);
    const tableWithDensityRank = addComputedColumn({
      table, column: 'rank', callback,
    });

    assert(tableWithDensityRank[0]['rank'], 20);
    assert(tableWithDensityRank[1]['rank'], 40);
    assert(tableWithDensityRank[2]['rank'], 60);
    assert(tableWithDensityRank[3]['rank'], 100);
    assert(tableWithDensityRank[4]['rank'], 80);
  });

  it('Table must be sorted by rank', () => {
    const table = [
      { city: '1', area: 12, population: 2, density: 100, country: '1' },
      { city: '2', area: 12, population: 2, density: 200, country: '2' },
      { city: '3', area: 12, population: 2, density: 300, country: '3' },
      { city: '4', area: 12, population: 2, density: 500, country: '4' },
      { city: '5', area: 12, population: 2, density: 400, country: '5' },
    ];

    const sortedTable = sortTableByColumn({ table, column: 'rank' });

    assert(sortedTable[0]['city'], '4');
    assert(sortedTable[1]['city'], '5');
    assert(sortedTable[2]['city'], '3');
    assert(sortedTable[3]['city'], '2');
    assert(sortedTable[4]['city'], '1');
  });

  it('Table should be converted to pritable string', () => {
    const table = [
      { city: '1', area: 12, population: 2, density: 100, country: '1' },
      { city: '2', area: 12, population: 2, density: 200, country: '2' },
      { city: '3', area: 12, population: 2, density: 300, country: '3' },
      { city: '4', area: 12, population: 2, density: 500, country: '4' },
      { city: '5', area: 12, population: 2, density: 400, country: '5' },
    ];
    const printableString = convertTableToPrintableString({ table });

    assert(typeof printableString === 'string', true);
  });

  it('Table printable string must contain rows delimited by newlines', () => {
    const table = [
      { city: '1', area: 12, population: 2, density: 100, country: '1' },
      { city: '2', area: 12, population: 2, density: 200, country: '2' },
      { city: '3', area: 12, population: 2, density: 300, country: '3' },
      { city: '4', area: 12, population: 2, density: 500, country: '4' },
      { city: '5', area: 12, population: 2, density: 400, country: '5' },
    ];
    const printableString = convertTableToPrintableString({ table, gap: 2 });
    const rows = printableString.split('\n');
    const firstRow = rows[0];
    const etalon = '1    12  2  100  1';
    assert(firstRow, etalon);
  });
});
