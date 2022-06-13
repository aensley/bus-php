<?php

$data = json_decode(file_get_contents('../.data.json'), true);
$list = [];

foreach($data as $s => $val) {
  $list[] = ['s' => $s, 'l' => $val['l'], 'c' => $val['c']];
}

echo json_encode($list);
