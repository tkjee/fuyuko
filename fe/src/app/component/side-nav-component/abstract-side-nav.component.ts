import {filter, map} from 'rxjs/operators';
import {ActivatedRoute, ActivatedRouteSnapshot, Event as RouterEvent, NavigationEnd, Router} from '@angular/router';
import {EventEmitter, OnInit} from '@angular/core';


export abstract class AbstractSideNavComponent implements OnInit {

    routeSideNavData: string;

    constructor(protected route: ActivatedRoute, protected router: Router) {
    }

    ngOnInit(): void {
        this.routeSideNavData = this.findSideNavData([this.route.snapshot]);
        this.router.events
            .pipe(
                filter((e: RouterEvent) => e instanceof NavigationEnd),
                map((e: NavigationEnd) => {
                    this.routeSideNavData = this.findSideNavData([this.route.snapshot]);
                })
            ).subscribe();
    }

    findSideNavData(r: ActivatedRouteSnapshot[]): string {
        let result: string = null;
        for (const rr of r) {
            result = rr.data.sideNav;
            if (!result) {
                result =  this.findSideNavData(rr.children);
                if (result) {
                    return result;
                }
            } else {
                return result;
            }
        }
        return result;
    }

}
