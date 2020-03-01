import {LoginPage} from "./page-object/login.page";
import {PricingPage} from "./page-object/pricing.page";

describe(`pricing structure spece`, () => {

    let pricingPage: PricingPage;

    before(() => {
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        pricingPage = new LoginPage()
            .visit()
            .login(username, password)
            .visitPricingPage();
    });

    after(() => {
        localStorage.clear();
        sessionStorage.clear();
    });


    beforeEach(() => {
        cy.restoreLocalStorage();
        pricingPage.visit();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('should load', () => {
        pricingPage
            .visit()
            .validateTitle()
        ;
    });

    //////////////////

    it(`should select and display existing pricing structure`, () => {
        const pricingStructureName1 = `Pricing Structure #1`;
        const pricingStructureName2 = `Pricing Structure #2`;

        pricingPage
            .selectPricingStructure(pricingStructureName1)
            .verifyPricingStrucureHasItems(pricingStructureName1)
            .selectPricingStructure(pricingStructureName2)
            .verifyPricingStructureHasNoItems(pricingStructureName2)
        ;

    });

    it.only (`should create, edit, edit item in pricing structure and then delete pricing structure`, () => {

        const random = `${Math.random()}`;
        const pricingStructureName = `New-Pricing-Structure-${random}`;
        const pricingStructureDescription = `New-Pricing-Structure-Description-${random}`;

        /*
        pricingPage
            .clickAddNewPricingStructure()
            .editPricingStructureName(pricingStructureName)
            .editPricingStructureDescription(pricingStructureDescription)
         */






    });
});