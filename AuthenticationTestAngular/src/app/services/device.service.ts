import { Injectable } from '@angular/core';
import { HostListener } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  public deviceWidth: number;
  public deviceType: string;

  constructor() {
    this.deviceWidth = window.innerWidth;
    this.deviceType = this.getDeviceType(this.deviceWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.deviceWidth = window.innerWidth;
    this.deviceType = this.getDeviceType(this.deviceWidth);
    console.log("Test")
  }

  private getDeviceType(width: number): string {
    console.log("asdf")
    if (width < 768) {
      return 'mobile';
    } else if (width >= 768 && width < 1024) {
      return 'tablet';
    } else {
      return 'laptop'; // or desktop if you want to add distinction
    }
  }
}
