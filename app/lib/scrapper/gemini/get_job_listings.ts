import {
  GenerationConfig,
  GoogleGenerativeAI,
  SchemaType,
} from "@google/generative-ai";

const systemInstruction = `Parse unstructured scraped data into a structured JSON format. Extract the 'jobtitle', 'url', 'posted_time', and 'job_type' fields. Ensure 'posted_time' is no older than one day.
---
### Steps:
1. **Input Analysis:**
   - Identify key fields: 'job_title', 'url', 'posted_time', and 'job_type'.
   - Check data for completeness and clarity.
2. **Extraction Rules:**
   - 'job_title': Look for recognizable job titles.
   - 'url': Extract valid links leading to job details.
   - 'posted_time': Ensure parsed dates are within the last 24 hours.
   - 'job_type': Extract and map to one of the allowed job types: "full-time", "part-time", "contract", "temporary", "internship".
3. **Validation:**
   - Confirm 'job_title', 'url', and 'job_type' are not empty.
   - Validate 'posted_time' is within range and correctly formatted.
   - Ensure 'job_type' matches one of the predefined enumerated values.
4. **Output Construction:**
   - Structure data into a JSON array with each job's information.
   - Return an empty array if no valid data is found.
---
### Output Format:
JSON array where each entry contains:
- 'job_title' (string): Job title.
- 'url' (string): Job details link.
- 'posted_time' (string in hr format): Posting time, within the last 24 hours.
- 'job_type' (enum): One of ["full-time", "part-time", "contract", "temporary", "internship"].
Example:
[
  {
    "job_title": "Software Engineer",
    "url": "https://example.com/job/software-engineer",
    "posted_time": "24hr",
    "job_type": "full-time"
  },
  {
    "job_title": "Data Analyst",
    "url": "https://example.com/job/data-analyst",
    "posted_time": "11hr",
    "job_type": "contract"
  }
]
---
### Notes:
- Handle missing or malformed 'posted_time', 'url', and 'job_type' gracefully.
- Use hr format for 'posted_time' consistency.
- Exclude data older than one day.
- Log ambiguities or errors for debugging.
`;
const apiKey = process.env["GEMINI_API_KEY"];
const mock_data = [
  {
    job_title: "Web3 Blockchain Developer (Node.js)",
    url: "/remote-jobs/vcred-web3-blockchain-developer-node-js",
    posted_time: "01hr",
  },
  {
    job_title: "Software Engineer",
    url: "/remote-jobs/overalls-software-engineer",
    posted_time: "20hr",
  },
];
const schema = {
  description: "List of jobs",
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      job_title: {
        type: SchemaType.STRING,
        description: "Title of the job",
        nullable: false,
      },
      url: {
        type: SchemaType.STRING,
        description: "URL to got to the job detail.",
        nullable: false,
      },
      posted_time: {
        type: SchemaType.STRING,
        description: "Job posted time in hour ago format.",
        nullable: false,
      },
      job_type: {
        type: SchemaType.STRING,
        description: `Type of the job: One of ["full-time", "part-time", "contract", "temporary", "internship"].`,
        nullable: false,
      },
    },
    required: ["job_title", "url"],
    example: {
      response: [
        {
          job_title: "Senior Shopify Developer (remote)",
          url: "/remote-jobs/storetasker-senior-shopify-developer-remote-flexible-3",
          posted_time: "11h",
          job_type: "remote",
        },
        {
          job_title: "Software Engineer",
          url: "https://example.com/job/software-engineer",
          posted_time: "13hr",
          job_type: "full-time",
        },
        {
          job_title: "Data Analyst",
          url: "https://example.com/job/data-analyst",
          posted_time: "09hr",
          job_type: "contract",
        },
      ],
    },
  },
};
export const getJobListings = async (
  dom: string
): Promise<{ job_title: string; url: string; posted_time: string }[]> => {
  if (!apiKey) {
    return mock_data;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const generationConfig: GenerationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8189,
    responseMimeType: "application/json",
    responseSchema: schema,

    // },
  };
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction,
    generationConfig,
  });
  const result = await model.generateContent(dom);
  console.log(result);
  console.log(result.response.text());
  return mock_data;
};
