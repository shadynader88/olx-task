/// <reference types="cypress" />

import '@testing-library/cypress/add-commands'
import moment from "moment-timezone";
import HomePage from "../../page-objects/Home";
import SearchPage from "../../page-objects/Search";

describe("Olx Task", () => {

  let homePage = new HomePage();
  let searchPage = new SearchPage();
  let todayDate = new Date();
  let startDate = new Date();
  let endDate = new Date();
  let startMonth;
  let endMonth;
  let travelPeriod;
  let nextMonth = 0;

  before(() => {
    cy.visit(Cypress.env("airBnbUrl")).then((win) => {
      win.localStorage.clear();
    });
    cy.clearCookies();
    cy.findAllByText("Live anywhere").should("be.exist");
  });

  it("Verify that the results match the search criteria", () => {
    cy.scrollTo("bottom");
    cy.get(homePage.startYourSearchButton).click();
    cy.get(homePage.locationInput).type("Rome");
    cy.findByText("Rome, Italy").click();
    //todayDate.setDate(20);
    startDate.setDate(todayDate.getDate() + 7);
    endDate.setDate(todayDate.getDate() + 14);
    startMonth = moment(startDate).format("MMM");
    endMonth = moment(endDate).format("MMM");
    (startMonth === endMonth) ?
      travelPeriod = `${startMonth} ${startDate.getDate()} – ${endDate.getDate()}`
        : travelPeriod = `${startMonth} ${startDate.getDate()} – ${endMonth} ${endDate.getDate()}`;
    (startDate.getMonth() > todayDate.getMonth()) ?  nextMonth++ : nextMonth;
    cy.get(homePage.calendarInput).eq(1 + nextMonth).findByText(startDate.getDate()).click({ force: true });
    (endDate.getMonth() > startDate.getMonth()) ?  nextMonth++ : nextMonth;
    cy.get(homePage.calendarInput).eq(1 + nextMonth).findByText(endDate.getDate()).click({ force: true });
    cy.get(homePage.addGuestInput).click();
    cy.get(homePage.increaseAdultsButton).click();
    cy.get(homePage.increaseAdultsButton).click();
    cy.get(homePage.increaseChildrenButton).click();
    cy.get(homePage.searchButton).click();
    cy.get(searchPage.searchFilters).eq(0).should("have.text", "Rome");
    cy.get(searchPage.searchFilters).eq(1).should("have.text", travelPeriod);
    cy.get(searchPage.searchFilters).eq(2).should("have.text", "3 guests");
    cy.get(searchPage.searchTitle).should("have.text", "Stays in Metropolitan City of Rome");
    cy.get(searchPage.infoText).each(($el, index, $list) => {
      let numberOfGuests = parseInt($el.text().split(' ')[0]);
      expect(numberOfGuests).to.be.at.least(3);
    });
  });
});
