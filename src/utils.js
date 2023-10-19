const { TCPHelper, InstanceStatus } = require('@companion-module/base');

module.exports = {
	initTCP: function() {
		let self = this;
		let receivebuffer = '';
	
		if (self.socket !== undefined) {
			self.socket.destroy();
			delete self.socket;
		}
	
		if (self.config.host) {
			self.socket = new TCPHelper(self.config.host, self.config.port);

			self.socket.on('connect', function () {
				self.updateStatus(InstanceStatus.Ok);
			});
	
			// separate buffered stream into lines with responses
			self.socket.on('data', function (chunk) {
				//console.log('chunk: ' + chunk)

				let i = 0, line = '', offset = 0;
				receivebuffer += chunk;
	
				while ( (i = receivebuffer.indexOf('\n', offset)) !== -1) {
					line = receivebuffer.substr(offset, i - offset);
					offset = i + 1;
					self.socket.emit('receiveline', line.toString());
				}
	
				receivebuffer = receivebuffer.substr(offset);
			});
	
			self.socket.on('receiveline', function (line) {
				self.log('debug', 'Received: ' + line);

				if (self.command === null && line.match(/:/) ) {
					self.command = line;
				}
				else if (self.command !== null && line.length > 0) {
					self.stash.push(line.trim());
				}
				else if (line.length === 0 && self.command !== null) {
					let cmd = self.command.trim().split(/:/)[0];
	
					self.log('debug', 'COMMAND: ' + cmd);
	
					let obj = {};
					self.stash.forEach(function (val) {
						let info = val.split(/\s*:\s*/);
						obj[info.shift()] = info.join(':');
					});
	
					self.processInformation(cmd, obj);
	
					self.stash = [];
					self.command = null;
				}
				else {
					self.log('debug', 'Unexpected response from Ultimatte: ' + line);
				}
			});
	
			self.socket.on('error', function (err) {
				self.log('error', 'Network error: ' + err.message);
				self.socket.destroy(); //close the socket after receiving the error
				self.updateStatus(InstanceStatus.Error, err.message);
			});
		}
	},

	processInformation: function(key, data) {
		let self = this;

		try {
			if (key == 'CONTROL') {	
				console.log('CONTROL')
				console.log(data)
				for (let i = 0; i < self.controls_rotary.length; i++) {
					let control = self.controls_rotary[i];
					let controlId = control.id;
					let controlName = control.label;
					let controlValue = data[controlName];
	
					if (controlValue !== undefined) {
						self.data[controlId] = parseInt(controlValue);
					}
				}
			}
		
			self.checkFeedbacks();
			self.checkVariables();	
		}
		catch(error) {
			self.log('error', 'Error parsing information: ' + String(error));
		}
	},

	sendCommand: function(cmd) {
		let self = this;

		if (cmd !== undefined) {
			if (self.socket !== undefined && self.socket.isConnected) {
				self.log('debug', 'Sending: ' + cmd);
				self.socket.send(cmd);
			} else {
				self.log('debug', 'Socket not connected :(');
			}
		}
	},

	makeControlCommand: function (contVar, contValue) {
		let self = this
		let cmd = self.Headers.CONTROL + ':\n' + contVar + ': ' + contValue + '\n\n'
		return cmd
	},

	buildDropdownExact: function (droplist) {
		let drop = []
		for (let i = 0; i < droplist.length; i++) {
			drop.push({ id: droplist[i], label: droplist[i] })
		}
		return drop
	}
}