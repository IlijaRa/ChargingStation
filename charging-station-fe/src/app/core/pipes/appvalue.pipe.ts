import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'appvalue' })
export class AppValuePipe implements PipeTransform {
  transform(value: any): any {
    return (value != undefined && value.toString().trim() != '' ? value : '*');
  }
}