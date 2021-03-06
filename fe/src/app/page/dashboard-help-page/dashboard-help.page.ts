import {Component} from '@angular/core';
import {HelpService} from "../../service/help.service/help.service";
import {tap} from "rxjs/operators";

const HELP_POSTFIX = `HELP_DASHBOARD.md`;

@Component({
    templateUrl: './dashboard-help.page.html',
    styleUrls: ['./dashboard-help.page.scss']
})
export class DashboardHelpPageComponent {

    help: string = '';

    constructor(private helpService: HelpService) {
    }

    ngOnInit(): void {
        this.helpService.getHelp(HELP_POSTFIX).pipe(tap((html: string) => {
            this.help = html;
        })).subscribe();
    }

}
