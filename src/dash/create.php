<?php

require '../config.php';

$short = (!empty($_POST['s']) ? preg_replace('/[^a-z0-9-]/i', '', $_POST['s']) : '');
$long = $_POST['l'];

// Make sure at least the long URL was supplied.
if (empty($long)) {
  http_response_code(400);
  echo json_encode(
    ['status' => 'error', 'message' => 'Insufficient data supplied'],
    JSON_FORCE_OBJECT
  );
  exit;
}

$data = getData();
$longs = array_column($data, 'l');
$found = array_search($long, $longs);

// Make sure the long URL isn't already shortened.
if ($found !== false) {
  $shorts = array_keys($data);
  echo json_encode(
    ['status' => 'success', 'message' => 'URL is already shortened', 'short' => $shorts[$found], 'long' => $long],
    JSON_FORCE_OBJECT
  );
  exit;
}

// Make sure the short URL isn't already taken.
if (!empty($short) && array_key_exists($short, $data)) {
  http_response_code(400);
  echo json_encode(
    ['status' => 'error', 'message' => 'Short URL already exists', 'short' => $short, 'long' => $data[$short]['l']],
    JSON_FORCE_OBJECT
  );
  exit;
}

// Generate short code
if (empty($short)) {
  $count = 0;
  do {
    $short = substr(hash('sha512', $long . $count++), 0, 6);
  } while (array_key_exists($short, $data));
}

// All checks complete. Add the URL.
$data[$short] = ['l' => $long, $c => time()];
try {
  setData($data);
  echo json_encode(
    ['status' => 'success', 'message' => 'Short URL added', 'short' => $short, 'long' => $long],
    JSON_FORCE_OBJECT
  );
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(
    ['status' => 'error', 'message' => 'Unable to add Short URL', 'short' => $short, 'long' => $long],
    JSON_FORCE_OBJECT
  );
}
