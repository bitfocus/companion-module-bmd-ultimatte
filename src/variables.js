module.exports = {
	initVariables: function () {
		let self = this;
		let variables = [];

		self.setVariableDefinitions(variables);
	},

	checkVariables: function () {
		let self = this;

		try {
			let variableObj = {};

			self.setVariableValues(variableObj);
		}
		catch(error) {
			self.log('error', 'Error parsing Variables: ' + String(error));
		}
	}
}
