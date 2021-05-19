package IOpkg;

import IOpkg.Seed;

public class SpringSeed extends Seed {

    private double maxWindIntensity;

    public SpringSeed(double neededWater, double howOftenToWater, double maxWindIntensity){
        super(neededWater, howOftenToWater);
        this.maxWindIntensity = maxWindIntensity;
    }
    

    public SpringSeed(SpringSeed base) {
        super(base);
        this.maxWindIntensity = base.maxWindIntensity;
    }

    public SpringSeed clone() {
        return new SpringSeed(this);
    }

    public double getMaxWindIntensity(){
        return maxWindIntensity;
    }

    public void setMaxWindIntensity(double maxWindIntensity){
        this.maxWindIntensity = maxWindIntensity;
    }

}