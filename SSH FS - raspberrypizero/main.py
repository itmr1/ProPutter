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
    
    URL2 = "https://100.25.202.97:3000/data/sensor"
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
        time.sleep(0.2)
        if(interrupt_button.getInput() == 0):
            return True
        else:
            time.sleep(1)
    else:
        return False

def backwards_detect(data):
    if(data < -1):
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
    b = backwards_detect(accel_data[0])
    if(backswing_fsm[0] == False):
        backswing_fsm[0] = b
    elif(backswing_fsm[1] == False):
        backswing_fsm[1] = forwards_detect(accel_data[0])
    elif(backswing_fsm[2] == False):
        backswing_fsm[2] = b
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
    #print(topacket.shape)
    #print(topacket)
    # row = np.array([accel_data,temp,humidity,timestamp])
    # print(row.shape)
    print(str(topacket))
    # f.write(str(topacket)+"\n")
 
    packet = np.append(packet,topacket,axis=0)
    #print(packet.shape)

    if(endofput_detect(accel_data)): #previously if(endofput_detect(accel_data))
        print("\nEND OF PUT\n")
        global toggle
        global backswing_fsm
        backswing_fsm = np.zeros(3)
        transmit(packet)
        # f.close()
        toggle = False

    return packet,""
    
    
    # if(test_motion.straightness(accel_data[0])):
    #     print("straight")
    #     print(accel_data)
    # else:
    #     print("N O T   S T R A I G H T")
    #     # print(accel_data)
    #     print("\n")

def reset():
    global backswing_fsm
    global accel_instance
    backswing_fsm = np.zeros(3)
    accel_instance = sensors.accel(1)

if __name__ == "__main__":
    # f = open("data.txt","w")
    #internet setup

    warnings.filterwarnings("ignore", message="Certificate for .* has no `subjectAltName`")
    URL = "https://100.25.202.97:3000/data/check_acc"
    data = {"username":"itmr", "password":"dummy"}
    r = requests.post(url=URL, verify="certificate.pem", json=data)
    print(r.status_code)
    print(r.content)
    #fini internet setup
    button.gpio.setwarnings(False)
    accel_fifo = fifo.fifo(10)
    interrupt_button = button.button()
    accel_instance = sensors.accel(1)

    test_motion = motion_detect.motion(m_threshold=1, s_threshold=[2, 2])
    
    reading=0
    counter=0
    jsonpacket = ""
    packet = np.array([[0,0,0,0,0,0]]) #first 3 are accel, last 3 temp, humidity, timestamp
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
            
            reset()
        elif(toggle):
            packet = test(packet,temp,humidity,jsonpacket)[0]
            #jsonpacket = test(packet,temp,humidity,jsonpacket)
            #print(test(packet,temp,humidity,jsonpacket)[1])
        
        #print the last 10 rows of the packet
        
        
        
        # #print(sensors.poll_temp(0x40,0xf3))
        # # print(sensors.poll_humidity(0x40,0xf5))
        # # time.sleep(0.1)



# def bk():
#     while True:
#         if(interrupt_button.getInput() == 0):
#             reading = 1
#             print("START\n")
#             counter = 0
#         if(reading == 1):
#             accel_fifo.packet_into_fifo(accel_instance.poll())
#             #print(np.round(accel_fifo.packet_out_fifo(), 3))
#             packet = np.append(packet,np.round(accel_fifo.packet_out_fifo(), 3),axis=0)
#             counter +=1
#         if(counter > 100):
#             reading = 0
#             counter = 0
#             print(packet)
#             b = packet[1:].tolist()
#             jsondata = {"array": b}
#             jsonpacket = json.dumps(jsondata)
#             print("STOP\n")
#             print(jsonpacket)