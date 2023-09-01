import time
import board
import shtc3

import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn

i2c = board.I2C() 
sht = shtc3.SHTC3(i2c)

ads = ADS.ADS1115(i2c)
moisture_0 = AnalogIn(ads, ADS.P0)

def append_file(datestr, timestr, val, name):
    filename = name + "_" + datestr + ".csv"
    line = timestr + "," + str(val) + "\n"
    with open(filename,'a') as fd:
        fd.write(line)
    

while True:
    temperature, relative_humidity = sht.measurements
    datestr = time.strftime("%Y%m%d")
    timestr = time.strftime("%Y%m%d-%H%M%S")

    append_file(datestr, timestr, temperature, 'temperature')
    append_file(datestr, timestr, relative_humidity, 'humidity')
    append_file(datestr, timestr, moisture_0.value, 'moisture0')

    time.sleep(5 * 60)
