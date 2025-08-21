   // 디지털 시계
   setInterval(function(){
      var now = new Date();
      var y = now.getFullYear();
      var m = now.getMonth() + 1;
      var d = now.getDate();
      var w = now.getDay();
      var hh = now.getHours();
      var mm = now.getMinutes();
      var ss = now.getSeconds();
      
      // 조건 연산자(? :)
      (m>=10) ? m=m : m='0'+m;
      (d>=10) ? d=d : d='0'+d;
      (mm>=10) ? mm=mm : mm='0'+mm;
      (ss>=10) ? ss=ss : ss='0'+ss;

      // 숫자 요일을 문자로
      if(w==1) {
         w = 'Mon';
      } else if(w==2) {
         w = 'Tue';
      } else if(w==3) {
         w = 'Wed';
      } else if(w==4) {
         w = 'Thu';
      } else if(w==5) {
         w = 'Fri';
      } else if(w==6) {
         w = 'Sat';
      } else {
         w = 'Sun';
      }

      // AM/PM 설정
      var ap;
      if(hh>=13) {
         hh = '0' + (hh - 12);
         ap = ' PM';
      } else if(hh>=10) {
         hh = hh;
         ap = ' AM';
      } else {
         hh = '0' + hh;
         ap = ' AM';
      }

      $('#mobile p span').eq(0).text(ap);
      $('#mobile p span').eq(1).text(hh);
      $('#mobile p span').eq(2).text(mm);
      $('#mobile p span').eq(3).text(ss);
      $('#mobile p span').eq(4).text(y);
      $('#mobile p span').eq(5).text(m);
      $('#mobile p span').eq(6).text(d);
      $('#mobile p span').eq(7).text(w);
   },1000);

   var now = new Date();
   var hh = now.getHours();

   if(hh>=5 && hh<11) {
      // 05시 이상 ~ 11시 미만
      $('#header').removeClass();
      $('#header').addClass('morning');
      $('#bnb li').removeClass();
      $('#bnb li').eq(0).addClass('on');
   } else if(hh>=11 && hh<16) {
      // 11시 이상 ~ 16시 미만
      $('#header').removeClass();
      $('#header').addClass('afternoon');
      $('#bnb li').removeClass();
      $('#bnb li').eq(1).addClass('on');
   } else if(hh>=16 && hh<20) {
      // 16시 이상 ~ 20시 미만
      $('#header').removeClass();
      $('#header').addClass('evening');
      $('#bnb li').removeClass();
      $('#bnb li').eq(2).addClass('on');
   } else if(hh>=20 && hh<25) {
      // 20시 이상 ~ 01시 미만
      $('#header').removeClass();
      $('#header').addClass('night');
      $('#bnb li').removeClass();
      $('#bnb li').eq(3).addClass('on');
   } else {
      // 01시 이상 ~ 05시 미만
      $('#header').removeClass();
      $('#header').addClass('night');
      $('#bnb li').removeClass();
      $('#bnb li').eq(3).addClass('on');
   }