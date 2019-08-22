var crypto = require('crypto');

function generateRandomToken(length) 
{
    return crypto.randomBytes(length).toString('hex');
}

function generateNumericCode(length)
{
    if (length > 9)
        throw Error('length exceed limit of 10');

    var number = Math.floor(crypto.randomBytes(4).readUInt32BE() / 0xffffffff * Math.pow(10, length));

    return formatNumberString(number, length);
}

function formatNumberString(num, length) {
    var str = "" + num

    while(str.length < length) {
        str = "0" + str;
    }

    return str;
}

module.exports = {
    generateRandomToken,
    generateNumericCode
}