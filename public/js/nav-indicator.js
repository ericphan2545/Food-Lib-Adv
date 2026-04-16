(() => {
  const navList = document.querySelector(".nav ul");
  if (!navList) return;

  const links = Array.from(navList.querySelectorAll("a"));
  let activeLink = null;

  const getTargetLink = () => {
    // Get the current pathname and extract the filename
    const pathname = window.location.pathname;
    // Remove base path if present (e.g., /NutriPlan/)
    const path = pathname.replace(/^\/NutriPlan\//, '/').split("/").pop() || "index.html";
    return (
      links.find((link) => {
        const href = link.getAttribute("href");
        // Extract filename from href (could be /NutriPlan/index.html or index.html)
        const hrefFile = href.split("/").pop();
        return hrefFile && (path === hrefFile || path.endsWith(hrefFile));
      }) || links[0]
    );
  };

  const setActive = (link) => {
    // Remove active class from all links
    links.forEach((l) => l.classList.remove("active"));
    // Add active class to clicked link
    if (link) {
      link.classList.add("active");
      activeLink = link;
    }
  };

  // Initialize active link
  const initialLink = getTargetLink();
  setActive(initialLink);

  // Click handlers
  links.forEach((link) => {
    link.addEventListener("click", () => setActive(link));
  });
})();

