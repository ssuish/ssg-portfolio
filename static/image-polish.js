document.addEventListener("DOMContentLoaded", () => {
  const article = document.querySelector(".content");
  if (!article) return;

  const motionMQ = window.matchMedia("(prefers-reduced-motion: reduce)");

  initImagePolish(article, motionMQ.matches);
  initZoom(article);
  if (!motionMQ.matches) initGSAP(article);

  motionMQ.addEventListener("change", ({ matches }) => {
    if (!matches || !window.gsap) return;
    if (window.ScrollTrigger) ScrollTrigger.getAll().forEach((t) => t.kill());
    gsap.set(
      article.querySelectorAll(
        "h1, h2, h3, p, ul, ol, blockquote, pre, .image-frame",
      ),
      { clearProps: "all" },
    );
  });
});

function initImagePolish(article, prefersReduced) {
  const images = Array.from(article.querySelectorAll("img"));

  images.forEach((img) => {
    if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
    if (!img.hasAttribute("decoding")) img.setAttribute("decoding", "async");

    // Skip loading transition for users who prefer reduced motion
    if (!prefersReduced) {
      img.classList.add("img-loading");
      const markReady = () => {
        img.classList.remove("img-loading");
        img.classList.add("img-ready");
      };
      if (img.complete) {
        markReady();
      } else {
        img.addEventListener("load", markReady, { once: true });
        img.addEventListener("error", () => img.classList.remove("img-loading"), {
          once: true,
        });
      }
    }

    const wrapper = img.parentElement;
    const isStandaloneImageParagraph =
      wrapper?.tagName === "P" &&
      wrapper.childElementCount === 1 &&
      wrapper.firstElementChild === img;

    if (!img.closest(".image-frame") && isStandaloneImageParagraph) {
      const frame = document.createElement("figure");
      frame.className = "image-frame";
      wrapper.parentNode?.insertBefore(frame, wrapper);
      frame.appendChild(img);

      const maybeCaptionP = wrapper.nextElementSibling;
      if (maybeCaptionP?.tagName === "P") {
        const em = maybeCaptionP.querySelector("em");
        if (em && maybeCaptionP.textContent.trim() === em.textContent.trim()) {
          const cap = document.createElement("figcaption");
          cap.className = "image-caption";
          cap.textContent = em.textContent.trim();
          frame.appendChild(cap);
          maybeCaptionP.remove();
        }
      }

      wrapper.remove();
    }
  });
}

function initZoom(article) {
  if (!window.mediumZoom) return;
  mediumZoom(".content img", {
    margin: 24,
    background: "rgba(17, 24, 39, 0.85)",
  });
  article
    .querySelectorAll("img")
    .forEach((img) => img.classList.add("zoomable"));
}

function initGSAP(article) {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  // Gate hover effects to pointer-capable devices; touch devices skip mouse-only UX
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    gsap.utils.toArray(".nav-links a, .brand").forEach((el) => {
      el.addEventListener("mouseenter", () =>
        gsap.to(el, { y: -2, duration: 0.18, ease: "power2.out" }),
      );
      el.addEventListener("mouseleave", () =>
        gsap.to(el, { y: 0, duration: 0.18, ease: "power2.out" }),
      );
    });

    gsap.utils.toArray(".content a").forEach((el) => {
      el.addEventListener("mouseenter", () =>
        gsap.to(el, { y: -1, duration: 0.14, ease: "power2.out" }),
      );
      el.addEventListener("mouseleave", () =>
        gsap.to(el, { y: 0, duration: 0.14, ease: "power2.out" }),
      );
    });

    gsap.utils.toArray(".image-frame img").forEach((img) => {
      img.addEventListener("mouseenter", () =>
        gsap.to(img, { scale: 1.02, duration: 0.22, ease: "power2.out" }),
      );
      img.addEventListener("mouseleave", () =>
        gsap.to(img, { scale: 1, duration: 0.22, ease: "power2.out" }),
      );
    });
  }

  const revealTargets = article.querySelectorAll(
    "h1, h2, h3, p, ul, ol, blockquote, pre, .image-frame",
  );

  gsap.set(revealTargets, { opacity: 0, y: 10 });

  ScrollTrigger.batch(revealTargets, {
    start: "top 88%",
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
        stagger: 0.04,
      }),
  });
}
