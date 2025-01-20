import { test, expect, APIRequestContext} from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import Ajv from "ajv";

// Load api data from JSON file
let apiData, apiContext: APIRequestContext;
const testDataDir = path.resolve(__dirname, "../data", "apidata.json");
const schemaDir = path.resolve(__dirname, "../data", "schema.json");

try 
{
  const rawData = fs.readFileSync(testDataDir, "utf8");
  apiData = JSON.parse(rawData);
} catch (error) 
{
  console.error("Error reading api test data", error);
  // Exit the process with an error code
  process.exit(1); 
}

test.beforeAll(async ({ playwright }) => {
    // Create a context that will issue http requests.
    apiContext = await playwright.request.newContext({
    baseURL: apiData.baseurl,
    extraHTTPHeaders: {
        'Content-Type': 'application/json' 
    }
  });
});

test.afterAll(async ({ }) => {
    // Dispose all responses.
    await apiContext.dispose();
});

test.describe("As a consumer of the API, I want to validate the schema", { tag: ['@be'] }, () => {
  test('Schema Validation', async ({ request }, testInfo) => {
      const rsp = await apiContext.get("all"); 
      const ajv = new Ajv({ allErrors: false });

      await expect(rsp.ok()).toBeTruthy();
      const body = await rsp.json();

      await testInfo.attach(JSON.stringify(body), {contentType: 'application/json'});
      // Validate the response against the schema file
      const valid = ajv.validate(require(schemaDir), body);
      // Output the errors text
      if (!valid) {
        console.error('AJV Validation Errors:', ajv.errorsText());
      }

     // If the JSON is valid, the variable is "true"
      expect.soft(valid).toBe(true);
  });
});

test.describe("As a map builder, I want to confirm that there are 195 countries", { tag: ['@be'] }, () => {
  test('Validate Total Countries', async ({ request }, testInfo) => {
      const rsp = await apiContext.get("all");
      
      await expect(rsp.ok()).toBeTruthy();
      const body = await rsp.json();

      await testInfo.attach(JSON.stringify(body), {contentType: 'application/json'});
      
      const count = body.length;
      await expect.soft(count).toBe(195);
  });
});

test.describe("As the Minister of Education, I want to ensure that South African Sign Language (SASL)", { tag: ['@be'] }, () => {
  test('Validate SASL Language', async ({ request }, testInfo) => {
      const rsp = await apiContext.get("name/south africa?fullText=true");
      
      await expect(rsp.ok()).toBeTruthy();
      const body = await rsp.text();

      await testInfo.attach(JSON.stringify(body), {contentType: 'application/json'});

      await expect(body).toContain(apiData.languageKey);
  });
});