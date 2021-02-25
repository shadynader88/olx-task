/// <reference types="cypress" />

class SearchPage {
  searchFilters = '[data-testid="little-search"] div:nth-child(2)';
  searchTitle = 'h1[tabindex="-1"]';
  infoText = '[class="_tmwq9g"] > [style="margin-top: 9px;"]';
  increaseBedroomsButton = '[data-testid="filterItem-rooms_and_beds-stepper-min_bedrooms-0-increase-button"]';
  moreFilters = '[data-testid="menuItemButton-dynamicMoreFilters"]';
  poolCheckbox = '[data-testid="filterItem-facilities-checkbox-amenities-7"] span:nth-child(1)';
  showStaysButton = '[data-testid="more-filters-modal-submit-button"]';
  listItem = '[class="_gjfol0"]';
}

export default SearchPage;
