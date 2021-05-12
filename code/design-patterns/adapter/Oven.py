class Oven:

    degrees = 0

    def __init__(self, deg) -> None:
        self.degrees = deg


    def setDegrees(self, x : float) -> None:
        self.degrees = x

    def getDegrees(self) -> float:
        return self.degrees


