'use strict';

const decals = {
  elevated: 'include ../../decals/elevated',
  owner: 'include ../../decals/owner',
  direct: 'include ../../decals/direct',
  blacklist: 'include ../../decals/blacklist',
  inline: 'include ../../decals/inline',
};

const path = require('path');
const fs = require('fs');

const commands = require('./commands.json');

const outFolder = '../partials/sections/categories/';

const categories = {};

const entity = str => str.replace(/[\u00A0-\u9999<>\&]/gim, i=> '&#'+i.charCodeAt(0)+';');

// convert command into pug tokens
commands.forEach((command) => {
  let token = `div.command\n  h4.command-name ${command.call}  &nbsp;`;
  
  if (command.requiresAuth) token += `\n    ${decals.elevated}`;
  if (command.ownerOnly) token += `\n    ${decals.owner}`;
  if (command.allowDM) token += `\n    ${decals.direct}`;
  if (!command.blacklistable) token += `\n    ${decals.blacklist}`;
  if (command.isInline) token += `\n    ${decals.inline}`;

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