import { Page } from "@playwright/test";

/**
 * Method to click on the button by its visible text
 * 
 * @param page 
 * @param buttonText 
 */
async function clickButton(page: Page, buttonText: string): Promise<void> {
    await page.getByRole('button', { name: buttonText }).click()
}


/**
 * Method to click on the button by its visible text
 * 
 * @param page 
 * @param buttonText 
 */
async function clickLink(page: Page, linkText: string): Promise<void> {
    await page.getByRole('link', { name: linkText }).click()
}

export { clickButton, clickLink }