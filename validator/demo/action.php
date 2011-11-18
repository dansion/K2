<?php header("Content-Type: text/html; charset=GBK"); ?>

<table border="1">
  <thead>
    <tr>
      <th>name</th>
      <th>value</th>
    </tr>  
  </thead>
  
  <tbody>
    <?php
      foreach($_POST as $key => $value) {
        $value = empty($value) ? "(empty)" : $value;
        echo "<tr><td>$key</td><td>";
        
        if(is_array($value)) {
          foreach($value as $k1 => $k2) {
            echo "$k1 => $k2 <br>";
          }
        }
        else {
           echo $value;
        }

        echo "</td></tr>";
      }
    ?>
  </tbody>

</table>

<p>
<a href="<?php echo $_SERVER[ "HTTP_REFERER"]; ?>">·µ»Ø&gt;&gt;</a>
</p>