gsap.registerPlugin(ScrollTrigger);

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => gsap.utils.toArray(selector);

let ctx;
let initTimeout;

//    inititalize animation

function initAnimations() {
  const scroller = $(".page-wrapper");
  if (!scroller) {
    return;
  }

  ctx?.revert();

  ScrollTrigger.defaults({
    scroller,
  });

  ctx = gsap.context(() => {
    //    1. HOMEPAGE HERO
    //    Image zooms while scrolling.
    const hero = $(".climb-hero");
    const image = $(".climb-hero__image img");

    if (hero && image) {
      gsap.to(image, {
        scale: 1.925,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }

    //    2. PAGE HERO
    //    Entrance animation used by:
    //    About / Membership / Classes
    const pageHeroSteps = [
      ["top", 0.5, 0],
      ["title", 0.8, 0.25],
      ["intro", 0.6, 0.4],
      ["visual", 1, 0.3],
      ["bottom", 0.5, 0.5],
    ];

    $$(".about-hero").forEach((section) => {
      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      pageHeroSteps.forEach(([name, duration, overlap]) => {
        const element = section.querySelector(`.about-hero__${name}`);

        if (!element) {
          return;
        }
        const isVisual = name === "visual";

        timeline.fromTo(
          element,
          {
            autoAlpha: 0,
            y: isVisual ? 50 : 30,
            ...(isVisual && {
              clipPath: "inset(100% 0% 0% 0%)",
            }),
          },
          {
            autoAlpha: 1,
            y: 0,
            duration,
            ...(isVisual && {
              clipPath: "inset(0% 0% 0% 0%)",
            }),
          },
          `-=${overlap}`,
        );
      });
    });

    //    3. HOMEPAGE ABOUT
    //    Climbing holds fly into position on scroll.
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
        x: (index) => aboutFrom[index % aboutFrom.length].x,
        y: (index) => aboutFrom[index % aboutFrom.length].y,

        rotation: (index) => aboutFrom[index % aboutFrom.length].rotation,
        ease: "none",
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

    //    4. HOMEPAGE FEATURES
    //    Desktop / tablet only.
    const featureFrom = [
      { x: -400, y: 0, rotation: -8 },
      { x: 400, y: 0, rotation: 8 },
      { x: 0, y: 365, rotation: 8 },
    ];

    const featureMedia = gsap.matchMedia();

    featureMedia.add("(min-width: 990px)", () => {
      $$(".custom-feature").forEach((card, index) => {
        const from = featureFrom[index % featureFrom.length];
        gsap.fromTo(card, from, {
          x: 0,
          y: 0,
          rotation: 0,
          ease: "none",

          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            end: "top 50%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });
    });

    //    5. ABOUT COMMUNITY
    //    Cursor-attracted climbing holds.
    //    Desktop / tablet only.

    const communityVisual = $(".about-community__visual");
    const floaters = $$(".about-community__visual .hold");
    const communityMedia = gsap.matchMedia();

    communityMedia.add("(min-width: 750px)", () => {
      if (!communityVisual || !floaters.length) {
        return;
      }
      const movers = floaters.map((element, index) => {
        const options = {
          duration: 0.7 + index * 0.04,
          ease: "power3.out",
        };
        return {
          strength: 0.725 + (index % 3) * 0.75,
          x: gsap.quickTo(element, "x", options),
          y: gsap.quickTo(element, "y", options),
        };
      });

      let centers = [];
      let visualRect;
      let animationFrame = null;
      let mouseX = 0;
      let mouseY = 0;
      let pointerInside = false;

      //  Cache hold positions.
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

      //  Move holds once per animation frame.

      const update = () => {
        animationFrame = null;
        if (!pointerInside || !centers.length) {
          return;
        }

        const maxDistance = 650;

        movers.forEach((mover, index) => {
          const center = centers[index];
          const dx = mouseX - center.x;
          const dy = mouseY - center.y;
          const distance = Math.hypot(dx, dy);
          const influence = Math.max(0, 1 - distance / maxDistance);
          mover.x(dx * mover.strength * influence);
          mover.y(dy * mover.strength * influence);
        });
      };

      //   pointer enters
      const handlePointerEnter = () => {
        measure();
        pointerInside = true;
      };

      //   pointer moves
      const handlePointerMove = (event) => {
        if (!visualRect) {
          measure();
        }
        mouseX = event.clientX - visualRect.left;
        mouseY = event.clientY - visualRect.top;
        pointerInside = true;
        if (!animationFrame) {
          animationFrame = requestAnimationFrame(update);
        }
      };

      //   pointer leaves
      const handlePointerLeave = () => {
        pointerInside = false;
        movers.forEach((mover) => {
          mover.x(0);
          mover.y(0);
        });
      };

      // Recalculate positions on resize.
      const handleResize = () => {
        measure();
      };
      communityVisual.addEventListener("pointerenter", handlePointerEnter);
      communityVisual.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });
      communityVisual.addEventListener("pointerleave", handlePointerLeave);
      window.addEventListener("resize", handleResize, { passive: true });

      // Initial measurement
      measure();

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
        communityVisual.removeEventListener("pointerenter", handlePointerEnter);
        communityVisual.removeEventListener("pointermove", handlePointerMove);
        communityVisual.removeEventListener("pointerleave", handlePointerLeave);
        window.removeEventListener("resize", handleResize);
      };
    });
  });
  ScrollTrigger.refresh();
}

// Inititalization
function scheduleInit(delay = 500) {
  clearTimeout(initTimeout);
  initTimeout = setTimeout(() => {
    initAnimations();
  }, delay);
}
const start = () => {
  scheduleInit(500);
};
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}
// Shopify theme editor
document.addEventListener("shopify:section:load", () => {
  scheduleInit(100);
});
