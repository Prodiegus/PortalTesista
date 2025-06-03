import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {HttpRequestService} from './Http-request.service';

describe('HttpRequestService', () => {
  let service: HttpRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpRequestService],
    });
    service = TestBed.inject(HttpRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
