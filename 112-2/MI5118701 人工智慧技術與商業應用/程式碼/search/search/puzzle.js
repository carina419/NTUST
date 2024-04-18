/**
1.This sample program of 8-puzzle game is for illustrating how to realize algorithm A*,
  and the execution efficiency is not optimized.
2.The open-list is a JS array sorted with a comparator based on cost function f(n).
3.The efficiency of open-list and closed-list could be improved if native objects
  are used instead of array.
4.Another efficient way of implementing the open-list is to use minimum heap.
5.Execute the codes by running "jjs search.js" (Java 8), "jrunscript search.js" (Java 7),
  or "node search.js" (Nodejs, but need to set the variable println as console.log)

Author: Bor-Shen Lin at NTUST
*******************************************************************************************
For God so loved the world that he gave his one and only Son, that
whoever believes in him shall not perish but have eternal life. John 3:16 
**/

// 0: no heuristic, 1: # of out-of-place tiles
// 2: manhattan distance, 3: manhattan distance + 2 * (# of direct-swapping pairs)
var heuristicType = 3;
var open = new Array(); // open list for frontier nodes
var closed = new Array(); // closed list for visited nodes
var BLANK_TILE = 0;
var ACTION_NONE = 0;
var ACTION_MOVE_UP = 1;
var ACTION_MOVE_DOWN = 2;
var ACTION_MOVE_LEFT = 3;
var ACTION_MOVE_RIGHT = 4;
var ROW = 3, COL = 3; // 3 x 3 puzzle
var nodeCount = 0;
var UNDEFINED = "undefined";

var println = print; // for jjs/jrunscript
// var println = console.log; // for nodejs

State.prototype.setData = function (data) {
	this.tiles = new Array(data.length);
	for(var i = 0; i < this.tiles.length; i++)
    this.tiles[i] = new Array(data[i].length);
	for(var i = 0; i < data.length; i++) {
		for(var j = 0; j < data[i].length; j++) {
			this.tiles[i][j] = data[i][j];
			if(data[i][j] == BLANK_TILE) {
				this.blankRow = i;
				this.blankCol = j;
			}
		}
	}
}
State.prototype.moveTo = function (x, y) {
	this.tiles[this.blankRow][this.blankCol] = this.tiles[x][y];
	this.tiles[x][y] = BLANK_TILE;
	this.blankRow = x;
	this.blankCol = y;
}
State.prototype.toString = function (){
	var s = "";
	for(var i = 0; i < this.tiles.length; i++) {
		if(i > 0) s += "\n";
		for(var j = 0; j < this.tiles[i].length; j++) {
			if(this.tiles[i][j] == BLANK_TILE) s += "  ";
			else s += " " + this.tiles[i][j];
		}
	}
	return s;
}
State.prototype.getOffset = function(id){
	for(var i = 0; i < this.tiles.length; i++) {
		for(var j = 0; j < this.tiles[i].length; j++) {
			if(this.tiles[i][j] == id) return i * COL + j;
		}
	}
	return 0;
}
State.prototype.equals = function (another) {
	for(var i = 0; i < this.tiles.length; i++) {
		for(var j = 0; j < this.tiles[i].length; j++) {
			if(this.tiles[i][j] != another.tiles[i][j]) return false;
		}
	}
	return true;
}
State.prototype.isGoal = function () {
	return this.equals(goal);
}
State.prototype.getSuccessors = function () {
	var successors = Array();
	//println(this.blankRow + "," + this.blankCol);
	if(this.blankRow > 0) {
		successors.push(new State(this, ACTION_MOVE_UP));
	}
	if(this.blankRow < this.tiles.length -1) {
		successors.push(new State(this, ACTION_MOVE_DOWN));
	}
	if(this.blankCol > 0) {
		successors.push(new State(this, ACTION_MOVE_LEFT));
	}
	if(this.blankCol < this.tiles[0].length -1) {
		successors.push(new State(this, ACTION_MOVE_RIGHT));
	}
	return successors;
}
State.prototype.f =function () {
	return this.depth + this.h();
}
State.prototype.h = function (){
    if(heuristicType === 0) return 0;
    else if(heuristicType === 1) return this.getOutOfPlaceNum(); // h1(n)
    else if(heuristicType === 2) return this.getManhattanDistance(); // h2(n)
    else if(heuristicType === 3)	return this.getManhattanDistance() + 2.0 * this.getDirectSwappedPair(); // h3(n)
};
State.prototype.getOutOfPlaceNum = function () {
	var  diff, tile, total = ROW * COL;
	for(tile = 0, diff = 0; tile < total; tile++) {
		if(tile == BLANK_TILE) continue;
		if(this.getOffset(tile) != goal.getOffset(tile)) diff++;
	}
	//println("diff=" + diff);
	return diff;
}
State.prototype.getManhattanDistance = function (){
	var dist = 0, total = ROW * COL;
	for(var tile = 1; tile < total; tile++) {
		var aOffset = this.getOffset(tile);
		var bOffset = goal.getOffset(tile);
		var aCol = aOffset % COL, aRow = Math.round((aOffset-aCol) / COL);
		var bCol = bOffset % COL, bRow = Math.round((bOffset-bCol) / COL);
		dist += Math.abs(aRow - bRow) + Math.abs(aCol - bCol);
	}
	return dist;
};
State.prototype.getDirectSwappedPair = function() {
    var dist = 0, total = ROW * COL;
    for (var tile = 0; tile < total; tile++) {
        if (tile == BLANK_TILE) {
            continue;
        }
        var aOffset = this.getOffset(tile);
        var bOffset = goal.getOffset(tile);
        if (aOffset != bOffset
                && goal.tiles[Math.floor(aOffset / COL)][aOffset % COL] == this.tiles[Math.floor(bOffset / COL)][bOffset % COL]) {
            dist++;
        }
    }
    return dist / 2;
};

main();

function main() {
    goalTiles = new Array(new Array(1,2,3),new Array(8,0,4),new Array(7,6,5));
    goal = new State(goalTiles);
    initialTiles = new Array(new Array(1,2,3),new Array(4,0,6),new Array(7,8,5));
    initial = new State(initialTiles);

    println("---- initial ----");
    println(initial);
    println("---- goal ----");
    println(goal);

    open.push(initial);
    closed.push(initial);
    found = search(open, closed);
    path = backtrace(found);
    println("nodeCount = " + nodeCount);

    println("\n" + (path.length-1) + " steps");
    for(var i in path) println("---- step " + i + " ---- \n" + path[i]);
}

function State(p, move) {
	if(typeof(move) == "undefined") {
		this.parent = null;
		this.depth = 0;
		this.setData(p);
		return;
	}
	this.parent = p;
	this.depth = p.depth + 1;
	this.setData(p.tiles);
	switch(move) {
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
function search(open, closed) {
	var state;
	while(true) {
		state = open.shift(); // shift -> read from head for JS array ( pop() to pop from tail)
		if(typeof(state) == UNDEFINED) return null;
		//println(" ---- pop ---\n" + state);
		if(state.isGoal()) return state;
		successors = state.getSuccessors();
		for(var i in successors) {
			var successor = successors[i];
			//println("-----successor----");
			//println(successor);
			if(!successor.isGoal() && contains(closed, successor)) continue; // visited
			open.push(successor);
			closed.push(successor);
			nodeCount++;
			//if(nodeCount % 10 == 0) WScript.Echo("nodeCount=" + nodeCount);
		}
		open.sort(comp);
		// open.forEach(function(item){println("--- " + item.f() + "---\n" + item);})
		// return null;
	}
}
function backtrace(state) {
	var path = new Array();
	for(var node = state; node != null; node = node.parent) {
		path.push(node);
	}
	path.reverse();
	return path;
}
// comparator: defining how any two entries are compared in open-list
function comp(a, b) {
	return a.f() - b.f(); // ascending
}

function contains(arr, a) {
	for(var i in arr) {
		if(arr[i].equals(a)) return true;
	}
	return false;
}
