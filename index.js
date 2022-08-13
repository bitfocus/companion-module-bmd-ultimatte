var tcp = require('../../tcp');
var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// Controls
	self.LY_FADE_MIX = "LY Fade Mix";

	// Headers
	self.CONTROL = "CONTROL";
	self.FILE = "FILE";
	self.GPI = "GPI";
	self.PING = "PING";
	self.QUIT = "QUIT";



	// A promise that's resolved when the socket connects to the matrix.
	self.PromiseConnected = null;

	// super-constructor
	instance_skel.apply(this, arguments);
	
	self.actions();

	return self;

}


/**
 * The user updated the config.
 * 
 * @param config         The new config object
 */
instance.prototype.updateConfig = function(config) {
	var self = this;
	var resetConnection = false;

	if (self.config.host != config.host || self.config.port != config.port) {
		resetConnection = true;
	}

	self.config = config;

	if (resetConnection === true || self.socket === undefined) {
		self.init_connection();
	}

};



/**
 * Initializes the module 
 */
instance.prototype.init = function() {
	var self = this;
	
	debug = self.debug;
	log   = self.log;

	self.init_connection();

};


/**
 * Connect to the Blackmagic Ultimate.
 */
instance.prototype.init_connection = function() {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
		delete self.socket;
	}

	if (!self.config.host) {
		return;
	}

	self.status(self.STATUS_WARNING, 'Connecting');

	self.PromiseConnected = new Promise((resolve, reject) => {

		self.socket = new tcp(self.config.host, self.config.port, { reconnect_interval:5000 });

		self.socket.on('error', (err) => {

			if (self.currentStatus !== self.STATUS_ERROR) {
				// Only log the error if the module isn't already in this state.
				// This is to prevent spamming the log during reconnect failures.
				debug('Network error', err);
				self.status(self.STATUS_ERROR, err);
				self.log('error', `Network error: ${err.message}`);
			}

			reject(err);

		});

		self.socket.on('connect', () => {
			self.status(self.STATUS_OK);
			debug('Connected');
			resolve();
		});



	}).catch((err) => {
		// The error is already logged, but Node requires all rejected promises to be caught.
	});

	self.socket.on('status_change', (status, message) => {
		self.status(status, message);
	});

};



/**
 * Sends the command to the Blackmagic Ultimatte.
 * 
 * @param cmd      The command to send
 * @returns        Success state of writing to the socket
 */
instance.prototype.send = function(cmd) {
	var self = this;

	if (self.isConnected()) {
		debug('sending', cmd, 'to', self.config.host);
		return self.socket.send(cmd);
	} else {
		debug('Socket not connected');
	}

	return false;

};


/**
 * Returns if the socket is connected.
 * 
 * @returns      If the socket is connected
 */
instance.prototype.isConnected = function() {
	var self = this;

	return self.socket !== undefined && self.socket.connected;

};


/**
 * Return config fields for web config.
 * 
 * @returns      The config fields for the module
 */
instance.prototype.config_fields = function() {
	var self = this;
	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: "This module works controls the Blackmagic Ultimate"
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 4,
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Target Port',
			width: 4,
			value: 9998,
			regex: self.REGEX_PORT
		}
	]
};


/**
 * Cleanup when the module gets deleted.
 */
instance.prototype.destroy = function() {
	var self = this;
	
	if (self.socket !== undefined) {
		self.socket.destroy();
		delete self.socket;
	}

	debug('destroy', self.id);

};


/**
 * Creates the actions for this module.
 */
instance.prototype.actions = function(system) {
	var self = this;

	self.setActions({
		'ly_fade_mix': {
			label: self.LY_FADE_MIX,
			options: [
				{
					type: 'textwithvariables',
					label: 'Value',
					id: 'controlValue',
					tooltip: 'Value between 0-10000.',
					default: '0',
					regex: self.REGEX_NUMBER
				}
			]
		}
	});

};


/**
 * Executes the action and sends the TCP packet to the Blackmagic Ultimatte.
 * 
 * @param action      The action to perform
 */
instance.prototype.action = function(action) {
	var self = this;
	let opt = action.options;
	let cmd = undefined;

	switch (action.action) {
		case 'ly_fade_mix':
			cmd = self.makeControlCommand(self.CONTROL, self.LY_FADE_MIX, opt.controlValue);
			break;

		// Other cases go here
	}

	if (cmd !== undefined) {
		self.send(cmd);
	}

};


/**
 * Formats the CONTROL command as per the Blackmagic Ultimatte.
 * 
 * @param contVar        The control variable to be updated
 * @param contValue      The new value of the control variable
 * @returns              The built command to send
 */
instance.prototype.makeControlCommand = function(header, contVar, contValue) {
	var self = this;
	var cmd = header;
	self.CONTROL = "CONTROL"; //TODO - remove
	cmd += ':\n' + contVar + ': ' + contValue + '\n\n';
	return cmd;

};



instance_skel.extendedBy(instance);
exports = module.exports = instance;
var cmd = instance.prototype.makeControlCommand("LY Fade Mix", 100); //TODO - remove
console.log(cmd); //TODO - remove
