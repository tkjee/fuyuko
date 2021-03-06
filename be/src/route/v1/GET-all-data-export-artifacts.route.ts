import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {DataExportArtifact} from "../../model/data-export.model";
import {View} from "../../model/view.model";
import {ApiResponse} from "../../model/api-response.model";
import {getAllExportArtifacts} from "../../service/export-artifact.service";

// CHECKED
const httpAction: any[] = [
    [
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const dataExportArtifact: DataExportArtifact[] = await getAllExportArtifacts();
        res.status(200).json({
            status: 'SUCCESS',
            message: `Data export artifact retrieved successfully`,
            payload: dataExportArtifact
        } as ApiResponse<DataExportArtifact[]>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/data-export-artifacts`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);

};

export default reg;