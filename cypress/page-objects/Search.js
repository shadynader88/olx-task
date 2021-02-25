/// <reference types="cypress" />

class SearchPage {
  searchFilters = '[data-testid="little-search"] div:nth-child(2)';
  searchTitle = 'h1[tabindex="-1"]';
  infoText = '[class="_tmwq9g"] div:nth-child(3)';
}

export default SearchPage;
