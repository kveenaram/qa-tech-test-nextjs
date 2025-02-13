import { Page, Locator } from '@playwright/test';

export class ImageGalleryPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly filterDropdown: Locator;
  readonly imageListItems: Locator;
  readonly firstImage: Locator;
  readonly firstImageTitle: Locator;
  readonly firstImageKeywords: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchInput = this.page.getByPlaceholder('Search');
        this.filterDropdown = this.page.getByRole('combobox');
        this.imageListItems = page.locator('li.MuiImageListItem-root');
        this.firstImage = this.imageListItems.first().locator('img.MuiImageListItem-img');
        this.firstImageTitle = this.imageListItems.first().locator('div.MuiImageListItemBar-title');
        this.firstImageKeywords = this.imageListItems.first().locator('div.MuiImageListItemBar-subtitle');
      }
    
      async navigate() {
        await this.page.goto('/');
      }
    
      async search(keyword: string) {
        await this.searchInput.fill(keyword);
        await this.page.keyboard.press('Enter');
      }
    
      async filterByCategory(category: string) {
        await this.filterDropdown.selectOption(category);
      }

      async getFirstImageTitle() {
        return await this.firstImageTitle.textContent();
      }

      async getFirstImageKeywords() {
        return await this.firstImageKeywords.textContent();
      }
    }