from house import HouseBuilder, HouseManager
import stuff as st


test = HouseBuilder("Custom")

test.addFloor()
test.addFeature(0, st.Window(10, 20))

test.addFloor()
test.addFeature(1, st.Window(10, 20))

print(test.getHouse())

print("#######################")

print(HouseManager.getFamilyHouse())

print("#######################")

print(HouseManager.getBlockOfFlats())