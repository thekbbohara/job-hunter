// go to https://weworkremotely.com/categories/remote-full-stack-programming-jobs#job-listings
// scrape todays joblisting detail and the href to that job details in an array
// loop over all the post
// - go to job detail and send details to ai
//  - if apply email is given expect -> {jobDeatiails:String , applyEmail:String}
//  -else expect a url for applying -> {jobDetails:String , applyUrl:string}
//    - go to apply url cheak is applyEmail available if available return applyEmail:String
//    - else check if it is a form to apply and if yes return applyFormUrl:String
// save the details in db and scrape next

import { ActionFunction } from "@remix-run/node";
import { getFilteredDOM } from "~/lib/scrapper";

export const action: ActionFunction = async ({ request }) => {
  console.log({ request });
  const jobListUrls: string[] = [
    "https://weworkremotely.com/categories/remote-full-stack-programming-jobs#job-listings",
  ];

  try {
    // Use Promise.all to fetch all URLs concurrently and return their results.
    const results = await Promise.all(
      jobListUrls.map(async (jobUrl) => {
        const dom = await getFilteredDOM(jobUrl);
        return { url: jobUrl, dom: dom || null };
      })
    );

    return new Response(JSON.stringify({ results }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing job URLs:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process job URLs" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
