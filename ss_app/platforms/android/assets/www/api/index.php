<?php
// inclusions
require 'vendor/autoload.php';

// connect to database
$mysqli = new mysqli('localhost', 'root', 'root', 'safespot');

// glabal variables
$app = new \Slim\Slim();

/* ENDPOINTS */

// pointless test endpoint
$app->get('/', function () use ($mysqli) {
  echo '<h1>Using Slim Framework!</h1>';
});

// create a new user
$app->post('/users/new', function () use ($app, $mysqli) {
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

  if ($query = $mysqli->prepare("SELECT * FROM users WHERE username = ? LIMIT 1")) {
    $query->bind_param('s', $username);
    $query->execute();
    $query->store_result();
    if ($query->num_rows == 1) {
      echo json_encode('error');
    }
    else {
      if ($query = $mysqli->prepare("INSERT INTO users(username, email, firstname,
        lastname, pin, password, salt) VALUES (?, ?, ?, ?, NULL, ?, ?)")) {
        $query->bind_param('ssssss', $username, $email, $first, $last, $password, $salt);
        if ($query->execute()) {
          echo json_encode('success');
        }
        else {
          echo json_encode('error');
        }
      }
      echo json_encode('success');
    }
  }
});

// log in a user
$app->post('/users/login', function () use ($app, $mysqli) {
  session_start();
  $request = $app->request();
  $inputs = json_decode($request->getBody(), true);
  $username = $inputs['user'];
  $password = $inputs['pass'];

  if ($query = $mysqli->prepare("SELECT id, password, salt FROM users WHERE username = ? LIMIT 1")) {
    $query->bind_param('s', $username);
    $query->execute();
    $query->store_result();

    $query->bind_result($id, $db_password, $salt);
    $query->fetch();

    $password = hash('sha512', $password . $salt);

    if ($password == $db_password) {
      $_SESSION['id'] = $id;
      $_SESSION['user'] = $username;
      $_SESSION['pass'] = $db_password;
      $_SESSION['salt'] = $salt;
      echo json_encode('success');
    }
  }
});

// log out a user
$app->post('/users/logout', function () use ($app, $mysqli) {
  session_start();
  session_destroy();
  $_SESSION = array();
  echo json_encode('success');
});

// check which user is logged in
$app->get('/users/logged_in', function () use ($app, $mysqli) {
  session_start();
  if (isset($_SESSION['user'])) {
    echo json_encode($_SESSION['user']);
  }
  else {
    echo json_encode('nobody');
  }
});

// debug function to clear users table
$app->post('/users/clear', function () use ($app, $mysqli) {
  session_start();
  session_destroy();
  $_SESSION = array();
  if ($query = $mysqli->prepare("DELETE FROM users")) {
    $query->execute();
    if ($query = $mysqli->prepare("ALTER TABLE users AUTO_INCREMENT = 1")) {
      $query->execute();
    }
  }
  echo json_encode('success');
});

// change email
$app->post('/users/email', function () use ($app, $mysqli) {
  session_start();
  $request = $app->request();
  $inputs = json_decode($request->getBody(), true);
  $new_email = $inputs['email'];
  $mysqli->query("UPDATE users SET email = '" . $new_email . "' WHERE id = " . $_SESSION['id']);
  echo json_encode('success: email for user ' . $_SESSION['id'] . ' set to ' . $new_email);
});

// change pin
$app->post('/users/pin', function () use ($app, $mysqli) {
  session_start();
  $request = $app->request();
  $inputs = json_decode($request->getBody(), true);
  $new_pin = $inputs['pin'];

  $mysqli->query("UPDATE users SET pin = " . $new_pin . " WHERE id = " . $_SESSION['id']);
  echo json_encode('success: pin for user ' . $_SESSION['id'] . ' set to ' . $new_pin);
});

// change password
$app->post('/users/password', function () use ($app, $mysqli) {
  session_start();
  $request = $app->request();
  $inputs = json_decode($request->getBody(), true);
  $new_password = $inputs['pass'];

  $new_salt = hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true));
  $new_password_hash = hash('sha512', $new_password . $new_salt);

  $mysqli->query("UPDATE users SET password = '" . $new_password_hash . "', salt = '" . $new_salt . "' WHERE id = " . $_SESSION['id']);
  echo json_encode('success: pass for user ' . $_SESSION['id'] . ' set to ' . $new_password);
});

// get contacts
$app->get('/users/contacts', function() use ($app, $mysqli) {
  session_start();
  $contacts = array();
  if ($query = $mysqli->prepare('SELECT firstname, lastname, phone, street, city, state
      FROM contacts WHERE user_id = ?')) {
    $query->bind_param('i', $_SESSION['id']);
    $query->execute();
    $query->store_result();
    $query->bind_result($first, $last, $phone, $street, $city, $state);
    // iterate through contacts
    while ($query->fetch()) {
      $contact = array(
        'first' => $first,
        'last' => $last,
        'phone' => $phone,
        'street'=> $street,
        'city' => $city,
        'state' => $state
      );
      array_push($contacts, $contact);
    }
    $contacts_array = array('contacts' => $contacts);
    echo json_encode($contacts_array);
  }
});

$app->post('/users/contacts', function() use ($app, $mysqli) {
  session_start();
  $request = $app->request();
  $inputs = json_decode($request->getBody(), true);

  $first = $inputs['first'];
  $last = $inputs['last'];
  $phone = $inputs['phone'];
  $street = $inputs['street'];
  $city = $inputs['city'];
  $state = $inputs['state'];

  if ($query = $mysqli->prepare('INSERT INTO contacts(user_id, firstname, lastname, phone, street, city, state)
    VALUES (?, ?, ?, ?, ?, ?, ?)')) {
    $query->bind_param('ississs', $_SESSION['id'], $first, $last, $phone, $street, $city, $state);
    if ($query->execute()) {
      echo json_encode('success');
    }
    else {
      echo json_encode('error');
    }
  }
});

$app->delete('/users/contacts', function() use ($app, $mysqli) {
  session_start();
  $request = $app->request();
  $inputs = json_decode($request->getBody(), true);
  $first = $inputs['first'];
  $last = $inputs['last'];
  /*
  if ($query = $mysqli->prepare('DELETE FROM contacts WHERE  user_id = ?, firstname = ?, lastname = ?')) {
    $query->bind_param('iss', $_SESSION['id'], $first, $last);
    if ($query->execute()) {
      echo json_encode('success');
    }
    else {
      echo json_encode('error');
    }
  }*/
  $mysqli->query('DELETE FROM contacts WHERE user_id = ' . $_SESSION['id'] . ' AND firstname = "' . $first
    . '" AND lastname="' . $last . '"');
  echo json_encode('success : ' . $first . ' ' . $last);
});

$app->run();
?>
