const removeHttpHeader = (req, res, next) => {
    res.removeHeader('X-Powered-By'); // Removes the 'X-Powered-By' header
    next();
}

module.exports = removeHttpHeader;