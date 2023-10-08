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

			});
	
			self.socket.on('receiveline', function (line) {

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
	

	
		self.checkFeedbacks();
		self.checkVariables();	
	},

	sendCommand: function(cmd) {
		let self = this;

		if (cmd !== undefined) {
			if (self.socket !== undefined && self.socket.isConnected) {
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