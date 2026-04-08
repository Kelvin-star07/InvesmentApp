import { validationResult } from "express-validator";

/**
 * Handles validation errors and redirects to a specified route
 * @param {*} redirecTO 
 * @returns 
 */

export function handleValidationErrors(redirecTO = null) {
    return (req, res, next) => { 
        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            const url = typeof redirecTO === "function"
                ? redirecTO(req)
                : (redirecTO || req.originalUrl);

            req.flash("errors", errors.array().map(err => err.msg));
            return res.redirect(url);
        }

        return next();
    }
}