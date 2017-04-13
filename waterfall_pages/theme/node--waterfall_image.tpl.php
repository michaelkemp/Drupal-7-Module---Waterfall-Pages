

<div class="waterfall_image nid-<?php print $variables['nid']; ?>">
    <?php 
        if(isset($content['field_waterfall_display_title'])) {
            print '<h4 class="display_title">';
            print drupal_render($content['field_waterfall_display_title']);
            print '</h4>';
        }
        if(isset($content['field_waterfall_image_entity'])) {
            print(drupal_render($content['field_waterfall_image_entity']));
        }
    ?>
</div>


