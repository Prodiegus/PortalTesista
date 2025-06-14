import { ExtractTimePipe } from './extract-time.pipe';

describe('ExtractTimePipe', () => {
  let pipe: ExtractTimePipe;

  beforeEach(() => {
    pipe = new ExtractTimePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null/undefined/empty', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(null as any)).toBe('');
    expect(pipe.transform(undefined as any)).toBe('');
  });

  it('should transform ISO time to 12-hour format (AM)', () => {
    const input = '2024-06-13T08:15:00.000Z';
    const result = pipe.transform(input);
    expect(result).toBe('8:15 am');
  });

  it('should transform ISO time to 12-hour format (PM)', () => {
    const input = '2024-06-13T13:45:00.000Z';
    const result = pipe.transform(input);
    expect(result).toBe('1:45 pm');
  });

  it('should transform midnight (00:00) to 12:00 am', () => {
    const input = '2024-06-13T00:00:00.000Z';
    const result = pipe.transform(input);
    expect(result).toBe('12:00 am');
  });

  it('should zero-pad minutes when needed', () => {
    const input = '2024-06-13T09:03:00.000Z';
    const result = pipe.transform(input);
    expect(result).toBe('9:03 am');
  });
});

