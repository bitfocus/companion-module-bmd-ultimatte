module.exports = {
	initActions: function () {
		let self = this;
		let actions = {};

		let onoffdrop = self.buildDropdownExact(['On', 'Off'])

		actions.ly_fade_mix = {
			name: 'LY Fade Mix',
			options: [
				{
					type: 'textinput',
					label: 'Value',
					id: 'controlValue',
					tooltip: 'Value between 0-10000.',
					default: '0',
					//regex: self.REGEX_NUMBER,
				},
			],
			callback: async function (action, bank) {
				let opt = action.options;
				let cmd = self.makeControlCommand(self.Controls.LY_FADE_MIX, opt.controlValue);
				self.sendCommand(cmd);
			}
		};
		
		actions.backing_clr = {
			name: 'Backing Color',
			options: [
				{
					type: 'dropdown',
					label: 'Color',
					id: 'controlValue',
					default: 'Red',
					choices: self.buildDropdownExact(['Red', 'Green', 'Blue']),
				},
			],
			callback: async function (action, bank) {
				let opt = action.options;
				let cmd = self.makeControlCommand(self.Controls.BACKING_CLR, opt.controlValue);
				self.sendCommand(cmd);
			}
		};
		
		actions.mon_out = {
			name: 'Monitor Out',
			options: [
				{
					type: 'dropdown',
					label: 'Monitor Out',
					id: 'controlValue',
					default: 'Program',
					choices: self.buildDropdownExact([
						'Program',
						'FG',
						'BG',
						'Combined Matte',
						'Internal Matte',
						'Fill',
						'Layer In',
						'Background Matte In',
						'Garbage Matte In',
						'Holdout Matte In',
						'Layer Matte In',
						'Processed LM',
						'Processed HM',
						'Processed GM',
						'Processed BM',
						'Screen Correction',
					]),
				},
			],
			callback: async function (action, bank) {
				let opt = action.options;
				let cmd = self.makeControlCommand(self.Controls.MONITOR_OUT, opt.controlValue);
				self.sendCommand(cmd);
			}
		};
		
		actions.vid_format = {
			name: 'Video Format',
			options: [
				{
					type: 'dropdown',
					label: 'Video Format',
					id: 'controlValue',
					default: 'Auto Detect',
					choices: self.buildDropdownExact([
						'Auto Detect',
						'525i59.94 NTSC 4:3',
						'625i50 PAL 4:3',
						'720p60',
						'720p59.94',
						'720p50',
						'1080i60',
						'1080i59.94',
						'1080i50',
						'1080p60',
						'1080p59.94',
						'1080p50',
						'1080p30',
						'1080p29.97',
						'1080p25',
						'1080p24',
						'1080p23.98',
						'1080PsF30',
						'1080PsF29.97',
						'1080PsF25',
						'1080PsF24',
						'1080PsF23.98',
						'2160p60',
						'2160p59.94',
						'2160p50',
						'2160p30',
						'2160p29.97',
						'2160p25',
						'2160p24',
						'2160p23.98',
						'4320p60',
						'4320p59.94',
						'4320p50',
						'4320p30',
						'4320p29.97',
						'4320p25',
						'4320p24',
						'4320p23.98',
						]),
					},
			],
			callback: async function (action, bank) {
				let opt = action.options;
				let cmd = self.makeControlCommand(self.Controls.VIDEO_FORMAT, opt.controlValue);
				self.sendCommand(cmd);
			}
		};
		
		actions.talent_mir = {
			name: 'Talent Mirror',
			options: [
				{
					type: 'dropdown',
					label: 'On/Off',
					id: 'controlValue',
					default: 'On',
					choices: onoffdrop,
				},
			],
			callback: async function (action, bank) {
				let opt = action.options;
				let cmd = self.makeControlCommand(self.Controls.TALENT_MIR, opt.controlValue);
				self.sendCommand(cmd);
			}
		};
		
		actions.dual_cur = {
			name: 'Dual Cursor',
			options: [
				{
					type: 'dropdown',
					label: 'On/Off',
					id: 'controlValue',
					default: 'On',
					choices: onoffdrop,
				},
			],
			callback: async function (action, bank) {
				let opt = action.options;
				let cmd = self.makeControlCommand(self.Controls.DUAL_CUR, opt.controlValue);
				self.sendCommand(cmd);
			}
		};
		
		actions.wall_cur_enable = {
			name: 'Wall Cursor Position Enable',
			options: [
				{
					type: 'dropdown',
					label: 'On/Off',
					id: 'controlValue',
					default: 'On',
					choices: onoffdrop,
				},
			],
			callback: async function (action, bank) {
				let opt = action.options;
				let cmd = self.makeControlCommand(self.Controls.WALL_CUR_ENABLE, opt.controlValue);
				self.sendCommand(cmd);
			}
		};
		
		actions.floor_cur_enable = {
			name: 'Floor Cursor Position Enable',
			options: [
				{
					type: 'dropdown',
					label: 'On/Off',
					id: 'controlValue',
					default: 'On',
					choices: onoffdrop,
				},
			],
			callback: async function (action, bank) {
				let opt = action.options;
				let cmd = self.makeControlCommand(self.Controls.FLOOR_CUR_ENABLE, opt.controlValue);
				self.sendCommand(cmd);
			}
		};
		
		actions.cur_x = {
			name: 'Cursor X',
			options: [
				{
					type: 'textinput',
					label: 'Value',
					id: 'controlValue',
					tooltip: 'Value between 0-10000.',
					default: '0',
					//regex: self.REGEX_NUMBER,
				},
			],
			callback: async function (action, bank) {
				let opt = action.options;
				let cmd = self.makeControlCommand(self.Controls.CUR_X, opt.controlValue);
				self.sendCommand(cmd);
			}
		};
		
		actions.cur_y = {
			name: 'Cursor Y',
			options: [
				{
					type: 'textinput',
					label: 'Value',
					id: 'controlValue',
					tooltip: 'Value between 0-10000.',
					default: '0',
					//regex: self.REGEX_NUMBER,
				},
			],
			callback: async function (action, bank) {
				let opt = action.options;
				let cmd = self.makeControlCommand(self.Controls.CUR_Y, opt.controlValue);
				self.sendCommand(cmd);
			}
		};
		
		actions.cur_2_x = {
			name: 'Cursor 2 X',
			options: [
				{
					type: 'textinput',
					label: 'Value',
					id: 'controlValue',
					tooltip: 'Value between 0-10000.',
					default: '0',
					//regex: self.REGEX_NUMBER,
				},
			],
			callback: async function (action, bank) {
				let opt = action.options;
				let cmd = self.makeControlCommand(self.Controls.CUR_2_X, opt.controlValue);
				self.sendCommand(cmd);
			}
		};
		
		actions.cur_2_y = {
			name: 'Cursor 2 Y',
			options: [
				{
					type: 'textinput',
					label: 'Value',
					id: 'controlValue',
					tooltip: 'Value between 0-10000.',
					default: '0',
					//regex: self.REGEX_NUMBER,
				},
			],
			callback: async function (action, bank) {
				let opt = action.options;
				let cmd = self.makeControlCommand(self.Controls.CUR_2_Y, opt.controlValue);
				self.sendCommand(cmd);
			}
		};
		
		actions.matte_den = {
			name: 'Matte Density',
			options: [
				{
					type: 'textinput',
					label: 'Value',
					id: 'controlValue',
					tooltip: 'Value between 0-10000.',
					default: '0',
					//regex: self.REGEX_NUMBER,
				},
			],
			callback: async function (action, bank) {
				let opt = action.options;
				let cmd = self.makeControlCommand(self.Controls.MATTE_DEN, opt.controlValue);
				self.sendCommand(cmd);
			}
		};
		
		actions.black_gloss = {
			name: 'Black Gloss',
			options: [
				{
					type: 'textinput',
					label: 'Value',
					id: 'controlValue',
					tooltip: 'Value between 0-10000.',
					default: '0',
					//regex: self.REGEX_NUMBER,
				},
			],
			callback: async function (action, bank) {
				let opt = action.options;
				let cmd = self.makeControlCommand(self.Controls.BLACK_GLOSS, opt.controlValue);
				self.sendCommand(cmd);
			}
		};
		
		actions.shadow_lvl = {
			name: 'Shadow Level',
			options: [
				{
					type: 'textinput',
					label: 'Value',
					id: 'controlValue',
					tooltip: 'Value between 0-10000.',
					default: '0',
					//regex: self.REGEX_NUMBER,
				},
			],
			callback: async function (action, bank) {
				let opt = action.options;
				let cmd = self.makeControlCommand(self.Controls.SHADOW_LEV, opt.controlValue);
				self.sendCommand(cmd);
			}
		};
		
		actions.shadow_thr = {
			name: 'Shadow Threshold',
			options: [
				{
					type: 'textinput',
					label: 'Value',
					id: 'controlValue',
					tooltip: 'Value between 0-10000.',
					default: '0',
					//regex: self.REGEX_NUMBER,
				},
			],
			callback: async function (action, bank) {
				let opt = action.options;
				let cmd = self.makeControlCommand(self.Controls.SHADOW_THR, opt.controlValue);
				self.sendCommand(cmd);
			}
		};
		
		actions.veil_mas = {
			name: 'Veil Master',
			options: [
				{
					type: 'textinput',
					label: 'Value',
					id: 'controlValue',
					tooltip: 'Value between 0-10000.',
					default: '0',
					//regex: self.REGEX_NUMBER,
				},
			],
			callback: async function (action, bank) {
				let opt = action.options;
				let cmd = self.makeControlCommand(self.Controls.VEIL_MAS, opt.controlValue);
				self.sendCommand(cmd);
			}
		};
		
		actions.clean_lvl = {
			name: 'Cleanup Level',
			options: [
				{
					type: 'textinput',
					label: 'Value',
					id: 'controlValue',
					tooltip: 'Value between 0-10000.',
					default: '0',
					//regex: self.REGEX_NUMBER,
				},
			],
			callback: async function (action, bank) {
				let opt = action.options;
				let cmd = self.makeControlCommand(self.Controls.CLEAN_LEV, opt.controlValue);
				self.sendCommand(cmd);
			}
		};
		
		actions.matte_enable = {
			name: 'Matte Enable',
			options: [
				{
					type: 'dropdown',
					label: 'On/Off',
					id: 'controlValue',
					default: 'On',
					choices: onoffdrop,
				},
			],
			callback: async function (action, bank) {
				let opt = action.options;
				let cmd = self.makeControlCommand(self.Controls.MATTE_ENABLE, opt.controlValue);
				self.sendCommand(cmd);
			}
		};
		
		actions.quickload = {
			name: 'QuickLoad',
			options: [
				{
					type: 'dropdown',
					label: 'Selection',
					id: 'controlSel',
					default: '1',
					choices: self.buildDropdownExact(['1', '2', '3', '4', '5']),
				},
				{
					type: 'dropdown',
					label: 'On/Off',
					id: 'controlValue',
					default: 'On',
					choices: onoffdrop,
				},
			],
			callback: async function (action, bank) {
				let opt = action.options;
				let cmd = self.makeControlCommand(self.Controls.QUICKLOAD + ' ' + opt.controlSel, opt.controlValue);
				self.sendCommand(cmd);
			}
		};
		
		actions.quicksave = {
			name: 'QuickSave',
			options: [
				{
					type: 'dropdown',
					label: 'Selection',
					id: 'controlSel',
					default: '1',
					choices: self.buildDropdownExact(['1', '2', '3', '4', '5']),
				},
				{
					type: 'dropdown',
					label: 'On/Off',
					id: 'controlValue',
					default: 'On',
					choices: onoffdrop,
				},
			],
			callback: async function (action, bank) {
				let opt = action.options;
				let cmd = self.makeControlCommand(self.Controls.QUICKSAVE + ' ' + opt.controlSel, opt.controlValue);
				self.sendCommand(cmd);
			}
		};
		
		actions.gm_enable = {
			name: 'GM Enable',
			options: [
				{
					type: 'dropdown',
					label: 'On/Off',
					id: 'controlValue',
					default: 'On',
					choices: onoffdrop,
				},
			],
			callback: async function (action, bank) {
				let opt = action.options;
				let cmd = self.makeControlCommand(self.Controls.GM_ENABLE, opt.controlValue);
				self.sendCommand(cmd);
			}
		};
		
		actions.samp_wall = {
			name: 'Sample Wall',
			options: [],
			callback: async function (action, bank) {
				let cmd = self.makeControlCommand(self.Controls.SAMP_WALL, 'Yes');
				self.sendCommand(cmd);
			}
		};
		
		actions.samp_floor = {
			name: 'Sample Floor',
			options: [],
			callback: async function (action, bank) {
				let cmd = self.makeControlCommand(self.Controls.SAMP_FLOOR, 'Yes');
				self.sendCommand(cmd);
			}
		};
		
		actions.auto_scn_sample = {
			name: 'Auto Screen Sample',
			options: [],
			callback: async function (action, bank) {
				let cmd = self.makeControlCommand(self.Controls.AUTO_SCN_SAMP, 'Yes');
				self.sendCommand(cmd);
			}
		};

		//Rotary Actions
		actions.offset_controls = {
			name: 'Offset Controls',
			options: [
				{
					type: 'dropdown',
					label: 'Control',
					id: 'controlSel',
					default: self.controls_rotary[0].id,
					choices: self.controls_rotary,
				},
				{
					type: 'dropdown',
					label: 'Direction',
					id: 'direction',
					default: 'Up',
					choices: self.buildDropdownExact(['Up', 'Down']),
				},
				{
					type: 'textinput',
					label: 'Offset Amount',
					id: 'offset',
					default: 1,
					useVariables: true
				},
			],
			callback: async function (action, bank) {
				let opt = action.options;

				//get the offset object based on the control selection
				let control = self.controls_rotary.find((control) => control.id === opt.controlSel);
				if (control) {
					console.log('control is valid');
					let min = control.min;
					let max = control.max;

					let currentValue = self.data[control.id];
					if (currentValue === undefined) {
						console.log('current value was undefined')
						currentValue = 0;
					}
					currentValue = parseInt(currentValue);

					console.log('current value: ' + currentValue)

					let newAmount = currentValue;

					let offset = await self.parseVariablesInString(opt.offset);
					offset = parseInt(offset);
					//make sure offset is not NaN
					if (isNaN(offset)) {
						offset = 0;
					}

					console.log('offset: ' + offset)

					if (opt.direction == 'Up') {
						newAmount = currentValue + offset;
					}
					else {
						newAmount = currentValue - offset;
					}

					console.log('new amount: ' + newAmount)

					if (newAmount < min) {
						newAmount = min;
					}
					else if (newAmount > max) {
						newAmount = max;
					}

					console.log('final new amount: ' + newAmount);

					let cmd = self.makeControlCommand(control.label, newAmount);

					console.log('cmd: ' + cmd);
					self.sendCommand(cmd);
				}
				else {
					console.log('control is invalid');
				}
			}
		}

		self.setActionDefinitions(actions);
	}
}