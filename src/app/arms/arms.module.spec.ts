import { ArmsModule } from './arms.module';

describe('ArmsModule', () => {
  let armsModule: ArmsModule;

  beforeEach(() => {
    armsModule = new ArmsModule();
  });

  it('should create an instance', () => {
    expect(armsModule).toBeTruthy();
  });
});
