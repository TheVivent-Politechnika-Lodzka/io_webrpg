from Oven import Oven
from Adapters import FahrenheitAdapter, KelvinAdapter

cel = Oven(20)
far = FahrenheitAdapter(cel)
kel = KelvinAdapter(cel)

print("""
Witamy w pisanym na szybko interfejsie niegraficznym uzytkownika

    - aby przełączyć tryb na C to napisz:   cel
    - aby przełączyć tryb na F to napisz:   far
    - aby przełączyć tryb na K to napisz:   kel
    - aby zmienić temperaturę wpisz:        set <ile>
    - aby wyjść z programu:                 exit
""")

cmd = ""
current = cel

while(cmd != "exit"):
    cmd = input("-> ")
    if cmd == "cel": current = cel
    if cmd == "far": current = far
    if cmd == "kel": current = kel
    if cmd[:3] == "set": 
        current.setDegrees(int(cmd[4:]))
    print("\033[F-> {} -> [{:.2f}]".format(cmd, current.getDegrees()))