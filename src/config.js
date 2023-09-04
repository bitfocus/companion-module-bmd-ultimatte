const { Regex } = require('@companion-module/base')

module.exports = {
	getConfigFields() {
		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This module controls the BMD Ultimatte'
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'IP',
				width: 4,
				regex: Regex.IP
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Port',
				width: 4,
				regex: Regex.PORT,
				default: 9998
			}
		]
	},
}
