import Keyboard from './input/Keyboard.js';
import Mouse from './input/Mouse.js';
import State from './State.js';
import LoadingState from './state/LoadingState.js';
import Paddle from './Paddle.js';
import Ball from './Ball.js';

export default class BoyceBall {
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