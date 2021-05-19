from saver import *


oryginal = FileDataSource("test")
encrypted = EncryptionDecorator(oryginal, "klucz")
reversed = ReverseDecorator(encrypted)

reversed.writeData(input("Twój tekst: "))

print("ReverseDecorator: {}".format(reversed.readData()))
print("EncryptionDecorator: {}".format(encrypted.readData()))
print("FileDataSource: {}".format(oryginal.readData()))