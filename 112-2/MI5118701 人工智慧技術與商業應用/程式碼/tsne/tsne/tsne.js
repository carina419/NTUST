"use strict";
/**
 * Dimension reduction of feature with t-SNE.
 *
 * @author Bor-Shen Lin at National Taiwan University of Science and Technology
 * ****************************************************************************
 * Because of the tender mercy of our God, by which the rising sun will come to
 * us from heaven to shine on those living in darkness and in the shadow of
 * death, to guide our feet into the path of peace. Luke 1:78-79
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polar = exports.TSNE = void 0;
var println = console.log;
class TSNE {
    static expectationMinimization(x, y, iterNum, eps) {
        let v = TSNE.findVariance(x);
        let g = new Array(y.length);
        y.forEach((val, i) => g[i] = new Array(y[0].length).fill(0));
        let _g = new Array(y.length);
        y.forEach((val, i) => _g[i] = new Array(y[0].length).fill(0));
        for (let iter = 0; iter < iterNum; iter++) {
            let p = TSNE.computeGaussian(x, v);
            let q = TSNE.computeGaussian2(y);
            TSNE.computeGradient(p, q, y, g);
            let cost = TSNE.findKLD(p, q); // objective function
            println(iter + "\t" + getTime() + '\t' + cost);
            TSNE.update(y, g, _g, eps);
            let temp = g;
            g = _g;
            _g = temp;
        }
    }
    static findVariance(x) {
        let m = 0, v = 0;
        for (let i = 0; i < x.length; i++) {
            for (let j = 0; j < x[i].length; j++) {
                m += x[i][j];
                v += x[i][j] * x[i][j];
            }
        }
        m /= x.length * x[0].length;
        v = v / (x.length * x[0].length) - m * m;
        return v;
    }
    static findKLD(p, q) {
        let cost = 0;
        for (let i = 0; i < p.length; i++) {
            for (let j = 0; j < p[i].length; j++) {
                if (i != j)
                    if (p[i][j] > 0 && q[i][j] > 0) {
                        let value = p[i][j] / q[i][j];
                        if (value > 0)
                            cost += p[i][j] * Math.log(value);
                    }
            }
        }
        return cost;
    }
    static update(y, g, _g, eps) {
        for (let i = 0; i < g.length; i++) {
            for (let k = 0; k < g[i].length; k++) {
                if (TSNE.momentum && g[i][k] * _g[i][k] > 0) {
                    g[i][k] += _g[i][k];
                }
                y[i][k] -= eps * g[i][k];
            }
        }
    }
    static computeGaussian(x, v) {
        let p = new Array(x.length);
        x.forEach((val, i) => p[i] = new Array(x.length));
        let denom = 2 * v;
        for (let i = 0; i < p.length; i++) {
            let sum = 0;
            for (let j = 0; j < p[i].length; j++) {
                if (j != i) {
                    p[i][j] = Math.exp(-distance(x[i], x[j]) / denom);
                    sum += p[i][j];
                }
            }
            for (let j = 0; j < p[i].length; j++) {
                if (j != i) {
                    p[i][j] /= sum;
                }
            }
        }
        // for (let i = 0; i < p.length; i++) {
        // }
        return p;
    }
    static computeGaussian2(y) {
        let q = new Array(y.length);
        y.forEach((v, i) => q[i] = new Array(y.length).fill(0));
        for (let i = 0; i < q.length; i++) {
            let sum = 0;
            for (let j = 0; j < q[i].length; j++) {
                if (j != i) {
                    // q[i][j] = 1 / (1 + distance(y[i], y[j])); // symmetric
                    q[i][j] = Math.exp(-distance(y[i], y[j]));
                    sum += q[i][j];
                }
            }
            for (let j = 0; j < q[i].length; j++) {
                if (j != i) {
                    q[i][j] /= sum;
                }
            }
        }
        // for (let i = 0; i < q.length; i++) {
        // }
        return q;
    }
    static computeGradient(p, q, y, g) {
        for (let i = 0; i < g.length; i++) {
            for (let k = 0; k < g[i].length; k++) {
                g[i][k] = 0;
                for (let j = 0; j < g.length; j++) {
                    if (j != i)
                        g[i][k] += (p[i][j] + p[j][i] - q[i][j] - q[j][i]) * (y[i][k] - y[j][k]); //前面的括號內的就是梯度下降的內容
                }
            }
        }
    }
    static generateRandomData(N, m) {
        let points = new Array();
        for (let i = 0; i < N; i++) {
            let x = new Array(m.length);
            for (let k = 0; k < x.length; k++) {
                x[k] = normal() + m[k];
            }
            points.push(x);
        }
        return points;
    }
    static normalize(Y) {
        let mean = new Array(Y[0].length).fill(0);
        Y.forEach(y => y.forEach((val, k) => mean[k] += val));
        Y[0].forEach((val, k) => mean[k] /= Y.length);
        Y.forEach(y => mean.forEach((val, k) => y[k] -= val));
        return Y;
    }
}
exports.TSNE = TSNE;
TSNE.momentum = true;
class Polar {
    constructor() { }
    setByXY(x, y) {
        this.radius = Math.sqrt(x * x + y * y);
        this.theta = Math.atan2(y, x);
        return this;
    }
    getPoint(scale = 1) {
        let x = scale * this.radius * Math.cos(this.theta);
        let y = scale * this.radius * Math.sin(this.theta);
        return { x: x, y: y };
    }
    static generatePoint(num) {
        let points = [];
        for (let i = 0; i < num; i++) {
            points.push(new Polar().setByXY(normal(), normal()));
        }
        return points;
    }
    ToString() {
        return roundOf(this.radius, 4) + ' ' + roundOf(this.theta, 4);
    }
}
exports.Polar = Polar;
function main() {
    let X = new Array();
    TSNE.generateRandomData(100, [6, 6, 6, 6]).forEach(arr => X.push(arr));
    TSNE.generateRandomData(100, [5, 5, 4, 4]).forEach(arr => X.push(arr));
    TSNE.generateRandomData(100, [3, 3, 3, 3]).forEach(arr => X.push(arr));
    X.forEach(arr => console.log(arr));
    let Y = TSNE.generateRandomData(300, [3, 3]); // reduced to 2D
    Y.forEach(arr => console.log(arr));
    TSNE.expectationMinimization(X, Y, 1000, 0.005);
    // let polars = TSNE.normalize(Y)
    //               .map(y => new Polar().setByXY(y[0], y[1]));
    // polars.forEach(polar =>console.log(polar.getPoint()))
}
main();
function getTime() {
    return new Date().toLocaleTimeString();
}
function roundOf(f, len = 2) {
    let s = f + '', index = s.indexOf('.');
    if (index < 0)
        return s;
    return s.slice(0, index + len + 1);
}
function normal() {
    var u = 0, v = 0;
    while (u === 0)
        u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0)
        v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    // return Math.sqrt(-2 * Math.log(Math.random()))*Math.cos((2*Math.PI) * Math.random())
}
function distance(a, b) {
    let sum = 0;
    for (let k = 0; k < a.length; k++) {
        let diff = a[k] - b[k];
        sum += diff * diff;
    }
    return sum;
}
