package IOpkg;

public abstract class Seed {

    private double neededWater;
    private double howOftenToWater;

    public Seed(double neededWater, double howOftenToWater) {
        this.neededWater = neededWater;
        this.howOftenToWater = howOftenToWater;
    }

    public Seed(Seed base) {
        this.neededWater = base.neededWater;
        this.neededWater = base.neededWater;
    }

    public double getNeedeWater(){
        return neededWater;
    }

    public double getHowOftenToWater(){
        return howOftenToWater;
    }

    public void setNeededWater(double neededWater){
        this.neededWater = neededWater;
    }

    public void setHowOftenToWater(double howOftenToWater){
        this.howOftenToWater = howOftenToWater;
    }

    abstract public Seed clone();
}
