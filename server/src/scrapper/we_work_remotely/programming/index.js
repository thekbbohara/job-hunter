// go to https://weworkremotely.com/categories/remote-full-stack-programming-jobs#job-listings
// scrape todays joblisting detail and the href to that job details in an array
// loop over all the post
// - go to job detail and send details to ai
//  - if apply email is given expect -> {jobDeatiails:String , applyEmail:String}
//  -else expect a url for applying -> {jobDetails:String , applyUrl:string}
//    - go to apply url cheak is applyEmail available if available return applyEmail:String
//    - else check if it is a form to apply and if yes return applyFormUrl:String
// save the details in db and scrape next
