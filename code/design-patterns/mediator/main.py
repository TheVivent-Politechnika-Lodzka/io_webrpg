from time import sleep

class Repository:
    def __init__(self, objList = []):
        self.list = []
        self.list += objList

    def getByID(self, ID):
        for obj in self.list:
            if obj.getID() == ID:
                return obj
        return None

class User:
    def __init__(self, name, ID, mediator):
        self.name = name
        self.ID = ID
        self.mediator = mediator

    def createOrderList(self, restaurantID):
        orderList = []
        menu = self.mediator.react(self, restaurantID, None)
        while(True):
            choice = int(input("Input 0 for restaurant menu, numbers from menu to select item: "))
            if choice == 0:
                print(menu)
                continue
            if choice > 0 and choice < len(menu) + 1:
                orderList.append(choice)
                continue

            break
            
        return orderList

    def order(self, restaurantID):
        orderList = self.createOrderList(restaurantID)
        self.mediator.react(self, restaurantID, orderList)

    def notify(self, message):
        print(message)


    def getID(self):
        return self.ID

class Restaurant:

    def __init__(self, menu, ID, mediator):
        self.menu = menu
        self.ID = ID
        self.currentOrders = []
        self.mediator = mediator

    def placeOrder(self, orderList, client):
        self.currentOrders.append([orderList, client])

    def deliver(self, orderId, deliveryID):
        order = self.currentOrders[orderId]
        self.mediator.react(self, deliveryID, order)
        self.currentOrders.remove(order)

    def getID(self):
        return self.ID

    def getMenu(self):
        return self.menu

class Delivery:

    def __init__(self, ID, mediator):
        self.order = None
        self.client = None
        self.ID = ID
        self.mediator = mediator

    def dispatch(self, orderData):
        self.order = orderData[0]
        self.client = orderData[1]
        self.mediator.react(self, self.client, "Delivery in progress")

    def arrived(self):
        self.mediator.react(self, self.client, "Delivery arrived")

    def getID(self):
        return self.ID


class Mediator:

    def __init__(self, repoU, repoR, repoD):
        self.repoU = repoU
        self.repoR = repoR
        self.repoD = repoD

    def react(self, obj, ID, data):
        if type(obj) == User:
            if type(data) == type([]):
                restaurant = self.repoR.getByID(ID)
                restaurant.placeOrder(data, obj.getID())
            elif data == None:
                return self.repoR.getByID(ID).getMenu()
    
        elif type(obj) == Restaurant:
            delivery = self.repoD.getByID(ID).dispatch(data)

        elif type(obj) == Delivery:
            self.repoU.getByID(ID).notify(data)


print("Żeby zakończyć wybieranie wybierz element którego spoza listy")

# technicznie powinna być hermetyzacja, ale to tylko przykład
# działania mediatora, więc chyba ujdzie?
testMediator = Mediator(Repository(), Repository(), Repository())

testUser = User("John", 1, testMediator)
testMediator.repoU.list.append(testUser)

testRestaurant = Restaurant(["1. Kotlet schabowy", "2. Bigos", "3. Grochówka"], 1, testMediator)
testMediator.repoR.list.append(testRestaurant)

testDelivery = Delivery(1, testMediator)
testMediator.repoD.list.append(testDelivery)


testUser.order(1)
print("\nOrder beeing processed I guess...")
sleep(2)
testRestaurant.deliver(0, 1)

sleep(2)
testDelivery.arrived()
