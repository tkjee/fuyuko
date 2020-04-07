import {PartnerTablePage} from "./sub-page-object/partner-table.page";
import {PartnerListPage} from "./sub-page-object/partner-list.page";
import {PartnerThumbnailPage} from "./sub-page-object/partner-thumbnail.page";


export class PartnerPage {

    visitPartnerTablePage(): PartnerTablePage {
        cy.visit('/partner-layout/(table//help:partner-help)');
        return new PartnerTablePage();
    }

    visitPartnerListPage(): PartnerListPage {
        cy.visit('/partner-layout/(list//help:partner-help)');
        return new PartnerListPage;
    }

    visitPartnerThumbnailPage(): PartnerThumbnailPage {
        cy.visit('/partner-layout/(thumbnail//help:partner-help)');
        return new PartnerThumbnailPage();
    }


}
