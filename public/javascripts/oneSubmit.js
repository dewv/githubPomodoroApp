// TODO do this without jquery
$(function() {
    $('form').submit(function() {
        $(':submit', this)
            .val("Please Wait...")
            .attr('disabled', true);

    });
});
