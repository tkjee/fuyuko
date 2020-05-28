import {
    AreaUnits,
    CountryCurrencyUnits,
    DimensionUnits, HeightUnits,
    LengthUnits,
    VolumeUnits,
    WidthUnits
} from "../../../model/unit.model";
import {AbstractViewDataItemPopupPage} from "./abstract-view-data-item-popup.page";
import * as util from "../../../util/util";


export class AbstractViewDataAttributePopupPage {

    constructor(public PAGE_NAME: string) {}

    waitForReady(): AbstractViewDataAttributePopupPage {
        util.waitUntilTestPageReady(this.PAGE_NAME);
        return this;
    }

    verifyPopupTitle(): this {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .should('exist');
        return this;
    }

    editStringAttribute(v: string): this {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-field-string]`)
            .clear({force: true})
            .type(v, {force: true});
        this.waitForReady();
        return this;
    }

    editTextAttribute(v: string): this {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-field-text]`)
            .clear({force: true})
            .type(v, {force: true});
        this.waitForReady();
        return this;
    }

    editNumericAttribute(v: number): this {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-field-number]`)
            .clear({force: true})
            .type(String(v), {force: true});
        return this;
    }

    editDateAttribute(v: string /* DD-MM-YYYY */): this {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-field-date]`)
            .clear({force: true})
            .type(v, {force: true})
        ;
        this.waitForReady();
        return this;
    }

    editCurrencyAttribute(v: number, unit: CountryCurrencyUnits): this {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find((`[test-field-currency]`))
            .clear({force: true})
            .type(String(v), {force: true})
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-currency] div`).first().click({force: true});
        cy.get(`[test-mat-select-option-currency='${unit}']`).click({force: true});
        this.waitForReady();
        return this;
    }

    editAreaAttribute(v: number, unit: AreaUnits): this {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-field-area]`)
            .clear({force: true})
            .type(String(v), {force: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-area] div`).first().click({force: true});
        cy.get(`[test-mat-select-option-area='${unit}']`).click({force: true});
        this.waitForReady();
        return this;
    }

    editVolumeAttribute(v: number, unit: VolumeUnits): this {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-field-volume]`)
            .clear({force: true})
            .type(String(v), {force: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-volume] div`).first().click({force: true});
        cy.get(`[test-mat-select-option-volume='${unit}']`).click({force: true});
        this.waitForReady();
        return this;
    }

    editDimensionAttribute(l: number, w: number, h: number, unit: DimensionUnits): this {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-field-dimension-length]`)
            .clear({force: true})
            .type(String(l), {force: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-field-dimension-width]`)
            .clear({force: true})
            .type(String(w), {force: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-field-dimension-height]`)
            .clear({force: true})
            .type(String(h), {force: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-dimension] div`).first().click({force: true});
        cy.get(`[test-mat-select-option-dimension='${unit}']`).click({force: true});
        this.waitForReady();
        return this;
    }

    editWidthAttribute(v: number, unit: WidthUnits): this {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-field-width]`)
            .clear({force: true})
            .type(String(v), {force: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-width] div`).first().click({force: true});
        cy.get(`[test-mat-select-option-width='${unit}']`).click({force: true});
        this.waitForReady();
        return this;
    }

    editLengthAttribute(v: number, unit: LengthUnits): this {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-field-length]`)
            .clear({force: true})
            .type(String(v), {force: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-length] div`).first().click({force: true});
        cy.get(`[test-mat-select-option-length='${unit}']`).click({force: true});
        return this;
    }

    editHeightAttribute(v: number, unit: HeightUnits): this {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-field-height]`)
            .clear({force: true})
            .type(String(v), {force: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-height] div`).first().click({force: true});
        cy.get(`[test-mat-select-option-height='${unit}']`).click({force: true});
        this.waitForReady();
        return this;
    }

    editSelectAttribute(key: string): this {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-select-key] div`).first().click({force: true});
        cy.get(`[test-mat-select-option-select-key='${key}']`).click({force: true});
        this.waitForReady();
        return this;
    }

    editDoubleSelectAttribute(key1: string, key2: string): this {
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-doubleselect-key1] div`).first().click({force: true});
        cy.get(`[test-mat-select-option-doubleselect-key1='${key1}']`).click({force: true});
        cy.get(`[test-popup-dialog-title='data-editor-dialog-popup']`)
            .find(`[test-mat-select-doubleselect-key2] div`).first().click({force: true});
        cy.get(`[test-mat-select-option-doubleselect-key2='${key2}']`).click({force: true});
        this.waitForReady();
        return this;
    }
}
