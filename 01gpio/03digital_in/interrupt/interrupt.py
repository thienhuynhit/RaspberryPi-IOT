import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.IN)
# channel = GPIO.wait_for_edge(18, GPIO.RISING, timeout=5000)
# if channel is None:
#     print('Timeout occurred')
# else:
#     print('Edge detected on channel', channel)

def isr(channel):
    print('Edge detected on channel %s state %s'% (channel, GPIO.input(channel))) 

GPIO.add_event_detect(18, GPIO.BOTH, callback=isr)
#GPIO.add_event_detect(18, GPIO.BOTH, callback=isr, bouncetime=200)
while True:
    time.sleep(100)