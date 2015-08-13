from pubnub import Pubnub
from settings import PUBLISH_KEY, SUBSCRIBE_KEY
import time
from datetime import datetime

pubnub = Pubnub(publish_key=PUBLISH_KEY, subscribe_key=SUBSCRIBE_KEY)
while True:
    message = datetime.now().isoformat()
    print pubnub.publish(channel="beacon", message=message), message
    time.sleep(2)




