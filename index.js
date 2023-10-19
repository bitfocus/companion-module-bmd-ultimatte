const { InstanceBase, InstanceStatus, runEntrypoint } = require('@companion-module/base')
const UpgradeScripts = require('./src/upgrades')

const config = require('./src/config')
const actions = require('./src/actions')
const feedbacks = require('./src/feedbacks')
const variables = require('./src/variables')
const presets = require('./src/presets')

const constants = require('./src/constants')
const utils = require('./src/utils')

class ultimatteInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			...config,
			...actions,
			...feedbacks,
			...variables,
			...presets,
			...constants,
			...utils
		})

		this.stash = [];
		this.command = null;

		this.data = {};
	}

	async destroy() {
		if (self.socket !== undefined) {
			self.socket.destroy();
		}
	}

	async init(config) {
		this.configUpdated(config)
	}

	async configUpdated(config) {
		this.config = config

		this.updateStatus(InstanceStatus.Connecting);
		
		this.initActions()
		this.initFeedbacks()
		this.initVariables()
		this.checkVariables();
		this.initPresets()

		this.initTCP();
	}
}

runEntrypoint(ultimatteInstance, UpgradeScripts)