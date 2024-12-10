import puppeteer from "puppeteer";

export const getFilteredDOM = async (url: string): Promise<string | null> => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Navigate to the URL
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Extract specific elements
    const specificDOM = await page.evaluate(() => {
      // Unwanted selectors
      const unwantedSelectors = [
        "nav",
        "script",
        "noscript",
        "footer",
        "style",
        "img",
        "header",
        "link",
      ];

      // console.log("innertext", document.querySelector("body")?.innerText);
      // Remove unwanted elements from the DOM
      unwantedSelectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => el.remove());
      });

      // Clean elements by removing specific attributes
      const elementsToClean = document.querySelectorAll("body *");
      elementsToClean.forEach((el) => {
        const attributesToRemove = ["class", "id", "style", "loading", "alt"];
        attributesToRemove.forEach((attr) => el.removeAttribute(attr));
        // Remove wildcard attributes
        Array.from(el.attributes)
          .filter((attribute) =>
            ["data-", "aria-"].some((prefix) =>
              attribute.name.startsWith(prefix)
            )
          )
          .forEach((attribute) => el.removeAttribute(attribute.name));
      });

      // Select and return desired elements
      const selectors = ["body > div", "body > main", "body > section"];
      const selectedDom = selectors
        .map((selector) => {
          const element = document.querySelector(selector);
          return element ? element.outerHTML : null;
        })
        .filter(Boolean)
        .join("\n");
      let filteredDom = selectedDom.replaceAll("<div>", "");
      filteredDom = filteredDom.replaceAll("</div>", "");
      filteredDom = filteredDom.replaceAll("<span>", "");
      filteredDom = filteredDom.replaceAll("</span>", "");
      filteredDom = filteredDom.replaceAll("<li>", "<>");
      filteredDom = filteredDom.replaceAll("</li>", "</>");
      return filteredDom || null;
    });

    return specificDOM;
  } catch (error) {
    console.error("Error fetching specific DOM:", error);
    return null;
  } finally {
    await browser.close();
  }
};
//
// console.log(
//   getFilteredDOM(
//     "https://weworkremotely.com/categories/remote-full-stack-programming-jobs#job-listings"
//   )
// );
