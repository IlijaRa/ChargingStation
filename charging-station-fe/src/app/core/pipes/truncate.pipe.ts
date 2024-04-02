import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate' })

export class TruncatePipe implements PipeTransform {
    transform(value: any, limit = 50, completeWords = true, ellipsis = ' ...') {
        if (value != undefined && value.toString().trim() != '') {
            if (value.length > limit && completeWords) {
                limit = value.substring(0, limit).lastIndexOf(' ');
            }
            return value.length > limit ? value.substring(0, limit) + ellipsis : value;
        }
        return '';
    }
}