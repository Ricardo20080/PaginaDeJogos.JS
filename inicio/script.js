document.querySelectorAll(".play-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        window.location.href = btn.dataset.link;
    });
});