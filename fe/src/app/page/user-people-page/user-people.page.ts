import {Component, OnInit} from '@angular/core';
import {UserManagementService} from '../../service/user-management-service/user-management.service';
import {Observable, of} from 'rxjs';
import {NotificationsService} from 'angular2-notifications';
import {UserSearchFn} from '../../component/user-table-component/user-table.component';
import {User} from '../../model/user.model';
import {
  ActionType,
  UserSearchTableComponentEvent
} from '../../component/user-search-table-component/user-search-table.component';
import {combineAll, map, tap} from 'rxjs/operators';
import {ApiResponse} from '../../model/api-response.model';
import {toNotifications} from '../../service/common.service';


@Component({
  templateUrl: './user-people.page.html',
  styleUrls: ['./user-people.page.scss']
})
export class UserPeoplePageComponent implements OnInit {

  inactiveUserSearchFn: UserSearchFn;
  activeUserSearchFn: UserSearchFn;

  ready: boolean;
  activeUsers: User[];
  inactiveUsers: User[];
  activeUsersActionTypes: ActionType[];
  inactiveUsersActionTypes: ActionType[];

  constructor(private userManagementService: UserManagementService,
              private notificationService: NotificationsService) {
    this.inactiveUserSearchFn = (userName: string): Observable<User[]> => {
      return this.userManagementService.findInactiveUsers(userName);
    };
    this.activeUserSearchFn = (userName: string): Observable<User[]> => {
      return this.userManagementService.findActiveUsers(userName);
    };

    this.activeUsersActionTypes = [{type: 'DEACTIVATE', icon: 'remove_circle', tooltip: 'Deactivate User'}];
    this.inactiveUsersActionTypes = [{type: 'ACTIVATE', icon: 'add_box', tooltip: 'Activate User'}];
  }

  ngOnInit(): void {
      this.reload();
  }

  reload() {
    this.ready = false;
    of(this.userManagementService.getAllActiveUsers(), this.userManagementService.getAllInactiveUsers()).pipe(
        combineAll(),
        tap((r: [User[], User[]]) => {
            const activeUsers: User[] = r[0];
            const inactiveUsers: User[] = r[1];
            this.activeUsers = activeUsers;
            this.inactiveUsers = inactiveUsers;
            this.ready = true;
        })
    ).subscribe();

    /*
    this.userManagementService.getAllActiveUsers().pipe(
        tap((u: User[]) => {
          this.activeUsers = u;
        })
    ).subscribe();
    this.userManagementService.getAllInactiveUsers().pipe(
        map((u: User[]) => this.inactiveUsers = u)
    ).subscribe();
     */
  }



  onActiveUsersTableEvent($event: UserSearchTableComponentEvent) {
      switch ($event.type) {
        case 'DEACTIVATE':
          this.userManagementService.setUserStatus($event.user.id, 'DISABLED')
              .pipe(
                  tap((r: ApiResponse) => {
                    toNotifications(this.notificationService, r);
                    this.reload();
                  })
              ).subscribe();
          break;
      }
  }

  onInactiveUsersTableEvent($event: UserSearchTableComponentEvent) {
    switch ($event.type) {
      case 'ACTIVATE':
        this.userManagementService.setUserStatus($event.user.id, 'ENABLED')
            .pipe(
                tap((r: ApiResponse) => {
                  toNotifications(this.notificationService, r);
                  this.reload();
                })
            ).subscribe();
        break;
    }
  }

}

