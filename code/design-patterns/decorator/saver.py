import abc
from encoder import *

# interfejs
class DataSource():
    @classmethod
    def __subclasshook__(cls, subclass):
        return (hasattr(subclass, 'writeData') and 
                callable(subclass.writeData) and 
                hasattr(subclass, 'readData') and 
                callable(subclass.readData) and
                hasattr(subclass, "close") and
                callable(subclass.close))

    @abc.abstractmethod
    def writeData(self, data : bytes) -> None:
        raise NotImplementedError

    @abc.abstractmethod
    def readData(self) -> str:
        raise NotImplementedError
        
    @abc.abstractmethod
    def close(self) -> None:
        raise NotImplementedError


class FileDataSource(DataSource):
    
    def __init__(self, filename : str) -> None:
        self.filename = filename
        self.FILE = open(self.filename, "wb+")

    def writeData(self, data : str) -> None:
        self.FILE.write(data.encode("utf-8"))
        self.FILE.flush()

    def readData(self) -> str:
        self.FILE.seek(0)
        return self.FILE.read().decode("utf-8")

    def close(self) -> None:
        self.FILE.close()



class EncryptionDecorator(DataSource):

    
    def __init__(self, dataSource : DataSource, key : str) -> None:
        self.key = key
        self.wrapper = dataSource

    def writeData(self, data : str) -> None:
        data = encode(self.key, data)
        self.wrapper.writeData(data)

    def readData(self) -> str:
        data = self.wrapper.readData()
        return decode(self.key, data)

    def close(self) -> None:
        self.wrapper.close()


class ReverseDecorator(DataSource):

    def __init__(self, dataSource : DataSource) -> None:
        self.wrapper = dataSource

    def writeData(self, data) -> None:
        data = data[::-1]
        # data = zlib.compress(data.encode("utf-8"))
        self.wrapper.writeData(data)

    def readData(self) -> bytes:
        data = self.wrapper.readData()
        # return zlib.decompress(data.encode("utf-8")).decode("utf-8")
        return data[::-1]

    def close(self) -> None:
        self.wrapper.close()