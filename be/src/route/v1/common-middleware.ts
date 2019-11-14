import {NextFunction, Request, Response} from "express";
import {validationResult, ValidationError} from 'express-validator';
import {e, i} from "../../logger";
import {makeApiError, makeApiErrorObj} from "../../util";
import {verifyJwtToken } from "../../service";
import {JwtPayload} from "../../model/jwt.model";
import {hasUserRole} from "../../service/user.service";


export const validateUserRoleMiddlewareFn = (roleName: string) => {
    return (async (req: Request, res: Response, next: NextFunction) => {
        const jwtPayload: JwtPayload = getJwtPayload(res);
        const userId: number = jwtPayload.user.id;
        const hasRole: boolean = await hasUserRole(userId, roleName);
        if (!hasRole) {
            res.status(403).json(
                makeApiErrorObj(
                    makeApiError(`Unauthorized: Require role ${roleName} to perform ${req.method} ${req.url}`,
                        'roleName', roleName, 'Security')
                )
            );
            return;
        }
        next();
    });
}

export const getJwtPayload = (res: Response): JwtPayload => {
   return res.locals.jwtPayload;
}

export const timingLogMiddlewareFn = (req: Request, res: Response, next: NextFunction) => {
    const startTime = process.hrtime();
    const httpMethod = req.method;
    const url = req.url;

    res.on('finish', () => {
        const elapsedTime = process.hrtime(startTime);
        const diffInMilliSecs = ((elapsedTime[0] * 1000) + (elapsedTime[1] * 1e-6));

        const s = res.statusCode;
        i(`Profiling Request ${httpMethod}-${url} Response ${s} : ${diffInMilliSecs}ms`);
    });
    next();
}

export const httpLogMiddlewareFn = (req: Request, res: Response, next: NextFunction) => {
    const httpMethod = req.method;
    const url = req.url;
    i(`Incoming HTTP request: ${httpMethod} - ${url}`);
    next();
};

export const validateMiddlewareFn = (req: Request, res: Response, next: NextFunction) => {
    const errors  = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
    } else {
        next();
    }
};

type JwtErrorType = {
    name: string;
    message: string;
    expireDate: number;
}


export const validateJwtMiddlewareFn = (req: Request, res: Response, next: NextFunction) => {
    const jwtToken: string = req.headers['x-auth-jwt'] as string;
    if (!jwtToken) {
        res.status(401).json(makeApiErrorObj(
            makeApiError(`Missing jwt token`, 'jwt', '', 'Security')
        ));
        return;
    }
    try {
        const jwtPayload: JwtPayload = verifyJwtToken(jwtToken);
        res.locals.jwtPayload = jwtPayload;
        next();
    } catch(err ) {
        const jwtError: JwtErrorType = err;
        res.status(401).json(makeApiErrorObj(
            makeApiError(`${jwtError.name} ${jwtError.message}`, 'jwtToken', '', 'Security')
        ));
    }
};

export const catchErrorMiddlewareFn = async (err: any, req: Request, res: Response, next: NextFunction) => {
       e('Unexpected Error', err);
       if (res.headersSent) {
           return next(err);
       }
       res.status(500).json(
           makeApiErrorObj(
               makeApiError(`Unexpected Error: ${err.toString()}`, '', '', 'error')
           )
       );
};
