package IOpkg;

public class SummerSeed extends Seed {

    private double sunExpousure;

    public SpringSeed(double neededWater, double howOftenToWater, double sunExpousure){
        super(neededWater, howOftenToWater);
        this.sunExpousure = sunExpousure;
    }

    public SummerSeed(SummerSeed base) {
        super(base);
        this.sunExpousure = base.sunExpousure;

    }

    public Seed clone() {
        return new SummerSeed(this);
    }

    public void getSunExpousure(){
        return sunExpousure;
    }

    public double setSunExpousure(sunExpousure){
        this.sunExpousure = sunExpousure;
    }


}