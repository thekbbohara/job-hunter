import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "job-hunter" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return <div>Job-hunter</div>;
}
