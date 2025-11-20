// This file is auto-generated during build
// Do not edit manually

export const EMBEDDED_TEMPLATE = `shell: /bin/zsh

userCommandsExec:
  - command: ls
    relativePath: ./
    label: list files
    runner: ''
  - command: run test
    relativePath: ./
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
    windowHeight: 50%
    previewWindow:
      direction: right
      percentage: 50%`;
