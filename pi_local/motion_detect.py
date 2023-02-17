import numpy as np

class motion():
    def __init__(self, m_threshold, s_threshold):
        self.m_t = m_threshold
        self.s_t = s_threshold

    def detect_motion(self, data):
        if(abs(data) > self.m_t):
            return True
    
    # UNUSED IN FINAL DESIGN
    def straightness(self, data_x, data_y = None):
        if(data_y):
            if(abs(data_x) > self.s_t[0] or (abs(9.81 - abs(data_y)) > self.s_t[1])):
                return False
            else:
                return True
        else:
            if(abs(data_x)> self.s_t[0]):
                return False
            else:
                return True






























# class motion_d():
#     def __init__(self, threshold):
#         self.threshold = threshold
#         self.mem = np.zeros(2)
#         self.fresh = True
    
#     # def detect(self, data):
#     #     # Do you want to detect based on real difference, or % difference?
#     #     if((data[1] - data[0]) > self.threshold):
#     #         return 1
#     #     elif((data[1] - data[0]) > self.threshold):
    
#     def detect(self, data):
#         if(data > 0.5)

