import RPi.GPIO as gpio

class button():
    def __init__(self):
        gpio.setmode(gpio.BOARD)
        #using bottom right pin on raspberry zero W
        self.GPIO_I = 40
        self.GPIO_O = 38
        gpio.setup(self.GPIO_O, gpio.OUT)
        gpio.setup(self.GPIO_I, gpio.IN, pull_up_down = gpio.PUD_UP)

    def getInput(self):
        return not(gpio.input(self.GPIO_I))

    

