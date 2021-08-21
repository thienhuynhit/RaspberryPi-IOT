var wpi = require('node-wiring-pi');
var pin = 18

wpi.wiringPiSetupGpio();
var prev = 0;
while (true) {
	var data = [];
	var data2 = [];
	var cnt = 0;
	wpi.pinMode(pin, wpi.OUTPUT);
	wpi.digitalWrite(pin, wpi.HIGH);
	wpi.digitalWrite(pin, wpi.LOW);
	wpi.delay(18);
	wpi.pinMode(pin, wpi.INPUT);
	wpi.pullUpDnControl(pin, wpi.PUD_UP);
	
	while (true) {
		err = true
		while (wpi.digitalRead(pin) == 0) {
		}
		var old = process.hrtime();
		while (wpi.digitalRead(pin) == 1) {
			err = false
			prev = process.hrtime(old);
			if (prev[1] * 1e-9 > 0.001) {
				err = true;
				break;
			}
		}
		if (err == false)
			data.push(prev[1] * 1e-9);
		cnt += 1
		if (cnt > 41) {
			break;
		}
	}
	//console.log(data.length, data);

	if (data[0] >= 0.00007) {
		data.shift(0)
		for( let i=0; i<data.length; i++) {
			if (data[i] > 0.00007) {
				console.log('no good data:invalid data', i);
				break;
			} else if (data[i] >= 0.00004) { // originally should be 70us
				data2.push(1);
			} else {
				data2.push(0);
			}
		}
		// console.log(data2, data2.length);
		if (data2.length != 40) {
			console.log('no good data:not enough data.');
		} else {
			humi1 = parseInt(data2.slice(0, 8).join(''), 2);
			humi2 = parseInt(data2.slice(9, 16).join(''), 2);
			temp1 = parseInt(data2.slice(17, 24).join(''), 2);
			temp2 = parseInt(data2.slice(25, 32).join(''), 2);
			crc = parseInt(data2.slice(33, 40).join(''), 2);
			if (crc != (humi1 + humi2 + temp1 + temp2)) {
				console.log('no good data:crc err');
			} else {
				console.log('huminity : %d.%d%%, temperatur:%d.%dC', humi1,
						humi2, temp1, temp2);
			}
		}
	} else {
		console.log('no good data', data[0]);
	}
	wpi.delay(500)
}
