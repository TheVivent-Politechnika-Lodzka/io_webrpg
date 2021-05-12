import stuff
import copy
from typing import Optional



class House:

    roof = None
    floors = [[]]
    basement = True

    def __init__(self, roof : Optional[stuff.Roof] = None, basement : Optional[bool] = True):
        self.roof = roof if roof != None else stuff.Roof(0, "plate")
        self.basement = basement
        self.floors = []

    def __str__(self) -> str:
        to_return = "{} with{} basement".format(
            type(self).__name__,
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

    def __init__(self, roof : Optional[stuff.Roof] = None, basement : Optional[bool] = True):
        self.newHouse(roof, basement)

    def newHouse(self, roof : Optional[stuff.Roof] = None, basement : Optional[bool] = True):
        self.house = House(roof, basement)
    
    def getHouse(self) -> House:
        return copy.deepcopy(self.house)

    def addFloor(self) -> None:
        self.house.floors.append([])

    def addFeature(self, floor : int, feature : stuff.Stuff) -> None:
        self.house.floors[floor].append(feature)

    def setRoof(self, roof : stuff.Roof) -> None:
        self.house.roof = roof

    def setBasement(self, basement : bool) -> None:
        self.house.basement = basement