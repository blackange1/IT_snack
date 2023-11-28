document.addEventListener("DOMContentLoaded", function () {
    const print = console.log
    const ements = document.querySelectorAll(".tabs__item")
    for (const ement of ements) {
        ement.onclick = function() {
            print(this)
            this.style.zIndex = '-1';
        }
    }
});