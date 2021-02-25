/// <reference types="cypress" />

import '@testing-library/cypress/add-commands'
import moment from "moment-timezone";
import HomePage from "../../page-objects/Home";
import SearchPage from "../../page-objects/Search";
import PropertyPage from "../../page-objects/Property";

describe("Olx Task", () => {

  let homePage = new HomePage();
  let searchPage = new SearchPage();
  let propertyPage = new PropertyPage();
  let todayDate;
  let startDate;
  let endDate;
  let startMonth;
  let endMonth;
  let travelPeriod;
  let nextMonth;
  let propertyName;
  let propertyPrice;

  beforeEach(() => {
    visitAndSearch();
  });

  it("Verify that the results match the search criteria", () => {
    cy.get(searchPage.listItemName).then(($tr) => {
      propertyName = $tr.eq(0).text();
    });
    cy.get(searchPage.listItemPrice).then(($tr) => {
      propertyPrice = $tr.eq(0).text();
    });
    cy.get(searchPage.searchFilters).eq(0).should("have.text", "Rome");
    cy.get(searchPage.searchFilters).eq(1).should("have.text", travelPeriod);
    cy.get(searchPage.searchFilters).eq(2).should("have.text", "3 guests");
    cy.get(searchPage.searchTitle).should("have.text", "Stays in Metropolitan City of Rome");
    // Asserting all list items are at least 3 adults
    cy.get(searchPage.infoText).each(($el, index, $list) => {
      let numberOfGuests = parseInt($el.text().split(' ')[0]);
      expect(numberOfGuests).to.be.at.least(3);
    });
  });

  it("Verify that the results and details page match the extra filters", () => {
    cy.get(searchPage.moreFilters).click();
    cy.get(searchPage.increaseBedroomsButton).click();
    cy.get(searchPage.increaseBedroomsButton).click();
    cy.get(searchPage.increaseBedroomsButton).click();
    cy.get(searchPage.increaseBedroomsButton).click();
    cy.get(searchPage.increaseBedroomsButton).click();
    cy.get(searchPage.poolCheckbox).click();
    cy.get(searchPage.showStaysButton).click();
    cy.get(searchPage.moreFilters).should("contain.text", "More filters · 2");
    // Asserting all list items are at least 5 bedrooms
    cy.get(searchPage.infoText).each(($el) => {
      let numberOfBedrooms = parseInt($el.text().split('·')[1].split(' ')[1]);
      expect(numberOfBedrooms).to.be.at.least(5);
    });
    // Opening property in the same page
    cy.get(searchPage.listItem).eq(0).each((locator) => {
      cy.wrap(locator)
        .invoke("removeAttr", "target")
        .click();
    });
    cy.get(propertyPage.amenitiesSection)
      .should("be.exist")
      .should("contain.text", "Pool");
  });

  it("Verify that a property is displayed on the map correctly", () => {
    let white = "rgb(255, 255, 255)";
    let black = "rgb(34, 34, 34)";
    cy.get(searchPage.mapItem).should("be.exist");
    // Asserting color & background before hover action
    cy.document().then((document) => {
      let item = document.querySelector(searchPage.mapItem);
      expect(item.style.color).to.equals(black);
      expect(item.style.backgroundColor).to.equals(white);
    })
    cy.get(searchPage.listItem).eq(0).trigger('mouseover');
    // Asserting color & background after hover action
    cy.document().then((document) => {
      let item = document.querySelector(searchPage.mapItem);
      expect(item.style.color).to.equals(white);
      expect(item.style.backgroundColor).to.equals(black);
    })
    cy.get(searchPage.mapItem).click();
    // Asserting name & price are matching
    cy.get(searchPage.mapPopupInfo).then(($tr) => {
      expect($tr.eq(3).text()).to.be.equal(propertyName);
      expect($tr.eq(4).text()).to.contain(propertyPrice);
    });
  });

  function visitAndSearch() {
    // Visiting airbnb.com
    cy.visit(Cypress.env("airBnbUrl")).then((win) => {
      win.localStorage.clear();
    });
    cy.clearCookies();
    // Start searching
    cy.findAllByText("Live anywhere").should("be.exist");
    cy.scrollTo("bottom");
    cy.get(homePage.startYourSearchButton).click();
    cy.get(homePage.locationInput).type("Rome");
    cy.findByText("Rome, Italy").click();
    todayDate = new Date();
    startDate = new Date();
    endDate = new Date();
    startDate.setDate(todayDate.getDate() + 7);
    endDate.setDate(todayDate.getDate() + 14);
    startMonth = moment(startDate).format("MMM");
    endMonth = moment(endDate).format("MMM");
    (startMonth === endMonth) ?
      travelPeriod = `${startMonth} ${startDate.getDate()} – ${endDate.getDate()}`
      : travelPeriod = `${startMonth} ${startDate.getDate()} – ${endMonth} ${endDate.getDate()}`;
    nextMonth = 0;
    (startDate.getMonth() > todayDate.getMonth()) ? nextMonth++ : nextMonth;
    cy.get(homePage.calendarInput).eq(1 + nextMonth).findByText(startDate.getDate()).click({force: true});
    (endDate.getMonth() > startDate.getMonth()) ? nextMonth++ : nextMonth;
    cy.get(homePage.calendarInput).eq(1 + nextMonth).findByText(endDate.getDate()).click({force: true});
    cy.get(homePage.addGuestInput).click();
    cy.get(homePage.increaseAdultsButton).click();
    cy.get(homePage.increaseAdultsButton).click();
    cy.get(homePage.increaseChildrenButton).click();
    cy.get(homePage.searchButton).click();
  }
});
