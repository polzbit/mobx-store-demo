var aes256 = require("aes256");

// secret key used for encrypting and decrypting
var secret_key = "uI2ooxtwHeIqwrbyj98fx9SWVGbpQohO";

export const to_Encrypt = (text) => {
    // returns the encrypted text
    var encrypted = aes256.encrypt(secret_key, text);
    return encrypted;
};

export const to_Decrypt = (cipher) => {
    // decryped message is returned
    var decrypted = aes256.decrypt(secret_key, cipher);
    return decrypted;
};