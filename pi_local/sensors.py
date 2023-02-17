import smbus2
import time
import numpy as np
import fifo
factor = 0.0005987


def poll_temp(addr=0x40, command=0xf3):
    """
    executes command on temperature sensor, will cause delay, inputs addr, command
    returns temperature
    """
    si7021_ADD = addr
    si7021_READ_TEMPERATURE = command
    bus = smbus2.SMBus(1)
    #Set up a write transaction that sends the command to measure temperature
    cmd_meas_temp = smbus2.i2c_msg.write(si7021_ADD,[si7021_READ_TEMPERATURE])

    #Set up a read transaction that reads two bytes of data
    read_result = smbus2.i2c_msg.read(si7021_ADD,2)
    #Execute the two transactions with a small delay between them
    bus.i2c_rdwr(cmd_meas_temp)
    time.sleep(0.1)
    bus.i2c_rdwr(read_result)
    #convert the result to an int
    temperature = int.from_bytes(read_result.buf[0]+read_result.buf[1],'big')
    temp = (175.72*(temperature)/65536)-46.85
    return temp

def poll_humidity(addr=0x40, command=0xf5):
    """
    executes command on humidity sensor, will cause delay, inputs addr, command
    returns humidity
    """
    si7021_ADD = addr
    si7021_READ_TEMPERATURE = command
    bus = smbus2.SMBus(1)
    #Set up a write transaction that sends the command to measure temperature
    cmd_meas_temp = smbus2.i2c_msg.write(si7021_ADD,[si7021_READ_TEMPERATURE])

    #Set up a read transaction that reads two bytes of data
    read_result = smbus2.i2c_msg.read(si7021_ADD,2)
    #Execute the two transactions with a small delay between them
    bus.i2c_rdwr(cmd_meas_temp)
    time.sleep(0.1)
    bus.i2c_rdwr(read_result)
    #convert the result to an int
    temperature = int.from_bytes(read_result.buf[0]+read_result.buf[1],'big')
    temp = (125*(temperature)/65536)-6
    return temp

def s16(upper, lower):
    upper = upper << 8
    result = upper + lower
    return -(result & 0x8000) + (result & 0x7fff)

class sensors_i2c():
    # empty for now
    def __init__(self, port):
        self.bus_instance = smbus2.SMBus(port)
        pass
    
class accel(sensors_i2c):
    def __init__(self, port):
        super().__init__(port)
        self.name = "lis3dh"
        self.bus_instance.write_byte_data(0x18, 0x20, 0x2f) # write to ctrl_reg1 to disable power down mode
                                          # and to enable low power mode
        self.bus_instance.write_byte_data(0x18, 0x23, 0x80) # write to ctrl reg4 to disable high res mode

        self.bus_instance.write_byte_data(0x18, 0x21, 0b11111111) # write to ctrl_reg2 to enable filtering
        self.tearoff = np.zeros(3)
        self.tearoff = self.tear_init()
        time.sleep(0.25)
        self.counter = 0

    def tear_init(self):
        accel_fifo = fifo.fifo(10)
        for i in range(10):
            accel_fifo.packet_into_fifo(self.poll())
        return accel_fifo.packet_out_fifo()

    def poll(self):
        """
        accel
        """
        xl = self.bus_instance.read_byte_data(0x18, 0x28) # read from x_l
        xh = self.bus_instance.read_byte_data(0x18, 0x29) # read from x_h
        x_val = (s16(xh, xl))*factor

        yl = self.bus_instance.read_byte_data(0x18, 0x2a) # read from x_l
        yh = self.bus_instance.read_byte_data(0x18, 0x2b) # read from x_h
        y_val = (s16(yh, yl))*factor

        zl = self.bus_instance.read_byte_data(0x18, 0x2c) # read from x_l
        zh = self.bus_instance.read_byte_data(0x18, 0x2d) # read from x_h
        z_val = (s16(zh, zl))*factor
        
        return np.array([x_val-self.tearoff[0], y_val-self.tearoff[1], z_val-self.tearoff[2]])

class temp(sensors_i2c):
    def __init__(self):
        super(accel,self).__init__()
        self.name = "si7021"