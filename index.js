import chalk from 'chalk';
import { select } from '@inquirer/prompts';

import { mergeRecords, duplicateRecords, differenceRecords } from './lib/index.js';

function exitFromConverter() {
  process.exit('Вихід із програми');
}

const main = async () => {
  try {
    do {
      const answer = await select({
        message: 'Виберіть пункт меню для виконання',
        choices: [
          {
            name: "Об'єднати записи",
            value: async () => await mergeRecords()
          },
          {
            name: 'Пошук дублікатів записів',
            value: async () => await duplicateRecords()
          },
          {
            name: 'Пошук різниці між записами',
            value: async () => await differenceRecords()
          },
          {
            name: 'Вихід із програми',
            value: async () => exitFromConverter()
          }
        ]
      });

      if (typeof answer === 'function') {
        await answer();
      } else {
        console.error(`Function ${answer} does not exist.`);
      }
    } while (true);
  } catch (err) {
    if (err?.name === 'ExitPromptError') {
      console.info('Вихід із програми');
      process.exit(0);
    } else {
      console.error('Виникла помилка:', err.message);
      process.exit(1);
    }
  }
};

main();
