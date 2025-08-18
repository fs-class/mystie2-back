// 스크롤 이벤트 감지 및 클래스 토글
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('mainNavbar');
    // 스크롤이 50px 이상 되면 헤더에 navbar-scrolled 클래스가 추가
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});


// 작품 이미지 라이트 박스
lightbox.option({
    'resizeDuration': 200,      // 이미지 전환 애니메이션 속도(ms)
    'wrapAround': true,         // 마지막 이미지에서 첫 번째 이미지로 이동 가능
    'alwaysShowNavOnTouchDevices': true, // 모바일에서도 화살표 항상 보이기
    'fadeDuration': 200,        // 페이드인·아웃 속도
    'imageFadeDuration': 200    // 이미지 자체 전환 속도
});