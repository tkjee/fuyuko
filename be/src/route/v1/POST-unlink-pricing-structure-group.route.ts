import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_EDIT} from "../../model/role.model";
import { param } from "express-validator";
import {
    unlinkPricingStructureWithGroupId
} from "../../service/pricing-structure.service";
import {ApiResponse} from "../../model/api-response.model";


const httpAction: any[] = [
    [
        param('pricingStructureId').exists().isNumeric(),
        param('groupId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const pricingStructureId: number = Number(req.params.pricingStructureId);
        const groupId: number = Number(req.params.groupId);
        const errors: string[] = await unlinkPricingStructureWithGroupId(pricingStructureId, groupId);
        if (errors && errors.length) {
            res.status(400).json({
                status: 'ERROR',
                message: errors.join(', ')
            } as ApiResponse);
        } else {
            res.status(200).json({
                status: 'SUCCESS',
                message: `pricing structure ${pricingStructureId} and group ${groupId} unlinked successfully`
            } as ApiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/pricing-structure/:pricingStructureId/group/:groupId/unlink`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;