document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById("loginModal");
    const openBtn = document.getElementById("openLoginModal");
    const closeBtn = document.querySelector(".close");

    if (openBtn) {
        openBtn.onclick = function () {
            modal.style.display = "block";
        }
    }

    if (closeBtn) {
        closeBtn.onclick = function () {
            modal.style.display = "none";
        }
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
});
