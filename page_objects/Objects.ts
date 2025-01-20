import { Page, BrowserContext, Locator, expect } from '@playwright/test';

export class Objects {
    readonly page: Page;
    readonly fOneHeading: Locator;
    readonly fOneLink: Locator;
    readonly fOneResultsLink: Locator;
    readonly datepicker2023Link: Locator;
    readonly gpSelectorVegasLink: Locator;
    readonly gpSelectorAbuDhabiLink: Locator;
    readonly gpFullResultsLink: Locator;
    readonly firstDriverResultLbl: Locator;
    readonly secondDriverResultLbl: Locator;
    readonly thirdDriverResultLbl: Locator;
    readonly searchTxt: Locator;
    readonly searchInput: Locator;
    readonly searchBtn: Locator;
    readonly searchResult: Locator;
    readonly searchResultsport2023:Locator;

    constructor(page: Page) {
        this.page = page;
        this.fOneHeading = page.getByRole('heading', { name: 'Formula 1' });
        this.fOneLink = page.locator("//a/span[text() = 'Formula 1' and contains(@class, 'ssrcss-1u47p8g-LinkTextContainer')]");
        this.fOneResultsLink = page.locator("//a/span[text() = 'Results' and contains(@class, 'eis6szr1')]");
        this.datepicker2023Link = page.getByTestId("datepicker-date-link-2023");
        this.gpSelectorVegasLink = page.locator("//span[contains(text(), 'Las Vegas')]/parent::div/parent::button");//"//span[contains(text() , '19 November 2023')]");
        this.gpSelectorAbuDhabiLink = page.locator("//span[contains(text(), 'Abu Dhabi')]/parent::div/parent::button");
        this.gpFullResultsLink = page.locator("//a[@href = '/sport/formula1/2023/las-vegas-grand-prix/results']");
        this.firstDriverResultLbl = page.locator("//table[@aria-label = 'Race']//tr[1]/td[2]//span[@class = 'ssrcss-1hf3wfc-FullName e1dzfgvv0']");
        this.secondDriverResultLbl = page.locator("//table[@aria-label = 'Race']//tr[2]/td[2]//span[@class = 'ssrcss-1hf3wfc-FullName e1dzfgvv0']");
        this.thirdDriverResultLbl = page.locator("//table[@aria-label = 'Race']//tr[3]/td[2]//span[@class = 'ssrcss-1hf3wfc-FullName e1dzfgvv0']");        
        this.searchTxt = page.locator("//span[contains(text(), 'Search BBC')]");
        this.searchInput = page.getByPlaceholder('Search the BBC');
        this.searchBtn = page.getByRole('button', { name: 'Search' });
        this.searchResult = page.getByTestId("default-promo");
        this.searchResultsport2023 = page.locator("//div[@data-testid = 'default-promo']//span[contains(text(),'2023') and contains(text(),'sport')]");
        
    }

    async navToURL(url: string): Promise<void> {
        await this.page.goto(url, {timeout: 60000, waitUntil: 'commit'});
    }

    async navToGpResults(): Promise<void>{
         // Navigate to Las Vegas 2023 Results.
        await this.fOneLink.click();
        
        // Expect a title "to contain" a substring.
        await expect(this.fOneHeading).toBeVisible();
        
        //Click through to full results
        await this.fOneResultsLink.click();
        await this.datepicker2023Link.click();
        await this.page.waitForTimeout(3000);
        await expect(this.gpSelectorVegasLink).toBeVisible();
        await this.gpSelectorVegasLink.click({force:true});
        await this.gpFullResultsLink.click();
    }

    async search(text: string): Promise<void>{
        //Perform search action
        await this.searchTxt.click();
        await this.searchInput.fill(text);
        await this.searchBtn.click();
        //Verify successful search
        await expect(this.searchResult.first()).toBeVisible();
    }

    async verifyRelevantResults() {
        await expect.poll(async () => this.searchResultsport2023.count()).toBeGreaterThan(3);
    }

    async attachScreenshot(): Promise<Buffer>{
        const screenshot = await this.page.screenshot();
        return screenshot;
    }
}