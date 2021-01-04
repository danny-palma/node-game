console.clear();
const { greenBright, redBright } = require("chalk");
const { createInterface, cursorTo, clearLine, clearScreenDown } = require("readline");
const windowManager = require("./win-manager");

var maxColums = process.stdout.columns;
var maxRows = process.stdout.rows;

process.stdout.on("resize", () => {
    maxColums = process.stdout.columns;
    maxRows = process.stdout.rows;
});

var windowInterface = createInterface({
    output: process.stdout,
    input: process.stdin,
    prompt: ""
});

windowInterface.input.on("keypress", (keyPress, keyInfo) => {
    switch (keyInfo.name) {
        // move player Y
        case "up":
            windowManager.player.y == 3 ? null : windowManager.player.y -= 1;
            break;
        case "down":
            windowManager.player.y == maxColums ? null : windowManager.player.y += 1;
            break;
        // move player X
        case "left":
            windowManager.player.x == 0 ? null : windowManager.player.x -= 1;
            break;
        case "right":
            windowManager.player.x == maxRows ? null : windowManager.player.x += 1;
            break;
        default:
            null;
            break;
    }
});

setInterval(() => {
    windowManager.bullets.push({
        x: 1,
        y: getRandomInt(3, 25)
    });
    for (const entity of windowManager.bullets) {
        entity.x += 1;
    };
}, 1000);

function getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
};

// graphics
async function updatePlayer() {
    process.stdout.cursorTo(windowManager.player.x, windowManager.player.y, async () => {
        process.stdout.write("█");
        await updateBullets();
        return true;
    })
}
async function updateBullets() {
    var count = 0;
    var update = () => {
        process.stdout.cursorTo(windowManager.bullets[count].x, windowManager.bullets[count].y, () => {
            process.stdout.write("-->");
            count++;
            update();
        });
    }
}
async function updateLives() {

}
setInterval(async () => {
    process.stdout.cursorTo(0, 3, () => {
        process.stdout.clearScreenDown(async () => {
            await updatePlayer();
        })
    })
}, 16);
