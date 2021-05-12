import stuff
import copy
from typing import Optional, Type



class House:

    name = ""
    roof = None
    floors = [[]]
    basement = True

    def __init__(self, name : str, roof : Optional[stuff.Roof] = None, basement : Optional[bool] = True):
        self.name = name
        self.roof = roof if roof != None else stuff.Roof(0, "plate")
        self.basement = basement
        self.floors = []

    def __str__(self) -> str:
        to_return = "{} `{}` with{} basement".format(
            type(self).__name__, self.name,
            "" if self.basement else "out"
        )

        to_return += "\n" + str(self.roof)
        for i in range(len(self.floors)):
            to_return += "\n\nfloor {}".format(i)
            for j in range(len(self.floors[i])):
                to_return += "\n    " + str(self.floors[i][j])

        return to_return


class HouseBuilder:

    house = None

    def __init__(self, name : str, roof : Optional[stuff.Roof] = None, basement : Optional[bool] = True):
        self.newHouse(name, roof, basement)

    def newHouse(self, name : str, roof : Optional[stuff.Roof] = None, basement : Optional[bool] = True):
        self.house = House(name, roof, basement)
    
    def getHouse(self) -> House:
        return copy.deepcopy(self.house)

    def addFloor(self) -> None:
        self.house.floors.append([])

    def addFeature(self, floor : int, feature : Type[stuff.Stuff]) -> None:
        self.house.floors[floor].append(feature)

    def setRoof(self, roof : stuff.Roof) -> None:
        self.house.roof = roof

    def setBasement(self, basement : bool) -> None:
        self.house.basement = basement

class HouseManager:

    HB = HouseBuilder("none")

    def getFamilyHouse() -> House:
        hb = HouseManager.HB

        hb.newHouse("FamilyHouse", stuff.Roof(30, "tiles"), True)
        hb.addFloor()
        hb.addFeature(0, stuff.Window(100, 100))
        hb.addFeature(0, stuff.Window(100, 200))
        hb.addFeature(0, stuff.Window(50, 50))
        hb.addFeature(0, stuff.Window(20, 50))
        hb.addFeature(0, stuff.Window(50, 10))


        return hb.getHouse()

    def getBlockOfFlats():
        hb = HouseManager.HB

        hb.newHouse("Block of Flats")
        for i in range(10):
            hb.addFloor()
            for j in range(20):
                hb.addFeature(i, stuff.Window(50, 50))

        return hb.getHouse()