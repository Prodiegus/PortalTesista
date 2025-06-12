import { TwoDigitDayPipe } from './two-digit-day.pipe';
import { TestBed } from '@angular/core/testing';

describe('TwoDigitDayPipe', () => { afterEach(() => { TestBed.resetTestingModule(); });
  it('create an instance', () => {
    const pipe = new TwoDigitDayPipe();
    expect(pipe).toBeTruthy();
  });
});

