import React from 'react';
import {
  AppRegistry,
  View,
  Text,
  StyleSheet
} from 'react-native';

import Mapbox,{
  MapView
} from 'react-native-mapbox-gl';

import Api from './weather-api';

import TurfDistance from '@turf/distance';
import TurfHelper from '@turf/helpers';


Mapbox.setAccessToken('pk.eyJ1IjoibmlyYWJwdWRhc2FpbmkiLCJhIjoiOVRtcWxvTSJ9.Ubh6aFZDqx9HHYU1hPxH9Q');

var Weather = React.createClass({
  getInitialState: function(){
    return {
      markers: [{
          coordinates: [0,0],
          type: 'point',
          id: 'map-center'
      }],
      city: '',
      temperature: '',
      description: '',
      currentLocation: {
        latitude: 0,
        longitude: 0
      }
    };
  },
  render: function(){
    return <View style={styles.container}>
      <MapView style={styles.map}
        initialCenterCoordinate={{latitude:10.824006,longitude:106.627460}}
        initialZoomLevel={10}
        showUserLocation={true}
        onRegionDidChange={this.onRegionDidChange}
        annotations={this.state.markers}
        logoIsHidden={true}>
      </MapView>
      <View style={styles.textWrapper}>
        <Text style={styles.text}>
          {this.state.city}
        </Text>
        <Text style={styles.text}>
          {this.state.temperature}
        </Text>
        <Text style={styles.text}>
          {this.state.description}
        </Text>

      </View>
    </View>
  },
  onRegionDidChange: function(region){
    console.log(region);
    this.setState({
      markers: [{
        coordinates: [region.latitude,region.longitude],
        type: 'point',
        id: 'map-center'
      }]
    });
    if(region.zoomLevel > 7){
     var pointNow = TurfHelper.point([region.longitude, region.latitude]);
     var pointPrevious = TurfHelper.point([this.state.currentLocation.longitude, this.state.currentLocation.latitude])
     var distance = TurfDistance(pointNow, pointPrevious, 'kilometers');
     //console.log(distance);

     if (distance > 3){
     Api(region.latitude, region.longitude).then((data) => {
       //console.log(data);
       this.setState({
         currentLocation: {
           latitude: region.latitude,
           longitude: region.longitude
         }
       }
       );
    this.setState(data);
     });
   }
   }
  }
});

var styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF'
  },
  map: {
    flex: 2
  },
  textWrapper: {
    flex: 1,
    alignItems: 'center'
  },
  text: {
    fontSize: 30
  }

});

AppRegistry.registerComponent('weather', () => Weather);
