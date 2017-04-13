

<div class="waterfall_text nid-<?php print $variables['nid']; ?>">
    <?php 
        if(isset($content['field_waterfall_display_title'])) {
            print '<h4 class="display_title">';
            print drupal_render($content['field_waterfall_display_title']);
            print '</h4>';
        }
        if(isset($content['field_waterfall_text_entity'])) {
            print(drupal_render($content['field_waterfall_text_entity']));
        }
    ?>
</div>


