$(".motion").waypoint(
    function (e) {
        if (e === "down") {
            $(".motion").each(function (index) {
                $(this).delay(index * 200).animate({
                    top: 0,
                    opacity: 1
                }, 500); // 각 요소의 애니메이션 지속 시간
            });
        } else {
            $(".motion").each(function (index) {
                $(this).delay(index * 200).animate({
                    top: 400,
                    opacity: 0
                }, 500);
            });
        }
    },
    {
        // 해당 요소가 뷰포트(viewport, 화면)에 얼마나 들어왔을 때 이벤트를 실행할지 결정하는 기준점
        offset: "90%"
    }
);