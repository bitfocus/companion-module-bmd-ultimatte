const { combineRgb } = require('@companion-module/base')

module.exports = {
	initPresets: function () {
		let self = this;
		let presets = {}

		const foregroundColor = combineRgb(255, 255, 255) // White
		const foregroundColorBlack = combineRgb(0, 0, 0) // Black
		const backgroundColorRed = combineRgb(255, 0, 0) // Red
		const backgroundColorGreen = combineRgb(0, 255, 0) // Green
		const backgroundColorOrange = combineRgb(255, 102, 0) // Orange

		// Helper to build a rotary (dial) preset: turning the encoder offsets the
		// control, and the button face shows its live value.
		function makeRotaryPreset(controlId, controlLabel, offsetAmount) {
			return {
				type: 'button',
				category: 'Rotary Controls',
				name: controlLabel + ' (Rotary)',
				style: {
					text: controlLabel,
					size: '14',
					color: foregroundColor,
					bgcolor: foregroundColorBlack,
				},
				options: {
					rotaryActions: true,
				},
				feedbacks: [
					{
						feedbackId: 'control_value_display',
						options: {
							controlSel: controlId,
							format: 'percent',
						},
					},
				],
				steps: [
					{
						down: [],
						up: [],
						rotate_left: [
							{
								actionId: 'offset_controls',
								options: {
									controlSel: controlId,
									direction: 'Down',
									offset: String(offsetAmount),
								},
							},
						],
						rotate_right: [
							{
								actionId: 'offset_controls',
								options: {
									controlSel: controlId,
									direction: 'Up',
									offset: String(offsetAmount),
								},
							},
						],
					},
				],
			}
		}

		presets.matte_density_rotary = makeRotaryPreset('matte_density', 'Matte Density', 200);
		presets.black_gloss_rotary = makeRotaryPreset('black_gloss', 'Black Gloss', 200);
		presets.cursor_x_rotary = makeRotaryPreset('cursor_x', 'Cursor X', 200);

		// Plain +/- buttons for the same controls, for setups without an encoder.
		presets.matte_density_inc = {
			type: 'button',
			category: 'Rotary Controls',
			name: 'Matte Density +',
			style: {
				text: 'Matte\\nDensity\\n+',
				size: '14',
				color: foregroundColor,
				bgcolor: backgroundColorGreen,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'offset_controls',
							options: {
								controlSel: 'matte_density',
								direction: 'Up',
								offset: '500',
							},
						},
					],
					up: [],
				},
			],
		};

		presets.matte_density_dec = {
			type: 'button',
			category: 'Rotary Controls',
			name: 'Matte Density -',
			style: {
				text: 'Matte\\nDensity\\n-',
				size: '14',
				color: foregroundColor,
				bgcolor: backgroundColorRed,
			},
			feedbacks: [],
			steps: [
				{
					down: [
						{
							actionId: 'offset_controls',
							options: {
								controlSel: 'matte_density',
								direction: 'Down',
								offset: '500',
							},
						},
					],
					up: [],
				},
			],
		};

		// Jump straight to a known value, and turn orange when Matte Density is maxed out.
		presets.matte_density_default = {
			type: 'button',
			category: 'Rotary Controls',
			name: 'Matte Density: Default',
			style: {
				text: 'Matte\\nDensity\\nDefault',
				size: '14',
				color: foregroundColor,
				bgcolor: foregroundColorBlack,
			},
			feedbacks: [
				{
					feedbackId: 'control_value_compare',
					options: {
						controlSel: 'matte_density',
						comparison: '>=',
						value: '9500',
					},
					style: {
						color: foregroundColorBlack,
						bgcolor: backgroundColorOrange,
					},
				},
			],
			steps: [
				{
					down: [
						{
							actionId: 'set_control',
							options: {
								controlSel: 'matte_density',
								controlValue: '5000',
							},
						},
					],
					up: [],
				},
			],
		};

		self.setPresetDefinitions(presets);
	}
}
