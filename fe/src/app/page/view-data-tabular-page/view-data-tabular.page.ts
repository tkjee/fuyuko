import {Component, OnDestroy, OnInit} from '@angular/core';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {ItemService} from '../../service/item-service/item.service';
import {combineLatest, forkJoin, Subscription, concat, Observable} from 'rxjs';
import {concatAll, concatMap, map, tap} from 'rxjs/operators';
import {Item, ItemSearchType, TableItem} from '../../model/item.model';
import {Attribute} from '../../model/attribute.model';
import {TableItemAndAttributeSet} from '../../model/item-attribute.model';
import {ViewService} from '../../service/view-service/view.service';
import {View} from '../../model/view.model';
import {DataTableComponentEvent} from '../../component/data-table-component/data-table.component';
import {toTableItem} from '../../utils/item-to-table-items.util';
import {ItemSearchComponentEvent} from '../../component/item-search-component/item-search.component';
import {ApiResponse, PaginableApiResponse} from '../../model/api-response.model';
import {toNotifications} from '../../service/common.service';
import {NotificationsService} from 'angular2-notifications';
import {CarouselComponentEvent} from "../../component/carousel-component/carousel.component";
import {Pagination} from "../../utils/pagination.utils";
import {PaginationComponentEvent} from "../../component/pagination-component/pagination.component";


@Component({
  templateUrl: './view-data-tabular.page.html',
  styleUrls: ['./view-data-tabular.page.scss']
})
export class ViewDataTabularPageComponent implements OnInit, OnDestroy {

  itemAndAttributeSet: TableItemAndAttributeSet;
  done: boolean;


  pagination: Pagination;
  search: string;
  searchType: ItemSearchType;
  currentView: View;
  subscription: Subscription;

  constructor(private attributeService: AttributeService,
              private notificationService: NotificationsService,
              private viewService: ViewService,
              private itemService: ItemService) {
      this.pagination = new Pagination();
  }

  ngOnInit(): void {
    this.search = '';
    this.searchType = 'basic';
    this.subscription = this.viewService.asObserver().subscribe((currentView: View) => {
      this.currentView = currentView;
      if (this.currentView) {
        this.reload();
      } else {
        this.done = true;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  reload() {
    this.done = false;
    const viewId = this.currentView.id;
    forkJoin([
      this.attributeService.getAllAttributesByView(viewId)
          .pipe(map((r: PaginableApiResponse<Attribute[]>) => r.payload)),
      (this.search && this.searchType) ?
          this.itemService.searchForItems(viewId, this.searchType, this.search) :
          this.itemService.getAllItems(viewId, this.pagination.limitOffset())
    ]).pipe(
      map( (r: [Attribute[], PaginableApiResponse<Item[]>]) => {
       const attributes: Attribute[] = r[0];
       const items: Item[] = r[1].payload;
       this.pagination.update(r[1]);
       const tableItems: TableItem[] = toTableItem(items);
       this.itemAndAttributeSet = {
         attributes,
         tableItems,
       };
       this.done = true;
      })
    ).subscribe();
  }


  onDataTableEvent($event: DataTableComponentEvent) {
    const o: Observable<ApiResponse>[] = [];
    if ($event.newItems && $event.newItems.length) {
        o.push(this.itemService.saveTableItems(this.currentView.id, $event.newItems));
    }
    if ($event.modifiedItems && $event.modifiedItems.length) {
        o.push(this.itemService.saveItems(this.currentView.id, $event.modifiedItems as any));
    }
    if ($event.deletedItems && $event.deletedItems.length) {
        o.push(this.itemService.deleteTableItems(this.currentView.id, $event.deletedItems));
    }
    switch ($event.type) {
      case 'modification':
          concat(...o).pipe(
              tap((r: ApiResponse) => {
                toNotifications(this.notificationService, r);
                this.reload();
              })
          ).subscribe();
        break;
      case 'reload':
        this.reload();
        break;
    }
  }

  onDataTableSearchEvent($event: ItemSearchComponentEvent) {
    this.search = $event.search;
    this.searchType = $event.type;
    this.reload();
  }

  onCarouselEvent($event: CarouselComponentEvent) {
    switch ($event.type) {
      case "upload":
          this.itemService.uploadItemImage($event.itemId, $event.file).pipe(
              tap((r: ApiResponse) => {
                toNotifications(this.notificationService, r);
                this.reload();
              })
          ).subscribe();
        break;
      case "markAsPrimary":
        this.itemService.markItemImageAsPrimary($event.itemId, $event.image.id).pipe(
            tap((r: ApiResponse) => {
              toNotifications(this.notificationService, r);
              this.reload();
            })
        ).subscribe();
        break;
      case "delete":
        this.itemService.deleteItemImage($event.itemId, $event.image.id).pipe(
            tap((r: ApiResponse) => {
              toNotifications(this.notificationService, r);
              this.reload();
            })
        ).subscribe();
        break;
    }
  }

    onPaginationEvent($event: PaginationComponentEvent) {
      this.pagination.updateFromPageEvent($event.pageEvent);
      this.reload();
    }
}
