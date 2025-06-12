import { ExtractTimePipe } from './extract-time.pipe';
import { TestBed } from '@angular/core/testing';

describe('ExtractTimePipe', () => { afterEach(() => { TestBed.resetTestingModule(); });
  it('create an instance', () => {
    const pipe = new ExtractTimePipe();
    expect(pipe).toBeTruthy();
  });
});

