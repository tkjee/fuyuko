import {AfterViewInit, Component, OnDestroy, OnInit} from "@angular/core";
import {DashboardWidget, DashboardWidgetInfo} from "../../../../model/dashboard.model";
import {DashboardWidgetService} from "../../../../service/dashboard-service/dashboard-widget.service";
import uuid from "uuid";

declare const TradingView: any;

@Component({
    templateUrl: './stock-trading-widget.component.html',
    styleUrls: ['./stock-trading-widget.component.scss']
})
export class StockTradingWidgetComponent extends DashboardWidget implements OnInit, AfterViewInit, OnDestroy {

    static info(): DashboardWidgetInfo {
       return { id: 'stock-trading-widget', name: 'stock-trading-widget', type: StockTradingWidgetComponent };
    }

    uid = `tradingview_${uuid()}`;

    constructor(protected dashboardWidgetService: DashboardWidgetService) {
        super(dashboardWidgetService);
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.f();
    }

    ngOnDestroy(): void {
    }


    f() {
        /*
        let s = document.createElement('script');
        s.src =`https://s3.tradingview.com/tv.js`;
        const fjs = (document.getElementsByTagName(`script`)[0] as HTMLScriptElement);
        fjs.parentNode.insertBefore(s, fjs);
        console.log('***** ', TradingView);
         */
        setTimeout(() => {
            new TradingView.widget(
                {
                    "width": 980,
                    "height": 610,
                    "symbol": "NASDAQ:AAPL",
                    "interval": "D",
                    "timezone": "Etc/UTC",
                    "theme": "light",
                    "style": "1",
                    "locale": "en",
                    "toolbar_bg": "#f1f3f6",
                    "enable_publishing": false,
                    "allow_symbol_change": true,
                    "container_id": this.uid
                }
            );
        }, 3000);
    }


}