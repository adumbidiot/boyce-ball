export default class Ball {
    constructor(game) {
        this.x = 1;
        this.y = 1;
        this.w = 100;
        this.h = 100;
        this.dx = 10;
        this.dy = 10;
    }

    update(game) {
        let canvas = game.ctx.canvas;
        if (this.y + this.w > canvas.height || this.y < 0) {
            this.dy *= -1;
        }

        if (this.x - this.w > canvas.width || this.x < 0) { //KEEP
            this.dx *= -1;
        }

        this.x += this.dx;
        this.y += this.dy;
    }

    render(game) {
        let img = game.assets.get('jacob.png');
        game.ctx.drawImage(img, this.x, this.y, this.w, this.h);
    }
}