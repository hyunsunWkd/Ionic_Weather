import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Openweather } from '../../providers/openweather';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
/*
  Generated class for the Forecast page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-forecast',
  templateUrl: 'forecast.html'
})
export class Forecast {
  forecastList = [];
  cityId: string;
  constructor(public navCtrl: NavController, public weather : Openweather, public navParams : NavParams) {
    this.cityId = this.navParams.get("cityID");
    this.getForecast(this.cityId);
  }

  ionViewDidLoad() {
    console.log('Hello Forecast Page');
  }

  getForecast(city: string) {
    this.weather.getForecastByCityId(city)
    .map( data => data.json() )
    .subscribe(
      data => {
        this.forecastList = data.list;
      });
  }

}
