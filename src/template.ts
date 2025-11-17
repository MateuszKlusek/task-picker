// This file is auto-generated during build
// Do not edit manually

export const EMBEDDED_TEMPLATE = `shell: /bin/zsh

userCommandsExec:
  - command: ls
    workDir: ./
    label: list files
    runner: ''
  - command: run test
    workDir: ./
    label: run test
    runner: npx

packageJsonExec:
    include: ./**/package.json
    exclude: node_modules
    
patternExec:
  - include: ./src/**/*.ts
    exclude: '**/*.test.ts'
    runner: npx tsx
    label: run ts file in src

fzfConfig:
    height: 50%`;
