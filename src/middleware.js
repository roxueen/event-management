exports.authenticate = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.status(401).send('Unauthorized');
};

exports.authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!req.session?.user?.role) {
            return res.status(500).send('User role missing in session.');
        }

        if (roles.length && !roles.includes(req.session.user.role)) {
            return res.status(403).send('Access denied.');
        }

        next();
    };
};
