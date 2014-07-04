
module.exports = {
	tokens: {
		UuNiX4zHhFhN: {
			plan: 'super',
			created: new Date(2014, 7, 4),
			expires: new Date(2100, 7, 4)
		},

		// seenta
		jQJ8Tf9vF35q: {
			plan: 'default',
			created: new Date(2014, 7, 4),
			expires: new Date(2015, 7, 4)
		}
	},
	plans: {
		super: {
			period: 'second',
			requests: 10
		},
		default: {
			period: 'second',
			requests: 3
//			allowedTools: ['less']
		}
	},
	defaultPlan: 'default'
};