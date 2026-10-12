gsap.registerPlugin(ScrollTrigger);

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => gsap.utils.toArray(selector);
let ctx;
let initTimeout;

// Stops mobile URL-bar show/hide from triggering refreshes mid-scroll
ScrollTrigger.config({ ignoreMobileResize: true });

function initAnimations() {
  const scroller = $(".page-wrapper");
  if (!scroller) return;

  ctx?.revert();
  ScrollTrigger.defaults({ scroller });

  ctx = gsap.context(() => {
    // 1. homepage hero scroll animation
    const hero = $(".climb-hero");
    const image = $(".climb-hero__image img");

    if (hero && image) {
      gsap.to(image, {
        scale: 1.475,
        transformOrigin: "50% 50%",
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }

    // 2. hero animation (About / Membership / Classes)
    const pageHeroSteps = [
      ["top", 0.5, 0],
      ["title", 0.8, 0.25],
      ["intro", 0.6, 0.4],
      ["visual", 1, 0.3],
      ["bottom", 0.5, 0.5],
    ];

    $$(".about-hero").forEach((section) => {
      const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });

      pageHeroSteps.forEach(([name, duration, overlap]) => {
        const element = section.querySelector(`.about-hero__${name}`);
        if (!element) return;
        const isVisual = name === "visual";

        timeline.fromTo(
          element,
          {
            autoAlpha: 0,
            y: isVisual ? 50 : 30,
            ...(isVisual && { clipPath: "inset(100% 0% 0% 0%)" }),
          },
          {
            autoAlpha: 1,
            y: 0,
            duration,
            ...(isVisual && { clipPath: "inset(0% 0% 0% 0%)" }),
            // Remove the leftover clip-path once finished so it isn't
            // re-evaluated on every later repaint
            clearProps: isVisual ? "clipPath" : "",
          },
          `-=${overlap}`,
        );
      });
    });

    // 3. homepage about section - holds animation on scroll
    const about = $(".custom-about");
    const holds = $$(".custom-about__hold");

    const aboutFrom = [
      { x: -180, y: 140, rotation: -35 },
      { x: 160, y: -160, rotation: 30 },
      { x: 200, y: 120, rotation: 40 },
      { x: -180, y: -140, rotation: -30 },
      { x: 180, y: 150, rotation: 35 },
      { x: -160, y: -120, rotation: -40 },
    ];

    if (about && holds.length) {
      gsap.from(holds, {
        x: (i) => aboutFrom[i % aboutFrom.length].x,
        y: (i) => aboutFrom[i % aboutFrom.length].y,
        rotation: (i) => aboutFrom[i % aboutFrom.length].rotation,
        ease: "none",
        force3D: true,
        stagger: 0.15,
        scrollTrigger: {
          trigger: about,
          start: "top 90%",
          end: "top 10%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }

    // 4. homepage features — desktop / tablet only
    const featureFrom = [
      { x: -400, y: 0, rotation: -8 },
      { x: 400, y: 0, rotation: 8 },
      { x: 0, y: 365, rotation: 8 },
    ];

    gsap.matchMedia().add("(min-width: 990px)", () => {
      $$(".custom-feature").forEach((card, index) => {
        const from = featureFrom[index % featureFrom.length];
        gsap.fromTo(card, from, {
          x: 0,
          y: 0,
          rotation: 0,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            // Stable parent (the grid), not the element being moved
            trigger: card.parentElement,
            start: "top 90%",
            end: "top 50%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });
    });

    // 5. about page community — cursor holds animation
    const communityVisual = $(".about-community__visual");
    const floaters = $$(".about-community__visual .hold");

    gsap
      .matchMedia()
      .add("(min-width: 750px) and (hover: hover) and (pointer: fine)", () => {
        if (!communityVisual || !floaters.length) return;

        // keep a permanent 3D transform so GSAP doesn't swap layers mid-hover
        gsap.set(floaters, { force3D: true });

        const strengths = [2, 2.25, 2.75];
        const maxDistance = 650;

        const movers = floaters.map((element, index) => {
          const options = {
            duration: 0.7 + index * 0.04,
            ease: "power2.out",
          };
          return {
            strength: strengths[index % strengths.length],
            x: gsap.quickTo(element, "x", options),
            y: gsap.quickTo(element, "y", options),
          };
        });

        let centers = [];
        let visualRect = null;
        let frame = null;
        let clientX = 0;
        let clientY = 0;
        let pointerInside = false;

        // Hold centers relative to the visual (independent of scroll position)
        const measure = () => {
          visualRect = communityVisual.getBoundingClientRect();
          centers = floaters.map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              x:
                rect.left -
                visualRect.left +
                rect.width / 2 -
                gsap.getProperty(element, "x"),
              y:
                rect.top -
                visualRect.top +
                rect.height / 2 -
                gsap.getProperty(element, "y"),
            };
          });
        };

        const update = () => {
          frame = null;
          if (!pointerInside || !centers.length) return;

          // Re-read the visual's position every frame so scrolling can't
          // leave us chasing a stale cursor position
          visualRect = communityVisual.getBoundingClientRect();
          const mouseX = clientX - visualRect.left;
          const mouseY = clientY - visualRect.top;

          movers.forEach((mover, index) => {
            const dx = mouseX - centers[index].x;
            const dy = mouseY - centers[index].y;
            const influence = Math.max(0, 1 - Math.hypot(dx, dy) / maxDistance);
            mover.x(dx * mover.strength * influence);
            mover.y(dy * mover.strength * influence);
          });
        };

        const requestUpdate = () => {
          if (!frame) frame = requestAnimationFrame(update);
        };

        const handlePointerEnter = (event) => {
          clientX = event.clientX;
          clientY = event.clientY;
          measure();
          pointerInside = true;
          scroller.addEventListener("scroll", requestUpdate, { passive: true });
          requestUpdate();
        };

        const handlePointerMove = (event) => {
          clientX = event.clientX;
          clientY = event.clientY;
          pointerInside = true;
          requestUpdate();
        };

        const handlePointerLeave = () => {
          pointerInside = false;
          scroller.removeEventListener("scroll", requestUpdate);
          if (frame) {
            cancelAnimationFrame(frame);
            frame = null;
          }
          movers.forEach((mover) => {
            mover.x(0);
            mover.y(0);
          });
        };

        const handleResize = () => measure();

        communityVisual.addEventListener("pointerenter", handlePointerEnter);
        communityVisual.addEventListener("pointermove", handlePointerMove, {
          passive: true,
        });
        communityVisual.addEventListener("pointerleave", handlePointerLeave);
        window.addEventListener("resize", handleResize, { passive: true });

        measure();

        return () => {
          if (frame) cancelAnimationFrame(frame);
          scroller.removeEventListener("scroll", requestUpdate);
          communityVisual.removeEventListener(
            "pointerenter",
            handlePointerEnter,
          );
          communityVisual.removeEventListener("pointermove", handlePointerMove);
          communityVisual.removeEventListener(
            "pointerleave",
            handlePointerLeave,
          );
          window.removeEventListener("resize", handleResize);
        };
      });
  });

  requestAnimationFrame(() => ScrollTrigger.refresh());
}

// initialization
function scheduleInit(delay = 0) {
  clearTimeout(initTimeout);
  if (delay > 0) {
    initTimeout = setTimeout(initAnimations, delay);
  } else {
    initAnimations();
  }
}

// recalculate trigger positions once images and fonts have settled
let refreshTimeout;
const refreshSoon = () => {
  clearTimeout(refreshTimeout);
  refreshTimeout = setTimeout(() => ScrollTrigger.refresh(), 100);
};

const start = () => {
  initAnimations();
  if (document.readyState === "complete") {
    refreshSoon();
  } else {
    window.addEventListener("load", refreshSoon, { once: true });
  }
  document.fonts?.ready.then(refreshSoon);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}

// Shopify theme editor
document.addEventListener("shopify:section:load", () => scheduleInit(100));
