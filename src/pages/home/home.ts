import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';

import {Addweather} from '../addweather/addweather';
import {Openweather} from '../../providers/openweather';
import {Forecast} from '../forecast/forecast';
import {Observable} from 'rxjs/Observable';
import {Geolocation} from 'ionic-native';
import {Storage} from '@ionic/storage';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  weatherList = [];
  LocalWeather;
  localForecastList = [];
  forecastList = [];

  myslideoptions = {pager:true, initialSlide:0}

  constructor(public navCtrl: NavController, public modalCtrl : ModalController,
     public weather : Openweather, public storage : Storage) {

       this.storage.set("Name", "Hyunseon Ahn");
       this.storage.get("Name").then(
         value => console.log(value)
       );

       this.storage.get("weathers").then(
         (value) => {
           this.weatherList = JSON.parse(value) || [];//왼쪽 null일때 오른쪽.
           // JSON.parse(value);
         },
         (err) => console.log(err)
       )
       this.storage.get("forecasts").then(
         (value) => {
           this.forecastList = JSON.parse(value) || [];
         }
       )
    Geolocation.getCurrentPosition().then(
      (resp) => {
        this.weather.getWeatherByLocation(resp.coords.latitude, resp.coords.longitude)
        .map( data => data.json() )
        .subscribe((data) => {
          this.LocalWeather = data;
          this.viewLocalForecast(this.LocalWeather);
        })
      }
    );

  }
  addWeather() {
     let m = this.modalCtrl.create(Addweather);
     m.onDismiss( (data) => {
       this.getWeather(data.city, data.country);
     })
     m.present();
  }
  viewLocalForecast(weather) {
    this.weather.getForecastByCityId(weather.id)
    .map( data => data.json() )
    .subscribe(
      data => {
        this.localForecastList = data.list;
      });
  }
  viewForecast(weatherIndex) {
    let currentWeather = this.weatherList[weatherIndex];
    this.weather.getForecastByCityId(currentWeather.id)
    .map( data => data.json() )
    .subscribe(
      data => {
        this.forecastList.push(data.list);
        this.storage.set("forecasts", JSON.stringify(this.forecastList));
      });
      console.log(this.forecastList)
  }
  getCurrentForecast(weather) {
    return this.forecastList[this.weatherList.indexOf(weather)];
  }

  getWeather( city: string, country:string ) {
    this.weather.getWeatherByCity(city, country )
    .map( data => data.json() )
    .subscribe(
      data=> {
        this.weatherList.push(data);
        this.viewForecast(this.weatherList.indexOf(data));
        this.storage.set("weathers", JSON.stringify(this.weatherList));
      },
      err=> console.log(err)
    );
    }

    remove(weather) {
      this.weatherList.splice(this.weatherList.indexOf(weather), 1);
      this.forecastList.splice(this.weatherList.indexOf(weather), 1);
      this.storage.set("weathers", JSON.stringify(this.weatherList));
      this.storage.set("forecasts", JSON.stringify(this.forecastList));
    }

  }
