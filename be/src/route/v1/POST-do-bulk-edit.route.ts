import {Registry} from "../../registry";
import {Router, Request, Response, NextFunction} from "express";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {PoolConnection} from "mariadb";
import {param} from 'express-validator';
import {ItemValueAndAttribute, ItemValueOperatorAndAttribute} from "../../model/item-attribute.model";
import {ItemValTypes, Value} from "../../model/item.model";
import {Attribute} from "../../model/attribute.model";
import {OperatorType} from "../../model/operator.model";
import {BulkEditItem, BulkEditPackage} from "../../model/bulk-edit.model";
import {ItemMetadata2, ItemMetadataEntry2} from "../model/ss-attribute.model";
import {toItemValTypes} from "../../service/item-conversion.service";


const constructExp = (operator: OperatorType, value: Value, exp: string) => {
    switch (operator) { // construct operator
        case "empty":
            exp += ` = '' `;
            break;
        case "eq":
            exp += ` = `;
            constructValue(operator, value, exp);
            break;
        case "gt":
            exp += ` > `;
            constructValue(operator, value, exp);
            break;
        case "gte":
            exp += ` >= `;
            constructValue(operator, value, exp);
            break;
        case "lt":
            exp += ` < `;
            constructValue(operator, value, exp);
            break;
        case "lte":
            exp += ` <= `;
            constructValue(operator, value, exp);
            break;
        case "not empty":
            exp += ` <> '' `;
            break;
        case "not eq":
            exp += ` <> `;
            constructValue(operator, value, exp);
            break;
        case "not gt":
            exp += `not >`
            break;
        case "not gte":
            break;
        case "not lt":
            break;
        case "not lte":
            break;
    }
}

const constructValue = (operator: OperatorType, value: Value, exp: string) => {

    switch (value.val.type) { // construct value
        case "area":
            break;
        case "currency":
            break;
        case "date":
            break;
        case "dimension":
            break;
        case "doubleselect":
            break;
        case "height":
            break;
        case "length":
            break;
        case "number":
            break;
        case "select":
            break;
        case "string":
            break;
        case "text":
            break;
        case "volume":
            break;
        case "width":
            break;
    }
}

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

      const viewId: number = Number(req.params.viewId);

      await doInDbConnection(async (conn: PoolConnection) => {

        const changeClauses: ItemValueAndAttribute[] = req.body.changeClauses;
        const whenClauses: ItemValueOperatorAndAttribute[] = req.body.whereClauses;

        let exp = '';
        for (const itemValueOperatorAndAttribute of whenClauses) {
           const value: Value = itemValueOperatorAndAttribute.itemValue;
           const attribute: Attribute = itemValueOperatorAndAttribute.attribute;
           const operator: OperatorType = itemValueOperatorAndAttribute.operator;

           exp += `A.ID = '${attribute.id}' `;
           exp += `AND IE.VALUE `;
           constructExp(operator, value, exp);
        }

        const q: QueryA = await conn.query(`
           SELECT 
            I.ID AS I_ID,
            I.PARENT_ID AS I_PARENT_ID,
            I.VIEW_ID AS I_VIEW_ID,
            I.NAME AS I_NAME,
            I.DESCRIPTION AS I_DESCRIPTION,
            I.STATUS AS I_STATUS,
            
            V.ID AS V_ID,
            V.ITEM_ID AS V_ITEM_ID,
            V.ITEM_ATTRIBUTE_ID AS V_ITEM_ATTRIBUTE_ID,
            
            A.ID AS A_ID,
            A.VIEW_ID AS A_VIEW_ID,
            A.TYPE AS A_TYPE,
            A.NAME AS A_NAME,
            A.STATUS AS A_STATUS,
            A.DESCRIPTION AS A_DESCRIPTION,
            
            IM.ID AS IM_ID,
            IM.ITEM_VALUE_ID AS IM_ITEM_VALUE_ID,
            IM.NAME AS IM_NAME,
            
            IE.ID AS IE_ID,
            IE.ITEM_VALUE_METADATA_ID AS IE_ITEM_VALUE_METADATA_ID,
            IE.KEY AS IE_KEY,
            IE.VALUE AS IE_VALUE,
            IE.DATA_TYPE AS IE_DATA_TYPE
           
           FROM TBL_ITEM AS I
           LEFT JOIN TBL_ITEM_VALUE AS V ON V.ITEM_ID = I.ID
           LEFT JOIN TBL_ITEM_ATTRIBUTE AS A ON A.ID = V.ITEM_ATTRIBUTE_ID
           LEFT JOIN TBL_ITEM_VALUE_METADATA AS IM ON IM.ITEM_VALUE_ID = V.ID
           LEFT JOIN TBL_ITEM_VALUE_METADATA_ENTRY AS IE ON IE.ITEM_VALUE_METADATA_ID = IM.ID
           LEFT JOIN TBL_ITEM_ATTRIBUTE_METADATA AS AM ON AM.ITEM_ATTRIBUTE_ID = A.ID
           LEFT JOIN TBL_ITEM_ATTRIBUTE_METADATA_ENTRY AS AE ON AE.ITEM_ATTRIBUTE_METADATA_ID = AM.ID
           WHERE 
        `);


        const itemAttValueMetaMap: Map<string /* itemId_attributeId */, ItemMetadata2[]> = new Map();
        const itemAttValueMetaEntryMap: Map<string /* itemId_attributeId_metaId*/, ItemMetadataEntry2> = new Map();


        const itemAttValueMap: Map<string /* itemId_attributeId */, Value> = new Map();


        const iMap: Map<string /* */, BulkEditItem> = new Map();


        q.reduce((acc: BulkEditItem[], i: QueryI) => {

            const itemId: number = i.I_ID;
            const attributeId: number = i.A_ID;

            const itemAttValueKey: string = `${itemId}_${attributeId}`;

            if (!itemAttValueMap.has(itemAttValueKey)) {
                const m = {
                    // todo;

                } as ItemMetadata2;

                const val: ItemValTypes = toItemValTypes(m);
                const value: Value = {
                    attributeId,
                    val
                } as Value;
                itemAttValueMap.set(itemAttValueKey, value);
            }


            for (const whenClause of whenClauses) {
                const value: Value = whenClause.itemValue;
                const attribute: Attribute = whenClause.attribute;
                const operator: OperatorType = whenClause.operator;


                const iMapKey: string = `${itemId}`;


                if (attributeId == attribute.id &&

                ) {

                }

                if (!iMap.has(iMapKey)) {

                    const bulkEditItem: BulkEditItem = {
                        id: number;
                        name: string;
                        description: string;
                        images: string[];
                        parentId: number;
                        changes: {
                            [attributeId: number]: {
                                old: Value,
                                    new: Value
                            };
                        };
                        whens: {
                            [attributeId: number]: Value;
                        };

                        children: BulkEditItem[];
                    } as BulkEditItem;

                }



            }



            return acc;
        }, []);


        const r = {
           changeAttributes: [],
           whenAttributes: [],
           bulkEditItems: []
        } as BulkEditPackage
      });
   }
]

const filterFn = (changeClauses: ItemValueAndAttribute[], whenClauses: ItemValueOperatorAndAttribute[]) => (i: QueryI): boolean => {

    for (const whenClause of whenClauses) {
        const value: Value = whenClause.itemValue;
        const attribute: Attribute = whenClause.attribute;
        const operator: OperatorType = whenClause.operator;

        i.

    }
        return true;
}

const reg = (router: Router, registry: Registry) => {
   const p = `/view/:viewId/bulk-edit`;
   registry.addItem('POST', p);
   router.post(p, ...httpAction);
}

export default reg;
