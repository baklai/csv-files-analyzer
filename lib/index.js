import chalk from 'chalk';
import { join, parse } from 'path';
import { writeFileSync } from 'fs';
import csvToJson from 'convert-csv-to-json';
import { select, checkbox } from '@inquirer/prompts';

import { findCSVFiles } from '../utils/index.js';

const DIRECTIRY = 'data';

const RESULT_FILE = 'output.txt';

export async function mergeRecords() {
  try {
    const csvFiles = findCSVFiles(DIRECTIRY);

    if (csvFiles.length === 0) {
      throw new Error('Файли CSV не знайдено!');
    }

    const selectedCSVFiles = await checkbox({
      message: 'Виберіть файли CSV:',
      choices: csvFiles.map(file => ({ name: file, value: file }))
    });

    const response = { filename: 'output.csv', records: [], column: '' };

    response.filename = selectedCSVFiles.map(filename => parse(filename).name).join(' & ') + '.csv';

    for (const file of selectedCSVFiles) {
      console.info(chalk.bgGreen.bold('Опрацьовуємо файл:'), chalk.green(file));

      const jsonData = csvToJson.getJsonFromCsv(join(DIRECTIRY, file));

      const columns = Object.keys(jsonData[jsonData.length - 1]);

      const selectedColumn = await select({
        message: 'Виберіть стовпець:',
        choices: columns.map(column => ({ name: column, value: column }))
      });

      response.column = response.column + selectedColumn.replaceAll(',', '').replaceAll(';', '');

      response.records.push(...jsonData.map(item => item[selectedColumn]));
    }

    const csvContent = `${response.column}\n` + response.records.join('\n');

    writeFileSync(join(DIRECTIRY, response.filename), csvContent, 'utf8');

    console.info('\n', chalk.bgGreen.bold('Створено файл:'), chalk.green(response.filename), '\n');
  } catch (err) {
    console.error(chalk.bgRed(err.message));
  }
}

export async function duplicateRecords() {
  try {
    const csvFiles = findCSVFiles(DIRECTIRY);

    if (csvFiles.length === 0) {
      throw new Error('Файли CSV не знайдено!');
    }

    const selectedCSVFiles = await checkbox({
      message: 'Виберіть файли CSV:',
      choices: csvFiles.map(file => ({ name: file, value: file }))
    });

    const records = [];

    for (const file of selectedCSVFiles) {
      console.info(chalk.bgGreen.bold('Опрацьовуємо файл:'), chalk.green(file));

      const jsonData = csvToJson.getJsonFromCsv(join(DIRECTIRY, file));

      const columns = Object.keys(jsonData[jsonData.length - 1]);

      const selectedColumn = await select({
        message: 'Виберіть стовпець:',
        choices: columns.map(column => ({ name: column, value: column }))
      });

      records.push(...jsonData.map(item => item[selectedColumn]));
    }

    const countItems = records.reduce((acc, item) => {
      acc[item] = acc[item] ? acc[item] + 1 : 1;
      return acc;
    }, {});

    const duplicates = Object.keys(countItems).filter(item => countItems[item] > 1);

    if (duplicates.length) {
      console.info('\n', chalk.bgGreen.bold('Дубльовані записи:'));
      console.table(duplicates);
    } else {
      console.info('\n', chalk.bgRed.bold('Немає дублікатів записів'), '\n');
    }
  } catch (err) {
    console.error(chalk.bgRed(err.message));
  }
}

export async function differenceRecords() {
  try {
    const csvFiles = findCSVFiles(DIRECTIRY);

    if (csvFiles.length === 0) {
      throw new Error('Файли CSV не знайдено!');
    }

    const selectedCSVFiles = await checkbox({
      message: 'Виберіть файли CSV:',
      choices: csvFiles.map(file => ({ name: file, value: file }))
    });

    const dataFiles = [];

    for (const file of selectedCSVFiles) {
      console.info(chalk.bgGreen.bold('Опрацьовуємо файл:'), chalk.green(file));

      const jsonData = csvToJson.getJsonFromCsv(join(DIRECTIRY, file));

      const columns = Object.keys(jsonData[jsonData.length - 1]);

      const selectedColumn = await select({
        message: 'Виберіть стовпець:',
        choices: columns.map(column => ({ name: column, value: column }))
      });

      dataFiles.push({
        filename: file,
        records: jsonData.map(item => item[selectedColumn])
      });
    }

    for (const data of dataFiles) {
      console.info(chalk.green(`${data.filename}:`), chalk.bold(data.records.length));
    }

    // if (uniqueValues.length > 0) {
    //   console.info('\n', chalk.bgGreen.bold('Дубльовані записи:'));
    //   console.table(uniqueValues);
    //   console.info('Values ​​found in collection.');
    // } else {
    //   console.info('\n', chalk.bgRed.bold('Немає дублікатів записів'), '\n');
    // }
  } catch (err) {
    console.error(chalk.bgRed(err.message));
  }
}
