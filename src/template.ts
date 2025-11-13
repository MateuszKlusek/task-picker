// This file is auto-generated during build
// Do not edit manually

export const EMBEDDED_TEMPLATE = `shell: /bin/zsh

filesSearchInclude:
  - package.json
  - Taskfile.yaml
  - Taskfile.yml

userCommands:
  - command: ls
    workDir: ./
    label: list files
    runner: ''
  - command: run test  
    workDir: ./
    label: run test
    runner: 'npx'

patternExec:
  - include: "./src/**/*.ts"
    exclude: "**/*.test.ts"
    runner: 'npx tsx'
    label: run ts file in src
`;
