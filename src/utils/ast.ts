import { Project, ScriptTarget } from 'ts-morph';

const project = new Project({
  compilerOptions: {
    target: ScriptTarget.ESNext,
  },
});

export function getSourceFile(filePath: string) {
  return project.addSourceFileAtPathIfExists(filePath);
}
