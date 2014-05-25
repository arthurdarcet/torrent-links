<?php

$pass = 'secret';
$base_dir = '/home/media/torrents/.watch/';
$dirs = array('manual', 'show', 'movie', 'book');

if(!isset($_REQUEST['p']) || $_REQUEST['p'] != $pass || empty($_REQUEST['url']))
    exit;

if(!isset($_REQUEST['cat']) || !in_array($_REQUEST['cat'], $dirs))
    $_REQUEST['cat'] = 'manual';

$_REQUEST['url'] = urldecode($_REQUEST['url']);
if(substr($_REQUEST['url'],0,7) == 'magnet:')
    $content = 'd10:magnet-uri'.strlen($_REQUEST['url']).':'.$_REQUEST['url'].'e';
else
    $content = file_get_contents($_REQUEST['url']);

$file = fopen($base_dir.$_REQUEST['cat'].'/'.md5(time()).'.torrent', 'w');
if(fwrite($file, $content) !== false)
    echo 'ok';
fclose($file);

