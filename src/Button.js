import Rect from './Rect.js';

export default class Button {
    constructor(x, y, w, h) {
        this.rect = new Rect(x, y, w, h);
        this.onclick = () => {};
    }

    update(game) {
        for (var i = 0; i != game.mouse.clicks.length; i++) {
            const click = game.mouse.getClick(i);
            if (this.rect.intersectsPoint(click)) {
                this.onclick(game);
            }
        }
    }

    render(game) {
        let ctx = game.ctx;
        ctx.fillStyle = this.style || 'white';
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
        if (this.text) {
            ctx.font = this.textStyle || '30px Comic Sans MS';
            ctx.fillStyle = this.textColor || 'white';
            ctx.textAlign = 'center';
            ctx.fillText(this.text, this.rect.x + (this.rect.w / 2), this.rect.y + (this.rect.h / 2));
        }
    }
}