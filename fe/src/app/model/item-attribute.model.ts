import {Item, TableItem, Value} from './item.model';
import {Attribute, Attribute2} from './attribute.model';
import {OperatorType} from './operator.model';

export interface TableItemAndAttribute {
  attribute: Attribute2;
  tableItem: TableItem;
}

export interface ItemAndAttributes {
  attributes: Attribute2[];
  item: Item;
}

export interface ItemValueAndAttribute {
  itemValue: Value;
  attribute: Attribute2;
}

export interface ItemValueOperatorAndAttribute {
  itemValue: Value;
  operator: OperatorType;
  attribute: Attribute2;
}

export interface TableItemAndAttributeSet {
  attributes: Attribute2[];
  tableItems: TableItem[];
}

export interface ItemAndAttributeSet {
  attributes: Attribute2[];
  items: Item[];
}

