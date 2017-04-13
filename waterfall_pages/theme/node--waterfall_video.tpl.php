

<div class="waterfall_video nid-<?php print $variables['nid']; ?>">
    <?php 
        if(isset($content['field_waterfall_display_title'])) {
            print '<h4 class="display_title">';
            print drupal_render($content['field_waterfall_display_title']);
            print '</h4>';
        }
        
        $vidID = isset($content['field_waterfall_video_entity']['#object']->field_waterfall_video_entity[LANGUAGE_NONE][0]["video_id"]) ? $content['field_waterfall_video_entity']['#object']->field_waterfall_video_entity[LANGUAGE_NONE][0]["video_id"] : ""; 
        print "<div class='waterfall_video_wrapper'>";
        print "<iframe width='560' height='349' src='http://www.youtube.com/embed/${vidID}?&rel=0&autoplay=0&showinfo=0&controls=1&wmode=opaque&hd=1' frameborder='0' allowfullscreen></iframe>";
        print "</div>";
        
        /*
        if(isset($content['field_waterfall_video_entity'])) {
            print(drupal_render($content['field_waterfall_video_entity']));
        }
        */
    ?>
</div>


