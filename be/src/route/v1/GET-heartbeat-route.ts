import {Router, Request, Response, NextFunction} from "express";
require('express-async-errors');
import {Registry} from "../../registry";
import {validateMiddlewareFn} from "./common-middleware";
import {ApiResponse} from "../../model/api-response.model";
import moment from 'moment';

// CHECKED

/**
 * Tells if application is alive and responsive
 */
const httpAction: any[] = [
    [],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const date = moment().format(`DD-MM-YYYY hh:mm:ss a`);
        res.status(200).json({
           status: 'SUCCESS',
           message: `${date}`
        } as ApiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
   const p = `/heartbeat`;
   registry.addItem('GET', p);
   router.get(p, ...httpAction);
};

export default reg;
