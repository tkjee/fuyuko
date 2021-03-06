import {Component, Input, OnInit} from '@angular/core';
import {BulkEditTableItem} from '../../model/bulk-edit.model';
import {Attribute} from '../../model/attribute.model';
import {DataSource} from '@angular/cdk/table';
import {CollectionViewer} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import uuid from "uuid";

export class BulkEditReviewTableDataSource extends DataSource<BulkEditTableItem> {
    private subject: BehaviorSubject<BulkEditTableItem[]> = new BehaviorSubject([]);
    connect(collectionViewer: CollectionViewer): Observable<BulkEditTableItem[] | ReadonlyArray<BulkEditTableItem>> {
        return this.subject.asObservable();
    }
    disconnect(collectionViewer: CollectionViewer): void {
        this.subject.complete();
    }

    update(bulkEditTableItem: BulkEditTableItem[]) {
        if (bulkEditTableItem) {
            this.subject.next(bulkEditTableItem);
        }
    }
}


@Component({
    selector: 'app-bulk-edit-review-table',
    templateUrl: './bulk-edit-review-table.component.html',
    styleUrls: ['./bulk-edit-review-table.component.scss']
})
export class BulkEditReviewTableComponent implements OnInit {

    @Input() changeAttributes: Attribute[];
    @Input() whenAttributes: Attribute[];
    @Input() bulkEditTableItem: BulkEditTableItem[];
    attributeHeaderColumns: string[];
    changeOldNewValuesHeaderColumns: string[];
    displayedColumns: string[];
    dataSource: BulkEditReviewTableDataSource;

    constructor() {
        this.displayedColumns = [];
        this.attributeHeaderColumns = [];
        this.changeOldNewValuesHeaderColumns = [];
        this.dataSource = new BulkEditReviewTableDataSource();
    }

    ngOnInit(): void {
        this.whenAttributes.forEach((a: Attribute) => a['uid'] = uuid());
        this.changeAttributes.forEach((a: Attribute) => a['uid'] = uuid());

        this.attributeHeaderColumns = [
            'item-number-header',
            'item-info-header',
            ...this.whenAttributes.map((wa: Attribute) => `when-attributes-header-${wa['uid']}-${wa.id}`),
            ...this.changeAttributes.map((ca: Attribute) => `change-attributes-header-${ca['uid']}-${ca.id}`),
        ];
        this.changeAttributes.forEach((ca: Attribute) => {
            this.changeOldNewValuesHeaderColumns.push(`change-old-values-header-${ca['uid']}-${ca.id}`);
            this.changeOldNewValuesHeaderColumns.push(`change-new-values-header-${ca['uid']}-${ca.id}`);
        });
        this.displayedColumns = [
            `item-number-cell`,
            `item-info-cell`,
            ...this.whenAttributes.map((wa: Attribute) => `${wa['uid']}-${wa.id}`),
        ];
        this.changeAttributes.forEach((ca: Attribute) => {
            this.displayedColumns.push(`old-${ca['uid']}-${ca.id}`);
            this.displayedColumns.push(`new-${ca['uid']}-${ca.id}`);
        });
        this.dataSource.update(this.bulkEditTableItem);
    }
}
