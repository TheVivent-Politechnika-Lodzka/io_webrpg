from Oven import Oven

class FahrenheitAdapter:

    oven = None

    def __init__(self, oven : Oven):
        self.oven = oven

    def setDegrees(self, x : float) -> None:
        self.oven.setDegrees((x - 32) / 1.8)

    def getDegrees(self) -> float:
        return (1.8 * self.oven.getDegrees()) + 32

class KelvinAdapter:

    oven = None

    def __init__(self, oven : Oven):
        self.oven = oven

    def setDegrees(self, x : float) -> None:
        self.oven.setDegrees(x - 273.15)

    def getDegrees(self) -> float:
        return self.oven.getDegrees() + 273.15