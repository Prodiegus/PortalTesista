import { TwoDigitDayPipe } from './two-digit-day.pipe';

describe('TwoDigitDayPipe', () => {
  let pipe: TwoDigitDayPipe;

  beforeEach(() => {
    pipe = new TwoDigitDayPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return two digits for numbers < 10', () => {
    expect(pipe.transform(5)).toBe('05');
    expect(pipe.transform(0)).toBe('00');
  });

  it('should return number as string for numbers >= 10', () => {
    expect(pipe.transform(10)).toBe('10');
    expect(pipe.transform(25)).toBe('25');
  });
});
