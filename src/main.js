window.setup = () => {
    window.createCanvas(window.innerWidth, window.innerHeight);

};

window.windowResized = () => {
    window.resizeCanvas(window.innerWidth, window.innerHeight);
}

window.draw = () => {
    window.background(100, 100, 100);

    window.fill(255, 100, 10);
    window.rect(50, 50, 200, 150);
};

window.keyPressed = () => {
    console.log(window.keyCode);
};
window.keyReleased = () => {
    console.log(window.keyCode);
};
