import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Rule} from '../../model/rule.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {map} from 'rxjs/operators';
import {Attribute} from '../../model/attribute.model';

export interface RulesTableComponentEvent {
  type: 'add' | 'edit' | 'delete' | 'enable' | 'disable' ;
  rule: Rule;
}

@Component({
  selector: 'app-rules-table' ,
  templateUrl: './rules-table.component.html',
  styleUrls: ['./rules-table.component.scss']
})
export class RulesTableComponent {
  counter: number;

  @Input() attributes: Attribute[];
  @Input() rules: Rule[];
  @Output() events: EventEmitter<RulesTableComponentEvent>;

  constructor(private matDialog: MatDialog) {
    this.rules = [];
    this.attributes = [];
    this.counter = -1;
    this.events = new EventEmitter();
  }

  onDeleteRule($event: MouseEvent, rule: Rule) {
    $event.stopImmediatePropagation();
    $event.preventDefault();
    this.events.emit({
      type: 'delete',
      rule: {...rule},
    } as RulesTableComponentEvent);
  }

  onExternalEdit($event: MouseEvent, rule: Rule) {
    this.events.emit({
      type: 'edit',
      rule: {...rule}
    } as RulesTableComponentEvent);
  }

  onAddRule($event: MouseEvent) {
    const newRule: Rule = {
      id: this.counter--,
      status: null,
      name: '',
      description: '',
      validateClauses: [],
      whenClauses: []
    };
    this.events.emit({
        type: 'add',
        rule: {...newRule}
      } as RulesTableComponentEvent);
    /*
    const matDialogRef: MatDialogRef<RuleEditorDialogComponent, Rule> = this.matDialog.open(RuleEditorDialogComponent, {
      minWidth: '60vw',
      minHeight: '30vh',
      data: {
        attributes: this.attributes,
        rule: {
          id: this.counter--,
          name: '',
          description: '',
          validateClauses: [],
          whenClauses: []
        } as Rule
      } as RuleEditorDialogComponentData
    });
    matDialogRef.afterClosed()
      .pipe(
        map((r: Rule) => {
          if (r) {
            this.events.emit({
              type: 'add',
              rule: {...r}
            } as RulesTableComponentEvent);
          }
        })
      ).subscribe();
     */
  }

  findAttribute(attributeId: number): Attribute {
    return this.attributes.find((a: Attribute) => a.id === attributeId);
  }

  onEnableRule($event: MouseEvent, rule: Rule) {
    $event.stopImmediatePropagation();
    $event.preventDefault();
    this.events.emit({
        type: 'enable',
        rule
      } as RulesTableComponentEvent);
  }

  onDisableRule($event: MouseEvent, rule: Rule) {
    $event.stopImmediatePropagation();
    $event.preventDefault();
    this.events.emit({
      type: 'disable',
      rule
    } as RulesTableComponentEvent);
  }

  isEnabled(rule: Rule) {
    return rule.status === 'ENABLED';
  }

  isDisabled(rule: Rule) {
    return rule.status === 'DISABLED';
  }
}
