import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'twoDigitDay'
})
export class TwoDigitDayPipe implements PipeTransform {
  transform(value: number | null): string {
    if (value === null) {
      return '';
    }
    return value.toString().padStart(2, '0');
  }
}
