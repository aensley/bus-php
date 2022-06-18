<?php

require '../config.php';

$data = getData();
$list = [];

foreach ($data as $s => $val) {
  $list[] = ['s' => $s, 'l' => $val['l'], 'c' => $val['c']];
}

echo json_encode($list);
