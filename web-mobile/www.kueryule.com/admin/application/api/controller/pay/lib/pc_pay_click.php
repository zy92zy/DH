<?php
include_once '../../config.php';
if(select($_GET['order'],false) != null)
die ('success');
else
die ('fail');