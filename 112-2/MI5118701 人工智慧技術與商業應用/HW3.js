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
var fs = require('fs');
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
        return p;
    }
    static computeGaussian2(y) {
        let q = new Array(y.length);
        y.forEach((v, i) => q[i] = new Array(y.length).fill(0));
        for (let i = 0; i < q.length; i++) {
            let sum = 0;
            for (let j = 0; j < q[i].length; j++) {
                if (j != i) {
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
        return q;
    }
    static computeGradient(p, q, y, g) {
        for (let i = 0; i < g.length; i++) {
            for (let k = 0; k < g[i].length; k++) {
                g[i][k] = 0;
                for (let j = 0; j < g.length; j++) {
                    if (j != i)
                        g[i][k] += (p[i][j] + p[j][i] - q[i][j] - q[j][i]) * (y[i][k] - y[j][k]);
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
    // 讀取 IRIS 數據集 CSV 文件
    let data = fs.readFileSync('D:/GitHub/NTUST/112-2/MI5118701 人工智慧技術與商業應用/iris.csv', 'utf8');
    let lines = data.split('\n').filter(line => line.trim() !== '');
    let X = [];
    let labels = [];
    let classMap = {};

    lines.forEach((line, index) => {
        if (index === 0) return; // Skip header
        let parts = line.split(',');
        let features = parts.slice(0, 4).map(parseFloat);
        let label = parts[4].trim();
        if (!classMap[label]) {
            classMap[label] = Object.keys(classMap).length;
        }
        labels.push(classMap[label]);
        X.push(features);
    });

    // 初始化隨機 2D 點
    let Y = TSNE.generateRandomData(X.length, [0, 0]); // reduced to 2D
    TSNE.expectationMinimization(X, Y, 1000, 0.005);

    // 可視化結果
    let colors = ['r', 'g', 'b'];
    let plotData = Y.map((point, index) => ({
        x: point[0],
        y: point[1],
        label: labels[index]
    }));

    const { createCanvas } = require('canvas');
    const canvas = createCanvas(800, 800);
    const ctx = canvas.getContext('2d');

    function drawPlot() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        plotData.forEach(point => {
            ctx.beginPath();
            ctx.arc(400 + point.x * 100, 400 - point.y * 100, 5, 0, 2 * Math.PI);
            ctx.fillStyle = colors[point.label];
            ctx.fill();
        });
        console.log('<img src="' + canvas.toDataURL() + '" />');
    }

    drawPlot();
}

function normal() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function distance(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
        sum += (a[i] - b[i]) * (a[i] - b[i]);
    }
    return sum;
}

function getTime() {
    let date = new Date();
    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}

function roundOf(num, digits) {
    return Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits);
}

main();
