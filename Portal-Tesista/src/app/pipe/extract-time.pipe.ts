import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extractTime'
})
export class ExtractTimePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Extract the time part from the ISO string
    const [timePart] = value.split('T')[1].split('.');
    const [hours, minutes] = timePart.split(':').map(Number);

    const ampm = hours >= 12 ? 'pm' : 'am';
    const adjustedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${adjustedHours}:${minutesStr} ${ampm}`;
  }
}
