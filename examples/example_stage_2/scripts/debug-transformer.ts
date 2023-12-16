import { transformer } from 'cheap-di-ts-transform';
import { stat } from 'fs/promises';
import path from 'path';
import ts from 'typescript';
import tsconfig from '../tsconfig.json';

(async () => {
  const filePath = path.join(__dirname, '..', 'src', 'index.ts');

  const { options: compilerOptions } = ts.convertCompilerOptionsFromJson(tsconfig.compilerOptions, '.');

  const fileStats = await stat(filePath);
  if (!fileStats.isFile()) {
    throw new Error(`file not found for path (${filePath})`);
  }

  const host = ts.createCompilerHost(compilerOptions);
  const program = ts.createProgram({
    host,
    options: compilerOptions,
    rootNames: [filePath],
  });

  const sourceFile = program.getSourceFile(filePath);
  if (!sourceFile) {
    throw new Error(`we can not to make SourceFile from a file (${filePath})`);
  }

  program.emit(undefined, undefined, undefined, undefined, {
    before: [transformer({ program })],
  });
})();
