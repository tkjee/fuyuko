import {LoginPo} from './po/login.po';

describe('login', () => {

    let po: LoginPo;

    beforeEach(() => {

    });


    it('loads', () => {
        cy.visit('http://localhost:4200/login-layout/login');

        cy.get('[test-page-title]')
            .should('have.attr', 'test-page-title', 'login');
    });
});
