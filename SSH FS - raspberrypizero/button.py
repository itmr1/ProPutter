import RPi.GPIO as gpio
#192.168.32.71 hostname

"""
the text after gpio.IN is the internal pull up resistor of the rpi
you need to enable this to get a clean reading from the button
Since the button goes to ground, we need to pull it hup to hold the input high until you press it
"""

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

    

