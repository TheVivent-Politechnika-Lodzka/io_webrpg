from enum import Enum
from typing import NewType



class Stuff:
    pass

class Window(Stuff):

    width = 0
    height = 0

    def __init__(self, w : int, h : int):
        self.width = w
        self.height = h

    def __str__(self) -> str:
        return "{}, width: {}, height: {}".format(
            type(self).__name__, self.width, self.height)


class Roof:

    deg = 0
    material = ""


    def __init__(self, deg : int, material : str):
        if deg > 180 or deg < 0:
            raise Exception("kąt nachylenia dachu musi być [0, 180]")
        
        self.deg = deg
        self.material = material

    def __str__(self) -> str:
        return "{}, slope: {}, material: {}".format(
            type(self).__name__, self.deg, self.material)

# Roof = NewType("Roof", Roof)
# Window = NewType("Window", Window)
# Stuff = NewType("Stuff", Stuff)