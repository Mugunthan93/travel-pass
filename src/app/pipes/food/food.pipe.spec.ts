import { FoodPipe } from './food.pipe';

describe('FoodPipe', () => {
  it('create an instance', () => {
    const pipe = new FoodPipe();
    expect(pipe).toBeTruthy();
  });
});
