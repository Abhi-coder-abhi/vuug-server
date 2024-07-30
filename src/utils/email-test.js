const { validate } = require('deep-email-validator');

const validateEmail = async (email) => {
    try {
        email.trim().toLowerCase();
        const result = await validate({
            email,
            validateRegex: true,
            validateMx: true,
            validateTypo: true,
            validateDisposable: true,
            validateSMTP: true,
            additionalTopLevelDomains: ["com", "com.au", "com.tw", "ca", "co.nz", "co.uk", "de", "fr", "it", "ru", "net", "org", "edu", "gov", "jp", "nl", "kr", "se", "eu", "ie", "co.il", "us", "at", "be", "dk", "hk", "es", "gr", "ch", "no", "cz", "in", "net", "net.au", "info", "biz", "mil", "co.jp", "sg", "hu", "uk", "co.id", "co.in", "yahoo.co.in", "yahoo.com"]
        })
        if (!result.validators.regex.valid) {
            return { success: false, message: "Invalid email format" };
        }
        if (!result.validators.smtp.valid && result.validators?.smtp?.reason === "Mailbox not found.") {
            return { success: false, message: "Invalid email", reason: result.reason }
        }
        else if (!result.validators.mx.valid && !result.validators.smtp.valid) {
            return { success: false, message: "Invalid email", reason: result.reason }
        }
        else {
            return { success: true }
        }
    } catch (error) {
        return { success: false, message: "error while validating mail", error }
    }
}

export default validateEmail;