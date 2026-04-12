// Copied from NutriPlan/public/js/nav-indicator.js
(() => {
  const navList = document.querySelector(".nav ul");
  if (!navList) return;

  const links = Array.from(navList.querySelectorAll("a"));

  const getTargetLink = () => {
    const pathname = window.location.pathname;
    const path = pathname.split("/").filter(Boolean).pop() || "";
    return (
      links.find((link) => {
        const href = link.getAttribute("href") || "";
        if (href === "/" && pathname === "/") return true;
        if (href === "/" && path === "") return true;
        return href.endsWith(pathname) || href.endsWith(path);
      }) || links[0]
    );
  };

  const setActive = (link) => {
    links.forEach((l) => l.classList.remove("active"));
    if (link) link.classList.add("active");
  };

  setActive(getTargetLink());
  links.forEach((link) => {
    link.addEventListener("click", () => setActive(link));
  });
})();

