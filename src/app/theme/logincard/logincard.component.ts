import { Component, ViewChild, Input } from '@angular/core';
import { logo, fragmentmap, iillustration } from '../../images';
@Component({
    selector: 'app-logincard',
    styleUrls: ['./logincard.scss'],
    templateUrl: './logincard.html',
})
export class LoginCardComponent {
    logo: any = logo;
    fragmentmap: any = fragmentmap;
    iillustration: any = iillustration;
    @Input() title: String;
}
