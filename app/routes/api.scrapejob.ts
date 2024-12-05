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
import { getFilteredDOM, getJobListings } from "~/lib/scrapper";

export const action: ActionFunction = async () => {
  // const jobLists: { url: string; title: string }[] = [
  //   {
  //     title: "remote-full-stack-programming-jobs",
  //     url: "https://weworkremotely.com/categories/remote-full-stack-programming-jobs",
  //   },
  //   {
  //     title: "remote-front-end-programming-jobs",
  //     url: "https://weworkremotely.com/categories/remote-front-end-programming-jobs",
  //   },
  //   {
  //     title: "remote-back-end-programming-jobs",
  //     url: "https://weworkremotely.com/categories/remote-back-end-programming-jobs",
  //   },
  // ];
  const jobLists: { url: string; title: string }[] = [
    {
      title: "remote-full-stack-programming-jobs",
      url: "https://weworkremotely.com/categories/remote-full-stack-programming-jobs",
    },
  ];
  try {
    // Use Promise.all to fetch all URLs concurrently and return their results.
    const results = await Promise.all(
      jobLists.map(async (job: { url: string; title: string }) => {
        const dom = await getFilteredDOM(job.url);
        if (dom) {
          const jobLists: {
            title: string;
            url: string;
            posted_time: string;
          }[] = await getJobListings(dom);
          console.log(jobLists);
        }
        return { url: job.url, jobTitle: job.title, dom: dom || null };
      })
    );
    return new Response(JSON.stringify({ err: null, results }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing job URLs:", error);
    return new Response(JSON.stringify({ err: "Failed to process job URLs" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
