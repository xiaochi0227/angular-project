import { UserrightsModule } from './userrights.module';

describe('UserrightsModule', () => {
  let userrightsModule: UserrightsModule;

  beforeEach(() => {
    userrightsModule = new UserrightsModule();
  });

  it('should create an instance', () => {
    expect(userrightsModule).toBeTruthy();
  });
});
