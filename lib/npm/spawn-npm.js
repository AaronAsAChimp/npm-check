'use strict';

const chalk = require('chalk');
const execa = require('execa');
const ora = require('ora');

function install(packages, currentState) {
    if (!packages.length) {
        return Promise.resolve(currentState);
    }

    const installGlobal = currentState.get('global') ? '--global' : null;
    const saveExact = currentState.get('saveExact') ? '--save-exact' : null;
    const color = chalk.supportsColor ? '--color=always' : null;

    const npmArgs = ['install']
        .concat(installGlobal)
        .concat(saveExact)
        .concat(packages)
        .concat(color)
        .filter(Boolean);

    const installer = process.env.NPM_CHECK_INSTALLER || 'npm';
    const logMessage = `${chalk.green(installer)} ${chalk.green(npmArgs.join(' '))}`;
    const spinner = ora(logMessage);
    spinner.start();

    return execa(installer, npmArgs, {cwd: currentState.get('cwd')}).then(output => {
        spinner.stop();
        console.log(logMessage);
        console.log(output.stdout);
        console.log(output.stderr);

        return currentState;
    });
}

module.exports = {
    install
};
