import { EntinfoModule } from './entinfo.module';

describe('EntinfoModule', () => {
  let entinfoModule: EntinfoModule;

  beforeEach(() => {
    entinfoModule = new EntinfoModule();
  });

  it('should create an instance', () => {
    expect(entinfoModule).toBeTruthy();
  });
});
