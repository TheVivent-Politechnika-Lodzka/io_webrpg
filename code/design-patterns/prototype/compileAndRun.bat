@echo off
del "*.class"
del "IOpkg\*.class"

javac --release 8 Main.java
java Main