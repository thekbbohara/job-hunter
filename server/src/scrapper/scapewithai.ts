
// go to https://weworkremotely.com/categories/remote-full-stack-programming-jobs#job-listings
// scrape todays joblisting detail and the href to that job details in an array
// loop over all the post
// - go to job detail and send details to ai
//  - if apply email is given expect -> {jobDeatiails:String , applyEmail:String}
//  -else expect a url for applying -> {jobDetails:String , applyUrl:string}
//    - go to apply url cheak is applyEmail available if available return applyEmail:String
//    - else check if it is a form to apply and if yes return applyFormUrl:String
// save the details in db and scrape next

import puppetter from "puppeteer";

// export const getFullDOM = async (url:string) => {
//   const browser = await puppetter.launch({ headless: false });
//   const page = await browser.newPage();
//   // Set screen size.
//   await page.setViewport({width: 1080, height: 1024});

//   try {
//     // Navigate to the URL
//     await page.goto(url, { waitUntil: "load", timeout: 0 });

//     // Get the entire body HTML
//     const fullDOM = await page.evaluate(() => document.documentElement.outerHTML);
//     return fullDOM;
//   } catch (error) {
//     console.error("Error fetching DOM:", error);
//   } finally {
//     await browser.close();
//   }
// };



const getSpecificDOM = async (url: string) => {
  const browser = await puppetter.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Navigate to the URL
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Extract specific elements: body > div, body > main, or body > section
    const specificDOM = await page.evaluate(() => {
      // Remove unwanted elements (navbar, scripts, etc.)
      const unwantedSelectors = ['nav', 'script', 'footer', 'style', 'img', 'header','link'];

      // Remove unwanted elements from the DOM
      unwantedSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });

      // More selective attribute removal
      const elementsToClean = document.querySelectorAll('body *');
      elementsToClean.forEach(el => {
        // Only remove specific attributes that are likely to be unnecessary
        const attributesToRemove = ['class', 'id', 'style','loading','alt', 'data-*', 'aria-*'];

        attributesToRemove.forEach(attr => {
          if (attr.includes('*')) {
            // Handle wildcard attributes (like data-* and aria-*)
            Array.from(el.attributes)
              .filter(attribute => attribute.name.startsWith(attr.replace('*', '')))
              .forEach(attribute => el.removeAttribute(attribute.name));
          } else {
            // Remove specific attributes
            el.removeAttribute(attr);
          }
        });
      });

      // Select the desired elements and return the cleaned HTML
      const selectors = ["body > div", "body > main", "body > section"];
      return selectors
        .map(selector => {
          const element = document.querySelector(selector);
          return element ? element.outerHTML : null;
        })
        .filter(Boolean)
        .join("\n");
    });

    console.log(specificDOM); // Print specific DOM content
    return specificDOM;
  } catch (error) {
    console.error("Error fetching specific DOM:", error);
    return null;
  } finally {
    await browser.close();
  }
};

export const scrapeWithAi = async (url: string) => {
  const dom = await getSpecificDOM(url);
  if (!dom) {
    console.log("No DOM content found.");
    return;
  }

  console.log("Extracted DOM:", dom);
  // send the DOM to AI to extract job listings details (like href, apply email, etc.)
  // further AI processing can be done here
};
