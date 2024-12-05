import OpenAI from "openai";
import { ChatCompletion } from "openai/resources/index.mjs";

const apiKey = process.env["OPENAI_API_KEY"];

export const getJobListings = async (dom: string) => {
  if (!apiKey) {
    const mock_data = [
      {
        title: "Web3 Blockchain Developer (Node.js)",
        url: "/remote-jobs/vcred-web3-blockchain-developer-node-js",
        posted_time: "2024-12-05T05:00:00Z",
      },
      {
        title: "Software Engineer",
        url: "/remote-jobs/overalls-software-engineer",
        posted_time: "2024-12-05T05:00:00Z",
      },
    ];
    return mock_data;
  }
  const client = new OpenAI({
    apiKey,
  });
  const chatCompletion: ChatCompletion = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Parse unstructured scraped data into a structured JSON format. Extract the 'jobtitle', 'url' (to view job details), and 'posted_time' fields. Ensure that 'posted_time' is no more than one day old.
          ---
          ### Steps
          1. **Input Analysis:**
             - Analyze the unstructured input data to locate key fields: 'jobtitle', 'url', and 'posted_time'.
             - Ensure data is complete and free of ambiguities for parsing.
          2. **Extraction Rules:**
             - Extract 'jobtitle': Look for the position's name or title.
             - Extract 'url': Identify and extract the URL that links to job details.
             - Extract 'posted_time': Parse and format the time data. Only include jobs posted within the last 24 hours.
          3. **Validation:**
             - Confirm the extracted 'jobtitle' and 'url' are not null or empty.
             - Validate 'posted_time' is within the required range.
          4. **Output Construction:**
             - Compile the extracted information into a structured JSON object for each job.
             - If no valid data is available, return an empty array or object.
          ---
          ### Output Format
          The output should be a JSON array where each entry contains the following fields:
          - 'jobtitle' (string): The title of the job.
          - 'url' (string): The link to view more details about the job.
          - 'posted_time' (string or ISO 8601 format): The time the job was posted, within the last 24 hours.
          Example:
          '''json
          [
            {
              "jobtitle": "Software Engineer",
              "url": "https://example.com/job/software-engineer",
              "posted_time": "2024-12-04T15:00:00Z"
            },
            {
              "jobtitle": "Data Analyst",
              "url": "https://example.com/job/data-analyst",
              "posted_time": "2024-12-04T18:00:00Z"
            }
          ]
          '''
          ---
          ### Notes
          - Handle edge cases where:
            - 'posted_time' is missing or cannot be parsed.
            - 'url' is incomplete or malformed.
            - Jobs posted more than one day ago should be excluded.
          - If data is ambiguous, return a log or error message specifying the issue.
          - Use ISO 8601 format for 'posted_time' to maintain consistency.`,
      },
      { role: "user", content: dom },
    ],
    // model: 'gpt-4o',
    model: "gpt-3.5-turbo",
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "Job Listings",
        description:
          "Job Lists with job title and url to go to job post that were posted within 1 day.",
        schema: {
          type: "array",
          title: String,
          url: String,
          posted_time: String,
        },
      },
    },
  });
  console.log(chatCompletion);
  return chatCompletion;
};

// getJobListing("");
