import puppeteer from "puppeteer";
// import { getFilteredDOM } from "../get_specific_dom";

export const getJobDetails = async (jobPostUrl: string) => {
  // const jobDetail = await getFilteredDOM(jobPostUrl);
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  try {
    await page.goto(jobPostUrl, { waitUntil: "domcontentloaded" });
    // console.log(jobDetail);
    const innerText = await page.evaluate(() => {
      const innerText = document.querySelector("body")?.innerText;
      return innerText;
    });
    console.log(innerText);
  } catch (e) {
    console.log(e);
  } finally {
    await browser.close();
  }
};
