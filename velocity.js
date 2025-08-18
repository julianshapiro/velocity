/* @type {HTMLCanvasElement} **/
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d")
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})
class partials {
    constructor() {
        this.radius = 20; // size of the circle ill create
        this.positionX = Math.random() * (canvas.width - this.radius * 2) + this.radius;
        this.positionY = Math.random() * (canvas.height - this.radius * 2) + this.radius;
        this.velocityX = (Math.random() * 0.5) * (Math.random() * 10); // random velocity X
        this.velocityY = (Math.random() * 0.5) * (Math.random() * 10); // random velocity Y
        this.initialcolor = `hsl(${Math.random() * 360}, 0%, 40%)`;
    }
    updatepositions() {
        if (this.positionX + this.radius > canvas.width || this.positionX - this.radius < 0) {
            this.velocityX *= -1;
        }
        if (this.positionY + this.radius > canvas.height || this.positionY - this.radius < 0) {
            this.velocityY *= -1;
        } this.positionX += this.velocityX; this.positionY += this.velocityY; this.creations();
    }
    creations() {
        context.beginPath(); context.lineWidth = 1; context.fillStyle = this.initialcolor;
        context.strokeStyle = `hsl(${Math.random() * 360}, 0%, 50%)`;
        context.arc(this.positionX, this.positionY, this.radius, 0, Math.PI * 2, false);
        context.stroke(); context.fill(); context.closePath();
    }
}
let partial = [];
for (let j = 0; j < 1; j++) {
    partial.push(new partials());
}
function easing() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (const j of partial) {
        j.updatepositions();
    } requestAnimationFrame(easing);
} easing();
