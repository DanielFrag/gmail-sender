const fileUtils = require('../utils/file-utils');
const {resolve} = require('path');

class LoggerHelper {
	constructor(userName) {
		this.logFileName = `${userName}#${new Date().toISOString()}.txt`;
		this.fqn = resolve(__dirname, `../files/${this.logFileName}`);
    }
    
    async createLogFile() {
        return fileUtils.writeFileWithPromise(this.fqn, 'Log:\n');
    }

	getLogFileName() {
		return this.logFileName;
	}

    async logDebug(message) {
        return fileUtils.appendToFileWithPromise(this.fqn, `${new Date().toISOString()} [DEBUG] ${message}\n`);
    }

    async logError(message) {
        return fileUtils.appendToFileWithPromise(this.fqn, `${new Date().toISOString()} [ERROR] ${message}\n`);
    }

    async logFatal(message) {
        return fileUtils.appendToFileWithPromise(this.fqn, `${new Date().toISOString()} [FATAL] ${message}\n`);
    }

    async logInfo(message) {
        return fileUtils.appendToFileWithPromise(this.fqn, `${new Date().toISOString()} [INFO] ${message}\n`);
    }

    async logTrace(message) {
        return fileUtils.appendToFileWithPromise(this.fqn, `${new Date().toISOString()} [TRACE] ${message}\n`);
    }

    async logWarning(message) {
        return fileUtils.appendToFileWithPromise(this.fqn, `${new Date().toISOString()} [WARNING] ${message}\n`);
	}
	
	async resetLogger() {
		return fileUtils.removeFileWithPromise(this.fqn);
	}
}

module.exports = LoggerHelper;