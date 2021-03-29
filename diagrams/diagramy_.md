@startuml
title "Lubię placki"

actor "aktor" as aktor
collections "GUI" as gui
collections "backend" as backend
collections "storage" as storage
database "baza danych" as baza

aktor   -> gui
gui     -> backend  : żądania logowania,\ngenerowania gui
backend -> storage  : żądanie danych użytkownika, gier
storage --> backend : dane w formie klas
storage -> baza     : 
baza    -> storage  :

gui -> storage : chat
storage --> gui
@enduml