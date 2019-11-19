import {Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {DataSource} from '@angular/cdk/table';
import {Attribute, Attribute2} from '../../model/attribute.model';
import {CollectionViewer} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {EditAttributeDialogComponent} from './edit-attribute-dialog.component';
import {map} from 'rxjs/operators';
import {View} from '../../model/view.model';

class AttributeTableDataSource extends DataSource<Attribute2> {

  private subject: BehaviorSubject<Attribute2[]> = new BehaviorSubject(null);

  connect(collectionViewer: CollectionViewer): Observable<Attribute2[] | ReadonlyArray<Attribute2>> {
    return this.subject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.subject.complete();
  }

  update(attributes: Attribute2[]) {
    this.subject.next(attributes);
  }
}

type EventType = 'delete' | 'search' | 'add' | 'edit';

export interface AttributeTableComponentEvent {
  type: EventType;
  search?: string;
  view?: View;
  attribute?: Attribute2;
}

@Component({
  selector: 'app-attribute-table',
  templateUrl: './attribute-table.component.html',
  styleUrls: ['./attribute-table.component.scss']
})
export class AttributeTableComponent implements OnChanges {

  @Input() searchFieldLabel;
  @Input() searchFieldHint;
  @Input() searchFieldPlaceholder;
  @Input() view: View;
  @Input() attributes: Attribute2[];

  @Output() events: EventEmitter<AttributeTableComponentEvent>;

  formControlAttributeSearch: FormControl;
  dataSource: AttributeTableDataSource;
  displayedColumns: string[] = ['name', 'type', 'description', 'metadata', 'actions'];

  constructor(private formBuilder: FormBuilder, private matDialog: MatDialog) {
    this.formControlAttributeSearch = this.formBuilder.control('');
    this.dataSource = new AttributeTableDataSource();
    this.events = new EventEmitter();
  }


  onAttributeSearchTriggered($event: Event) {
    this.events.emit({
      type: 'search',
      view: this.view,
      search: this.formControlAttributeSearch.value
    } as AttributeTableComponentEvent);
  }

  onCancelClicked($event: MouseEvent, attribute: Attribute) {
    this.events.emit({
      type: 'delete',
      view: this.view,
      attribute
    } as AttributeTableComponentEvent);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.attributes) {
      const simpleChange: SimpleChange = changes.attributes;
      const attributes: Attribute2[] = simpleChange.currentValue;
      this.dataSource.update(attributes);
    }
  }

  onAddAttributeClick($event: MouseEvent) {
    const attribute: Attribute = {
      id: -1,
      type: 'string',
      name: '',
      description: '',
      metadatas: []
    };
    this.popupEditDialog('add', attribute);
  }

  onEditClicked($event: MouseEvent, attribute: Attribute) {
    this.popupEditDialog('edit', attribute);
  }

  private popupEditDialog(command: EventType, attribute: Attribute) {
    const matDialogRef: MatDialogRef<EditAttributeDialogComponent> = this.matDialog.open(EditAttributeDialogComponent, {
      data: attribute,
      minWidth: 600,
    });
    matDialogRef.afterClosed()
      .pipe(
        map((a: Attribute) => {
          if (a) {
            this.events.emit({
              type: command,
              view: this.view,
              attribute: a
            } as AttributeTableComponentEvent);
          }
        })
      ).subscribe();
  }
}
