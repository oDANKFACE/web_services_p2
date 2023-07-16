const validator = require('../helpers/validate');

const clientValidate = (req, res, next) => {
    const validationRule = {
        firstName: 'required|string',
        lastName: 'required|string',
        email: 'required|email',
        birthday: 'string',
        diagnosisDate: 'string',
        highLimit: 'required|string',
        lowLimit: 'required|string'
    };
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412).send({
                success: false,
                message: 'Validation failed',
                data: err
            });
        } else {
            next();
        }
    });
};

const readingValidate = (req, res, next) => {
    const validationRule = {
        bg: 'required|string',
        readingTime: 'required|string',
        clientId: 'required|string'
    };
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412).send({
                success: false,
                message: 'Validation failed',
                data: err
            });
        } else {
            next();
        }
    });
};


module.exports = {
    clientValidate,
    readingValidate
};
