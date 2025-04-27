import { test, expect } from '@playwright/test';
import { ImagesClient } from '../../api/ImagesClient';

test.describe('GET /api/images Tests', () => {
  let imagesClient: ImagesClient;

  test.beforeEach(async ({ request }) => {
    imagesClient = new ImagesClient(request);
  });

  test('Should retrieve all images', async () => {
    const response = await imagesClient.getAllImages();
    expect(response.status()).toBe(200);
    
    const images = await response.json();
    expect(images.length).toBeGreaterThan(0);
  });

  test('Should filter images with valid keyword', async () => {
    const keyword = 'mountains'; 
    const response = await imagesClient.getAllImages(keyword);
    
    expect(response.status()).toBe(200);
    const images = await response.json();
    
   // Verify matching results
    const mountainImages = images.filter((img: any) => 
      img.keywords.includes(keyword) || 
      img.title.toLowerCase().includes(keyword)
    );
    
    expect(mountainImages.length).toBeGreaterThan(0);
    
    // Verify specific properties of the mountains image
    const mountainImage = images.find((img: any) => img.id === 'data_id_2');
    expect(mountainImage).toEqual({
      id: 'data_id_2',
      title: 'Mountains',
      image: expect.any(String),
      keywords: ['mountains', 'snow', 'cold'],
      uploadDate: expect.any(String)
    });
  });
});