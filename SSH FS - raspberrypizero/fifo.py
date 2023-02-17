import numpy as np
class fifo():
    def __init__(self, size):
        self.packet_counter = 0
        self.counter = np.zeros(3, dtype=int)
        self.arr_size = size
        self.mem = np.array([np.zeros(size),np.zeros(size),np.zeros(size)])
    
    def fifo_transaction(self, in_packet):
        self.packet_into_fifo(in_packet)
        return self.packet_out_fifo()
    
    def packet_into_fifo(self, in_arr):
        if(self.packet_counter > self.arr_size-1):
            self.packet_counter = 0
        self.mem[:, self.packet_counter] = in_arr


        self.packet_counter += 1

    def packet_out_fifo(self):
        return np.array([np.sum(self.mem[0]/self.arr_size), np.sum(self.mem[1]/self.arr_size), np.sum(self.mem[2]/self.arr_size)])

    # def into_fifo(self, in_data, xyz):
    #     if(self.counter[xyz] > self.arr_size-1):
    #         self.counter[xyz] = 0
    #     self.mem[xyz][self.counter[xyz]] = in_data
    #     self.counter[xyz] += 1

    # def out_fifo(self,xyz):
    #     return np.sum(self.mem[xyz]) / self.arr_size