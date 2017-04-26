var typingTimer;
var doneTypingInterval = 10;
var finaldoneTypingInterval = 500;

var oldData = $("p.content").html();
$('#tyingBox').keydown(function () {
    clearTimeout(typingTimer);
    if ($('#tyingBox').val) {
        typingTimer = setTimeout(function () {
            $("p.content").html('Typing...');
        }, doneTypingInterval);
    }
});

$('#tyingBox').keyup(function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(function () {
        $("p.content").html(oldData);
    }, finaldoneTypingInterval);
});