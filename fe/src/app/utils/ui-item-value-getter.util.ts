import {Attribute} from '../model/attribute.model';
import {
  AreaValue, CurrencyValue,
  DateValue, DimensionValue, DoubleSelectValue, HeightValue,
  Item,
  TableItem,
  ItemValTypes, LengthValue,
  NumberValue, SelectValue,
  StringValue,
  TextValue,
  VolumeValue, WidthValue, Value
} from '../model/item.model';

export const hasItemValue = (attribute: Attribute, values: Value[]): boolean => {
    if (!values || !values.length) {
      return false;
    }
    let r = true;
    for (const value of values) {
      switch (attribute.type) {
        case 'string':
          r = r &&  (!!(value.val as StringValue).value);
          break;
        case 'text':
          r = r && (!!(value.val as TextValue).value);
          break;
        case 'date':
          r = r && (!!(value.val as DateValue).value);
          break;
        case 'number':
          r = r && (!Number.isNaN(Number((value.val as NumberValue).value)));
          break;
        case 'currency':
          r = r && (!Number.isNaN(Number((value.val as CurrencyValue).value)) && (!!(value.val as CurrencyValue).country));
          break;
        case 'area':
          r = r && (!Number.isNaN(Number((value.val as AreaValue).value)) && (!!(value.val as AreaValue).unit));
          break;
        case 'volume':
          r = r && (!Number.isNaN(Number((value.val as VolumeValue).value)) && (!!(value.val as VolumeValue).unit));
          break;
        case 'dimension':
          r = r && (
              (!Number.isNaN(Number((value.val as DimensionValue).height))) &&
              (!Number.isNaN(Number((value.val as DimensionValue).width))) &&
              (!Number.isNaN(Number((value.val as DimensionValue).length))) &&
              (!!(value.val as DimensionValue).unit)
          );
          break;
        case 'width':
          r = r && (!Number.isNaN(Number((value.val as WidthValue).value)) && (!!(value.val as WidthValue).unit));
          break;
        case 'height':
          r = r && (!Number.isNaN(Number((value.val as HeightValue).value)) && (!!(value.val as HeightValue).unit));
          break;
        case 'length':
          r = r && (!Number.isNaN(Number((value.val as LengthValue).value)) && (!!(value.val as LengthValue).unit));
          break;
        case 'select':
          r = r &&  (!!(value.val as SelectValue).key);
          break;
        case 'doubleselect':
          r = r &&  (
              (!!(value.val as DoubleSelectValue).key1) &&
              (!!(value.val as DoubleSelectValue).key2)
          );
          break;
      }
    }
    return r;
};

const internalGetItemValue = (attribute: Attribute, item: TableItem | Item): ItemValTypes => {
  const v: ItemValTypes = item[attribute.id].val;
  return v;
};
export const getItemStringValue = (attribute: Attribute, item: TableItem | Item): StringValue => {
  return internalGetItemValue(attribute, item) as StringValue;
};
export const getItemTextValue = (attribute: Attribute, item: TableItem | Item): TextValue => {
  return internalGetItemValue(attribute, item) as TextValue;
};
export const getItemNumberValue = (attribute: Attribute, item: TableItem | Item): NumberValue => {
  return internalGetItemValue(attribute, item) as NumberValue;
};
export const getItemDateValue = (attribute: Attribute, item: TableItem | Item): DateValue => {
  return internalGetItemValue(attribute, item) as DateValue;
};
export const getItemCurrencyValue = (attribute: Attribute, item: TableItem | Item): CurrencyValue => {
  return internalGetItemValue(attribute, item) as CurrencyValue;
};
export const getItemAreaValue = (attribute: Attribute, item: TableItem | Item): AreaValue => {
  return internalGetItemValue(attribute, item) as AreaValue;
};
export const getItemVolumeValue = (attribute: Attribute, item: TableItem | Item): VolumeValue => {
  return internalGetItemValue(attribute, item) as VolumeValue;
};
export const getItemDimensionValue = (attribute: Attribute, item: TableItem | Item): DimensionValue => {
  return internalGetItemValue(attribute, item) as DimensionValue;
};
export const getItemWidthValue = (attribute: Attribute, item: TableItem | Item): WidthValue => {
  return internalGetItemValue(attribute, item) as WidthValue;
};
export const getItemHeightValue = (attribute: Attribute, item: TableItem | Item): HeightValue => {
  return internalGetItemValue(attribute, item) as HeightValue;
};
export const getItemLengthValue = (attribute: Attribute, item: TableItem | Item): LengthValue => {
  return internalGetItemValue(attribute, item) as LengthValue;
};
export const getItemSelectValue = (attribute: Attribute, item: TableItem | Item): SelectValue => {
  return internalGetItemValue(attribute, item) as SelectValue;
};
export const getItemDoubleSelectValue = (attribute: Attribute, item: TableItem | Item): DoubleSelectValue => {
  return internalGetItemValue(attribute, item) as DoubleSelectValue;
};
