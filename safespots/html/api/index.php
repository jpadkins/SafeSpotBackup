<?php
// inclusions
require 'vendor/autoload.php';

// glabal variables
$app = new \Slim\Slim();

/* ENDPOINTS */

// add user using python and cassandra
$app->post('/users', function () use ($app) {
  session_start();
  $request = $app->request();
  $inputs = json_decode($request->getBody(), true);

  $username = $inputs['user'];
  $email = $inputs['email'];
  $first = $inputs['first'];
  $last = $inputs['last'];
  $password = $inputs['pass'];
  $salt = hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true));
  $password = hash('sha512', $password . $salt);

  $python_res = exec('python python_signup.py ' . $username . ' ' . $email . ' '
    . $first . ' ' . $last . ' ' . $password . ' ' . $salt, $python_res);

  echo json_encode('python: ' . $python_res);
});

// log in a user using python and cassandra
$app->post('/users/login', function () use ($app) {
  session_start();
  $request = $app->request();
  $inputs = json_decode($request->getBody(), true);

  $user = $inputs['user'];
  $pass = $inputs['pass'];

  $python_res = exec('python python_login.py ' . $user . ' ' . $pass, $python_res);
  $result = json_decode($python_res, true);

  $pass = hash('sha512', $pass . $result['salt']);
  if ($pass == $result['password']) {
    $_SESSION = $result;
    echo json_encode('successful login for ' . $_SESSION['username']);
  }
  else {
    echo json_encode('error logging in');
  }
});

// check which user is logged in using python and cassandra
$app->get('/users', function () use ($app) {
  session_start();
  if (isset($_SESSION['username'])) {
    $data = array(
      'user'    => $_SESSION['username'],
      'first'   => $_SESSION['firstname'],
      'last'    => $_SESSION['lastname'],
      'email'   => $_SESSION['email'],
      'pin'     => $_SESSION['pin'],
      'timeout' => $_SESSION['timeout']
    );
    echo json_encode($data);
  }
  else {
    echo json_encode(0);
  }
});

// log out current user using python and cassandra
$app->post('/users/logout', function () use ($app) {
  session_start();
  session_destroy();
  $_SESSION = array();
  echo json_encode('successful logout');
});

// update attributes for logged in user using python and cassandra
$app->put('/users', function () use ($app) {
  session_start();
  $request = $app->request();
  $inputs = json_decode($request->getBody(), true);

  $field = $inputs['field'];
  $value = $inputs['value'];

  if ($field != 'password') {
    $_SESSION[$field] = $value;
    $python_res = exec('python python_update.py ' . $_SESSION['username'] . ' '
      . $field . ' ' . $value, $python_res);
    echo json_encode($python_res);
  }
  else {
    $value = hash('sha512', $value . $_SESSION['salt']);
    $python_res = exec('python python_update.py ' . $_SESSION['username'] . ' '
      . $field . ' ' . $value, $python_res);
    echo json_encode($python_res);
  }
});

// retrieve an array of contacts for logged in user using python and cassandra
$app->get('/contacts', function() use ($app) {
  session_start();
  $operation = 'GET';
  $python_res = exec('python python_contacts.py "' . $operation . '" "' . $_SESSION['username']
    . '"', $python_res);
  $result = json_decode($python_res, true);
  echo json_encode($result);
});

// add a contact for logged in user using python and cassandra
$app->post('/contacts', function() use ($app) {
  session_start();
  $operation = 'POST';
  $request = $app->request();
  $inputs = json_decode($request->getBody(), true);
  $city = $inputs['city'];
  $first = $inputs['first'];
  $last = $inputs['last'];
  $phone = $inputs['phone'];
  $state = $inputs['state'];
  $street = $inputs['street'];
  $python_res = exec('python python_contacts.py "' . $operation . '" "' . $_SESSION['username']
    . '" "' . $city . '" "' . $first . '" "' . $last . '" "' . $phone . '" "' . $state . '" "'
    . $street . '"', $python_res);
  echo json_encode($python_res);
});

// delete a contact for logged in user using python and cassandra
$app->delete('/contacts', function() use ($app) {
  session_start();
  $operation = 'DELETE';
  $request = $app->request();
  $inputs = json_decode($request->getBody(), true);
  $city = $inputs['city'];
  $first = $inputs['first'];
  $last = $inputs['last'];
  $phone = $inputs['phone'];
  $state = $inputs['state'];
  $street = $inputs['street'];
  $python_res = exec('python python_contacts.py "' . $operation . '" "' . $_SESSION['username']
    . '" "' . $city . '" "' . $first . '" "' . $last . '" "' . $phone . '" "' . $state . '" "'
    . $street . '"', $python_res);
  echo json_encode($python_res);
});

// retrieve an array of spots for logged in user using python and cassandra
$app->get('/spots', function() use ($app) {
  session_start();
  $operation = 'GET';
  $python_res = exec('python python_spots.py "' . $operation . '" "' . $_SESSION['username']
    . '"', $python_res);
  $result = json_decode($python_res, true);
  echo json_encode($result);
});

// add a spot for logged in user using python and cassandra
$app->post('/spots', function() use ($app) {
  session_start();
  $operation = 'POST';
  $request = $app->request();
  $inputs = json_decode($request->getBody(), true);
  $name = $inputs['name'];
  $lat = $inputs['lat'];
  $lng = $inputs['lng'];
  $python_res = exec('python python_spots.py "' . $operation . '" "' . $_SESSION['username']
    . '" "' . $name . '" "' . $lat . '" "' . $lng . '"', $python_res);
  echo json_encode($python_res);
});

// delete a spot for logged in user using python and cassandra
$app->delete('/spots', function() use ($app) {
  session_start();
  $operation = 'DELETE';
  $request = $app->request();
  $inputs = json_decode($request->getBody(), true);
  $name = $inputs['name'];
  $lat = $inputs['lat'];
  $lng = $inputs['lng'];
  $python_res = exec('python python_spots.py "' . $operation . '" "' . $_SESSION['username']
    . '" "' . $name . '" "' . $lat . '" "' . $lng . '"', $python_res);
  echo json_encode($python_res);
});

$app->post('/crimes', function() use ($app) {
  $request = $app->request();
  $inputs = json_decode($request->getBody(), true);
  $search_string = $inputs['search'];
  $python_res = shell_exec('xvfb-run python scrape/scrape.py ' . $search_string . ' 2>&1');
  $result = json_decode($python_res, true);
  echo json_encode($result);
});

$app->run();
?>
