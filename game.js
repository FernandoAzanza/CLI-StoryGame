const resolveAnimations = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

// Importing packages
import chalk from "chalk";
import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import gradient from 'gradient-string'
import { createSpinner } from "nanospinner";

// Create the spinner instance
const spinner = createSpinner();

let playerName;

async function startGame() {
    // Welcome message utilizing the chalk animation package
    const welcomeMsg = chalkAnimation.rainbow(`Welcome to the choose your adventure game \n`);
    // Call helper
    await resolveAnimations();
    // Stop the animation
    welcomeMsg.stop();
    // Prompt for the game
    console.log(`
    ${chalk.bgGreenBright('We shall begin')}
    This adventure lives in your terminal
    If you choose any of the wrong choices, I will ${chalk.bgRed('terminate')}
    If you make it to the end, you will be rewarded
    `);
}

async function playerInfo() {
    const answers = await inquirer.prompt({
        name: 'player_name',
        type: 'input',
        message: 'Hello, please enter your name.'
    });
    playerName = answers.player_name;
    await pathQuestion()
}

async function pathQuestion() {
    const answers = await inquirer.prompt({
        name: 'question_1',
        type: 'list',
        message: `Welcome ${playerName}, what path will you choose? \n`,
        choices: [
            { name: 'left - you hear a breeze echoing down the tunnel', value: 'left' },
            { name: 'right - you hear rocks crumbling in the distance', value: 'right' },
            { name: 'straight - you hear an eerie silence', value: 'straight' }
        ],
    });
    await pathChoice(answers.question_1);
}

async function pathChoice(choice) {
    spinner.start();
    await resolveAnimations();
    if (choice === 'left') {
        spinner.success({ text: `Interesting choice, ${playerName}, continue on` });
        await leftQuestion();
    } else if (choice === 'right') {
        spinner.warn({ text: `Interesting choice, ${playerName}, continue on` });
        await rightQuestion();
    } else {
        spinner.error({ text: chalk.bgRed(`FATAL - terminating process`) });
        process.exit(1)
    }
}

async function leftQuestion() {
    const answers = await inquirer.prompt({
        name: 'leftQuestion',
        type: 'list',
        message: `You have two choices: \n`,
        choices: [
            'Press the button',
            `Don't press the button`,
        ]
    });
    await handleLeftAnswer(answers.leftQuestion == 'Press the button');
}

async function handleLeftAnswer(choice) {
    spinner.start();
    await resolveAnimations();
    if (choice) {
        spinner.success({ text: `A secret passage opens, ${playerName}, you made the right choice` });
        await finalQuestion()
    } else {
        spinner.warn({ text: `${playerName}, you should have pressed the button. ${chalk.bgRed(`FATAL - terminating process due to inactivity`)}` });
        process.exit(1)
    }
}

async function rightQuestion() {
    const answers = await inquirer.prompt({
        name: 'rightQuestion',
        type: 'list',
        message: `Luckily you make it to the next stage. A screen appears with a question: What is JavaScript? \n`,
        choices: [
            `A good coffee brand`,
            `A programming language`,
            `It's Java but written in a script format`,
        ]
    });
    await handleRightQuestion(answers.rightQuestion == 'A programming language');
}

async function handleRightQuestion(choice) {
    spinner.start();
    await resolveAnimations();
    if (choice) {
        spinner.success({ text: `${playerName}, CORRECT! You have gained access to the final room` });
        await finalQuestion()
    } else {
        spinner.warn({ text: `${playerName} ${chalk.bgRed(`FATAL - INCORRECT CHOICE`)}` });
        process.exit(1)
    }
}

async function finalQuestion() {
    const answers = await inquirer.prompt({
        name: 'finalQuestion',
        type: 'list',
        message: `${chalk.bgGreen('You have made the correct decisions.')} One final question: "When did Node.js come out?"\n`,
        choices: [
            `2005`,
            `2009`,
            `1995`
        ]
    });
    await handleFinalAnswer(answers.finalQuestion == `2009`);
}

async function handleFinalAnswer(choice) {
    spinner.start();
    await resolveAnimations();
    if (choice) {
        spinner.success({ text: `Congratulations` });
        await winnerText()
    } else {
        spinner.warn({ text: `${chalk.bgRed(`FATAL - terminating process due to incorrect answer`)}` });
        process.exit(1)
    }
}

async function winnerText() {
    console.clear()
    const winMessage = `Congratulations ${playerName}`
    figlet(winMessage, (err, data) => {
        console.log(gradient.retro(data));
    })
}

async function main() {
    // Invoke our game functions here
    await startGame();
    await playerInfo();
}

main()
