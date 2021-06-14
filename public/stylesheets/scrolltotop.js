$(document).ready(function () {
  $(function () {
      $('container a').click(function (e) {
          e.preventDefault();
          $('a').removeClass('active');
          $(this).addClass('active');
          });
      });
});