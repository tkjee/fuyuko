import {Registry} from "../../registry";
import {Router, Request, Response, NextFunction} from "express";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {param, body} from 'express-validator';
import {ItemValueAndAttribute, ItemValueOperatorAndAttribute} from "../../model/item-attribute.model";
import moment from 'moment';
import {
    AreaValue,
    CurrencyValue, DateValue, DimensionValue, DoubleSelectValue, HeightValue, ItemImage, ItemValTypes,
    LengthValue,
    NumberValue, SelectValue,
    StringValue,
    TextValue,
    Value, VolumeValue, WidthValue
} from "../../model/item.model";
import {Attribute, DEFAULT_DATE_FORMAT} from "../../model/attribute.model";
import {OperatorType} from "../../model/operator.model";
import {BulkEditItem, BulkEditPackage} from "../../model/bulk-edit.model";
import {
    Attribute2,
    AttributeMetadata2,
    AttributeMetadataEntry2,
    ItemMetadata2,
    ItemMetadataEntry2, ItemValue2
} from "../model/server-side.model";
import {
    AreaUnits,
    CountryCurrencyUnits,
    DimensionUnits,
    HeightUnits,
    LengthUnits,
    VolumeUnits,
    WidthUnits
} from "../../model/unit.model";
import {_convert as _attributeConvert, convert as attributeConvert} from "../../service/conversion-attribute.service";
import {convert as itemValueConvert} from '../../service/conversion-item-value.service';
import {ROLE_EDIT} from "../../model/role.model";
import {
    compareArea, compareCurrency,
    compareDate, compareDimension, compareDoubleselect, compareHeight, compareLength,
    compareNumber, compareSelect,
    compareString, compareVolume, compareWidth,
} from "../../service/compare-attribute-values.service";
import {ApiResponse} from "../../model/api-response.model";


// CHECKED


const SQL: string = `
           SELECT 
            I.ID AS I_ID,
            I.PARENT_ID AS I_PARENT_ID,
            I.VIEW_ID AS I_VIEW_ID,
            I.NAME AS I_NAME,
            I.DESCRIPTION AS I_DESCRIPTION,
            I.STATUS AS I_STATUS,
            
            V.ID AS V_ID,
            V.ITEM_ID AS V_ITEM_ID,
            V.VIEW_ATTRIBUTE_ID AS V_VIEW_ATTRIBUTE_ID,
            
            A.ID AS A_ID,
            A.VIEW_ID AS A_VIEW_ID,
            A.TYPE AS A_TYPE,
            A.NAME AS A_NAME,
            A.STATUS AS A_STATUS,
            A.DESCRIPTION AS A_DESCRIPTION,
            A.CREATION_DATE AS A_CREATION_DATE,
            A.LAST_UPDATE AS A_LAST_UPDATE,
            
            AM.ID AS AM_ID,
            AM.VIEW_ATTRIBUTE_ID AS AM_VIEW_ATTRIBUTE_ID,
            AM.NAME AS AM_NAME,
            
            AME.ID AS AME_ID,
            AME.VIEW_ATTRIBUTE_METADATA_ID AS AME_VIEW_ATTRIBUTE_METADATA_ID,
            AME.KEY AS AME_KEY,
            AME.VALUE AS AME_VALUE,
            
            IM.ID AS IM_ID,
            IM.ITEM_VALUE_ID AS IM_ITEM_VALUE_ID,
            IM.NAME AS IM_NAME,
            
            IE.ID AS IE_ID,
            IE.ITEM_VALUE_METADATA_ID AS IE_ITEM_VALUE_METADATA_ID,
            IE.KEY AS IE_KEY,
            IE.VALUE AS IE_VALUE,
            IE.DATA_TYPE AS IE_DATA_TYPE,
            
            IMG.ID AS IMG_ID,
            IMG.ITEM_ID AS IMG_ITEM_ID,
            IMG.PRIMARY AS IMG_PRIMARY,
            IMG.MIME_TYPE AS IMG_MIME_TYPE,
            IMG.NAME AS IMG_NAME,
            IMG.SIZE AS IMG_SIZE
           
           FROM TBL_ITEM AS I
           LEFT JOIN TBL_ITEM_VALUE AS V ON V.ITEM_ID = I.ID
           LEFT JOIN TBL_VIEW_ATTRIBUTE AS A ON A.ID = V.VIEW_ATTRIBUTE_ID
           LEFT JOIN TBL_VIEW_ATTRIBUTE_METADATA AS AM ON AM.VIEW_ATTRIBUTE_ID = A.ID
           LEFT JOIN TBL_VIEW_ATTRIBUTE_METADATA_ENTRY AS AME ON AME.VIEW_ATTRIBUTE_METADATA_ID = AM.ID
           LEFT JOIN TBL_ITEM_VALUE_METADATA AS IM ON IM.ITEM_VALUE_ID = V.ID
           LEFT JOIN TBL_ITEM_VALUE_METADATA_ENTRY AS IE ON IE.ITEM_VALUE_METADATA_ID = IM.ID
           LEFT JOIN TBL_ITEM_IMAGE AS IMG ON IMG.ITEM_ID = I.ID
           WHERE I.STATUS = 'ENABLED' AND I.VIEW_ID=? 
`

const SQL_WITH_NULL_PARENT = `${SQL} AND I.PARENT_ID IS NULL`;
const SQL_WITH_PARAMETERIZED_PARENT = `${SQL} AND I.PARENT_ID = ? `;

interface BulkEditItem2 {
    id: number;  // itemId
    name: string;
    description: string;
    images: ItemImage[];
    parentId: number;
    metadatas: ItemMetadata2[]
    children: BulkEditItem2[]
}

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('changeClauses').exists().isArray(),
        body('whenClauses').exists().isArray(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

      const viewId: number = Number(req.params.viewId);

      const bulkEditPackage: BulkEditPackage = await doInDbConnection(async (conn: Connection) => {

        const changeClauses: ItemValueAndAttribute[] = req.body.changeClauses;
        const whenClauses: ItemValueOperatorAndAttribute[] = req.body.whenClauses;

        const {b: matchedBulkEditItem2s, m: attributeMap } = await doInDbConnection(async (conn: Connection) => {
            return await getBulkEditItem2s(conn, viewId, null, whenClauses);
        });

        const bulkEditItems: BulkEditItem[] = convertToBulkEditItems(matchedBulkEditItem2s, changeClauses,
            whenClauses.map((wc: ItemValueOperatorAndAttribute) => {
                return {
                   operator: wc.operator,
                   itemValue: wc.itemValue,
                   attribute: attributeMap.get(`${wc.attribute.id}`)
                } as ItemValueOperatorAndAttribute;
            }));
        const changeAttributes: Attribute[] = changeClauses.map((c: ItemValueAndAttribute) => attributeMap.get(`${c.attribute.id}`));
        const whenAttributes: Attribute[] = whenClauses.map((w: ItemValueOperatorAndAttribute) => attributeMap.get(`${w.attribute.id}`));
        const r = {
           changeAttributes,
           whenAttributes,
           bulkEditItems
        } as BulkEditPackage
        return r;
      });

      res.status(200).json({
          status: 'SUCCESS',
          message: `Bulk edit package ready`,
          payload: bulkEditPackage
      } as ApiResponse<BulkEditPackage>);
   }
]

const getBulkEditItem2s = async (conn: Connection,
                                 viewId: number,
                                 parentItemId: number,
                                 whenClauses: ItemValueOperatorAndAttribute[]):
    Promise<{b: BulkEditItem2[], m: Map<string /* attributeId */, Attribute>}> => {

        const q: QueryA = !!parentItemId ?
            await conn.query( SQL_WITH_PARAMETERIZED_PARENT, [viewId, parentItemId]) :
            await conn.query( SQL_WITH_NULL_PARENT, [viewId]);

        const iMap: Map<string /* itemId */, BulkEditItem2> = new Map();
        const itemAttValueMetaMap: Map<string /* itemId_attributeId_metaId */, ItemMetadata2> = new Map();
        const itemAttValueMetaEntryMap: Map<string /* itemId_attributeId_metaId_entryId */, ItemMetadataEntry2> = new Map();
        const itemImageMap: Map<string /* itemId_imageId */, ItemImage> = new Map();
        const attributeMap: Map<string /* attributeId*/, Attribute2> = new Map();
        const attributeMetadataMap: Map<string /* attributeId_metadataId */, AttributeMetadata2> = new Map();
        const attributeMetadataEntryMap: Map<string /* attributeId_metadataId_entryId */, AttributeMetadataEntry2> = new Map();

        const bulkEditItem2s: BulkEditItem2[] = [];
        for (const i of q) {

            const itemId: number = i.I_ID;
            const attributeId: number = i.A_ID;
            const attributeMetadataId: number = i.AM_ID;
            const attributeMetadataEntryId: number = i.AME_ID;
            const metaId: number = i.IM_ID;
            const entryId: number = i.IE_ID;
            const itemImageId: number = i.IMG_ID;

            const iMapKey: string = `${itemId}`;
            const itemAttValueMetaMapKey: string = `${itemId}_${attributeId}_${metaId}`;
            const itemAttValueMetaEntryMapKey: string = `${itemId}_${attributeId}_${metaId}_${entryId}`;
            const itemImageMapKey: string = `${itemId}_${itemImageId}`;
            const attributeMapKey: string = `${attributeId}`;
            const attributeMetadataMapKey: string = `${attributeId}_${attributeMetadataId}`;
            const attributeMetadataEntryMapKey: string = `${attributeId}_${attributeMetadataId}_${attributeMetadataEntryId}`;


            if (!iMap.has(iMapKey)) {
                const item: BulkEditItem2 = {
                    id: i.I_ID,
                    name: i.I_NAME,
                    description: i.I_DESCRIPTION,
                    parentId: i.I_PARENTID,
                    metadatas: [],
                    images: [],
                    children: []
                } as BulkEditItem2;
                iMap.set(iMapKey, item);
                bulkEditItem2s.push(item);

                const { b /* BulkEditItem2[] */, } = await getBulkEditItem2s(conn, viewId, itemId, whenClauses);
                item.children = b;
            }

            if (!itemImageMap.has(itemImageMapKey)) {
                const itemImage = {
                    id: i.IMG_ID,
                    name: i.IMG_NAME,
                    primary: i.IMG_PRIMARY,
                    mimeType: i.IMG_MIME_TYPE,
                    size: i.IMG_SIZE
                } as ItemImage;
                itemImageMap.set(itemImageMapKey, itemImage);
                iMap.get(iMapKey).images.push(itemImage);
            }

            if (!itemAttValueMetaMap.has(itemAttValueMetaMapKey)) {
                const meta: ItemMetadata2 = {
                    id: i.IM_ID,
                    name: i.IM_NAME,
                    attributeId: i.A_ID,
                    attributeType: i.A_TYPE,
                    entries: []
                } as ItemMetadata2;
                itemAttValueMetaMap.set(itemAttValueMetaMapKey, meta);
                iMap.get(iMapKey).metadatas.push(meta);
            }

            if (!itemAttValueMetaEntryMap.has(itemAttValueMetaEntryMapKey)) {
                const entry: ItemMetadataEntry2 = {
                    id: i.IE_ID,
                    key: i.IE_KEY,
                    value: i.IE_VALUE,
                    dataType: i.IE_DATA_TYPE
                } as ItemMetadataEntry2;
                itemAttValueMetaEntryMap.set(itemAttValueMetaEntryMapKey, entry);
                itemAttValueMetaMap.get(itemAttValueMetaMapKey).entries.push(entry);
            }

            if (!attributeMap.has(attributeMapKey)) {
                const a = {
                    id: i.A_ID,
                    name: i.A_NAME,
                    description: i.A_DESCRIPTION,
                    type: i.A_TYPE,
                    creationDate: i.A_CREATION_DATE,
                    lastUpdate: i.A_LAST_UPDATE,
                    metadatas: []
                } as Attribute2;
                attributeMap.set(attributeMapKey, a);
            }

            if (!attributeMetadataMap.has(attributeMetadataMapKey)) {
                const m = {
                    id: i.AM_ID,
                    name: i.AM_NAME,
                    entries: []
                } as AttributeMetadata2;
                attributeMetadataMap.set(attributeMetadataMapKey, m);
                attributeMap.get(attributeMapKey).metadatas.push(m);
            }

            if (!attributeMetadataEntryMap.has(attributeMetadataEntryMapKey)) {
                const e = {
                   id: i.AME_ID,
                   key: i.AME_KEY,
                   value: i.AME_VALUE
                } as AttributeMetadataEntry2;
                attributeMetadataEntryMap.set(attributeMetadataEntryMapKey, e);
                attributeMetadataMap.get(attributeMetadataMapKey).entries.push(e);
            }
        };

        const attMap: Map<string /* attributeId */, Attribute> =
            ([...attributeMap.values()]).reduce((m: Map<string /* attributeId */, Attribute>, i: Attribute2) => {
                m.set(`${i.id}`, _attributeConvert(i));
                return m;
            }, new Map()
        );


        const matchedBulkEditItem2s: BulkEditItem2[] = bulkEditItem2s.filter((b: BulkEditItem2) => {
            let r: boolean = false;
            for (const itemValueOperatorAndAttribute of whenClauses) {
                const value: Value = itemValueOperatorAndAttribute.itemValue;
                const attribute: Attribute = itemValueOperatorAndAttribute.attribute;
                const operator: OperatorType = itemValueOperatorAndAttribute.operator;

                const metas: ItemMetadata2[] = b.metadatas.filter((m: ItemMetadata2) =>  {
                    if (m.attributeId === attribute.id) {
                        switch(attribute.type) {
                            case "string": {
                                const eType: ItemMetadataEntry2 = findEntry(m.entries, 'type');
                                const eValue: ItemMetadataEntry2 = findEntry(m.entries, 'value');

                                const v1: string = (value ? (value.val as StringValue).value : null); // from rest API
                                const v2: string = eValue.value; // actual item attribute value

                                return compareString(v1, v2, operator);
                            }
                            case "text": {
                                const eValue: ItemMetadataEntry2 = findEntry(m.entries, 'value');

                                const v1: string = (value ? (value.val as TextValue).value : null); // from rest api
                                const v2: string = eValue.value; // from actual item attribute value

                                return compareString(v1, v2, operator);
                            }
                            case "number": {
                                const eValue: ItemMetadataEntry2 = findEntry(m.entries, 'value');

                                const v1: number = (value ? (value.val as NumberValue).value : null);
                                const v2: number = Number(eValue.value);

                                return compareNumber(v1, v2, operator);
                            }
                            case "area": {
                                const eValue: ItemMetadataEntry2 = findEntry(m.entries, "value");
                                const eUnit: ItemMetadataEntry2 = findEntry(m.entries, "unit");

                                const v1: number = (value ? (value.val as AreaValue).value : null);
                                const u1: AreaUnits = (value ? (value.val as AreaValue).unit : null);

                                const v2: number = Number((eValue.value));
                                const u2: AreaUnits = (eUnit.value) as AreaUnits;

                                return compareArea(v1, u1, v2, u2, operator);
                            }
                            case "currency": {
                                const eValue: ItemMetadataEntry2 = findEntry(m.entries, 'value');
                                const eUnit: ItemMetadataEntry2 = findEntry(m.entries, "country");

                                const v1: number = (value ? (value.val as CurrencyValue).value : null);
                                const u1: CountryCurrencyUnits = (value ? (value.val as CurrencyValue).country : null);

                                const v2: number = Number(eValue.value);
                                const u2: CountryCurrencyUnits = (eUnit.value) as CountryCurrencyUnits;

                                return compareCurrency(v1, u1, v2, u2, operator);
                            }
                            case "date": {
                                const eValue: ItemMetadataEntry2 = findEntry(m.entries, 'value');
                                const format = attribute.format ? attribute.format : DEFAULT_DATE_FORMAT;

                                const v1: moment.Moment = (value ? moment((value.val as DateValue).value, format) : null);
                                const v2: moment.Moment = (eValue.value ? moment(eValue.value, format) : undefined);

                                return compareDate(v1, v2, operator);
                            }
                            case "dimension": {
                                const eH: ItemMetadataEntry2 = findEntry(m.entries, 'height');
                                const eW: ItemMetadataEntry2 = findEntry(m.entries, 'width');
                                const eL: ItemMetadataEntry2 = findEntry(m.entries, 'length');
                                const eU: ItemMetadataEntry2 = findEntry(m.entries, 'unit');

                                const h1: number = (value ? ((value.val) as DimensionValue).height: null);
                                const w1: number = (value ? ((value.val) as DimensionValue).width : null);
                                const l1: number = (value ? ((value.val) as DimensionValue).length : null);
                                const u1: DimensionUnits = (value ? ((value.val) as DimensionValue).unit : null);

                                const h2: number = Number(eH.value);
                                const w2: number = Number(eW.value);
                                const l2: number = Number(eL.value);
                                const u2: DimensionUnits = (eU.value) as DimensionUnits;

                                return compareDimension(l1, w1, h1, u1, l2, w2, h2, u2, operator);
                            }
                            case "height": {
                                const eV: ItemMetadataEntry2 = findEntry(m.entries, 'value');
                                const eU: ItemMetadataEntry2 = findEntry(m.entries, 'unit');

                                const v1: number = (value ? (value.val as HeightValue).value : null);
                                const u1: HeightUnits = (value ? (value.val as HeightValue).unit : null);

                                const v2: number = Number(eV.value);
                                const u2: HeightUnits = eU.value as HeightUnits;

                                return compareHeight(v1, u1, v2, u2, operator);
                            }
                            case "length": {
                                const eV: ItemMetadataEntry2 = findEntry(m.entries, 'value');
                                const eU: ItemMetadataEntry2 = findEntry(m.entries, 'unit');

                                const v1: number = (value ? (value.val as LengthValue).value : null);
                                const u1: LengthUnits = (value ? (value.val as LengthValue).unit : null);

                                const v2: number = Number(eV.value);
                                const u2: LengthUnits = eU.value as LengthUnits;

                                return compareLength(v1, u1, v2, u2, operator);
                            }
                            case "volume": {
                                const eV: ItemMetadataEntry2 = findEntry(m.entries, 'value');
                                const eU: ItemMetadataEntry2 = findEntry(m.entries, 'unit');

                                const v1: number = (value ? (value.val as VolumeValue).value : null);
                                const u1: VolumeUnits = (value ? (value.val as VolumeValue).unit : null);

                                const v2: number = Number(eV.value);
                                const u2: VolumeUnits = eU.value as VolumeUnits;

                                return compareVolume(v1, u1, v2, u2, operator);
                            }
                            case "width": {
                                const eV: ItemMetadataEntry2 = findEntry(m.entries, 'value');
                                const eU: ItemMetadataEntry2 = findEntry(m.entries, 'unit');

                                const v1: number = (value ? (value.val as WidthValue).value : null);
                                const u1: WidthUnits = (value ? (value.val as WidthValue).unit : null);

                                const v2: number = Number(eV.value);
                                const u2: WidthUnits = eU.value as WidthUnits;

                                return compareWidth(v1, u1, v2, u2, operator);
                            }
                            case "select": {

                                const eK: ItemMetadataEntry2 = findEntry(m.entries, 'key');

                                const k1: string = (value ? (value.val as SelectValue).key : null);
                                const k2: string = eK.value;

                                return compareSelect(k1, k2, operator);
                            }
                            case "doubleselect": {
                                const eOne: ItemMetadataEntry2 = findEntry(m.entries, 'key1');
                                const eTwo: ItemMetadataEntry2 = findEntry(m.entries, 'key2');

                                const kOne1: string = (value ? (value.val as DoubleSelectValue).key1 : null);
                                const kTwo1: string = (value ? (value.val as DoubleSelectValue).key2 : null);
                                const kOne2: string = eOne.value;
                                const kTwo2: string = eTwo.value;

                                return compareDoubleselect(kOne1, kTwo1, kOne1, kOne2, operator);
                            }
                        }
                        return true;
                    }
                    return false;
                });

                if (metas && metas.length) { //  this bulkEditItem2 match the 'when' criteria
                    r = true;
                }
            }
            return r; // this bulkEditItem2 do not match the 'when' criteria
        });
        return { b: matchedBulkEditItem2s, m: attMap};
}

const convertToBulkEditItems = (b2s: BulkEditItem2[], changes: ItemValueAndAttribute[], whens: ItemValueOperatorAndAttribute[]): BulkEditItem[] => {
   return b2s.map((b2: BulkEditItem2) => convertToBulkEditItem(b2, changes, whens));
}


const convertToBulkEditItem = (b2: BulkEditItem2, changes: ItemValueAndAttribute[], whens: ItemValueOperatorAndAttribute[]): BulkEditItem => {
    const c = changes.reduce((acc: any, change: ItemValueAndAttribute) => {
        const met: ItemMetadata2 = b2.metadatas.find((m: ItemMetadata2) => m.attributeId === change.attribute.id);
        const _new = {
            attributeId: met.attributeId,
            val: {}
        } as Value;
        const _c = {
          old: itemValueConvert({
             id: -1,
             attributeId: met.attributeId,
             metadatas: [met]
          } as ItemValue2),
          new: change.itemValue
        };
        acc[met.attributeId] = _c ;
        return acc;
    }, {});
    const w = whens.reduce((acc: any, when: ItemValueOperatorAndAttribute) => {
        const z = {
            attributeId: when.attribute.id,
            operator: when.operator,
            val: (when ? when.itemValue ? when.itemValue.val : null : null)
        };
        acc[when.attribute.id] = z;
        return acc;
    }, {} as any);
    const b: BulkEditItem = {
        id: b2.id,
        name: b2.name,
        description: b2.description,
        parentId: b2.parentId,
        children: convertToBulkEditItems(b2.children, changes, whens),
        images: [],
        changes: c,
        whens: w
    } as BulkEditItem;
    return b;
}

const findEntry = (entries: ItemMetadataEntry2[], key: string): ItemMetadataEntry2 => {
    return entries.find((e: ItemMetadataEntry2) => e.key === key);
}

const reg = (router: Router, registry: Registry) => {
   const p = `/view/:viewId/preview-bulk-edit`;
   registry.addItem('POST', p);
   router.post(p, ...httpAction);
}

export default reg;
