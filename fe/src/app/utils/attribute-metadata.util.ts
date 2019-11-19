import {Attribute2, Metadata2, MetadataEntry2} from '../model/attribute.model';
import {DEFAULT_DATE_FORMAT, DEFAULT_NUMERAL_FORMAT} from '../model/unit.model';


export const getMetadataEntry = (key: string, attribute: Attribute2, defaultValue: string): string => {
    if (attribute.metadatas &&
        attribute.metadatas.length > 0) {
        for (const metadata of attribute.metadatas) {
            for (const entry of metadata.entries) {
                if (entry.key === key) {
                    return entry.value;
                }
            }
        }
    }
    return defaultValue;
};

export const setMetadataEntry = (key: string, attribute: Attribute2, value: string) => {
    if (!attribute.metadatas) {
        attribute.metadatas = [{
            id: -1,
            name: '',
            entries: [{
               id: -1,
               key,  value
            } as MetadataEntry2]
        } as Metadata2];
        return;
    }
    if (!attribute.metadatas[0].entries) {
        attribute.metadatas[0].entries = [{
            id: -1,
            key,  value
        } as MetadataEntry2];
        return;
    }
    for (const e of attribute.metadatas[0].entries) {
        if (e.key === key) {
            e.value = value;
            return;
        }
    }
    attribute.metadatas[0].entries.push({
       id: -1,
       key, value
    } as MetadataEntry2);
}




// ====================================



export const getFormatMetadataEntry = (attribute: Attribute2): string => {
    return this.getMetadataEntry('format', attribute, getDefaultFormat(attribute));
};

export const setFormatMetadataEntry = (attribute: Attribute2, value: string) => {
    return this.setMetadataEntry('format', attribute, value);
}


export const getShowCurrencyCountryMetadataEntry = (attribute: Attribute2): string => {
    return this.getMetadataEntry('showCurrencyCountry', attribute, getDefaultShowCurrencyCountry(attribute));
}

export const setShowCurrencyCountryMetadataEntry = (attribute: Attribute2, value: string) => {
    return this.setMetadataEntry('showCurrencyCountry', attribute, value);
}


// =========================================

const getDefaultShowCurrencyCountry = (attribute: Attribute2): string => {
    switch (attribute.type) {
        case 'currency':
            return 'true';
        case 'string':
        case 'text':
        case 'select':
        case 'doubleselect':
        case 'number':
        case 'volume':
        case 'dimension':
        case 'area':
        case 'length':
        case 'width':
        case 'height':
        case 'date':
        default:
            return '';
    }
}

const getDefaultFormat = (attribute: Attribute2): string => {
    switch (attribute.type) {
        case 'number':
        case 'volume':
        case 'dimension':
        case 'area':
        case 'length':
        case 'width':
        case 'height':
            return DEFAULT_NUMERAL_FORMAT;
        case 'date':
            return DEFAULT_DATE_FORMAT;
        case 'string':
        case 'text':
        case 'currency':
        case 'select':
        case 'doubleselect':
        default:
            return '';
    }
}


