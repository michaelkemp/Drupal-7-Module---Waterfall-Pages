

<div class="waterfall_file nid-<?php print $variables['nid']; ?>">
    <?php 
        if(isset($content['field_waterfall_display_title'])) {
            print '<h4 class="display_title">';
            print drupal_render($content['field_waterfall_display_title']);
            print '</h4>';
        }
        
        $title = isset($content['field_waterfall_file_entity']['#object']->title) ? $content['field_waterfall_file_entity']['#object']->title : "File";
        $uri = isset($content['field_waterfall_file_entity']['#object']->field_waterfall_file_entity[LANGUAGE_NONE][0]["uri"]) ? $content['field_waterfall_file_entity']['#object']->field_waterfall_file_entity[LANGUAGE_NONE][0]["uri"] : ""; 
        $url = file_create_url($uri);
       
        print "<a href='${url}' target='_blank'>${title}</a>";

        /*
        if(isset($content['field_waterfall_file_entity'])) {
            print(drupal_render($content['field_waterfall_file_entity']));
        }
        */

    ?>
</div>


