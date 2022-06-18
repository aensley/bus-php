<?php

require '../config.php';

// Config
$env = getEnvJson();
$data = getData();

// Index
readfile(DASH_HTML);
