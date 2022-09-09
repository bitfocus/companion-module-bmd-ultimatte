var tcp = require('../../tcp');
var instance_skel = require('../../instance_skel');
const Constants_1 = require("./constants");
var debug;
var log;

function instance(system, id, config) {
	var self = this;

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
			value: "This module controls the Blackmagic Ultimate"
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 5,
			default: "192.168.10.220",
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Target Port',
			width: 4,
			default: 9998,
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

	// build on/off dropdown
	let onoffdrop = this.buildDropdownExact(['On', 'Off']);

	self.setActions({
		'ly_fade_mix': {
			label: "LY Fade Mix",
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
		},
		'backing_clr': {
			label: "Backing Color",
			options: [
				{
					type: 'dropdown',
					label: 'Color',
					id: 'controlValue',
					default: 'Red',
					choices: this.buildDropdownExact(['Red', 'Green', 'Blue'])
				}
			]
		},
		'mon_out': {
			label: "Monitor Out",
			options: [
				{
					type: 'dropdown',
					label: 'Monitor Out',
					id: 'controlValue',
					default: 'Program',
					choices: this.buildDropdownExact(['Program', 'FG', 'BG', 'Combined Matte',
						'Internal Matte', 'Fill', 'Layer In', 'Background Matte In', 
						'Garbage Matte In', 'Holdout Matte In', 'Layer Matte In',
						'Processed LM', 'Processed HM', 'Processed GM', 'Processed BM',
						'Screen Correction'])
				}
			]
		},
		'vid_format': {
			label: "Video Format",
			options: [
				{
					type: 'dropdown',
					label: 'Video Format',
					id: 'controlValue',
					default: 'Auto Detect',
					choices: this.buildDropdownExact(['Auto Detect', '525i59.94 NTSC 4:3', 
						'625i50 PAL 4:3', '720p60', '720p59.94', 
						'720p50', '1080i60', '1080i59.94', 
						'1080i50', '1080p60', '1080p59.94', 
						'1080p50', '1080p30', '1080p29.97', 
						'1080p25', '1080p24', '1080p23.98', 
						'1080PsF30', '1080PsF29.97', 
						'1080PsF25', '1080PsF24', 
						'1080PsF23.98', '2160p60', '2160p59.94', 
						'2160p50', '2160p30', '2160p29.97', 
						'2160p25', '2160p24', '2160p23.98', 
						'4320p60', '4320p59.94', '4320p50', 
						'4320p30', '4320p29.97', '4320p25', 
						'4320p24', '4320p23.98'])
				}
			]
		},
		'talent_mir': {
			label: "Talent Mirror",
			options: [
				{
					type: 'dropdown',
					label: 'On/Off',
					id: 'controlValue',
					default: 'On',
					choices: onoffdrop
				}
			]
		},
		'dual_cur': {
			label: "Dual Cursor",
			options: [
				{
					type: 'dropdown',
					label: 'On/Off',
					id: 'controlValue',
					default: 'On',
					choices: onoffdrop
				}
			]
		},
		'wall_cur_enable': {
			label: "Wall Cursor Position Enable",
			options: [
				{
					type: 'dropdown',
					label: 'On/Off',
					id: 'controlValue',
					default: 'On',
					choices: onoffdrop
				}
			]
		},
		'floor_cur_enable': {
			label: "Floor Cursor Position Enable",
			options: [
				{
					type: 'dropdown',
					label: 'On/Off',
					id: 'controlValue',
					default: 'On',
					choices: onoffdrop
				}
			]
		},
		'cur_x': {
			label: "Cursor X",
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
		},
		'cur_y': {
			label: "Cursor Y",
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
		},
		'cur_2_x': {
			label: "Cursor 2 X",
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
		},
		'cur_2_y': {
			label: "Cursor 2 Y",
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
		},
		'matte_den': {
			label: "Matte Density",
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
		},
		'black_gloss': {
			label: "Black Gloss",
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
		},
		'shadow_lvl': {
			label: "Shadow Level",
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
		},
		'shadow_thr': {
			label: "Shadow Threshold",
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
		},
		'veil_mas': {
			label: "Veil Master",
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
		},
		'clean_lvl': {
			label: "Cleanup Level",
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
		},
		'matte_enable': {
			label: "Matte Enable",
			options: [
				{
					type: 'dropdown',
					label: 'On/Off',
					id: 'controlValue',
					default: 'On',
					choices: onoffdrop
				}
			]
		},
		'quickload': {
			label: "QuickLoad",
			options: [
				{
					type: 'dropdown',
					label: 'Selection',
					id: 'controlSel',
					default: '1',
					choices: this.buildDropdownExact(['1', '2', '3', '4', '5'])
				},
				{
					type: 'dropdown',
					label: 'On/Off',
					id: 'controlValue',
					default: 'On',
					choices: onoffdrop
				}
			]
		},
		'quicksave': {
			label: "QuickSave",
			options: [
				{
					type: 'dropdown',
					label: 'Selection',
					id: 'controlSel',
					default: '1',
					choices: this.buildDropdownExact(['1', '2', '3', '4', '5'])
				},
				{
					type: 'dropdown',
					label: 'On/Off',
					id: 'controlValue',
					default: 'On',
					choices: onoffdrop
				}
			]
		},
		'gm_enable': {
			label: "GM Enable",
			options: [
				{
					type: 'dropdown',
					label: 'On/Off',
					id: 'controlValue',
					default: 'On',
					choices: onoffdrop
				}
			]
		},
		'samp_wall': {
			label: "Sample Wall",
		},
		'samp_floor': {
			label: "Sample Floor",
		},
		'auto_scn_sample': {
			label: "Auto Screen Sample",
		},
	});

};


/**
 * Executes the action and sends the TCP packet to the Blackmagic Ultimatte.
 * 
 * @param action      The action to perform
 */
instance.prototype.action = function(action) {
	var self = this;
	let cmd = undefined;

	// Clone 'action.options', otherwise reassigning the parsed variables directly will push
	//  them back into the config, because that's done by reference.
	let opt = JSON.parse(JSON.stringify(action.options));

	// Loop through each option for this action, and if any appear to be variables, parse them
	//  and reassign the result back into 'opt'.
	for (const key in opt) {
		let v = opt[key];
		if (typeof v === 'string' && v.includes('$(')) {
			self.system.emit('variable_parse', v, parsed => v = parsed.trim());
			opt[key] = v;
		}
	}

	switch (action.action) {
		case 'ly_fade_mix':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.LY_FADE_MIX, opt.controlValue);
			break;
		case 'backing_clr':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.BACKING_CLR, opt.controlValue);
			break;
		case 'mon_out':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.MONITOR_OUT, opt.controlValue);
			break;
		case 'vid_format':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.VIDEO_FORMAT, opt.controlValue);
			break;
		case 'talent_mir':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.TALENT_MIR, opt.controlValue);
			break;
		case 'dual_cur':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.DUAL_CUR, opt.controlValue);
			break;
		case 'wall_cur_enable':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.WALL_CUR_ENABLE, opt.controlValue);
			break;
		case 'floor_cur_enable':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.FLOOR_CUR_ENABLE, opt.controlValue);
			break;
		case 'cur_x':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.CUR_X, opt.controlValue);
			break;
		case 'cur_y':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.CUR_Y, opt.controlValue);
			break;
		case 'cur_2_x':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.CUR_2_X, opt.controlValue);
			break;
		case 'cur_2_y':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.CUR_2_Y, opt.controlValue);
			break;
		case 'floor_cur_enable':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.FLOOR_CUR_ENABLE, opt.controlValue);
			break;
		case 'cur_x':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.CUR_X, opt.controlValue);
			break;
		case 'cur_y':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.CUR_Y, opt.controlValue);
			break;
		case 'cur_2_x':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.CUR_2_X, opt.controlValue);
			break;
		case 'cur_2_y':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.CUR_2_Y, opt.controlValue);
			break;
		case 'matte_den':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.MATTE_DEN, opt.controlValue);
			break;
		case 'black_gloss':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.BLACK_GLOSS, opt.controlValue);
			break;
		case 'shadow_lvl':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.SHADOW_LEV, opt.controlValue);
			break;
		case 'shadow_thr':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.SHADOW_THR, opt.controlValue);
			break;
		case 'veil_mas':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.VEIL_MAS, opt.controlValue);
			break;
		case 'clean_lvl':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.CLEAN_LEV, opt.controlValue);
			break;
		case 'matte_enable':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.MATTE_ENABLE, opt.controlValue);
			break;
		case 'quickload':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.QUICKLOAD+" "+opt.controlSel, opt.controlValue);
			break;
		case 'quicksave':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.QUICKSAVE+" "+opt.controlSel, opt.controlValue);
			break;
		case 'gm_enable':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.GM_ENABLE, opt.controlValue);
			break;
		case 'samp_wall':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.SAMP_WALL, "Yes");
			break;
		case 'samp_floor':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.SAMP_FLOOR, "Yes");
			break;
		case 'auto_scn_sample':
			cmd = self.makeControlCommand(Constants_1.Constants.Controls.AUTO_SCN_SAMP, "Yes");
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
instance.prototype.makeControlCommand = function(contVar, contValue) {
	var self = this;
	var cmd = Constants_1.Constants.Headers.CONTROL + ':\n' + contVar + ': ' + contValue + '\n\n';
	return cmd;

};

/**
 * 
 * Formats a list of drop down strings into an array with matching ids
 * 
 * @param droplist      List of dropdown strings 
 * @returns             Formatted dropdown list with index values
 */
instance.prototype.buildDropdownExact = function(droplist){
	let drop = [];
	for (let i=0; i<droplist.length; i++) {
		drop.push({ id:droplist[i], label: droplist[i] });
	}
	return drop;
}



instance_skel.extendedBy(instance);
exports = module.exports = instance;

