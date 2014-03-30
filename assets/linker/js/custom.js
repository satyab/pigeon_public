$(document).ready(function() {
  $('.multiselect').multiselect({
    enableCaseInsensitiveFiltering: true,
    includeSelectAllOption: true,
    buttonContainer: '<div class="btn-group" />',
    buttonWidth: '300px',
    maxHeight: 200,
    buttonText: function(options) {
      if (options.length == 0) {
        return 'Select Option <b class="caret"></b>';
      }
      else if (options.length > 2) {
        return options.length + ' selected <b class="caret"></b>';
      }
      else {
        var selected = '';
        options.each(function() {
          selected += $(this).text() + ', ';
        });
        return selected.substr(0, selected.length -2) + ' <b class="caret"></b>';
      }
    },
  });
});
