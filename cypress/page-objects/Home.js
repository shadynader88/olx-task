/// <reference types="cypress" />

class HomePage {
  startYourSearchButton = '[data-testid="little-search"]';
  locationInput = '[data-testid="structured-search-input-field-query"]';
  calendarInput = 'table[role*=presentation]';
  addGuestInput = '[data-testid="structured-search-input-field-guests-button"]';
  increaseAdultsButton = '[data-testid="stepper-adults-increase-button"]';
  increaseChildrenButton = '[data-testid="stepper-children-increase-button"]';
  searchButton = '[data-testid="structured-search-input-search-button"]';
}

export default HomePage;
