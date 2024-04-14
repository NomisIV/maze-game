import { CELL_SIZE, FOG_FADE_IN, FOG_FADE_OUT, MOVE_SPEED } from "./constants.js";

let playerSprite, ammoSprite;
let tilesets = {};
let monsterSprites = {};
let pixelFont;

export function loadGraphics() {
    playerSprite = window.loadImage("assets/player.png");
    ammoSprite = window.loadImage("assets/shotgun-shell.png");
    tilesets["mansion"] = window.loadImage("assets/mansion-tiles.png");
    tilesets["sand"] = window.loadImage("assets/sand-tiles.png");
    tilesets["hell"] = window.loadImage("assets/hell-tiles.png");
    monsterSprites["minotaur"] = window.loadImage("assets/demon-asset-pack/premium/premium asset pack/Premium Demon Animations/Rancorous Bull/RancorousBull.png");
    // monsterSprites["bat"] = window.loadImage("assets/demon-asset-pack/basic/basic asset pack/Basic Demon Animations/nefarious scamp/NefariousScamp.png");
    // monsterSprites["dog"] = window.loadImage("assets/demon-asset-pack/premium/premium asset pack/Premium Demon Animations/rabid cerberus/RabidCerberus.png");

    monsterSprites["antlered rascal"] = window.loadImage("assets/demon-asset-pack/basic/basic asset pack/Basic Demon Animations/antlered rascal/AntleredRascal.png");
    monsterSprites["clawed abomination"] = window.loadImage("assets/demon-asset-pack/basic/basic asset pack/Basic Demon Animations/clawed abomination/ClawedAbomination.png");
    monsterSprites["crimson imp"] = window.loadImage("assets/demon-asset-pack/basic/basic asset pack/Basic Demon Animations/crimson imp/CrimsonImp.png");
    monsterSprites["Depraved Blackguard"] = window.loadImage("assets/demon-asset-pack/basic/basic asset pack/Basic Demon Animations/Depraved Blackguard/DepravedBlackguard.png");
    monsterSprites["fledgling demon"] = window.loadImage("assets/demon-asset-pack/basic/basic asset pack/Basic Demon Animations/fledgling demon/FledglingDemon.png");
    monsterSprites["floating eye"] = window.loadImage("assets/demon-asset-pack/basic/basic asset pack/Basic Demon Animations/floating eye/FloatingEye.png");
    monsterSprites["foul gouger"] = window.loadImage("assets/demon-asset-pack/basic/basic asset pack/Basic Demon Animations/foul gouger/FoulGouger.png");
    monsterSprites["grinning gremlin"] = window.loadImage("assets/demon-asset-pack/basic/basic asset pack/Basic Demon Animations/grinning gremlin/GrinningGremlin.png");
    monsterSprites["nefarious scamp"] = window.loadImage("assets/demon-asset-pack/basic/basic asset pack/Basic Demon Animations/nefarious scamp/NefariousScamp.png");
    monsterSprites["pit balor"] = window.loadImage("assets/demon-asset-pack/basic/basic asset pack/Basic Demon Animations/pit balor/PitBalor.png");
    monsterSprites["pointed demonspawn"] = window.loadImage("assets/demon-asset-pack/basic/basic asset pack/Basic Demon Animations/pointed demonspawn/PointedDemonspawn.png");
    monsterSprites["Rascally Demonling"] = window.loadImage("assets/demon-asset-pack/basic/basic asset pack/Basic Demon Animations/Rascally Demonling/RascallyDemonling.png");
    monsterSprites["skewering stalker"] = window.loadImage("assets/demon-asset-pack/basic/basic asset pack/Basic Demon Animations/skewering stalker/SkeweringStalker.png");
    monsterSprites["tainted scoundrel"] = window.loadImage("assets/demon-asset-pack/basic/basic asset pack/Basic Demon Animations/tainted scoundrel/TaintedScoundrel.png");
    monsterSprites["warp skull"] = window.loadImage("assets/demon-asset-pack/basic/basic asset pack/Basic Demon Animations/warp skull/WarpSkull.png");

    monsterSprites["armored goliath"] = window.loadImage("assets/demon-asset-pack/supporter/supporter asset pack/Supporter Demon Animations/armored goliath/ArmoredGoliath.png");
    monsterSprites["beastly impaler"] = window.loadImage("assets/demon-asset-pack/supporter/supporter asset pack/Supporter Demon Animations/beastly impaler/BeastlyImpalerIdleSide.png");
    monsterSprites["blade hellion"] = window.loadImage("assets/demon-asset-pack/supporter/supporter asset pack/Supporter Demon Animations/blade hellion/BladeHellion.png");
    monsterSprites["Blood Drinker"] = window.loadImage("assets/demon-asset-pack/supporter/supporter asset pack/Supporter Demon Animations/Blood Drinker/BloodDrinker.png");
    monsterSprites["bulging incubus"] = window.loadImage("assets/demon-asset-pack/supporter/supporter asset pack/Supporter Demon Animations/bulging incubus/BulgingIncubus.png");
    monsterSprites["dastardly Crusher"] = window.loadImage("assets/demon-asset-pack/supporter/supporter asset pack/Supporter Demon Animations/dastardly Crusher/DastardlyCrusher.png");
    monsterSprites["deadly cambion"] = window.loadImage("assets/demon-asset-pack/supporter/supporter asset pack/Supporter Demon Animations/deadly cambion/DeadlyCambion.png");
    monsterSprites["demonic arachnid"] = window.loadImage("assets/demon-asset-pack/supporter/supporter asset pack/Supporter Demon Animations/demonic arachnid/DemonicArachnid.png");
    monsterSprites["ebon astaroth"] = window.loadImage("assets/demon-asset-pack/supporter/supporter asset pack/Supporter Demon Animations/ebon astaroth/EbonAstaroth.png");
    monsterSprites["horned brute"] = window.loadImage("assets/demon-asset-pack/supporter/supporter asset pack/Supporter Demon Animations/horned brute/HornedBrute.png");
    monsterSprites["pronged fury"] = window.loadImage("assets/demon-asset-pack/supporter/supporter asset pack/Supporter Demon Animations/pronged fury/ProngedFury.png");
    monsterSprites["red devil"] = window.loadImage("assets/demon-asset-pack/supporter/supporter asset pack/Supporter Demon Animations/red devil/RedDevil.png");
    monsterSprites["spiked ravager"] = window.loadImage("assets/demon-asset-pack/supporter/supporter asset pack/Supporter Demon Animations/spiked ravager/SpikedRavager.png");
    monsterSprites["vicious miscreant"] = window.loadImage("assets/demon-asset-pack/supporter/supporter asset pack/Supporter Demon Animations/vicious miscreant/ViciousMiscreant.png");
    monsterSprites["wicked wretch"] = window.loadImage("assets/demon-asset-pack/supporter/supporter asset pack/Supporter Demon Animations/wicked wretch/WickedWretch.png");

    monsterSprites["abyssal baron"] = window.loadImage("assets/demon-asset-pack/premium/premium asset pack/Premium Demon Animations/abyssal baron/AbyssalBaron.png");
    monsterSprites["combusting balrog"] = window.loadImage("assets/demon-asset-pack/premium/premium asset pack/Premium Demon Animations/combusting balrog/CombustingBalrog.png");
    monsterSprites["evil titan"] = window.loadImage("assets/demon-asset-pack/premium/premium asset pack/Premium Demon Animations/evil titan/EvilTitan.png");
    monsterSprites["gigantic juggernaut"] = window.loadImage("assets/demon-asset-pack/premium/premium asset pack/Premium Demon Animations/gigantic juggernaut/GiganticJuggernaut.png");
    monsterSprites["infernal scorcher"] = window.loadImage("assets/demon-asset-pack/premium/premium asset pack/Premium Demon Animations/infernal scorcher/InfernalScorche.png");
    monsterSprites["leering leviathan"] = window.loadImage("assets/demon-asset-pack/premium/premium asset pack/Premium Demon Animations/leering leviathan/LeeringLevithan.png");
    monsterSprites["Maleficent Ape"] = window.loadImage("assets/demon-asset-pack/premium/premium asset pack/Premium Demon Animations/Maleficent Ape/MaleficentApe.png");
    monsterSprites["malignant gazer"] = window.loadImage("assets/demon-asset-pack/premium/premium asset pack/Premium Demon Animations/malignant gazer/malignantgazer.png");
    monsterSprites["Mighty Desolator"] = window.loadImage("assets/demon-asset-pack/premium/premium asset pack/Premium Demon Animations/Mighty Desolator/MightyDesolator.png");
    monsterSprites["rabid cerberus"] = window.loadImage("assets/demon-asset-pack/premium/premium asset pack/Premium Demon Animations/rabid cerberus/RabidCerberus.png");
    monsterSprites["Rancorous Bull"] = window.loadImage("assets/demon-asset-pack/premium/premium asset pack/Premium Demon Animations/Rancorous Bull/RancorousBull.png");
    monsterSprites["Sanguine Annihilator"] = window.loadImage("assets/demon-asset-pack/premium/premium asset pack/Premium Demon Animations/Sanguine Annihilator/SanguineAnnihilator.png");
    monsterSprites["Towering Mongrel"] = window.loadImage("assets/demon-asset-pack/premium/premium asset pack/Premium Demon Animations/Towering Mongrel/ToweringMongrel.png");
    monsterSprites["vile tyrant"] = window.loadImage("assets/demon-asset-pack/premium/premium asset pack/Premium Demon Animations/vile tyrant/VileTyrant.png");
    monsterSprites["warp lord"] = window.loadImage("assets/demon-asset-pack/premium/premium asset pack/Premium Demon Animations/warp lord/WarpLord.png");

    pixelFont = window.loadFont("assets/pixel-emulator-font/PixelEmulator-xq08.ttf")
}

function cellSizeScreen() {
    let size = Math.min(window.width, window.height);
    let scale = size / (CELL_SIZE * 6);

    return CELL_SIZE * Math.max(1, Math.floor(scale));
}

function roundToPixel(coord) {
    return Math.round(coord * CELL_SIZE) / CELL_SIZE;
}

function roundToScreenPixel(coord) {
    return Math.round(coord * cellSizeScreen()) / cellSizeScreen();
}

export class Graphics {
    constructor(tilesetName) {
        this.cameraX = null;
        this.cameraY = null;
        this.playerX = null;
        this.playerY = null;
        this.monsterPos = [];
        this.shownTiles = new Map();
        this.showAll = false;
        this.tileset = tilesets[tilesetName];

        this.grayTileset = window.createImage(48, 32);
        this.grayTileset.copy(this.tileset, 0, 0, 48, 32, 0, 0, 48, 32);
        this.grayTileset.filter(window.GRAY);
    }

    shownTime(x, y) {
        if (!this.shownTiles.has([x, y].join(" "))) return 0;
        return (Date.now() - this.shownTiles.get([x, y].join(" "))) / 1000;
    }

    addShown(x, y) {
        if (this.shownTiles.has([x, y].join(" "))) {
            let oldTime = this.shownTiles.get([x, y].join(" "));
            if (oldTime + FOG_FADE_OUT * 1000 < Date.now()) {
                this.shownTiles.set([x, y].join(" "), Date.now() - FOG_FADE_OUT * 1000);
            }
        } else {
            this.shownTiles.set([x, y].join(" "), Date.now());
        }
    }

    copyExplored(other) {
        for (let [pos, _] of other.shownTiles) {
            this.shownTiles.set(pos, Date.now() - FOG_FADE_IN * 1000);
        }
    }

    moveCamera() {
        if (this.playerX === null || this.playerY === null) return;

        if (this.cameraX === null || this.cameraY === null) {
            this.cameraX = this.playerX + 0.5;
            this.cameraY = this.playerY + 0.5;
        }

        let lerp = Math.exp(-window.deltaTime / 1000 * 3.0);
        this.cameraX = lerp * this.cameraX + (1 - lerp) * (this.playerX + 0.5);
        this.cameraY = lerp * this.cameraY + (1 - lerp) * (this.playerY + 0.5);
    }


    startDrawing() {
        window.push();
        window.noSmooth();
        window.translate(Math.floor(window.width / 2), Math.floor(window.height / 2));
        window.scale(cellSizeScreen());
        window.translate(-roundToScreenPixel(this.cameraX || 0), -roundToScreenPixel(this.cameraY || 0));
        //window.scale(32);

        window.background(50, 50, 50);
    }

    endDrawing() {
        window.pop();
    }

    drawMaze(maze) {
        let minX = Math.floor((this.cameraX || 0) - window.width / 2 / cellSizeScreen());
        let maxX = Math.ceil((this.cameraX || 0) + window.width / 2 / cellSizeScreen());
        let minY = Math.floor((this.cameraY || 0) - window.height / 2 / cellSizeScreen());
        let maxY = Math.ceil((this.cameraY || 0) + window.height / 2 / cellSizeScreen());

        
        for (let y = minY; y < maxY; y++) {
            for (let x = minX; x < maxX; x++) {
                let time = this.shownTime(x, y);
                if (time <= 0 && !this.showAll) continue;
                let tileset = time < FOG_FADE_IN || this.showAll ? this.tileset : this.grayTileset;

                window.push();
                window.translate(x, y);

                let wallU = maze.hasWall(x, y, x + 1, y);
                let wallL = maze.hasWall(x, y, x, y + 1);
                let wallD = maze.hasWall(x, y + 1, x + 1, y + 1);
                let wallR = maze.hasWall(x + 1, y, x + 1, y + 1);
                window.image(tileset, 0.25, 0.25, 0.5, 0.5, 0, 0, 16, 16);

                window.image(tileset, 0, 0.25, 0.25, 0.5, wallL ? 24 : 8, 0, 8, 16);
                window.image(tileset, 0.75, 0.25, 0.25, 0.5, wallR ? 16 : 0, 0, 8, 16);
                window.image(tileset, 0.25, 0, 0.5, 0.25, wallU ? 32 : 0, 8, 16, 8);
                window.image(tileset, 0.25, 0.75, 0.5, 0.25, wallD ? 32 : 0, 0, 16, 8);

                if (wallU && wallL) window.image(tileset, 0, 0, 0.25, 0.25, 24, 24, 8, 8);
                else if (wallU) window.image(tileset, 0, 0, 0.25, 0.25, 40, 8, 8, 8);
                else if (wallL) window.image(tileset, 0, 0, 0.25, 0.25, 24, 8, 8, 8);
                else window.image(tileset, 0, 0, 0.25, 0.25, 8, 24, 8, 8);

                if (wallU && wallR) window.image(tileset, 0.75, 0, 0.25, 0.25, 16, 24, 8, 8);
                else if (wallU) window.image(tileset, 0.75, 0, 0.25, 0.25, 32, 8, 8, 8);
                else if (wallR) window.image(tileset, 0.75, 0, 0.25, 0.25, 16, 8, 8, 8);
                else window.image(tileset, 0.75, 0, 0.25, 0.25, 0, 24, 8, 8);

                if (wallD && wallL) window.image(tileset, 0, 0.75, 0.25, 0.25, 24, 16, 8, 8);
                else if (wallD) window.image(tileset, 0, 0.75, 0.25, 0.25, 40, 0, 8, 8);
                else if (wallL) window.image(tileset, 0, 0.75, 0.25, 0.25, 24, 0, 8, 8);
                else window.image(tileset, 0, 0.75, 0.25, 0.25, 8, 16, 8, 8);

                if (wallD && wallR) window.image(tileset, 0.75, 0.75, 0.25, 0.25, 16, 16, 8, 8);
                else if (wallD) window.image(tileset, 0.75, 0.75, 0.25, 0.25, 32, 0, 8, 8);
                else if (wallR) window.image(tileset, 0.75, 0.75, 0.25, 0.25, 16, 0, 8, 8);
                else window.image(tileset, 0.75, 0.75, 0.25, 0.25, 0, 16, 8, 8);

                window.pop();

            }
        }

    }

    drawPlayer(player) {
        if (this.playerX === null || this.playerY === null) {
            this.playerX = player.posX;
            this.playerY = player.posY;
        }

        let maxDelta = 1 / MOVE_SPEED;
        let limit = v => Math.min(Math.max(-maxDelta, v), maxDelta);
        this.playerX += limit(player.posX - this.playerX);
        this.playerY += limit(player.posY - this.playerY);

        if (player.isDead) {
            window.push();
            window.translate(roundToPixel(this.playerX + 0.5), roundToPixel(this.playerY + 0.5));
            window.rotate(-90);
            if (player.dir === "left") {
                window.scale(1, -1);
            }
            window.image(playerSprite, -0.25, -0.25, 0.5, 0.5, 0, 0, 16, 16);
            window.pop();
            return;
        }

        let dir = ["right", "left", "up", "down"].indexOf(player.direction);
        window.image(playerSprite, this.playerX + 0.25, this.playerY + 0.25, 0.5, 0.5, dir * 16, 0, 16, 16);
    }

    drawMonsters(monsters) {
        for (let i = 0; i < monsters.length; i++) {
            let monster = monsters[i];
            if (i >= this.monsterPos.length) {
                this.monsterPos.push([monster.posX, monster.posY]);
            }
            let [monsterX, monsterY] = this.monsterPos[i];

            let maxDelta = 1 / MOVE_SPEED;
            let limit = v => Math.min(Math.max(-maxDelta, v), maxDelta);
            monsterX += limit(monster.posX - monsterX);
            monsterY += limit(monster.posY - monsterY);
            this.monsterPos[i] = [monsterX, monsterY];

            if (this.shownTime(monster.posX, monster.posY) > FOG_FADE_IN && !this.showAll) {
                continue;
            }

            if (!(monster.type in monsterSprites)) continue;
            let monsterSprite = monsterSprites[monster.type];

            if (monster.isDead) {
                window.push();
                window.translate(roundToPixel(monsterX + 0.5), roundToPixel(monsterY + 0.5));
                window.rotate(-90);
                if (monster.isLookingLeft) {
                    window.scale(1, -1);
                }
                window.image(monsterSprite, -0.25, -0.25, 0.5, 0.5, 0, 0, 16, 16);
                window.pop();
                continue;
            }

            let sx = Math.floor(window.frameCount / 60 * 10) % 4 * 16;
            if (sx === 48 && monster.type === "minotaur") sx = 16;
            window.push();
            window.translate(roundToPixel(monsterX + 0.5), roundToPixel(monsterY + 0.5))
            if (monster.isLookingLeft) {
                window.scale(-1, 1);
            }
            window.image(monsterSprite, -0.25, -0.25, 0.5, 0.5, sx, 0, 16, 16);
            window.pop();
        }
    }

    drawAmmunition(x, y) {
        let float = Math.floor(window.frameCount / 60 * 2) % 2 / 16;
        window.image(ammoSprite, x + 0.25, y + 0.25 + float, 0.5, 0.5)
    }

    exploreAt(x, y, maze, dist = 2, seen = new Set()) {
        if (seen.has([x, y].join(" "))) return;
        seen.add([x, y].join(" "));

        this.addShown(x, y);
        if (dist < 1) return;

        if (!maze.hasWall(x + 1, y, x + 1, y + 1))
            this.exploreAt(x + 1, y, maze, dist - 1, seen);
        if (!maze.hasWall(x, y + 1, x + 1, y + 1))
            this.exploreAt(x, y + 1, maze, dist - 1, seen);
        if (!maze.hasWall(x, y, x, y + 1))
            this.exploreAt(x - 1, y, maze, dist - 1, seen);
        if (!maze.hasWall(x, y, x + 1, y))
            this.exploreAt(x, y - 1, maze, dist - 1, seen);
    }

    drawFogOfWar(maze, player) {

        window.noStroke();

        this.exploreAt(player.posX, player.posY, maze);

        let minX = Math.floor((this.cameraX || 0) - window.width / 2 / cellSizeScreen());
        let maxX = Math.ceil((this.cameraX || 0) + window.width / 2 / cellSizeScreen());
        let minY = Math.floor((this.cameraY || 0) - window.height / 2 / cellSizeScreen());
        let maxY = Math.ceil((this.cameraY || 0) + window.height / 2 / cellSizeScreen());

        for (let y = minY; y < maxY; y++) {
            for (let x = minX; x < maxX; x++) {
                if (this.showAll && x >= 0 && y >= 0 && x < maze.width && y < maze.height)
                    continue;

                let time = this.shownTime(x, y);
                if (time < FOG_FADE_OUT) {
                    let alpha = 1 - time / FOG_FADE_OUT;
                    window.fill(0, 0, 0, alpha * 255);
                    window.rect(x, y, 1, 1);
                } else {
                    let alpha = Math.min((time - FOG_FADE_OUT) / FOG_FADE_IN, 1);
                    window.fill(0, 0, 0, alpha * 128);
                    window.rect(x, y, 1, 1);
                }
            }
        }
    }

    drawUI(player, monsters, attempt) {
        window.noSmooth();
        for (let a = 0; a < Math.min(player.ammunition, 5); a++) {
            window.image(ammoSprite, window.width - 128 - 64 * a, window.height - 128, 128, 128);
        }
        window.textFont(pixelFont);
        window.fill('yellow');
        window.textAlign(LEFT);
        window.textSize(50);
        window.text('Attempt: ' + attempt, 32, window.height - 32);
        if (player.isDead) {
            window.textSize(100);
            window.textAlign(CENTER);
            window.text('You died', window.width / 2, window.height / 2);
            window.textSize(50);
            window.text('Press R to retry', window.width / 2, window.height / 2 + 100);
        }
        if (monsters.every((monster) => monster.isDead)) {
            window.textSize(100);
            window.textAlign(CENTER);
            window.text('You survived', window.width / 2, window.height / 2);
            window.textSize(50);
            window.text('Press Enter to return to the menu', window.width / 2, window.height / 2 + 100);
        }
    }
}

export function drawMainMenu() {
    window.textFont(pixelFont);
    window.textSize(100);
    window.fill('yellow');
    window.textAlign(CENTER);
    window.text('Minotaur Hunter', window.width / 2, window.height / 2 - 100);
    window.textSize(50);
    window.text('Press 1 for "Minotaur Maze"', window.width / 2, window.height / 2);
    window.text('Press 2 for "Luigi\'s Mansion"', window.width / 2, window.height / 2 + 100);
    window.text('Press 3 for "Literal Hell"', window.width / 2, window.height / 2 + 200);
}
