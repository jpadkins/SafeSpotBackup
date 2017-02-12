$(document).ready(function() {
  var a1lat;
  var a1lng;
  var a2lat;
  var a2lng;

  var gMarkers = [],
    actualMarkers = [];
  gMarkers['safespots'] = [];
  gMarkers['crimes'] = [];


  /* gMarkers['crimes'] =[
       {lat: 32.842729, lng: -96.782967, title:'crime1', infoWindow: {content: "crime1"}, icon: 'red_exclamation_icon.png'},
       {lat: 32.813824, lng: -96.871948, title:'crime2', infoWindow: {content: "crime2"}, icon: 'red_exclamation_icon.png'},
       {lat: 32.839212, lng: -96.679687, title:'crime3', infoWindow: {content: "crime3"}, icon: 'red_exclamation_icon.png'},
       {lat: 32.839212, lng: -96.768951, title:'crime4', infoWindow: {content: "crime4"}, icon: 'red_exclamation_icon.png'},
       {lat: 32.839222, lng: -96.579687, title:'crime5', infoWindow: {content: "crime3"}, icon: 'red_exclamation_icon.png'},
       {lat: 32.840729, lng: -96.789967, title:'crime6', infoWindow: {content: "crime1"}, icon: 'red_exclamation_icon.png'},
       {lat: 32.842729, lng: -96.082967, title:'crime7', infoWindow: {content: "crime1"}, icon: 'red_exclamation_icon.png'}
   ];*/


  //-----------DECLARE MAP------------

  var map = new GMaps({
    el: '#map',
    lat: -12.043333,
    lng: -77.028333,
    zoom: 17,
    zoomControl: true,
    zoomControlOpt: {
      style: 'SMALL',
      position: 'TOP_LEFT'
    }
  });

  //1.) LOCATE CURRENT POSITION, CENTER MAP

  GMaps.geolocate({
    success: function(position) {
      map.setCenter(position.coords.latitude, position.coords.longitude);
      var index = 0;
      var new_address;
      var geocoder = new google.maps.Geocoder;
      //var infowindow = new google.maps.InfoWindow;
      var latlng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var content;
      var template = $('#edit_marker_template').html();

      geocoder.geocode({
        'location': latlng
      }, function(results, status) { //get address from lat/lng
        console.log("Initial location address: ", results[0].formatted_address);
        new_address = results[0].formatted_address;
        content = template.replace(/{{address}}/g, new_address).replace(/{{index}}/g, index).replace(/{{lat}}/g, position.coords.latitude).replace(/{{lng}}/g, position.coords.longitude);
        getCrimes(new_address);
        map.addMarker({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          title: 'Your position',
          infoWindow: {
            content: content
          }
        });
      });

    },
    error: function(error) {
      alert('Geolocation failed: ' + error.message);
    },
    not_supported: function() {
      alert("Your browser does not support geolocation");
    }
  });

  /*
      //+++++++++++++++++DUMMY DATA
      cData = [
          {
              crime: "Robbery",
              address: "5701 Ownby Dr, Dallas, TX 75205, United States"
          },
          {
              crime: "Theft",
              address: "3415 McFarlin Blvd, Dallas, TX 75205, United States"
          },
          {
              crime: "Murder",
              address: "5531 SMU Boulevard, Dallas, TX 75206, United States"
          },
          {
              crime: "Theft",
              address: "3709 Potomac Ave, Dallas, TX 75205, United States"
          }
      ];
      //cDataLen = cData.length;
     // crimespots = JSON.parse(cData);//cData;
      crimesLen = cData.length;
      console.log(crimesLen);
      var template = $('#edit_marker_template').html();
      if (crimesLen > 0) {
          $('#crime').append('<h4>Crimes near your location:</h4>');
          for (var x = 0; x < crimesLen; x++) {
  //____
              crimetype = cData[x].crime;
              crimeAddress = cData[x].address;
              console.log(crimetype, crimeAddress);
              GMaps.geocode({
                  address: crimeAddress,
                  callback: function(results, status) {
                      if (status == 'OK') {
                          latlng = results[0].geometry.location;
                          //console.log(latlng.lat());
                          window.a1lat = latlng.lat();
                          window.a1lng = latlng.lng();
                          var i = map.markers.length;
                          var content = template.replace(/{{address}}/g, crimeAddress).replace(/{{index}}/g, i).replace(/{{lat}}/g, a1lat).replace(/{{lng}}/g, a1lng);
                          console.log(a1lat, a1lng, i);
                          gMarkers['crimes'].push({lat: latlng.lat(), lng: latlng.lng(), title: crimeAddress, infoWindow: {content: content}, icon: 'red_exclamation_icon.png'
                          });
                      }
                  }

              });
  //___________________________

              $('#ul_crimes').append('<li><p>'+crimetype+' @ '+crimeAddress+'</p></li>');

          }
      }

      //+++++++++++++++++++


  */
  // 1.1)************* AJAX REQUEST FOR Safespots ****************
  $.ajax({
    type: 'GET',
    url: '/api/spots',
    //dataType: 'json',
    success: function(data) {
      console.log("Obtained safespots info! : " + data);
      spots = JSON.parse(data);
      safespotsLen = spots.length;
      if (safespotsLen != 0) {
        for (var x = 0; x < safespotsLen; x++) {
          //gMarkers['safespots'];
          gMarkers['safespots'].push({
            lat: spots[i].lat,
            lng: spots[i].lng,
            title: spots[i].name,
            infoWindow: {
              content: spots.name
            },
            icon: 'logo_small.png'
          });

        }
      } else {
        console.log("No safespots received");
      }
    },
    error: function(err) {
      console.log("Error obtaining safespots from database!");
    }
  });

  //1.2)************* AJAX REQUEST FOR CRIME DATA ****************

  function getCrimes(query) {
    $.ajax({
      type: 'POST',
      url: '/api/crimes',
      dataType: 'json',
      data: query,
      success: function(data) {
        crimespots = JSON.parse(data);
        crimesLen = crimespots.length;
        console.log(crimesLen);
        var template = $('#edit_marker_template').html();
        if (crimesLen > 0) {
          $('#crime').append('<h4>Crimes near your location:</h4>');
          for (var x = 0; x < crimesLen; x++) {
            //____
            crimetype = crimespots[x].crime;
            crimeAddress = crimespots[x].address;
            console.log(crimetype, crimeAddress);
            GMaps.geocode({
              address: crimeAddress,
              callback: function(results, status) {
                if (status == 'OK') {
                  latlng = results[0].geometry.location;
                  //console.log(latlng.lat());
                  a1lat = latlng.lat();
                  a1lng = latlng.lng();
                  var i = map.markers.length;
                  var content = template.replace(/{{address}}/g, crimeAddress).replace(/{{index}}/g, i).replace(/{{lat}}/g, a1lat).replace(/{{lng}}/g, a1lng);
                  console.log(a1lat, a1lng, i);
                  gMarkers['crimes'].push({
                    lat: latlng.lat(),
                    lng: latlng.lng(),
                    title: crimeAddress,
                    infoWindow: {
                      content: content
                    },
                    icon: 'red_exclamation_icon.png'
                  });
                }
              }

            });
            //___________________________


            $('#ul_crimes').append('<li><p>' + crimetype + ' @ ' + crimeAddress + '</p></li>');

          }
          console.log("CRIME MARKERS", gMarkers['crimes']);

        } else {
          $('#crime').append('<h4>No crimes found in the area</h4>');
          console.log("No crimes received");
        }
      },
      error: function(err) {
        console.log("Error Obtaining Crimes from database!");
      }
    });
  }



  //1.3) TOGGLE/HIDE SafeSpots and/or Markers

  $(".toggle_markers > input:checkbox").click(function() {
    marker_type = $(this).attr('name');
    if ($(this).is(':checked')) {
      if (gMarkers[marker_type].length > 0) {
        map.showMarkers(marker_type);
      } else {
        window.alert("There are no " + marker_type + " to display!");
      }
    } else
      map.hideMarkers(marker_type);
  });

  //3.) SEARCH FOR A PLACE BY SPECIFYING THE ADDRESS:

  $("#b_address").click(function(e) {
    e.preventDefault();
    GMaps.geocode({
      address: $(address).val(),
      callback: function(results, status) {
        if (status == 'OK') {
          var latlng = results[0].geometry.location;
          console.log(latlng.lat());
          map.setCenter(latlng.lat(), latlng.lng());
          var lat = latlng.lat();
          var lng = latlng.lng();


          //adding markers algorithm:
          var index = map.markers.length;
          var new_address;
          var geocoder = new google.maps.Geocoder;
          var latlng = {
            lat: latlng.lat(),
            lng: latlng.lng()
          };
          var content;
          var template = $('#edit_marker_template').html();

          geocoder.geocode({
            'location': latlng
          }, function(results, status) { //get address from lat/lng
            console.log("Initial location address: ", results[0].formatted_address);
            new_address = results[0].formatted_address;

            content = template.replace(/{{address}}/g, new_address).replace(/{{index}}/g, index).replace(/{{lat}}/g, lat).replace(/{{lng}}/g, lng);

            map.addMarker({
              lat: lat,
              lng: lng,
              title: new_address,
              infoWindow: {
                content: content
              }

            });
            getCrimes(new_address);
          });
        }
      }

    });
  });
  //**********************************************

  //4.) PLAN ROUTE BY ENTERING THE ADDRESS:

  $("#b_route").click(function() {
    //e.preventDefault();
    var instr = $('#instructions');
    var template = $('#edit_marker_template').html();
    //clear instructions if there are any
    instr.empty();
    map.cleanRoute();

    GMaps.geocode({
      address: $(address1).val(),
      callback: function(results, status) {
        if (status == 'OK') {
          latlng = results[0].geometry.location;
          console.log(latlng.lat());
          a1lat = latlng.lat();
          a1lng = latlng.lng();
          var i = map.markers.length;
          var content = template.replace(/{{address}}/g, $(address1).val()).replace(/{{index}}/g, i).replace(/{{lat}}/g, a1lat).replace(/{{lng}}/g, a1lng);

          map.addMarker({
            lat: latlng.lat(),
            lng: latlng.lng(),
            title: $(address1).val(),
            icon: 'marker-yellow.png',
            infoWindow: {
              content: content //$(address1).val()
            }
          });
        }
      }

    });

    GMaps.geocode({
      address: $(address2).val(),
      callback: function(results, status) {
        if (status == 'OK') {
          var latlng = results[0].geometry.location;
          console.log(latlng.lat());
          map.setCenter(latlng.lat(), latlng.lng());
          a2lat = latlng.lat();
          a2lng = latlng.lng();
          var i = map.markers.length;
          var content = template.replace(/{{address}}/g, $(address2).val()).replace(/{{index}}/g, i).replace(/{{lat}}/g, a2lat).replace(/{{lng}}/g, a2lng);
          map.setCenter(latlng.lat(), latlng.lng());
          map.addMarker({
            lat: latlng.lat(),
            lng: latlng.lng(),
            title: $(address2).val(),
            icon: 'marker-yellow.png',
            infoWindow: {
              content: content //$(address2).val()
            }
          });
          var index = map.markers.length;
          map.travelRoute({
            origin: [a1lat, a1lng],
            destination: [a2lat, a2lng],
            travelMode: 'driving',
            step: function(e) {
              console.log("PLAN ROUTE: ", a1lat, a2lat);
              instr.append('<li>' + e.instructions + '</li>');
              $('#instructions li:eq(' + e.step_number + ')').delay(50 * e.step_number).fadeIn(200, function() {});
              map.drawPolyline({
                path: e.path,
                strokeColor: '#16C0C4',
                strokeOpacity: 0.6,
                strokeWeight: 6
              });
            }
          });
        }
      }

    });

  });
  //***************************************************

  //4.1 PLAN A ROUTE TO THE CLOSEST SAFESPOT
  $(document).on('click', '#b_route_safespot', function(e) {
    e.preventDefault(e);
    console.log(gMarkers);
    var safespots = gMarkers['safespots'];
    var crime = gMarkers['crimes'];
    var instr = $('#instructions');
    var markersFromList = $('#markers-with-coordinates > li > a:contains(' + "Your position" + ')');
    console.log(markersFromList);
    var closeSafe = [];
    var copyDistance;
    map.cleanRoute();
    if (safespots.length > 0) {

      var points, minimum, min2, min3, index, index2, index3, index1, p1, p2, p3, dc1, dc2, dc3, dc1c = 0,
        dc2c = 0,
        dc3c = 0;
      var route, mincount;
      var d = [];
      closeby = [];
      closeby1 = [];
      closeby2 = [];
      closeby3 = [];
      dc = [];
      //get
      //var markersFromList = $('#markers-with-coordinates > li:contains('+"Your position"+')');
      var lat = markersFromList.attr('data-marker-lat');
      var lng = markersFromList.attr("data-marker-lng");
      var spotsLen = safespots.length;
      console.log("Safespots length: ", spotsLen);

      //find distance to all of the safespots, select minimum
      for (s in safespots) {
        points = ({
          'lat1': lat,
          'lng1': lng,

          'lat2': safespots[s].lat,
          'lng2': safespots[s].lng

        });
        dist = parseFloat(distance(points));
        d.push(dist);

      }
      minimum = Array.min(d);
      index = d.indexOf(minimum);
      console.log("Crime Array Contents before loop:", crime);
      //function for finding a path dependent on nearby crimes
      if (crime.length != 0) {
        //first, find 3 lowest distances
        index1 = index;
        copyDistance = d;
        console.log(copyDistance);
        if (spotsLen > 1) {
          copyDistance.splice(index, 1);
          min2 = Array.min(copyDistance);
          index2 = d.indexOf(min2) + 1;
          console.log("Min2:", copyDistance, min2);
          if (spotsLen > 2) {
            copyDistance.splice(copyDistance.indexOf(min2), 1);
            min3 = Array.min(copyDistance);
            index3 = d.indexOf(min3) + 2;
            console.log("Min3:", copyDistance, min3);
          }
        }

        console.log("Min 1 2,3: ", minimum, min2, min3);
        console.log("index:index, 1 2,3: ", index, index1, index2, index3);

        // -- Find Distance between each of the spocified safespots/crimes
        for (var y = 0; y < crime.length; y++) {
          var tempLat = crime[y].lat;
          var tempLng = crime[y].lng;

          p1 = ({
            'lat1': safespots[index1].lat,
            'lng1': safespots[index1].lng,

            'lat2': tempLat,
            'lng2': tempLng
          });
          console.log("P1:", p1);
          dc1 = parseFloat(distance(p1));
          if (dc1 < 1.0) {
            dc1c += 1;
            closeby1.push(crime[y]);
          }

          if (spotsLen > 1) {
            p2 = ({
              'lat1': safespots[index2].lat,
              'lng1': safespots[index2].lng,

              'lat2': tempLat,
              'lng2': tempLng
            });
            dc2 = parseFloat(distance(p2));
            if (dc2 < 1.0) {
              dc2c += 1;
              closeby2.push(crime[y]);
            }
            //dc.push(dc2c);
            mincount = Array.min(dc);
            index = dc.indexOf(mincount);
            if (spotsLen > 2) {
              p3 = ({
                'lat1': safespots[index3].lat,
                'lng1': safespots[index3].lng,

                'lat2': tempLat,
                'lng2': tempLng
              });
              dc3 = parseFloat(distance(p3));
              if (dc3 < 1.0) {
                dc3c = dc3c + 1;
                closeby3.push(crime[y]);
              }
              //dc.push(dc3c);
              console.log(dc);
              mincount = Array.min(dc);
              index = dc.indexOf(mincount);

            }
          }

        }
        dc.push(dc1c);
        if (spotsLen > 1) {
          dc.push(dc2c);
          if (spotsLen > 2) {
            dc.push(dc3c);
          }
        }

        console.log(dc);
        mincount = Array.min(dc);
        index = dc.indexOf(mincount);
        if (dc[0] == dc[1] || dc[0] == dc[2] || dc[1] == dc[2] || dc[0] == dc[1] == dc[2]) {
          index = index1;
        }

        console.log("Closeby1:", closeby1);
        console.log("Closeby2:", closeby2);
        console.log("Closeby3:", closeby3);
        console.log("Index at the end of loop:", index);
        /*
        dc.push(dc1c, dc2c, dc3c);
        mincount = Array.min(dc);
        index = dc.indexOf(mincount);
        */
        //routeIndex = route.indexOf(route);
        if (index == 0) {
          closeby = closeby1;
          map.showMarkersByDistance('crime');
        } else if (index == 1) {
          closeby = closeby2;
          map.showMarkersByDistance('crime');
        } else if (index == 2) {
          closeby = closeby3;
          map.showMarkersByDistance('crime');
        }
        //just match dcXc with safespot and use that to plan a route

        //  if()

        console.log("Index at the end of checking:", index);
      }


      console.log("min dilemma", Math.min(0, 0, 1, 2, undefined, 0, 1));



      map.travelRoute({
        origin: [lat, lng],
        destination: [safespots[index].lat, safespots[index].lng],
        travelMode: 'driving',
        step: function(e) {
          console.log("Plan a safe route to: ", safespots[index].name);
          instr.append('<li>' + e.instructions + '</li>');
          $('#instructions li:eq(' + e.step_number + ')').delay(50 * e.step_number).fadeIn(200, function() {});
          map.drawPolyline({
            path: e.path,
            strokeColor: '#16C0C4',
            strokeOpacity: 0.6,
            strokeWeight: 6
          });
        }
      });

    } else {
      window.alert("I need to find a safespot first!");
    }

  });




  //5.) Rclear routes

  $("#b_route2").click(function() {
    map.cleanRoute();
  });


  // ************************************************


  // --------------MARKER ADD ON CLICK + INFO + MOD-----------------------

  GMaps.on('marker_added', map, function(marker) {
    var repeat = $('#markers-with-index:contains(' + marker.title + ')');
    //console.log(" REEEEEEEPPEEEEEEEEEAAAAAAAT: ", repeat);
    var template = $('#edit_marker_template').html();

    if (repeat.length < 1 && marker.title != undefined) {

      $('#markers-with-index').append('<li><a href="#" class="pan-to-marker" data-marker-index="' +
        map.markers.indexOf(marker) + '">' + marker.title + '</a></li>');

      $('#markers-with-coordinates').append('<li><a href="#" class="pan-to-marker" data-marker-lat="' +
        marker.getPosition().lat() + '" data-marker-lng="' + marker.getPosition().lng() + '">' + marker.title + '</a></li>');

    }
    if (marker.title == undefined) {
      console.log("Marker you are trying to add has undefined title!!!!");
    }

    var log = $('#markers-with-index').html();
    console.log("ON ADDED DATA: ", map.markers, "MARKER:", marker.title);
  });

  // add a marker upon interacting with the map via click
  GMaps.on('click', map.map, function(event) {
    //var repeat = $('#markers-with-index:contains('+marker.title+')');
    //console.log(" REPPPPPPPEEAAAT: ", repeat);
    var index = map.markers.length;
    var lat = event.latLng.lat();
    var lng = event.latLng.lng();
    //var new_address;
    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;
    var latlng = {
      lat: lat,
      lng: lng
    };

    geocoder.geocode({
      'location': latlng
    }, function(results, status) { //get address from lat/lng
      console.log(results[0].formatted_address);
      new_address = results[0].formatted_address;

      var template = $('#edit_marker_template').html();

      var content = template.replace(/{{address}}/g, new_address).replace(/{{index}}/g, index).replace(/{{lat}}/g, lat).replace(/{{lng}}/g, lng);

      console.log(lat, lng, template, index, content);
      map.addMarker({
        lat: lat,
        lng: lng,
        title: new_address, //'Marker #' + index,
        infoWindow: {
          content: content
        }
      });
    });






    /*if (status === google.maps.GeocoderStatus.OK) {
        if (results[1]) {
            //map.setZoom(11);
            var marker = new google.maps.Marker({
                position: latlng,
            });
            infowindow.setContent(results[1].formatted_address);
            //infowindow.open(map, marker);
        } else {
            window.alert('No results found');
        }
    } else {
        window.alert('Geocoder failed due to: ' + status);
    }*/

  });



  // ----------UPDATE POSITION----------------
  $(document).on('submit', '.edit_marker', function(e) {
    e.preventDefault();

    var $index = $(this).data('marker-index');
    //Data for replacing the list entry
    var title = $('#markers-with-index > li:contains(' + map.markers[$index].title + ')');
    var title1 = $('#markers-with-index:contains(' + map.markers[$index].title + ')');
    console.log("this.data(marker-title)", title.html());
    //var toreplace = '<li><a href="#" class="pan-to-marker" data-marker-index="' +
    // map.markers.$index + '">' + marker[$index].title + '</a></li>';
    //title.replaceWith('<li><a href="#" class="pan-to-marker" data-marker-index="' +map.markers.$index + '">' + marker[$index].title + '</a></li>');


    $lat = $('#marker_' + $index + '_lat').val();
    $lng = $('#marker_' + $index + '_lng').val();
    //new address
    var lat = parseFloat($lat);
    var lng = parseFloat($lng);
    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;
    var latlng = {
      lat: lat,
      lng: lng
    };
    var content;
    //var markerList =$('#markers-with-index > li:contains(' + map.markers[i].title + ')');
    //Get new address, update the list
    geocoder.geocode({
      'location': latlng
    }, function(results, status) { //get address from lat/lng
      console.log(results[0].formatted_address);
      new_address = results[0].formatted_address;
      //edit infoWindow template
      var template = $('#edit_marker_template').html();
      content = template.replace(/{{address}}/g, new_address).replace(/{{index}}/g, $index).replace(/{{lat}}/g, $lat).replace(/{{lng}}/g, $lng);
      console.log($lat, $lng, template, $index, content);

      title.replaceWith('<li><a href="#" class="pan-to-marker" data-marker-index="' + $index + '">' + new_address + '</a></li>');
      console.log($(('#markers-with-index')).html());
      //title.replace(map.markers[$index].title, new_address);
      //edit marker list
      //var temp = $('#markers-with-index').html;
      //$('#markers-with-index').find( map.markers[$index].title).replace(/map.markers[$index].title/g, new_address);
      //$('#markers-with-index > li:contains(' + map.markers[$index].title + ')').remove();
      map.markers[$index].setPosition(new google.maps.LatLng($lat, $lng));
      map.markers[$index].infoWindow.setContent(content);

      $marker = $('#markers-with-coordinates').find('li').eq(0).find('a');
      $marker.data('marker-lat', $lat);
      $marker.data('marker-lng', $lng);
    });

    //console.log("on Submit index: ", this, $index, $lat, $lng, template, content,"$MARKER:", $marker.data('marker-lat', $lat));
  });

  //-------------Update center-----------------
  $(document).on('click', '.pan-to-marker', map, function(e) {
    e.preventDefault();
    /*
            //CHECK IF CRIME MARKER IS ALREADY PRESENT; removes them from the map if true
            if(gMarkers['crimes'] != undefined) {
                for (var i = 0; i < map.markers.length; i++) {
                    //console.log("markers map.markers.len:", map.markers[i].title);
                    if (gMarkers['crimes'].length)
                        for (var j = 0; j < gMarkers['crimes'].length; j++) {
                            //console.log("markers gMarkers: ", gMarkers['crimes'][j].title);
                            if (map.markers[i].title == gMarkers['crimes'][j].title) {
                                console.log("markers before delete: ", gMarkers['crimes'][j].title);
                                $('#markers-with-index > li:contains(' + map.markers[i].title + ')').remove(); //removes DOM presence
                                map.markers[i].setMap(null);   //set map visibility to null
                                //map.markers.splice(i, 1);
                                //delete map.markers[i];         //deletes out of array

                            }
                        }

                }
            }
            else{
                console.log("No Crimes to hide from map");
            }

            //var $index = $('.edit_marker').data('marker-index');

    */
    var lat, lng;

    var $index = $(this).data('marker-index');
    var $lat = $(this).data('marker-lat');
    var $lng = $(this).data('marker-lng');
    console.log("document.onclick pan-to-marker :", $lng);
    if ($index != undefined) {
      // using indices
      var position = map.markers[$index].getPosition();
      lat = position.lat();
      lng = position.lng();

    } else {
      // using coordinates
      lat = $lat;
      lng = $lng;
    }
    console.log("document.onclick pan-to-marker, centering:", lng, lat);
    map.setCenter(lat, lng);

    /*

            //----------Calculate Distance-------------

            var template = $('#markers ').html();
            console.log(template);
            var points;
            closeby=[];
            //console.log(gMarkers['crimes'], $lat, $lng, lat, lng);
            for(s in gMarkers['crimes']){
                //console.log(gMarkers[s].lat);
               //console.log(gMarkers['crimes'][s].lat);
                points=({
                    'lat1': lat,
                    'lng1': lng,

                    'lat2': gMarkers['crimes'][s].lat,
                    'lng2': gMarkers['crimes'][s].lng

                });

                d = distance(points);
                x = 0;
                if(d <= 5.000){
                    console.log("Distance ", s, ": ", d, "km");
                    for(i=0; i < map.markers.length; i++) {
                       // console.log("marker #",i);
                        if(map.markers[i].title == gMarkers['crimes'][s].title){
                            x=1;
                        }

                    }
                    if(x!=1){
                        closeby.push(gMarkers['crimes'][s]);
                        console.log("CRIMES attempted to be pushed: ", gMarkers['crimes'][s]);
                    }
                }
            }
            map.showMarkersByDistance('crimes');//, s);
            //delete closeby; */
  });


  //-----------DELETE MARKER---------------
  $(document).on('click', '#b_delete_marker', function(e) {
    e.preventDefault();
    //e.stopPropagation();
    if (gMarkers['safespots'] == undefined) {
      map.hideMarkers('safespots');
    }
    if (gMarkers['crimes'] == undefined) {
      map.hideMarkers('crimes');
    }

    var lat, lng;

    var $index = $('.edit_marker').data('marker-index');
    console.log($index);
    console.log("document.onclick DELETE MARK :", $index);
    console.log("markers before delete: ", map.markers[$index].title);
    for (var x = 0; x < gMarkers['safespots'].length; x++) {
      if (gMarkers['safespots'][x].title == map.markers[$index].title) {
        gMarkers['safespots'][x].delete();
      }
    }

    //$("#markers-with-index: > li:contains("+map.markers[$index].title+")").remove; //removes DOM presence
    $('#markers-with-index > li:contains(' + map.markers[$index].title + ')').remove();
    map.markers[$index].setMap(null); //set map visibility to null
    //delete map.markers[$index];         //deletes out of array
    /*for (var x = 0; x < gMarkers['safespots'].length; x++) {
        if (map.markers[$index].title == gMarkers['safespots'][x]) {

        }
    }*/

    console.log("markers after delete: ", map.markers);
  });


  //----------------MAKE IT A SAFESPOT------------------
  $(document).on('click', '#make_safespot', function(e) {
    e.preventDefault();
    var lat, lng;
    var $index = $('.edit_marker').data('marker-index');
    var $lat = $('#marker_' + $index + '_lat').val();
    var $lng = $('.edit_marker').data('marker-lng');
    var geocoder = new google.maps.Geocoder;
    var new_address;
    var exists = false;

    //Hide the red marker under the new safespot

    console.log("Making a safespot :", $index, $lat, $lng);
    if ($index != undefined) {
      // using index
      var position = map.markers[$index].getPosition();
      lat = position.lat();
      lng = position.lng();

    } else {
      // using coordinates
      lat = $lat;
      lng = $lng;
    }

    //Get address from lat/lng, update gMarkers['safespots'] array with the new safespot
    var latlng = {
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    };

    for (var x = 0; x < gMarkers['safespots'].length; x++) {
      if (gMarkers['safespots'][x].lat == latlng.lat) {
        exists = true;
      }
    }
    if (exists != true) {
      map.markers[$index].setMap(null);
      console.log("LATLNG:", latlng, $lat, lat);
      geocoder.geocode({
        'location': latlng
      }, function(results, status) {
        console.log(results); //[0].formatted_address);
        new_address = results[0].formatted_address;
        var template = $('#edit_marker_template').html();
        var index = map.markers.length;
        content = template.replace(/{{address}}/g, new_address).replace(/{{index}}/g, index).replace(/{{lat}}/g, latlng.lat).replace(/{{lng}}/g, latlng.lng);
        console.log(content);

        gMarkers['safespots'].push({
          lat: latlng.lat,
          lng: latlng.lng,
          title: new_address,
          infoWindow: {
            content: content
          },
          icon: 'logo_small.png'
        });

        new_spot = {
          name: new_address,
          lat: $lat,
          lng: $lng
        };
        spot_json = JSON.stringify(new_spot);
        $.ajax({
          type: 'POST',
          url: '/api/safespots',
          dataType: 'application/json',
          data: spot_json,
          success: function(res) {
            console.log(res);
          },
          error: function(err) {
            console.log(err);
          }
        });
        console.log("added spot: ", spot_json);
        console.log("array after adding a spot: ", gMarkers['safespots']);

        //make the safespot appear on map
        var l = gMarkers['safespots'].length;
        map.addMarker(gMarkers['safespots'][l - 1]);
      });
      //---

      map.setCenter(lat, lng);
    } else {
      window.alert("This safespot already exists!")
    }

    //send new data to the database
    //console.log("NEW SAFESPOT Address:", new_address);



  });

  //---------------Show Crime----------------------------
  $(document).on('click', '#b_show_crime', function(e) {
    e.preventDefault();
    e.stopPropagation();

    //CHECK IF CRIME MARKER IS ALREADY PRESENT; removes them from the map if true
    if (gMarkers['crimes'] != undefined) {
      for (var i = 0; i < map.markers.length; i++) {
        //console.log("markers map.markers.len:", map.markers[i].title);
        if (gMarkers['crimes'].length)
          for (var j = 0; j < gMarkers['crimes'].length; j++) {
            //console.log("markers gMarkers: ", gMarkers['crimes'][j].title);
            if (map.markers[i].title == gMarkers['crimes'][j].title) {
              console.log("markers before delete: ", gMarkers['crimes'][j].title);
              $('#markers-with-index > li:contains(' + map.markers[i].title + ')').remove(); //removes DOM presence
              map.markers[i].setMap(null); //set map visibility to null
              //map.markers.splice(i, 1);
              //delete map.markers[i];         //deletes out of array

            }
          }

      }
    } else {
      console.log("No Crimes to hide from map");
    }

    //var $index = $('.edit_marker').data('marker-index');


    var lat, lng;

    //var $index = $(this).data('marker-index');
    var $index = $('.edit_marker').data('marker-index');
    var $lat = $(this).data('marker-lat');
    var $lng = $(this).data('marker-lng');
    console.log("document.onclick pan-to-marker :", $lng);
    if ($index != undefined) {
      // using indices
      var position = map.markers[$index].getPosition();
      lat = position.lat();
      lng = position.lng();

    } else {
      // using coordinates
      lat = $lat;
      lng = $lng;
    }
    console.log("document.onclick pan-to-marker after IF:", lng, lat);
    map.setCenter(lat, lng);



    //----------Calculate Distance-------------

    //var template = $('#markers ').html();
    //console.log(template);
    var points;
    closeby = [];
    //console.log(gMarkers['crimes'], $lat, $lng, lat, lng);
    for (s in gMarkers['crimes']) {
      //console.log(gMarkers[s].lat);
      //console.log(gMarkers['crimes'][s].lat);
      points = ({
        'lat1': lat,
        'lng1': lng,

        'lat2': gMarkers['crimes'][s].lat,
        'lng2': gMarkers['crimes'][s].lng

      });

      d = distance(points);
      x = 0;
      if (d <= 5.000) {
        console.log("Distance ", s, ": ", d, "km");
        /*for(i=0; i < map.markers.length; i++) {
            // console.log("marker #",i);
            if(map.markers[i].title == gMarkers['crimes'][s].title){
                x=1;
            }

        }*/
        if (x != 1) {
          closeby.push(gMarkers['crimes'][s]);
          console.log("CRIMES attempted to be pushed: ", gMarkers['crimes'][s]);
        }
      }
    }
    console.log(closeby.length);
    if (closeby.length > 0) {
      map.showMarkersByDistance('crimes'); //, s);
    } else {
      window.alert("No crime data nearby!");
    }

  });


  //---------------TOGGLE/HIDE gMarkers[] functions-------------------

  GMaps.prototype.showMarkers = function(marker_type) {
    var theMap = this.map; // save the current map
    actualMarkers[marker_type] = [];
    var template = $('#edit_marker_template').html();

    $.each(gMarkers[marker_type], function(index, obj) {
      //console.log("OBJECT: ", obj);
      //console.log("TOGGLE CRIME lat: ", map);

      //*****************Change Object's content***************
      /* var lat = gMarkers[marker_type][index].lat;
       var lng = gMarkers[marker_type][index].lng;
       var i = map.markers.length;
       var content = {};
       console.log(lat, lng, i);
       //geocoding address:
       var geocoder = new google.maps.Geocoder;
       var infowindow = new google.maps.InfoWindow;
       var latlng = {lat: lat, lng: lng};
       var new_address;
      /* geocoder.geocode({'location': latlng}, function(results, status) {      //get address from lat/lng
           console.log(results[0].formatted_address);
           new_address = results[0].formatted_address;
       });*/

      console.log(obj);

      var newMarker = map.addMarker(obj); // add the marker
      actualMarkers[marker_type].push(newMarker);


    });
  };

  GMaps.prototype.hideMarkers = function(marker_type) {
    // for each real marker of this type
    // CHECK IF MARKER IS ALREADY PRESENT
    for (var i = 0; i < map.markers.length; i++) {
      // console.log("markers map.markers.len:", map.markers[i].title);
      for (var j = 0; j < gMarkers[marker_type].length; j++) {
        // console.log("markers gMarkers: ", gMarkers['crimes'][j].title);
        if (map.markers[i].title == gMarkers[marker_type][j].title) {
          console.log("markers before delete: ", gMarkers[marker_type][j].title);
          $('#markers-with-index > li:contains(' + map.markers[i].title + ')').remove(); //removes DOM presence
          map.markers[i].setMap(null); //set map visibility to null
          //delete map.markers[i];
          //delete map.markers[i];         //deletes out of array

        }
      }

    }
    /*
            $.each(actualMarkers[marker_type],function(index, obj){  // remove the marker
                obj.setMap(null);


            });*/
    // clear markers of this type
    actualMarkers[marker_type] = [];
  };


  //TOGGLE/HIDE BY DISTANCE

  GMaps.prototype.showMarkersByDistance = function(marker_type) {
    var theMap = this.map; // save the current map
    actualMarkers[marker_type] = [];
    $.each(closeby, function(index, obj) {
      var newMarker = map.addMarker(obj); // add the marker
      actualMarkers[marker_type].push(newMarker);
    });
  };

  GMaps.prototype.hideMarkersByDistance = function(marker_type) {
    // for each real marker of this type
    $.each(actualMarkers[marker_type], function(index, obj) { // remove the marker
      obj.setMap(null);
    });
    // clear markers of this type
    actualMarkers[marker_type] = [];
  };



  // function for calculating distance

  function distance(points) {
    var lat1 = points.lat1; //get radians
    var radianLat1 = lat1 * (Math.PI / 180);
    var lng1 = points.lng1;
    var radianLng1 = lng1 * (Math.PI / 180);
    var lat2 = points.lat2;
    var radianLat2 = lat2 * (Math.PI / 180);
    var lng2 = points.lng2;
    var radianLng2 = lng2 * (Math.PI / 180);
    var earth_radius = 6371; // or  3959 for miles
    var diffLat = (radianLat1 - radianLat2);
    var diffLng = (radianLng1 - radianLng2);
    var sinLat = Math.sin(diffLat / 2);
    var sinLng = Math.sin(diffLng / 2);
    var a = Math.pow(sinLat, 2.0) + Math.cos(radianLat1) * Math.cos(radianLat2) * Math.pow(sinLng, 2.0);
    var distance = earth_radius * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
    return distance.toFixed(3);
  }







  //Extending Array to help get the lowest value out of it
  Array.min = function(array) {
    return Math.min.apply(Math, array);
  };



  // Sets the map on all markers in the array.
  function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  // Removes the markers from the map, but keeps them in the array.
  function clearMarkers() {
    setMapOnAll(null);
  }

  // Shows any markers currently in the array.
  function showMarkers() {
    setMapOnAll(map);
  }

  // Deletes all markers in the array by removing references to them.
  function deleteMarkers() {
    clearMarkers();
    markers = [];
  }
});

function geoCode(address) {
  var a = address;
  console.log(a);
  GMaps.geocode({
    address: a, //$(address).val(),
    callback: function(results, status) {
      if (status == 'OK') {
        var latlng = results[0].geometry.location;
        console.log(latlng.lat());
        map.setCenter(latlng.lat(), latlng.lng());
        map.addMarker({
          lat: latlng.lat(),
          lng: latlng.lng(),
          click: function(e) {
            deleteMarkers();
          }
        });
      }
    }

  });

}
