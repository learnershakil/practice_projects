<?php
$file = 'count.txt';

// Check kar file exists kar rha h ya nhi
if (!file_exists($file)) {
    // agr nhi toh file bna aur counter 0 se suru kar
    file_put_contents($file, '0');
}

// Check kr POST request h
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // agr hn toh counter badha
    $count = file_get_contents($file);
    $count++;
    file_put_contents($file, $count);
} else {
    // agr nhi toh sirf file padh
    $count = file_get_contents($file);
}

// Return karega current value counter ka
echo $count;
?>