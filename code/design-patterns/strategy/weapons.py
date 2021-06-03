import abc
from time import perf_counter as getTime

# interfejs broni
class WeaponInterface:

    @classmethod
    def __subclasshook__(cls, subclass):
        return (hasattr(subclass, 'attack') and 
                callable(subclass.attack))

    @abc.abstractmethod
    def attack(self) -> float:
        raise NotImplementedError


class Sword(WeaponInterface):
    

    def __init__(self, dmg : float) -> None:
        """
        dmg - wysokość obrażeń zadawanych przez broń
        """
        self.dmg = dmg

    def attack(self) -> float:
        return self.dmg


class Wand(WeaponInterface):

    def __init__(self, dmg : float, cooldown : int) -> None:
        """
        dmg      - wysokość obrażeń zadawanych przez broń\n
        cooldown - czas w ms między możliwością zadania obrażeń
        """
        self.dmg = dmg
        self.cooldown = cooldown / 1000 # konwersja s na ms
        self.lastAttack = getTime() - (self.cooldown)

    def attack(self) -> float: 
        if getTime() - self.lastAttack < self.cooldown:
            print("Trwa cooldown !!!")
            return 0
        self.lastAttack = getTime()
        return self.dmg