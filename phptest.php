<?php
echo json_encode([
  "php_works" => true,
  "version" => phpversion(),
  "mail_function_exists" => function_exists("mail"),
]);
