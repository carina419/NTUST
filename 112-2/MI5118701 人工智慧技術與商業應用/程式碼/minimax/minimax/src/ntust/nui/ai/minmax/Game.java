package ntust.nui.ai.minmax;

import java.util.List;

/**
 * Game class contains the kernel algorithm of searching the game tree in
 * depth-first way with minimax or alpha-beta pruning.
 *
 * @author Bor-Shen Lin at National Taiwan University of Science and Technology
 * ****************************************************************************
 * There is no fear in love. But perfect love drives out fear,
 * because fear has to do with punishment. The one who fears is not made perfect
 * in love. 1 John 4:18 
 */
public abstract class Game<T> {

	/**
	 * Owner defines the state of each location: occupied by the computer,
	 * occupied by the opponent, or empty.
	 */
	public enum Owner {
		EMPTY, COMPUTER, OPPONENT
	}
	/**
	 * A large positive score denoting the computer wins the game.
	 */
	public static final int SCORE_LOSE = Integer.MIN_VALUE;
	/**
	 * A large negative score denoting the computer loses the game.
	 */
	public static final int SCORE_WIN = Integer.MAX_VALUE;

	/**
	 * A flag that is used to enable the alpha-beta pruning.
	 */
	protected boolean alphaBetaPruning = true;
	/**
	 * The maximum depth for the search of game tree.
	 */
	protected int maxDepth = getMaxDepth();
	/**
	 * The optimal move obtained from minimax algortihm.
	 */
	protected T optimal = null;
	/**
	 * The total number of board states visited in deciding a move.
	 */
	protected int nodeNum;

	/**
	 * Constructor of game state with alpha-beta pruning disabled.
	 */
	public Game() {
	}

	public T minimax() {
		nodeNum = 0;
		maximum(0, Integer.MAX_VALUE);
		System.out.println("nodeNum = " + nodeNum);
		return optimal;
	}

	private int maximum(int depth, int parentBeta) {
		if (lose()) {
			return SCORE_LOSE;
		}
		if (win()) {
			return SCORE_WIN;
		}
		if (depth == maxDepth) {
			return evaluate();
		}
		int alpha = Integer.MIN_VALUE;	//temporary maximum
		T argmax = null;
		for (T move : getValidMoves()) {
			play(Owner.COMPUTER, move);
			int value = minimum(depth + 1, alpha); // pass alpha to lower layer
			if (value > alpha) {
				alpha = value;
				argmax = move;
			}
			remove(move);
			if (alphaBetaPruning && alpha >= parentBeta) {
				break; // pruned
			}
		}
		if (depth == 0) {
			optimal = argmax; // making choice at root node
		}
		return (argmax == null) ? evaluate() : alpha;
	}

	private int minimum(int depth, int parentAlpha) {
		if (lose()) {
			return SCORE_LOSE;
		}
		if (win()) {
			return SCORE_WIN;
		}
		if (depth == maxDepth) {
			return evaluate();
		}
		int beta = Integer.MAX_VALUE;	// temporary minimum
		T argmin = null;
		for (T move : getValidMoves()) {
			play(Owner.OPPONENT, move);
			int value = maximum(depth + 1, beta); // pass beta to lower layer
			if (value < beta) {
				beta = value;
				argmin = move;
			}
			remove(move);
			if (alphaBetaPruning && beta <= parentAlpha) {
				break; // pruned
			}

		}
		return (argmin == null) ? evaluate() : beta;
	}

	public abstract boolean win();

	public abstract boolean lose();

	public abstract int evaluate();

	public abstract int getMaxDepth();

	public abstract List<T> getValidMoves();

	public abstract void play(Owner who, T move);

	public abstract void remove(T move);

}
