
$("#username").keyup(function (event) {
        if(event.which === 32){
          $("#warning").css("display","block");
        }
      });
