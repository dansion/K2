<?php
$target_path = "uploads/"; 

$target_path = $target_path . basename( $_FILES['uploadFile']['name']);  

$messages = array();

array_push($messages, '{"code":"500","message":"不是合法图片","id":"","n":"","m":"","t":""}');
array_push($messages, '{"code":200, "message":"sucess", "id":"bi30ab0bbea1344d3adbd718fadd8c3074d6", "n":"n03", "m":"a", "t":"image/jpeg"}');

sleep(1);
echo $messages[1];
?>