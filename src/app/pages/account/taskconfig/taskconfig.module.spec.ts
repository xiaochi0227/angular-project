import { TaskconfigModule } from './taskconfig.module';

describe('TaskconfigModule', () => {
  let taskconfigModule: TaskconfigModule;

  beforeEach(() => {
    taskconfigModule = new TaskconfigModule();
  });

  it('should create an instance', () => {
    expect(taskconfigModule).toBeTruthy();
  });
});
