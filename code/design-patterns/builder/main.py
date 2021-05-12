from house import HouseBuilder
import stuff as st


test = HouseBuilder()

test.addFloor()
test.addFeature(0, st.Window(10, 20))

test.addFloor()
test.addFeature(1, st.Window(10, 20))
test.addFeature(1, "test")

print(test.getHouse())