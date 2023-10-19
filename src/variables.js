const { controls_rotary } = require("./constants");

function convertRange(value, oldRange, newRange) {
    return ((value - oldRange.min) * (newRange.max - newRange.min)) / (oldRange.max - oldRange.min) + newRange.min;
}

module.exports = {
	initVariables: function () {
		let self = this;
		let variables = [];

		for (let i = 0; i < controls_rotary.length; i++) {
			variables.push({
				variableId: controls_rotary[i].id,
				name: controls_rotary[i].label
			});
		}

		console.log(variables)

		self.setVariableDefinitions(variables);
	},

	checkVariables: function () {
		let self = this;

		try {
			let variableObj = {};

			for (let i = 0; i < controls_rotary.length; i++) {
				let control = controls_rotary[i];
				let controlId = control.id;
				let variableValue = self.data[controlId];

				if (variableValue !== undefined) {
					variableObj[controlId] = variableValue;

					if (control.minPercent !==undefined && control.maxPercent !== undefined) {
						let variableValuePercent = convertRange(variableValue, {min: control.min, max: control.max}, {min: control.minPercent, max: control.maxPercent});
						variableObj[controlId] = variableValuePercent + '%';
					}
				}
				else {
					variableObj[controlId] = '';
				}
			}

			self.setVariableValues(variableObj);
		}
		catch(error) {
			self.log('error', 'Error parsing Variables: ' + String(error));
		}
	}
}
