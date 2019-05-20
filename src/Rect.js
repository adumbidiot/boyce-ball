export default class Rect {
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