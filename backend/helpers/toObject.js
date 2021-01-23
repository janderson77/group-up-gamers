const toObject = (arr, key) => arr.reduce((a, b) => ({ ...a, [b[key]]: b }), {})

module.exports = toObject;