/**
1.This sample program of 8-puzzle game is for illustrating how to realize algorithm A*,
  and the execution efficiency is not optimized.
2.The open-list is a JS array sorted with a comparator based on cost function f(n).
3.The efficiency of open-list and closed-list could be improved if native objects
  are used instead of array.
4.Another efficient way of implementing the open-list is to use minimum heap.
5.Compile the codes by running compile Search.ts
  Execute the codes by running "node Search"

Author: Bor-Shen Lin at NTUST
*******************************************************************************************
For God so loved the world that he gave his one and only Son, that
whoever believes in him shall not perish but have eternal life. John 3:16
**/
var UNDEFINED = "undefined";
var println = console.log; // for nodejs
// 0: no heuristic, 1: # of out-of-place tiles
// 2: manhattan distance, 3: manhattan distance + 2 * (# of direct-swapping pairs)
var heuristicType = 3;
var BLANK_TILE = 0;
var ACTION_NONE = 0;
var ACTION_MOVE_UP = 1;
var ACTION_MOVE_DOWN = 2;
var ACTION_MOVE_LEFT = 3;
var ACTION_MOVE_RIGHT = 4;
var ROW = 3, COL = 3; // 3 x 3 puzzle (you may try 4 x 4)
var openlist = []; // open list for frontier nodes
var closedlist = []; // closed list for visited nodes
class Puzzle {
    constructor(p, move) {
        if (typeof (move) == UNDEFINED) {
            this.parent = null;
            this.depth = 0;
            this.setData(p);
            return;
        }
        this.parent = p;
        this.depth = p.depth + 1;
        this.setData(p.tiles);
        switch (move) {
            case ACTION_MOVE_UP:
                this.moveTo(this.blankRow - 1, this.blankCol);
                break;
            case ACTION_MOVE_DOWN:
                this.moveTo(this.blankRow + 1, this.blankCol);
                break;
            case ACTION_MOVE_LEFT:
                this.moveTo(this.blankRow, this.blankCol - 1);
                break;
            case ACTION_MOVE_RIGHT:
                this.moveTo(this.blankRow, this.blankCol + 1);
                break;
        }
    }
    setData(data) {
        this.tiles = new Array(data.length);
        for (var i = 0; i < this.tiles.length; i++)
            this.tiles[i] = new Array(data[i].length);
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++) {
                this.tiles[i][j] = data[i][j];
                if (data[i][j] == BLANK_TILE) {
                    this.blankRow = i;
                    this.blankCol = j;
                }
            }
        }
    }
    moveTo(x, y) {
        this.tiles[this.blankRow][this.blankCol] = this.tiles[x][y];
        this.tiles[x][y] = BLANK_TILE;
        this.blankRow = x;
        this.blankCol = y;
    }
    getOffset(id) {
        for (var i = 0; i < this.tiles.length; i++) {
            for (var j = 0; j < this.tiles[i].length; j++) {
                if (this.tiles[i][j] == id)
                    return i * COL + j;
            }
        }
        return 0;
    }
    getManhattanDistance() {
        var dist = 0, total = ROW * COL;
        for (var tile = 1; tile < total; tile++) {
            var aOffset = this.getOffset(tile);
            var bOffset = Puzzle.goal.getOffset(tile);
            var aCol = aOffset % COL, aRow = Math.round((aOffset - aCol) / COL);
            var bCol = bOffset % COL, bRow = Math.round((bOffset - bCol) / COL);
            dist += Math.abs(aRow - bRow) + Math.abs(aCol - bCol);
        }
        return dist;
    }
    getOutOfPlaceNum() {
        var diff = 0, total = ROW * COL;
        for (let tile = 0; tile < total; tile++) {
            if (tile == BLANK_TILE)
                continue;
            if (this.getOffset(tile) != Puzzle.goal.getOffset(tile))
                diff++;
        }
        return diff;
    }
    getDirectSwappedPair() {
        var dist = 0, total = ROW * COL;
        for (var tile = 0; tile < total; tile++) {
            if (tile == BLANK_TILE)
                continue;
            var aOffset = this.getOffset(tile);
            var bOffset = Puzzle.goal.getOffset(tile);
            if (aOffset != bOffset
                && Puzzle.goal.tiles[Math.floor(aOffset / COL)][aOffset % COL] == this.tiles[Math.floor(bOffset / COL)][bOffset % COL]) {
                dist++;
            }
        }
        return dist / 2;
    }
    isGoal() {
        return this.equals(Puzzle.goal);
    }
    getSuccessors() {
        var successors = new Array();
        if (this.blankRow > 0) {
            successors.push(new Puzzle(this, ACTION_MOVE_UP));
        }
        if (this.blankRow < this.tiles.length - 1) {
            successors.push(new Puzzle(this, ACTION_MOVE_DOWN));
        }
        if (this.blankCol > 0) {
            successors.push(new Puzzle(this, ACTION_MOVE_LEFT));
        }
        if (this.blankCol < this.tiles[0].length - 1) {
            successors.push(new Puzzle(this, ACTION_MOVE_RIGHT));
        }
        return successors;
    }
    f() {
        return this.g() + this.h();
    }
    g() {
        return this.depth;
    }
    h() {
        if (heuristicType === 0)
            return 0;
        else if (heuristicType === 1)
            return this.getOutOfPlaceNum(); // h1(n)
        else if (heuristicType === 2)
            return this.getManhattanDistance(); // h2(n)
        else if (heuristicType === 3)
            return this.getManhattanDistance() + 2.0 * this.getDirectSwappedPair(); // h3(n)
    }
    equals(other) {
        for (let i = 0; i < this.tiles.length; i++) {
            for (let j = 0; j < this.tiles[i].length; j++) {
                if (this.tiles[i][j] != other.tiles[i][j])
                    return false;
            }
        }
        return true;
    }
    toString() {
        var s = "";
        for (var i = 0; i < this.tiles.length; i++) {
            if (i > 0)
                s += "\n";
            for (var j = 0; j < this.tiles[i].length; j++) {
                if (this.tiles[i][j] == BLANK_TILE)
                    s += "  ";
                else
                    s += " " + this.tiles[i][j];
            }
        }
        return s;
    }
}
main();
function main() {
    let goal = new Puzzle([[1, 2, 3], [8, 0, 4], [7, 6, 5]]);
    let initial = new Puzzle([[1, 2, 3], [4, 0, 6], [7, 8, 5]]);
    println("---- initial ----");
    println(initial.toString());
    println("---- goal ----");
    println(goal.toString());
    openlist.push(initial);
    closedlist.push(initial);
    let { found, nodeCount } = search(goal);
    if (found) {
        let path = backtrace(found);
        println("nodeCount = " + nodeCount + "\n" + (path.length - 1) + " steps");
        for (var i in path) {
            println("---- step " + i + " ----");
            println(path[i].toString());
        }
    }
}
function search(goal) {
    Puzzle.goal = goal;
    let nodeCount = 0, iter = 0;
    while (true) {
        let state = openlist.shift(); // shift -> read from head for JS array ( pop() to pop from tail)
        if (state.isGoal()) {
            return { found: state, nodeCount: nodeCount };
        }
        state.getSuccessors().forEach(successor => {
            if (closedlist.some(node => node.equals(successor)))
                return; // avoid any duplication
            openlist.push(successor);
            closedlist.push(successor);
            nodeCount++;
        });
        if (openlist.length == 0)
            return null; // no solution
        openlist.sort((a, b) => a.f() - b.f()); // sort by cost function in ascending order
        iter++;
        // console.log(iter+'\topen '+openlist.length+'\t close '+closedlist.length)
    }
}
function backtrace(state) {
    var path = new Array();
    for (var node = state; node != null; node = node.parent) {
        path.push(node);
    }
    path.reverse();
    return path;
}
