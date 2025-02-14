import { Page, Locator } from '@playwright/test';

export class ImageGalleryPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly imagecardTitles: Locator;
  readonly imageCardSubtitles: Locator; 
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
        this.imagecardTitles = page.locator('.css-1sdhmys-MuiImageListItemBar-title');
        this.imageCardSubtitles = page.locator('.MuiImageListItemBar-subtitle');
        this.firstImage = this.imageListItems.first().locator('img.MuiImageListItem-img');
        this.firstImageTitle = this.imageListItems.first().locator('.css-1sdhmys-MuiImageListItemBar-title');
        this.firstImageKeywords = this.imageListItems.first().locator('div.MuiImageListItemBar-subtitle');
    }

    async goto() {
        await this.page.goto('http://localhost:3000');
    }

    async getImages() {
        return this.page.$$('.MuiImageListItem-img');
    }

    async getCardTitles() {
        return await this.imagecardTitles.allInnerTexts();
    }

    async getImageKeywords() {
        return await this.imageCardSubtitles.allInnerTexts();
    }

    async searchFor(text: string) {
        await this.searchInput.fill(text);
        await this.searchInput.press('Enter');
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