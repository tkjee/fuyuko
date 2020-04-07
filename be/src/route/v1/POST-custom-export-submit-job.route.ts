import {Registry} from "../../registry";
import {NextFunction, Request, Response, Router} from "express";
import {body, param} from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_EDIT} from "../../model/role.model";
import {
    ExportScriptInputValue,
    ExportScriptJobSubmissionResult,
    ExportScriptPreview
} from "../../model/custom-export.model";
import {runCustomExportJob} from "../../custom-export/custom-export-executor";


const httpAction: any[] = [
    [
        param('customExportId').exists().isNumeric(),
        param('viewId').exists().isNumeric(),
        body('values').isArray(),
        body('preview'),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const customExportId: number = Number(req.params.customExportId);
        const viewId: number = Number(req.params.viewId);
        const values: ExportScriptInputValue[] = req.body.values;
        const preview: ExportScriptPreview = req.body.preview;

        const r: ExportScriptJobSubmissionResult = await runCustomExportJob(viewId, customExportId, values, preview);
        res.status(200).json(r);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/custom-export/:customExportId/submit-job`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;