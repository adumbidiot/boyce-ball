import State from '../State.js';
import Button from '../Button.js';

export default class MainMenuState extends State {
    constructor(game) {
        super();
        let width = 200 * 2;
        let height = 100 * 2;
        let twoPlayer = new Button(game.ctx.canvas.width / 2 - width / 2, game.ctx.canvas.height / 2 - height / 2, width, height);
        twoPlayer.text = "Two Player";
        twoPlayer.textColor = "#47E3FF";
        twoPlayer.textStyle = "60px Comic Sans MS";
        twoPlayer.style = "	#FF6347";
        twoPlayer.onclick = (game) => {
            game.state = new TwoPlayerState(game);
        };

        this.buttons = [
            twoPlayer,
        ];
    }

    update(game) {
        super.update(game);
        for (var i = 0; i != this.buttons.length; i++) {
            this.buttons[i].update(game);
        }
    }

    render(game) {
        super.render(game);
        let ctx = game.ctx;
        let bg = game.assets.get('stock-photo-cyber-internet-robot-hacker-hacking-into-a-computer-to-steal-personal-data.png');
        let scale = Math.max((ctx.canvas.height / bg.height), (ctx.canvas.width / bg.width));
        ctx.drawImage(bg, 0, 0, bg.width * scale, bg.height * scale);

        for (var i = 0; i != this.buttons.length; i++) {
            this.buttons[i].render(game);
        }
    }
}