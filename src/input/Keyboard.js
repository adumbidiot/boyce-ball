export default class Keyboard {
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