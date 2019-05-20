import State from '../State.js';
import MainMenuState from '../state/MainMenuState.js';

export default class LoadingState extends State {
    constructor() {
        super();
        let assetsBase = './assets/';
        let assets = [
            ['img', 'jacob.png'],
            ['img', 'jacob1.png'],
            ['img', 'stock-photo-cyber-internet-robot-hacker-hacking-into-a-computer-to-steal-personal-data.png'],
            ['img', 'stats.png'],
        ];

        this.total = assets.length;
        this.loaded = 0;

        this.assetPromise = Promise.all(assets.map(asset => {
            switch (asset[0]) {
                case 'img': {
                    return new Promise((resolve, reject) => {
                        let img = new Image();
                        img.src = assetsBase + asset[1];
                        img.onload = () => {
                            this.loaded += 1;
                            resolve([asset[1], img]);
                        }
                    });
                }
                default:
                    throw asset[0];
            }
        }));
    }

    update(game) {
        super.update(game);

        if (this.loaded == this.total && game.keyboard.isDown(13)) {
            this.assetPromise.then(arr => {
                for (var i = 0; i != arr.length; i++) {
                    game.assets.set(arr[i][0], arr[i][1]);
                }
                game.state = new MainMenuState(game);
            });
        }
    }

    render(game) {
        super.render(game);
        let ctx = game.ctx;
        ctx.fillStyle = "#ff69b4";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "#69ffb4";
        ctx.font = "50px Comic Sans MS";
        ctx.fillText("Loading...", 50, 100);

        game.ctx.fillRect(50, 150, 50 + (ctx.canvas.width - 150) * (this.loaded / this.total), 100);

        ctx.fillText("$> BOYCE_BALL.EXE", 50, 300);
        ctx.fillText(this.loaded + '/' + this.total + ' assets loaded...', 50, 400);
        ctx.fillText('PRESS ENTER TO BEGIN', 50, 500);
    }
}