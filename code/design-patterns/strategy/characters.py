
from __future__ import annotations
from weapons import *

class Character:

    def __init__(self, name : str, helth : int) -> None:
        self.name = name
        self.helth = helth
        self.weapon = None
    
    def setWeapon(self, weapon : WeaponInterface) -> None:
        self.weapon = weapon

    def getAttacked(self, dmg) -> None:
        self.helth -= dmg
        if self.helth < 0:
            print("STOP! STOP! He's already dead!")
        print("{} ma {} pkt życia".format(self.name, self.helth))
        

    def attack(self, target : Character) -> None:
        to_dmg = 1
        if self.weapon != None:
            to_dmg = self.weapon.attack()
        target.getAttacked(to_dmg)