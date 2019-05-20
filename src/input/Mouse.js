export default class Mouse {
    constructor(game) {
        this.game = game;
        this.clicks = [];
        game.ctx.canvas.addEventListener('click', (e) => {
            this.clicks.push(e);
        });
    }

    getClick(index) {
        if (!this.clicks[index]) {
            return null;
        }
        const canvas = this.game.ctx.canvas;
        const event = this.clicks[index];
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        return {
            x,
            y
        };
    }

    clear() {
        this.clicks.length = 0;
    }
}