import IOpkg.*;

public class Main {

    public static void main(String[] args){
        SpringSeed test = new SpringSeed(1, 2, 3);
        SpringSeed clone = test.clone();

        System.out.println("Przed modyfikacja");
        System.out.println();
        System.out.println("oryginal:");
        System.out.println(test.getNeedeWater());
        System.out.println(test.getMaxWindIntensity());
                
        System.out.println("klon:");
        System.out.println(clone.getNeedeWater());
        System.out.println(clone.getMaxWindIntensity());

        System.out.println();
        System.out.println();
        System.out.println();

        test.setNeededWater(0.1);
        test.setMaxWindIntensity(0.2);

        System.out.println("Po modyfikacji oryginalu");
        System.out.println();
        System.out.println("oryginal:");
        System.out.println(test.getNeedeWater());
        System.out.println(test.getMaxWindIntensity());
        System.out.println("klon:");
        System.out.println(clone.getNeedeWater());
        System.out.println(clone.getMaxWindIntensity());


    }
}
