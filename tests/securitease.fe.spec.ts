import { test, expect} from '@playwright/test';
import { Objects } from '../page_objects/Objects';
import * as path from 'path';
import * as fs from 'fs';

// Load test data from JSON file
let testData;
const testDataDir = path.resolve(__dirname, "../data", "testdata.json");

try 
{
  const rawData = fs.readFileSync(testDataDir, "utf8");
  testData = JSON.parse(rawData);
} catch (error) 
{
  console.error("Error reading test data", error);
  // Exit the process with an error code
  process.exit(1); 
}

test.beforeEach("Initial Setup", async ({ page }) => {
  // Sets a 60-second timeout for all tests
  test.setTimeout(60000);
  const obj_page = new Objects(page);
  await obj_page.navToURL(testData.baseurl);
});

test.afterEach('Test Teardown', async ({ page }) => {
  //Close page after each test
  await page.close();
});

test.describe("As a BBC editor, I want to report on the top 3 finishers", { tag: ['@fe'] }, () => {
  test('Validate Las Vegas GP Results', async ({ page }, testInfo) => {
    const obj_page = new Objects(page);

    //Open browser + base URL
    await obj_page.navToURL(testData.baseurl);
    
    //Navigate to GP Results
    await obj_page.navToGpResults();
  
    //Assert results
    await expect.soft(obj_page.firstDriverResultLbl).toContainText(testData.firstDriver);
    await expect.soft(obj_page.secondDriverResultLbl).toContainText(testData.secondDriver);
    await expect.soft(obj_page.thirdDriverResultLbl).toContainText(testData.thirdDriver);

    //Screenshot
    const sc = await obj_page.attachScreenshot();
    await testInfo.attach('las_vegas_GP_results', { body: sc, contentType: 'image/png' });
  });
});

test.describe("As a BBC editor, I want to search for sport in 2023", { tag: ['@fe'] }, () => {
  test('Validate Search Results', async ({ page }, testInfo) => {
    const obj_page = new Objects(page);
    
    //Search
    await obj_page.search(testData.searchQuery);

    //Verify atleast 4 relevant search results
    await obj_page.verifyRelevantResults();
    
    //Screenshot
    const sc = await obj_page.attachScreenshot();
    await testInfo.attach('search_results', { body: sc, contentType: 'image/png' });
  });
});