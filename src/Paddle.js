import Rect from './Rect.js';

export default class Paddle {
    constructor(game, team) {
        let canvas = game.ctx.canvas;
        this.team = team;

        let w = 50;
        let h = 200;

        let x = team == 1 ? 50 : canvas.width - (50 + w);
        let y = (canvas.height - h) / 2;

        this.rect = new Rect(x, y, w, h);
    }

    update() {}

    moveDown(game) {
        this.rect.y += 10;
        let canvas = game.ctx.canvas;
        if (this.rect.y + this.rect.h > canvas.height) {
            this.rect.y = canvas.height - this.rect.h;
        }
    }

    moveUp() {
        this.rect.y -= 10;
        let canvas = game.ctx.canvas;
        if (this.rect.y < 0) {
            this.rect.y = 0
        }
    }

    render(game) {
        let ctx = game.ctx;
        ctx.fillStyle = this.team == 1 ? game.team1Color : game.team2Color;
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
    }
}