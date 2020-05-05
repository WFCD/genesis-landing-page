'use strict';

const path = require('path');
const fs = require('fs');

const commands = require('./commands.json');

const outFolder = '../partials/sections/categories/';

const categories = {};

const entity = str => str.replace(/[\u00A0-\u9999<>\&]/gim, i=> '&#'+i.charCodeAt(0)+';');

// convert command into pug tokens
commands.forEach((command) => {
  let token = `div.command\n  h4.command-name ${command.call}`;

  if (command.usages) {
    token +=`\n  ol.usages`;
    command.usages.forEach((usage) => {
      token += `\n    li.usage\n      span.description ${usage.description}\n      ul.params`;
      usage.parameters.forEach((param) => {
        if (command.delimiters) {
          token += `\n        li.param \n          pre ${entity(command.delimiters.begin)}${param}${entity(command.delimiters.end)}`;
        } else {
          token += `\n        li.param ${param}`;
        }
      });
    });
  }
  if (!categories[command.game.toLowerCase()]) {
    categories[command.game.toLowerCase()] = [];
  }
  categories[command.game.toLowerCase()].push(token);
});

Object.keys(categories).forEach((category) => {
  fs.writeFileSync(path.join(path.normalize(outFolder), `${category}.pug`), categories[category].join('\n\n'));
});