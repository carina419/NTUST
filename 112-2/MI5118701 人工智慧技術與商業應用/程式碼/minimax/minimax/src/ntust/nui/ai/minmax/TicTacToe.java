package ntust.nui.ai.minmax;

import java.util.*;
import javax.swing.*;
import java.awt.Color;
import java.awt.Graphics;
import java.awt.BorderLayout;
import java.awt.event.*;

/**
 * TicTacToe is a game created for demostrating the algorithms of minimax and
 * alpha-beta pruning.
 *
 * @author Bor-Shen Lin at National Taiwan University of Science and Technology
 * ****************************************************************************
 * There is no fear in love. But perfect love drives out fear,
 * because fear has to do with punishment. The one who fears is not made perfect
 * in love.	1 John 4:18 
 */
public class TicTacToe extends Game<Integer> {

	public static final int ENTRY_NUM = 9;
	public static final int COL_NUM = 3;
	public static final int MAX_DEPTH = 4;

	private Owner states[]; // states of locations

	private static Scanner input = new Scanner(System.in);
	private static JFrame frame;
	private static JPanel panel;
	private static JLabel msg;

	public TicTacToe() {
		states = new Owner[ENTRY_NUM];
		for (int i = 0; i < states.length; i++) {
			states[i] = Owner.EMPTY;
		}
	}

	private String getSymbol(Owner owner) {
		switch (owner) {
			case EMPTY:
				return "";
			case COMPUTER:
				return "X";
			default:
				return "O";
		}
	}

	@Override
	public String toString() {
		StringBuilder s = new StringBuilder();
		for (int i = 0; i < states.length; i++) {
			s.append("\t").append(getSymbol(states[i]));
			if (i % COL_NUM == COL_NUM - 1) {
				s.append("\n");
			}
		}
		return s.toString();
	}

	private int getThreats(Owner who) {
		int numThreats = 0;
		if (isThreat(0, 1, 2, who)) {
			numThreats++;
		}
		if (isThreat(3, 4, 5, who)) {
			numThreats++;
		}
		if (isThreat(6, 7, 8, who)) {
			numThreats++;
		}
		if (isThreat(0, 3, 6, who)) {
			numThreats++;
		}
		if (isThreat(1, 4, 7, who)) {
			numThreats++;
		}
		if (isThreat(2, 5, 8, who)) {
			numThreats++;
		}
		if (isThreat(0, 4, 8, who)) {
			numThreats++;
		}
		if (isThreat(2, 4, 6, who)) {
			numThreats++;
		}
		return numThreats;
	}

	private boolean isThreat(int i, int j, int k, Owner who) {
		if (states[i] == who && states[j] == who && states[k] == Owner.EMPTY) {
			return true;
		}
		if (states[j] == who && states[k] == who && states[i] == Owner.EMPTY) {
			return true;
		}
		if (states[i] == who && states[k] == who && states[j] == Owner.EMPTY) {
			return true;
		}
		return false;
	}

	private boolean lineMatched(int i, int j, int k, Owner who) {
		return (states[i] == who && states[j] == who && states[k] == who);
	}

	private boolean lineMatched(Owner who) {
		if (lineMatched(0, 1, 2, who)) {
			return true;
		}
		if (lineMatched(3, 4, 5, who)) {
			return true;
		}
		if (lineMatched(6, 7, 8, who)) {
			return true;
		}
		if (lineMatched(0, 3, 6, who)) {
			return true;
		}
		if (lineMatched(1, 4, 7, who)) {
			return true;
		}
		if (lineMatched(2, 5, 8, who)) {
			return true;
		}
		if (lineMatched(0, 4, 8, who)) {
			return true;
		}
		if (lineMatched(2, 4, 6, who)) {
			return true;
		}
		return false;
	}

	/**
	 * Play a move: owner plays which move.
	 *
	 * @param owner who playing the move
	 * @param move the move played
	 */
	@Override
	public void play(Owner owner, Integer move) {
		states[move] = owner;
		nodeNum++;
	}

	/**
	 * Remove the stone at specific move
	 *
	 * @param move the move to be removed
	 */
	@Override
	public void remove(Integer move) {
		states[move] = Owner.EMPTY;
	}

	/**
	 * Check if computer loses the game or not.
	 *
	 * @return true if the computer loses the game, false otherwise.
	 */
	@Override
	public boolean lose() {
		return lineMatched(Owner.OPPONENT);
	}

	/**
	 * Check if computer wins the game or not.
	 *
	 * @return true if the computer wins the game, false otherwise.
	 */
	@Override
	public boolean win() {
		return lineMatched(Owner.COMPUTER);
	}

	/**
	 * Evaluate the current game state.
	 *
	 * @return evaluation score.
	 */
	@Override
	public int evaluate() {
		return getThreats(Owner.COMPUTER) - getThreats(Owner.OPPONENT);
	}

	/**
	 * Get valid moves for current game state.
	 *
	 * @return Valid moves (move indexes for Tic-Tac-Toe).
	 */
	@Override
	public List<Integer> getValidMoves() {
		List<Integer> list = new LinkedList();
		for (int i = 0; i < ENTRY_NUM; i++) {
			if (isLegal(i)) {
				list.add(i);
			}
		}
//		System.out.println("valid " + list);
		return list;
	}

	/**
	 * The maximum depth for the search of game tree.
	 *
	 * @return Maximum depth of game tree to be searched.
	 */
	@Override
	public int getMaxDepth() {
		return MAX_DEPTH;
	}

	private boolean finished() {
		for (int i = 0; i < states.length; i++) {
			if (states[i] == Owner.EMPTY) {
				return false;
			}
		}
		return true;
	}

	private boolean isLegal(int move) {
		return states[move] == Owner.EMPTY;
	}

	public static void prompt(String s) {
		System.out.println(s);
		msg.setText("  " + s);
		frame.repaint();
	}

	private int opponentMove() {
		while (true) {
			prompt("Please input row,col (0 <= row, col <= 2)");
			String str = input.nextLine(); // input from stdin
			String tokens[] = str.split(",");
			if (tokens.length >= 2) {
				int move = Integer.parseInt(tokens[0]) * COL_NUM
						+ Integer.parseInt(tokens[1]);
				if (move < 0 || move >= ENTRY_NUM) {
					continue;
				}
				if (!isLegal(move)) {
					System.out.println("illegal move!");
					continue;
				}
				return move;
			}
		}
	}

	private void drawTiles(Graphics g) {
		for (int i = 0; i < states.length; i++) {
			int row = i / 3, col = i % 3;
			drawTile(g, row, col, getSymbol(states[i]));
		}
	}

	private static void drawTile(Graphics g, int row, int col, String s) {
		g.setColor(Color.lightGray);
		g.fillRect(col * 20, row * 20, 20, 20);
		g.setColor(Color.WHITE);
		g.drawRect(col * 20, row * 20, 20, 20);
		g.setColor(Color.BLACK);
		g.drawString(s, col * 20 + 5, row * 20 + 15);
	}

	private void textModeGrame(int type) {
		final TicTacToe game = new TicTacToe(); // game state
		if (type == 1) {
			int move = game.opponentMove();
			game.play(Owner.OPPONENT, move);
		}
		while (true) {
			// my move (computer)
			int move = game.minimax();
			if (move < 0 || move >= ENTRY_NUM) {
				prompt("Draw, game is over!");
				return;
			}
			game.play(Owner.COMPUTER, move);
			System.out.println(game);
			frame.repaint();
			if (game.win()) {
				prompt("I win!");
				return;
			}
			if (game.finished()) {
				prompt("Draw, game is over!");
				return;
			}
			// opponent's move
			move = game.opponentMove();
			game.play(Owner.OPPONENT, move);
			System.out.println(game);
			frame.repaint();
			if (game.lose()) {
				prompt("You win!");
				return;
			}
			if (game.finished()) {
				prompt("Draw, game is over!");
				return;
			}
		}
	}

	public static void main(String args[]) {
		if (args.length == 0) {
			System.out.println("java TicTacToe 0: computer takes first move");
			System.out.println("java TicTacToe 1: you take first move");
			return;
		}
		int type = Integer.parseInt(args[0]);
		final TicTacToe game = new TicTacToe(); // game state

		frame = new JFrame();
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.getContentPane().setLayout(new BorderLayout(10, 5));

		panel = new JPanel() {
			@Override
			public void paintComponent(Graphics graphics) {
				super.paintComponent(graphics);
				game.drawTiles(graphics);
			}
		};
		panel.addMouseListener(new MouseAdapter() {
			@Override
			public void mouseClicked(MouseEvent e) {
				int x = e.getX(), y = e.getY();
				if (x >= 0 && x < 60 && y >= 0 && y < 60) {
					int col = x / 20, row = y / 20;
					int move = row * 3 + col;
					System.out.println("row=" + row + " col=" + col + " index=" + move);
					if (!game.isLegal(move)) {
						prompt("illegal move!");
						return;
					}
					game.play(Owner.OPPONENT, move);
					System.out.println(game);
					frame.repaint();
					if (game.lose()) {
						prompt("You win!");
						return;
					}
					if (game.finished()) {
						prompt("Draw, game is over!");
						return;
					}
					// computer's moveValid
					move = game.minimax();
					//System.out.println(game.getOptimalMove());
					if (move < 0 || move >= ENTRY_NUM) {
						prompt("Draw, game is over!");
						return;
					}
					game.play(Owner.COMPUTER, move);
					System.out.println(game);
					frame.repaint();
					if (game.win()) {
						prompt("I win!");
						return;
					}
					if (game.finished()) {
						prompt("Draw, game is over!");
						return;
					}

				}
			}
		});

		msg = new JLabel();
		frame.add(msg, BorderLayout.NORTH);
		frame.add(panel, BorderLayout.CENTER);
		frame.setSize(200, 200);
		frame.setVisible(true);

		prompt("start game");
		if (type == 0) {
			int move = game.minimax();
			if (move < 0 || move >= ENTRY_NUM) {
				prompt("Draw, game is over!");
				return;
			}
			game.play(Owner.COMPUTER, move);
			System.out.println(game);
			frame.repaint();
		}
	}
}
