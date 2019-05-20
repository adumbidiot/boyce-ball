var BoyceBall = (function () {
    'use strict';

    class Keyboard {
        constructor() {
            this.keys = new Map();
            window.addEventListener("keydown", (e) => {
                this.keys.set(e.keyCode, true);
            });

            window.addEventListener("keyup", (e) => {
                this.keys.set(e.keyCode, false);
            });
        }

        isDown(code) {
            return this.keys.get(code);
        }
    }

    class Mouse {
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

    class State {
        update(game) {}

        render(game) {
            game.ctx.clearRect(0, 0, game.ctx.canvas.width, game.ctx.canvas.height);
        }
    }

    class Rect {
        constructor(x, y, w, h) {
            this.x = x || 0;
            this.y = y || 0;
            this.w = w || 0;
            this.h = h || 0;
        }

        getPoints() {}

        intersectsPoint(point) {
            return point.x > this.x && point.x < this.w + this.x && point.y > this.y && point.y < this.y + this.h;
        }
    }

    class Button {
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

    class MainMenuState extends State {
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

    class LoadingState extends State {
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
                            };
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

    class Paddle {
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
                this.rect.y = 0;
            }
        }

        render(game) {
            let ctx = game.ctx;
            ctx.fillStyle = this.team == 1 ? game.team1Color : game.team2Color;
            ctx.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
        }
    }

    class Ball {
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

    class BoyceBall {
        constructor(ctx) {
            this.ctx = ctx;
            this.state = new LoadingState();
            this.keyboard = new Keyboard();
            this.mouse = new Mouse(this);
            this.assets = new Map();
            this.FPS = 60;
            this.team1Color = '#FF0000';
            this.team2Color = '#47E3FF';
        }

        start() {
            this.loopInterval = setInterval(this.mainLoop.bind(this), (1000 / this.FPS) | 0);
        }

        mainLoop() {
            this.state.update(this);
            this.state.render(this);
            this.mouse.clear();
        }
    }

    BoyceBall.State = State;
    BoyceBall.Paddle = Paddle;
    BoyceBall.Ball = Ball;

    return BoyceBall;

}());
