const percent_number_step = $.animateNumber.numberStepFactories.append('%');

// 프로그래스바 애니메이션 실행 함수
function animateProgressBar($bar, to) {
  $bar.stop(true, true) // 기존 애니메이션 중단
    .css('width', to + '%');

  $bar.animateNumber(
    {
      number: to,
      numberStep: percent_number_step
    },
    {
      duration: 2000,
      easing: 'swing',
      step: function (now) {
        $bar.css('width', now + '%');
      }
    }
  );
}


// Waypoint 연결 (중복 없이, 하나의 콜백으로)
$('.progress-bar').each(function () {
  const $bar = $(this);
  // 10은 10진법
  let rate = parseInt($bar.attr('data-rate'), 10);

  new Waypoint({
    element: this,
    handler: function (direction) {
      if (direction === 'down') {
        animateProgressBar($bar, rate);
      } else {
        animateProgressBar($bar, 0);
      }
    },
    offset: '90%' // 요소가 화면의 아래쪽 10% 안으로 들어올 때 실행됨 (100 - 90 = 10)
  });
});

const counter_number_step = $.animateNumber.numberStepFactories.append('+');

// 카운터 애니메이션 실행 함수
function animateCounter($num, to) {
  $num.animateNumber(
    {
      number: to,
      numberStep: counter_number_step
    },
    {
      easing: 'swing',
      duration: 2000
    }
  );
}

// Waypoint 연결
$('.counter').each(function () {
  const $num = $(this);
  const rate = parseInt($num.attr('data-rate'), 10);

  new Waypoint({
    element: this,
    handler: function (direction) {
      if (direction === 'down') {
        animateCounter($num, rate); // 아래로 스크롤 시 카운터 실행
      } else if (direction === 'up') {
        animateCounter($num, 0);    // 위로 스크롤 시 초기화
      }
    },
    offset: '90%' // 요소가 아래에서 10% 위치일 때 트리거됨
  });
});



