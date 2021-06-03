# rpg, broń postaci
from weapons import Wand, Sword
from characters import Character
from time import perf_counter as getTime

player = Character("Rektor", 1000)
victim = Character("student", 100)

# nasze "strategie", bronie
sword  = Sword(5)
wand = Wand(10, 1000)

# atak bez broni
print("# pięści")
player.attack(victim)
print()

# wyposażenie w broń
player.setWeapon(sword)
print("# miecz")
player.attack(victim)
player.attack(victim)
print()

# wyposażenie w inną broń
player.setWeapon(wand)
print("# różdżka")
player.attack(victim)
player.attack(victim) # <- to nie wyjdzie, bo cooldown 1s

curr_time = getTime()

# odczekanie coooldownu 1s
while getTime() - curr_time < 1:
    pass

player.attack(victim)
print()