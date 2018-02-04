const fs = require('fs');

module.exports = {
	appendToFileWithPromise(filePath, data) {
		return new Promise((resolve, reject) => {
			fs.appendFile(filePath, data, (err) => {
				if (err) {
					return reject(err);
				}
				return resolve();
			});
		});
	},
	readFileWithPromise(path, encoding) {
		return new Promise((resolve, reject) => {
			fs.readFile(path, (err, data) => {
				if (err) {
					return reject(err);
				}
				return resolve(data);
			});
		});
	},
	async removeFileWithPromise(path) {
		return new Promise((resolve, reject) => {
			fs.unlink(path, (err) => {
				if (err) {
					return reject(err);
				}
				return resolve();
			});
		});
	},
	writeFileWithPromise(path, data) {
		return new Promise((resolve, reject) => {
			fs.writeFile(path, data, (err) => {
				if (err) {
					return reject(err);
				}
				return resolve();
			});
		});
	}
};