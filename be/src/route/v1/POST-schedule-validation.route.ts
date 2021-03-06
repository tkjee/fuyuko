import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_EDIT} from "../../model/role.model";
import { param, body } from "express-validator";
import {scheduleValidation} from "../../service/run-validation.service";
import {ScheduleValidationResponse} from "../../model/api-response.model";


// CHECKED

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('name').exists(),
        body('description'),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId = Number(req.params.viewId);
        const name = req.body.name;
        const description = req.body.description;

        const r: {validationId: number, errors: string[]} = await scheduleValidation(viewId, name, description);

        if (r.errors && r.errors.length) {
            res.status(400).json({
                status: 'ERROR',
                message: r.errors.join(', '),
                payload: {
                    validationId: r.validationId
                }
            } as ScheduleValidationResponse);

        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `Validation with id ${r.validationId} scheduled`,
                payload: {
                    validationId: r.validationId
                }
            } as ScheduleValidationResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/validation`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
