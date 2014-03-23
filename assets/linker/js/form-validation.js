function checkPass()
{
  var pass1 = $("#password");
  var pass2 = $("#confirm-password");
  var goodColor = "#66cc66";
  var badColor = "#ff6666";
  if(pass1.val() == pass2.val()){
    pass2.css('background-color', goodColor);
  }else{
    pass2.css('background-color', badColor);    
  }
}  
