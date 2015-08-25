var color = function () {
  return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}

if (window.$) {
  $(document).on('click', 'body', function () {
    $('body').css('background-color', color())
  })
}