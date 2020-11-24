<?php
    $url = "http://www.giantbomb.com/api/search/?api_key=5abebccc60f9a3c6eb0b4d38124138d10ba4291a&format=json&resources=game&limit=1";

    $page = 1;
    $query = "Call of Duty";
    $fields = "description,deck,name,developers,original_release_date";
    if(array_key_exists('q', $_GET)){
        $query = $_GET['q'];
        $query = urlencode($query);
    }
    $url = $url . "&query=" . $query;
    if(array_key_exists('page', $_GET)){
        $page = $_GET['page'];
        $page = (int)$page;
        if($page < 1){
            $page = 1;
        }
    }
    $url = $url . "&page=" . $page;
    if(array_key_exists('fields', $_GET)){
        $fields = $_GET['fields'];
    }

    $url = $url . "&field_list=" . $fields;

    header('content-type:application/json');
    header("Access-Control-Allow_Origin: *");
    #echo $url;
    $string = file_get_contents($url);
    $pattern = '/<.*?>/i';
    $spaces = '/  +/i';
    $string = preg_replace($pattern, " ", $string);
    $string = preg_replace($spaces, " ", $string);
    echo $string;
?>