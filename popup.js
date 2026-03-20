document.querySelectorAll("button[data-target]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const text = document.getElementById(btn.dataset.target).textContent;
    await navigator.clipboard.writeText(text);
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = "Copy"), 1500);
  });
});
