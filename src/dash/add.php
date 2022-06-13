<?php

$short = (!empty($_POST['s']) ? preg_replace('/[^a-z0-9-]/i', '', $_POST['s']) : '');
$long = $_POST['l'];

$data = json_decode(file_get_contents('../.data.json'), true);
$longs = array_column($data, 'l');
$found = array_search($long, $longs);

// Make sure at least the long URL was supplied.
if (empty($long)) {
  http_response_code(400);
  echo json_encode(['status' => 'error', 'message' => 'Insufficient data supplied']);
  exit;
}

// Make sure the URL isn't already shortened.
if ($found !== false) {
  $shorts = array_keys($data);
  echo json_encode(['status' => 'success', 'message' => 'URL is already shortened', 'short' => $shorts[$found]]);
  exit;
}
