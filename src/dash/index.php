<?php

// Config
$env = json_decode(file_get_contents('../.env.json'), true);
$data = json_decode(file_get_contents('../.data.json'), true);

// Index
$index = file_get_contents('.index.html');
echo str_replace('{{site-name}}', $env['public-domain'], $index);
