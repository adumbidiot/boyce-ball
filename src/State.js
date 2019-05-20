export default class State {
    update(game) {}

    render(game) {
        game.ctx.clearRect(0, 0, game.ctx.canvas.width, game.ctx.canvas.height);
    }
}