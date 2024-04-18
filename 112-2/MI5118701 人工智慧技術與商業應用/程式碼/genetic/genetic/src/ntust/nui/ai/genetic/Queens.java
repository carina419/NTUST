package ntust.nui.ai.genetic;

/**
 * A demonstration of genetic algorithm for solving N-queens problem.
 *
 * @author Bor-Shen Lin at National Taiwan University of Science and Technology.
 * *****************************************************************************
 * John 8:12 "I am the light of the world. Whoever follows me will never 
 * walk in darkness, but will have the light of life."
 */
public class Queens implements Chromosome {

    /**
     * Number of queens, may be changed. 
     */
    public static int NumQueens = 12;
    private int genes[];
    private int fitness;
    private static int goalFitness;

    public Queens() {
        genes = new int[NumQueens];
        for (int i = 0; i < genes.length; i++) {
            genes[i] = (int) (Math.random() * NumQueens);
        }
        goalFitness = genes.length * (genes.length - 1) / 2;
        findFitness();
    }

    /**
     * Construct a chromosome according to the values of assigned data array.
     *
     * @param g 
     */
    public Queens(int g[]) {
        genes = new int[NumQueens];
        for (int i = 0; i < genes.length; i++) {
            genes[i] = g[i];
        }
        findFitness();
    }

    /**
     * Clone a chromosome for this chromosome.
     *
     * @return a new chromosome
     */
	@Override
    public Chromosome clone() {
        return new Queens(this.genes);
    }


    @Override
    public double getFitness() {
        return fitness;
    }

    /**
     * Find the number of non-attacking pairs on the board.
     *
     * @return the number of non-attacking pairs
     */
    private int findNonConflicts() {
        int nonConflicts = genes.length * (genes.length - 1) / 2;
        for (int i = 0; i < genes.length; i++) {
            for (int j = i + 1; j < genes.length; j++) {
                if (genes[i] == genes[j]) {
                    nonConflicts--;
                } else if (Math.abs(genes[i] - genes[j]) == Math.abs(i - j)) {
                    nonConflicts--;
                }
            }
        }
        return nonConflicts;
    }

    private void findFitness() {
        fitness = findNonConflicts();
        if (fitness < 0) {
            fitness = 0;
        }
    }

    /**
     * Get the fitness weight for this chromosome with culling.
     *
     * @return fitness weight
     */
    @Override
    public double getFitnessWeight() {
        int delta = fitness - (goalFitness - 8); 
        if (delta < 0) {
            return 0.0; //culling: ignore if not good enough
        } else {
            return delta * delta;
        }
    }

    /**
     * Exchange genes with another chromosome.
     *
     * @param c another chromosome.
     */
    @Override
    public void crossOver(Chromosome c) {
        if (Math.random() > crossOverRate) {
            return;
        }
        Queens another = (Queens) c;
        int index = (int) (Math.random() * this.genes.length); // location for cutting
        for (int i = 0; i < index; i++) {
            int temp = this.genes[i];
            this.genes[i] = another.genes[i];
            another.genes[i] = temp;
        }
        this.findFitness();
        another.findFitness();
    }

    @Override
    public void mutation() {
        for (int i = 0; i < genes.length; i++) {
            if (Math.random() < mutationRate) {
                genes[i] = (int) (Math.random() * NumQueens);
            }
        }
        findFitness();
    }

    /**
     * Is this chromosome a solution for N-queens problem.
     *
     * @return true if it is a solution, and false otherwise.
     */
    @Override
    public boolean isSolution() {
        return fitness == goalFitness;
    }

    
    @Override
    public String toString() {
        StringBuilder s = new StringBuilder("(");
        for (int i = 0; i < genes.length; i++) {
            if (i > 0) {
                s.append(",");
            }
            s.append(genes[i]);
        }
        s.append(") fitness= ").append(fitness);
        return s.toString();
    }

    public static void main(String args[]) {    
        if (args.length >= 1) {
            Queens.NumQueens = Integer.parseInt(args[0]);
        }
        Generation currentGen = new Generation();
        for (int i = 0; i < 100; i++) {
            currentGen.add(new Queens());
        }
        for (int iter = 0; iter < 10000; iter++) {
            System.out.println("------ " + iter + " -------");
            Generation nextGen = currentGen.evolution();
            System.out.println(nextGen.getAverageFitness());
            System.out.println(nextGen.getOptimal());
            Chromosome goal = nextGen.findSolution();
            if (goal != null) {
                System.out.println("iter=" + iter);
                System.out.println(goal);
                break;
            }
            currentGen = nextGen;
        }
    }
}

