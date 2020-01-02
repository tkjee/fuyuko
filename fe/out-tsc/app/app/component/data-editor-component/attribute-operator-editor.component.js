import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CURRENCY_FORMAT } from '../../model/item.model';
import { convertToString } from '../../shared-utils/ui-item-value-converters.util';
import { setItemAreaValue, setItemCurrencyValue, setItemDateValue, setItemDimensionValue, setItemDoubleSelectValue, setItemHeightValue, setItemLengthValue, setItemNumberValue, setItemSelectValue, setItemStringValue, setItemTextValue, setItemVolumeValue, setItemWidthValue } from '../../shared-utils/ui-item-value-setter.util';
import { createNewItemValue } from '../../shared-utils/ui-item-value-creator.utils';
import { operatorNeedsItemValue, operatorsForAttribute } from '../../utils/attribute-operators.util';
import * as numeral from 'numeral';
let AttributeOperatorEditorComponent = class AttributeOperatorEditorComponent {
    constructor(formBuilder) {
        this.formBuilder = formBuilder;
        this.events = new EventEmitter();
        this.operators = [];
    }
    ngOnInit() {
        if (this.itemValueOperatorAndAttribute) {
            if (this.itemValueOperatorAndAttribute.attribute) {
                this.attribute = this.itemValueOperatorAndAttribute.attribute;
            }
            if (this.itemValueOperatorAndAttribute.operator) {
                this.operator = this.itemValueOperatorAndAttribute.operator;
            }
            if (this.itemValueOperatorAndAttribute.itemValue) {
                this.itemValue = this.itemValueOperatorAndAttribute.itemValue;
            }
        }
        this.reload();
    }
    reload() {
        this.formGroup = this.formBuilder.group({});
        this.formControlAttribute = this.formBuilder.control('', [Validators.required]);
        this.formControlOperator = this.formBuilder.control('', [Validators.required]);
        this.formGroup.setControl('attribute', this.formControlAttribute);
        this.formGroup.setControl('operator', this.formControlOperator);
        this.formControl = null;
        this.formControl2 = null;
        this.formControl3 = null;
        this.formControl4 = null;
        if (this.attribute) {
            this.formControlAttribute.setValue(this.attributes.find((a) => a.id === this.attribute.id));
            this.operators = operatorsForAttribute(this.attribute);
            if (this.operators && this.operator && (this.operators.find((o) => o === this.operator))) {
                this.formControlOperator = this.formBuilder.control(this.operator, [Validators.required]);
            }
            const hasItemValueForOperator = this.formControlOperator && operatorNeedsItemValue(this.formControlOperator.value);
            if ( /*this.itemValue &&*/hasItemValueForOperator) {
                switch (this.attribute.type) {
                    case 'string':
                    case 'text':
                    case 'number':
                    case 'date': {
                        const v = this.itemValue ? convertToString(this.attribute, this.itemValue) : '';
                        this.formControl = this.formBuilder.control(v, [Validators.required]);
                        this.formGroup.addControl('formControl', this.formControl);
                        break;
                    }
                    case 'currency': {
                        let currencyValue = ``;
                        let currencyCountry = ``;
                        if (this.itemValue && this.itemValue.val) {
                            const itemValueType = this.itemValue.val;
                            currencyValue = `${numeral(itemValueType.value).format(CURRENCY_FORMAT)}`;
                            currencyCountry = `${itemValueType.country}`;
                        }
                        this.formControl = this.formBuilder.control(currencyValue, [Validators.required]);
                        this.formControl2 = this.formBuilder.control(currencyCountry, [Validators.required]);
                        this.formGroup.addControl('formControl', this.formControl);
                        this.formGroup.addControl('formControl2', this.formControl2);
                        break;
                    }
                    case 'area':
                    case 'volume':
                    case 'width':
                    case 'length':
                    case 'height': {
                        let v = ``;
                        let u = ``;
                        if (this.itemValue && this.itemValue.val) {
                            const itemValueType = this.itemValue.val;
                            v = String(itemValueType.value);
                            u = itemValueType.unit;
                        }
                        this.formControl = this.formBuilder.control(v, [Validators.required]);
                        this.formControl2 = this.formBuilder.control(u, [Validators.required]);
                        this.formGroup.addControl('formControl', this.formControl);
                        this.formGroup.addControl('formControl2', this.formControl2);
                        break;
                    }
                    case 'dimension': {
                        let l = '';
                        let w = '';
                        let h = '';
                        let u = '';
                        if (this.itemValue && this.itemValue.val) {
                            const itemValueType = this.itemValue.val;
                            l = String(itemValueType.length);
                            w = String(itemValueType.width);
                            h = String(itemValueType.height);
                            u = itemValueType.unit;
                        }
                        this.formControl = this.formBuilder.control(l, [Validators.required]);
                        this.formControl2 = this.formBuilder.control(w, [Validators.required]);
                        this.formControl3 = this.formBuilder.control(h, [Validators.required]);
                        this.formControl4 = this.formBuilder.control(u, [Validators.required]);
                        this.formGroup.addControl('formControl', this.formControl);
                        this.formGroup.addControl('formControl2', this.formControl2);
                        this.formGroup.addControl('formControl3', this.formControl3);
                        this.formGroup.addControl('formControl4', this.formControl4);
                        break;
                    }
                    case 'select': {
                        let k = '';
                        if (this.itemValue && this.itemValue.val) {
                            const itemValueType = this.itemValue.val;
                            k = itemValueType.key;
                        }
                        this.formControl = this.formBuilder.control(k, [Validators.required]);
                        this.formGroup.addControl('formControl', this.formControl);
                        break;
                    }
                    case 'doubleselect': {
                        let k1 = '';
                        let k2 = '';
                        if (this.itemValue && this.itemValue.val) {
                            const itemValueType = this.itemValue.val;
                            k1 = itemValueType.key1;
                            k2 = itemValueType.key2;
                        }
                        this.formControl = this.formBuilder.control(k1, [Validators.required]);
                        this.formControl2 = this.formBuilder.control(k2, [Validators.required]);
                        this.formGroup.addControl('formControl', this.formControl);
                        this.formGroup.addControl('formControl2', this.formControl2);
                        break;
                    }
                }
            }
        }
    }
    onAttributeSelectionChange($event) {
        this.attribute = $event.value;
        this.operators = [];
        this.operator = null;
        this.itemValue = null;
        this.formControl = null;
        this.formControl2 = null;
        this.formControl3 = null;
        this.formControl4 = null;
        this.reload();
        this.emitEvent();
    }
    onOperatorSelectionChange($event) {
        this.operator = $event.value;
        this.itemValue = null;
        this.reload();
        this.emitEvent();
    }
    onDateChange($event) {
        this.onValueChange();
    }
    onValueChange() {
        if (!this.itemValue) {
            this.itemValue = createNewItemValue(this.attribute);
        }
        if (this.formControl) {
            switch (this.attribute.type) {
                case 'string':
                    setItemStringValue(this.attribute, this.itemValue, this.formControl.value);
                    break;
                case 'text':
                    setItemTextValue(this.attribute, this.itemValue, this.formControl.value);
                    break;
                case 'number':
                    setItemNumberValue(this.attribute, this.itemValue, this.formControl.value);
                    break;
                case 'date':
                    setItemDateValue(this.attribute, this.itemValue, this.formControl.value);
                    break;
                case 'currency':
                    setItemCurrencyValue(this.attribute, this.itemValue, this.formControl.value, this.formControl2.value);
                    break;
                case 'area':
                    setItemAreaValue(this.attribute, this.itemValue, this.formControl.value, this.formControl2.value);
                    break;
                case 'volume':
                    setItemVolumeValue(this.attribute, this.itemValue, this.formControl.value, this.formControl2.value);
                    break;
                case 'width':
                    setItemWidthValue(this.attribute, this.itemValue, this.formControl.value, this.formControl2.value);
                    break;
                case 'length':
                    setItemLengthValue(this.attribute, this.itemValue, this.formControl.value, this.formControl2.value);
                    break;
                case 'height': {
                    setItemHeightValue(this.attribute, this.itemValue, this.formControl.value, this.formControl2.value);
                    break;
                }
                case 'dimension': {
                    setItemDimensionValue(this.attribute, this.itemValue, this.formControl.value, this.formControl2.value, this.formControl3.value, this.formControl4.value);
                    break;
                }
                case 'select': {
                    setItemSelectValue(this.attribute, this.itemValue, this.formControl.value);
                    break;
                }
                case 'doubleselect': {
                    setItemDoubleSelectValue(this.attribute, this.itemValue, this.formControl.value, this.formControl2.value);
                    break;
                }
            }
        }
        this.emitEvent();
    }
    emitEvent() {
        const attribute = this.formControlAttribute.value;
        const operator = this.formControlOperator.value;
        const itemValue = createNewItemValue(this.attribute);
        if (this.formControl) {
            switch (this.attribute.type) {
                case 'string':
                    setItemStringValue(this.attribute, itemValue, this.formControl.value);
                    break;
                case 'text':
                    setItemTextValue(this.attribute, itemValue, this.formControl.value);
                    break;
                case 'number':
                    setItemNumberValue(this.attribute, itemValue, this.formControl.value);
                    break;
                case 'date':
                    setItemDateValue(this.attribute, itemValue, this.formControl.value);
                    break;
                case 'currency':
                    setItemCurrencyValue(this.attribute, itemValue, this.formControl.value, this.formControl2.value);
                    break;
                case 'area':
                    setItemAreaValue(this.attribute, itemValue, this.formControl.value, this.formControl2.value);
                    break;
                case 'volume':
                    setItemVolumeValue(this.attribute, itemValue, this.formControl.value, this.formControl2.value);
                    break;
                case 'width':
                    setItemWidthValue(this.attribute, itemValue, this.formControl.value, this.formControl2.value);
                    break;
                case 'length':
                    setItemLengthValue(this.attribute, itemValue, this.formControl.value, this.formControl2.value);
                    break;
                case 'height': {
                    setItemHeightValue(this.attribute, itemValue, this.formControl.value, this.formControl2.value);
                    break;
                }
                case 'dimension': {
                    setItemDimensionValue(this.attribute, itemValue, this.formControl.value, this.formControl2.value, this.formControl3.value, this.formControl4.value);
                    break;
                }
                case 'select': {
                    setItemSelectValue(this.attribute, itemValue, this.formControl.value);
                    break;
                }
                case 'doubleselect': {
                    setItemDoubleSelectValue(this.attribute, itemValue, this.formControl.value, this.formControl2.value);
                    break;
                }
            }
        }
        const event = { attribute, itemValue, operator };
        this.events.emit(event);
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], AttributeOperatorEditorComponent.prototype, "attributes", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], AttributeOperatorEditorComponent.prototype, "itemValueOperatorAndAttribute", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], AttributeOperatorEditorComponent.prototype, "events", void 0);
AttributeOperatorEditorComponent = tslib_1.__decorate([
    Component({
        selector: 'app-attribute-operator-editor',
        templateUrl: './attribute-operator-editor.component.html',
        styleUrls: ['./attribute-operator-editor.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [FormBuilder])
], AttributeOperatorEditorComponent);
export { AttributeOperatorEditorComponent };
//# sourceMappingURL=attribute-operator-editor.component.js.map