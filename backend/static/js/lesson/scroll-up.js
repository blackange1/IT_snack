const scrollUp = document.querySelector("#scroll-up");

scrollUp.addEventListener("click", () => {
  const $main = document.querySelector("main");
  $main.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});