import { ImportlistModule } from './importlist.module';

describe('ImportlistModule', () => {
  let importlistModule: ImportlistModule;

  beforeEach(() => {
    importlistModule = new ImportlistModule();
  });

  it('should create an instance', () => {
    expect(importlistModule).toBeTruthy();
  });
});
