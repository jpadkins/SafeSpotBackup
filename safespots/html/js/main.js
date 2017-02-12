$(document).ready(function() {
  set_username();
  $('#b_signup').on('click', function(e) {
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
      success: function(res, stat, jqXHR) {
        console.log('success!');
        console.log(res);
      },
      error: function(jqXHR, stat, err) {
        window.alert("ERROR");;
      }
    });
  });
  $('#b_login').on('click', function(e) {
    var $form = $('#f_login');
    var uname = $form.find('input[name="uname"]').val();
    var psw = $form.find('input[name="psw"]').val();
    var form_data = {user: uname, pass: psw};
    var json_data = JSON.stringify(form_data);
    console.log(json_data);
    $.ajax({
      type: 'POST',
      url: '/api/users/login',
      data: json_data,
      contentType: 'application/json',
      success: function(res, stst, jqXHR) {
       set_username(); 
      },
      error: function(jqXHR, stat, err) {
        window.alert("ERROR");
      }
    });
  });
  $('#b_logout').on('click', function(e) {
    $.ajax({
      type: 'POST',
      url: '/api/users/logout',
      success: function(res, stst, jqXHR) {
        window.open ('index.html','_self',false)
      },
      error: function(jqXHR, stat, err) {
        window.alert("ERROR");;
      }
    });
  });
});

function set_username() {
  $.ajax({
    type: 'GET',
    url: '/api/users',
    success: function(res, stst, jqXHR) {
      if (res == 0) { 
      } else {	
	document.location.pathname = 'account_safespots.html';
      }
    },
    error: function(jqXHR, stat, err) {
      window.alert("ERROR");;
    }
  });
}
