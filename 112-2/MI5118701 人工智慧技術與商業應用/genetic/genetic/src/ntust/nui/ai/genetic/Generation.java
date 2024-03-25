package ntust.nui.ai.genetic;

import java.util.*;

/**
 * A generation is a set of chromosomes.
 *
 * @author Bor-Shen Lin at National Taiwan University of Science and Technology.
 * *****************************************************************************
 * John 8:12 "I am the light of the world. Whoever follows me will never 
 * walk in darkness, but will have the light of life."
 */
public class Generation<C extends Chromosome> extends LinkedList<C> {

    private double ratios[];

    @Override
    public String toString() {
        StringBuilder s = new StringBuilder("weigths:");
        for (double ratio : ratios) {
            s.append(" ").append(ratio);
        }
        return s.toString();
    }

    /**
     * Produce the next generation from the current generation. The processes
     * include (1)selection(2)crossover(3)mutation.
     *
     * @return the next generation.
     */
    public Generation evolution() {
        Generation newGen = selection();
        newGen.crossOver();
        newGen.mutation();
        return newGen;
    }

    /**
     * Compute the average sum for this generation.
     *
     * @return the average sum.
     */
    public double getAverageFitness() {
        double sum = 0;
        for (Chromosome chromosome : this) {
            sum += chromosome.getFitness();
        }
        return sum / this.size();
    }

    /**
     * Find the optimal chromosome for the current generation.
     *
     * @return the optimal chromosome.
     */
    public Chromosome getOptimal() {
        Chromosome argmax = null;
        for (Chromosome c : this) {
            if (argmax == null || c.getFitness() > argmax.getFitness()) {
                argmax = c;
            }
        }
        return argmax;
    }

    /**
     * Find the solution (chromosome) for the problem in current generation.
     *
     * @return the chromosome as the solution if it is found, and null otherwise.
     */
    public Chromosome findSolution() {
        for (Chromosome chromosome : this) {
            if (chromosome.isSolution()) {
                return chromosome;
            }
        }
        return null;
    }

    private void findRatios() {
        ratios = new double[size()];
        double sum = 0;
        for (int i = 0; i < ratios.length; i++) {
            ratios[i] = get(i).getFitnessWeight();
            sum += ratios[i];
        }
        for (int i = 0; i < ratios.length; i++) {
            ratios[i] /= sum;
        }
    }

    private Generation selection() {
        findRatios();
        Generation nextGen = new Generation();
        for (int i = 0; i < size(); i++) {
            int choice;
            double sum = 0, random = Math.random();
            for (choice = 0; choice < ratios.length; choice++) {
                sum += ratios[choice];
                if (random < sum) {
                    break;
                }
            }
            if (choice >= ratios.length) {
                choice = ratios.length - 1;
            }
            nextGen.add(get(choice).clone());
        }
        return nextGen;
    }

    private void mutation() {
        forEach((Chromosome chromosome)-> {
            chromosome.mutation();
        });
    }

    private void crossOver() {
        for (int i = 0; i < size(); i++) {
            for (int j = 0; j < i; j++) {
                get(i).crossOver(get(j));
            }
        }
    }
}
