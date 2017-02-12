var global_user_data = {};
var global_user_contacts = {};
var global_user_spots = {};

$(document).ready(function() {
  set_username();

  $('#b_crimes').on('click', function(e) {
    e.preventDefault();
    var $form = $('#f_crimes');
    var _search = $form.find('input[name="search"]').val();
    var form_data = {search: _search};
    var json_data = JSON.stringify(form_data);
    $.ajax({
      type: 'POST',
      url: '/api/crimes',
      data: json_data,
      contentType: 'application/json',
      success: function(res) {
        crimes = JSON.parse(res);
	console.log(crimes[0]);
      },
      error: function(err) {
        console.log(err);
      }
    });
  });

  $('#b_add_contact').on('click', function(e) {
    e.preventDefault()
    var $form = $('#f_contacts');
    var _city = $form.find('input[name="city"]').val();
    var _first = $form.find('input[name="first"]').val();
    var _last = $form.find('input[name="last"]').val();
    var _phone = $form.find('input[name="phone"]').val();
    var _state = $form.find('input[name="state"]').val();
    var _street = $form.find('input[name="street"]').val();
    var form_data = {city: _city, first: _first, last: _last,
      phone: _phone, state: _state, street: _street};
    var json_data = JSON.stringify(form_data);
    $.ajax({
      type: 'POST',
      url: '/api/contacts',
      data: json_data,
      contentType: 'application/json',
      success: function(res) {
        alert(res);
      },
      error: function(err) {
        alert(err);
      }
    });
  });

  $('#d_contacts').on('click', 'button', function(e) {
    e.preventDefault();
    index = $(this).index();
    var contact_to_delete = {
      city:       global_user_contacts[index].city,
      first:  global_user_contacts[index].firstname,
      last:   global_user_contacts[index].lastname,
      phone:      global_user_contacts[index].phone,
      state:      global_user_contacts[index].state,
      street:     global_user_contacts[index].street
    };
    var json_data = JSON.stringify(contact_to_delete);
    $.ajax({
      type: 'DELETE',
      url: '/api/contacts',
      data: json_data,
      contentType: 'application/json',
      success: function(res) {
        console.log(res);
      },
      error: function(err) {
        console.log(err);
      }
    });
  });

  $('#b_list_contact').on('click', function(e) {
    e.preventDefault();
    $.ajax({
      type: 'GET',
      url: '/api/contacts',
      contentType: 'application/json',
      success: function(res) {
        global_user_contacts = JSON.parse(res);
        $('#d_contacts').empty();
        for (var i = 0; i < global_user_contacts.length; i++) {
          $('#d_contacts').append('<button>contact' + i + '</button>');
        }
      },
      error: function(err) {
        console.log(err);
      }
    });
  });

  $('#b_add_spot').on('click', function(e) {
    e.preventDefault()
    var $form = $('#f_spots');
    var _name = $form.find('input[name="name"]').val();
    var _lat = $form.find('input[name="lat"]').val();
    var _lng = $form.find('input[name="lng"]').val();
    var form_data = {name: _name, lat: _lat, lng: _lng};
    var json_data = JSON.stringify(form_data);
    $.ajax({
      type: 'POST',
      url: '/api/spots',
      data: json_data,
      contentType: 'application/json',
      success: function(res) {
        console.log(res);
      },
      error: function(err) {
        console.log(err);
      }
    });
  });

  $('#d_spots').on('click', 'button', function(e) {
    e.preventDefault();
    index = $(this).index();
    var spot_to_delete = {
      name:   global_user_spots[index].name,
      lat:    global_user_spots[index].lat,
      lng:    global_user_spots[index].lng
    };
    var json_data = JSON.stringify(spot_to_delete);
    $.ajax({
      type: 'DELETE',
      url: '/api/spots',
      data: json_data,
      contentType: 'application/json',
      success: function(res) {
        console.log(res);
      },
      error: function(err) {
        console.log(err);
      }
    });
  });

  $('#b_list_spot').on('click', function(e) {
    e.preventDefault();
    $.ajax({
      type: 'GET',
      url: '/api/spots',
      contentType: 'application/json',
      success: function(res) {
        console.log(res);
        global_user_spots = JSON.parse(res);
        $('#d_spots').empty();
        for (var i = 0; i < global_user_spots.length; i++) {
          $('#d_spots').append('<button>spot' + i + '</button>');
        }
      },
      error: function(err) {
        console.log(err);
      }
    });
  });

  $('#b_update').on('click', function() {
    var _field = $('#sel_update').val();
    var _value = $('#update_field').val();
    var form_data = {field: _field, value: _value};
    var json_data = JSON.stringify(form_data);
    $.ajax({
      type: 'PUT',
      url: '/api/users',
      data: json_data,
      contentType: 'application/json',
      success: function(res) {
        console.log(res);
      },
      error: function(err) {
        console.log(err);
      }
    });
  });

  $('#b_signup').on('click', function(e) {
    e.preventDefault();
    var $form = $('#f_signup');
    var fname = $form.find('input[name="fname"]').val();
    var lname = $form.find('input[name="lname"]').val();
    var uname = $form.find('input[name="uname"]').val();
    var psw = $form.find('input[name="psw"]').val();
    var eml = $form.find('input[name="eml"]').val();
    var form_data = {first: fname, last: lname,
      user: uname, pass: psw, email: eml};
    var json_data = JSON.stringify(form_data);
    $.ajax({
      type: 'POST',
      url: '/api/users',
      data: json_data,
      contentType: 'application/json',
      success: function(res) {
        alert(res);
      },
      error: function(err) {
        alert(err);
      }
    });
  });

  $('#b_login').on('click', function(e) {
    e.preventDefault();
    var $form = $('#f_login');
    var uname = $form.find('input[name="uname"]').val();
    var psw = $form.find('input[name="psw"]').val();
    var form_data = {user: uname, pass: psw};
    var json_data = JSON.stringify(form_data);
    $.ajax({
      type: 'POST',
      url: '/api/users/login',
      data: json_data,
      contentType: 'application/json',
      success: function(res) {
        alert(res);
      },
      error: function(err) {
        alert(err);
      }
    });
  });

  $('#b_logout').on('click', function(e) {
    $.ajax({
      type: 'POST',
      url: '/api/users/logout',
      success: function(res, stst, jqXHR) {
        console.log('logout success!');
        location.reload();
      },
      error: function(jqXHR, stat, err) {
        console.log('error!');
      }
    });
  });

  $('#b_clear').on('click', function(e) {
    $.ajax({
      type: 'POST',
      url: '/api/users/clear',
      success: function(res, stst, jqXHR) {
        console.log('clear users success!');
      },
      error: function(jqXHR, stat, err) {
        console.log('error!');
      }
    });
  });

});



function set_username() {
  $.ajax({
    type: 'GET',
    url: '/api/users',
    success: function(res) {
      global_user_data = JSON.parse(res);
      $('#s_user').text('Hello ' + global_user_data['user']);
      $('#s_first').text('first name: ' + global_user_data['first']);
      $('#s_last').text('last name: ' + global_user_data['last']);
      $('#s_email').text('email: ' + global_user_data['email']);
      $('#s_pin').text('pin: ' + global_user_data['pin']);
      $('#s_timeout').text('timeout: ' + global_user_data['timeout']);
    },
    error: function(err) {
      console.log('error!');
    }
  });
}
