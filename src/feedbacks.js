const { combineRgb } = require('@companion-module/base')

function convertRange(value, oldRange, newRange) {
	return ((value - oldRange.min) * (newRange.max - newRange.min)) / (oldRange.max - oldRange.min) + newRange.min;
}

module.exports = {
	initFeedbacks: function () {
		let self = this
		let feedbacks = {}

		const foregroundColor = combineRgb(255, 255, 255) // White
		const backgroundColorRed = combineRgb(255, 0, 0) // Red

		feedbacks.control_value_compare = {
			type: 'boolean',
			name: 'Control Value Comparison',
			description: "Change a button's style based on a control's current value.",
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
					label: 'Comparison',
					id: 'comparison',
					default: '=',
					choices: [
						{ id: '=', label: '=' },
						{ id: '!=', label: '!=' },
						{ id: '<', label: '<' },
						{ id: '<=', label: '<=' },
						{ id: '>', label: '>' },
						{ id: '>=', label: '>=' },
					],
				},
				{
					type: 'textinput',
					label: 'Value',
					id: 'value',
					tooltip: 'Raw value (0-10000 range, not percent) to compare against.',
					default: '0',
					useVariables: true,
				},
			],
			defaultStyle: {
				color: foregroundColor,
				bgcolor: backgroundColorRed,
			},
			callback: async function (feedback, context) {
				let opt = feedback.options;

				let control = self.controls_rotary.find((control) => control.id === opt.controlSel);
				if (!control) {
					return false;
				}

				let currentValue = self.data[control.id];
				if (currentValue === undefined) {
					return false;
				}
				currentValue = parseInt(currentValue);

				let compareValue = await context.parseVariablesInString(opt.value);
				compareValue = parseInt(compareValue);
				if (isNaN(compareValue)) {
					return false;
				}

				switch (opt.comparison) {
					case '=': return currentValue === compareValue;
					case '!=': return currentValue !== compareValue;
					case '<': return currentValue < compareValue;
					case '<=': return currentValue <= compareValue;
					case '>': return currentValue > compareValue;
					case '>=': return currentValue >= compareValue;
					default: return false;
				}
			}
		};

		feedbacks.control_value_display = {
			type: 'advanced',
			name: 'Show Control Value',
			description: "Displays a control's current value (or percent, if available) as the button text.",
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
					label: 'Format',
					id: 'format',
					default: 'raw',
					choices: [
						{ id: 'raw', label: 'Raw Value' },
						{ id: 'percent', label: 'Percent (if available)' },
					],
				},
			],
			callback: function (feedback) {
				let opt = feedback.options;

				let control = self.controls_rotary.find((control) => control.id === opt.controlSel);
				if (!control) {
					return {};
				}

				let currentValue = self.data[control.id];
				if (currentValue === undefined) {
					return { text: control.label + '\n--' };
				}
				currentValue = parseInt(currentValue);

				let displayValue = String(currentValue);
				if (opt.format === 'percent' && control.minPercent !== undefined && control.maxPercent !== undefined) {
					let percent = convertRange(currentValue, { min: control.min, max: control.max }, { min: control.minPercent, max: control.maxPercent });
					displayValue = Math.round(percent) + '%';
				}

				return { text: control.label + '\n' + displayValue };
			}
		};

		self.setFeedbackDefinitions(feedbacks);
	}
}
