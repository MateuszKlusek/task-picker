import type { TestProject } from "vitest/node";

export default async function testSetup(project: TestProject) {
  console.log("test-setup");

  project.provide("ctx", {
    value: "Matusz",
  });

  return async () => {
    console.log("[teardown] cleaning test directory...");
  };
}
