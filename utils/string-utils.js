module.exports = {
	assignMessageVars(message, receiverVars) {
		const keys = Object.keys(receiverVars);
		return keys.reduce((m, k) => {
			const r = new RegExp(`##${k}##`, 'g');
			return m.replace(r, receiverVars[k]);
		}, message);
	},
	validadeEmail(email) {
		return typeof email === 'string' && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
	}
}