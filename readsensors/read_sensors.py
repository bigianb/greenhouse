import time
import json
import board
import shtc3

import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn

def append_file(datestr, timestr, val, name):
    filename = name + "_" + datestr + ".csv"
    line = timestr + "," + str(val) + "\n"
    with open(filename,'a') as fd:
        fd.write(line)

def write_current_readings(temperature, relative_humidity, moisture):
    data = {'time': time.ctime(),
           'temperature': temperature,
           'relative_humidity': relative_humidity,
           'moisture': moisture
           }
    with open('current_readings.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

needs_init = True

while True:

    if needs_init:
        print("Initialising sensors\n", flush = True)
        i2c = board.I2C() 
        sht = shtc3.SHTC3(i2c)

        ads = ADS.ADS1115(i2c)
        moisture_0 = AnalogIn(ads, ADS.P0)

        needs_init = False
    try:
        temperature, relative_humidity = sht.measurements
        datestr = time.strftime("%Y%m%d")
        timestr = time.strftime("%Y%m%d-%H%M%S")

        append_file(datestr, timestr, temperature, 'temperature')
        append_file(datestr, timestr, relative_humidity, 'humidity')
        append_file(datestr, timestr, moisture_0.value, 'moisture0')

        write_current_readings(temperature, relative_humidity, moisture_0.value)

        time.sleep(5 * 60)
    except OSError as e:
        print(e)
        print("re-initialising\n", flush=True)
        needs_init=True
        time.sleep(15)

