
package ntust.nui.ai.genetic;

/**
 * Chromosome is the interface of the solution state defined for the problem.
 * Based on the definition, the generic algorithm is performed to find out 
 * the solution state with high fitness value.
 * 
 * @author Bor-Shen Lin at National Taiwan University of Science and Technology.
 * *****************************************************************************
 * John 8:12 "I am the light of the world. Whoever follows me will never 
 * walk in darkness, but will have the light of life."
 */
public interface Chromosome
{

	public static double crossOverRate = 0.1;

	public static double mutationRate = 0.1;

	Chromosome clone();

	double getFitness();

	double getFitnessWeight();

	void crossOver(Chromosome another);

	void mutation();

	boolean isSolution();
}
