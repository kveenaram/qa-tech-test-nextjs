import type { APIRequestContext } from '@playwright/test';

export class ImagesClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseURL: string = 'http://localhost:3000'
  ) {}

  async getAllImages(keyword?: string) {
    const url = new URL(`${this.baseURL}/api/images`);
    if (keyword) url.searchParams.append('keyword', keyword);
    return this.request.get(url.toString());
  }

  async createImage(imageData: {
    title: string;
    image: string;
    keywords: string[];
  }) {
    return this.request.post(`${this.baseURL}/api/images`, {
      data: imageData,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async deleteImage(imageId: string) {
    const url = new URL(`${this.baseURL}/api/images`);
    url.searchParams.append('id', imageId);
    return this.request.delete(url.toString());
  }
}