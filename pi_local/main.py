import sensors
import button
import fifo
import numpy as np
import codecs,json
import time
import motion_detect
import requests
import warnings


# 192.168.32.71

def transmit(packet):
    ip = "54.242.182.158"
    URL2 = "https://" + ip + ":3000/data/sensor"
    #time.sleep();
    data2 = packet[1:].tolist()
    arrdict = json.dumps({i:row for i,row in enumerate(data2)})
    data3={"data" : arrdict};
    print(data3)
    r2 = requests.post(url=URL2, verify="certificate.pem", json=data3)
    print(r2.status_code)
    print(r2.content)



def click_detect():
    if(interrupt_button.getInput() == 1):
        time.sleep(0.16)
        if(interrupt_button.getInput() == 0):
            return True
        else:
            time.sleep(1)
    else:
        return False

def backwards_detect(data, strong = 0):
    if(strong == 1):
        bound = -1.5
    else:
        bound = -0.4
    if(data < bound):
        return True
    else:
         return False

def forwards_detect(data):
    if(data > 2):
        return True
    else:
         return False



backswing_fsm = np.zeros(3)
def endofput_detect(accel_data):
    global backswing_fsm
    print(backswing_fsm)
    if(backswing_fsm[0] == False):
        backswing_fsm[0] = backwards_detect(accel_data[0], strong = 1)
    elif(backswing_fsm[1] == False):
        backswing_fsm[1] = forwards_detect(accel_data[0])
    elif(backswing_fsm[2] == False):
        backswing_fsm[2] = backwards_detect(accel_data[0], strong = 0)
    elif(abs(accel_data[0]) < 0.3):
        backswing_fsm = np.zeros(3)
    # return backwards_detect(accel_data[0])

    if(backswing_fsm.all() == 1):
        return True

    return False
    
    

def test(packet,temp,humidity,jsonpacket): 
    accel_data = accel_fifo.fifo_transaction(accel_instance.poll())
    
    timestamp= time.time() - startime
    
    topacket = accel_data
    topacket = np.append(topacket,temp)
    topacket = np.append(topacket,humidity)
    topacket = np.append(topacket,timestamp)
    topacket = np.round(topacket,3)
    topacket= np.reshape(topacket,(1,6))
 
    packet = np.append(packet,topacket,axis=0)

    if(endofput_detect(accel_data)): 
        print("\nEND OF PUT\n")
        print(test_motion.straightness(accel_data[0]))
        global toggle
        global backswing_fsm
        backswing_fsm = np.zeros(3)
        transmit(packet)
        toggle = False
        accel_fifo.empty()

    return packet,""

def reset():
    global backswing_fsm
    global accel_instance
    backswing_fsm = np.zeros(3)
    accel_instance = sensors.accel(1)

if __name__ == "__main__":
    #internet setup

    warnings.filterwarnings("ignore", message="Certificate for .* has no `subjectAltName`")
    # URL = "https://34.229.184.125:3000/data/check_acc"
    # data = {"username":"itmr", "password":"dummy"}
    # r = requests.post(url=URL, verify="certificate.pem", json=data)
    # print(r.status_code)
    # print(r.content)
    
    # Sensor infrastructure setup
    button.gpio.setwarnings(False)
    accel_fifo = fifo.fifo(5)
    interrupt_button = button.button()
    accel_instance = sensors.accel(1)
    test_motion = motion_detect.motion(m_threshold=1, s_threshold=[2, 2])
    reading=0
    counter=0

    jsonpacket = ""
    packet = np.array([[0,0,0,0,0,0]]) #first 3 are accel, last 3 temp, humidity, timestamp

    # Sensor instantiation
    temp = sensors.poll_temp(0x40,0xf3)
    humidity = sensors.poll_humidity(0x40,0xf5)

    print("START\n")
    
    accel_data = np.zeros(3)
    toggle = 0
    while True:
        if(click_detect()):
            toggle = not toggle
            startime = time.time()
            packet = np.array([[0,0,0,0,0,0]])
            accel_instance.tear_init()
            backswing_fsm = np.zeros(3)
            
            reset()
        elif(toggle):
            packet = test(packet,temp,humidity,jsonpacket)[0]
