import { DateFormatPipe } from './date-format.pipe';
import { TestBed } from '@angular/core/testing';

describe('DateFormatPipe', () => { afterEach(() => { TestBed.resetTestingModule(); });
  it('create an instance', () => {
    const pipe = new DateFormatPipe();
    expect(pipe).toBeTruthy();
  });
});

