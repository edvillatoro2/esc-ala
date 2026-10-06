gsap.registerPlugin(ScrollTrigger);

function initHeroAnimation() {
  const hero = document.querySelector(".climb-hero");
  const image = document.querySelector(".climb-hero__image img");
  const scroller = document.querySelector(".page-wrapper");

  if (!hero || !image || !scroller) {
    console.log("Hero animation: element missing");
    return;
  }

  console.log("Hero animation: initializing");

  gsap.to(image, {
    scale: 1.925,
    ease: "none",
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: true,
      scroller: scroller,
    },
  });
}

function initPageHeroAnimation() {
  const heroes = document.querySelectorAll(".about-hero");

  if (!heroes.length) {
    console.log("Page hero animation: element missing");
    return;
  }

  console.log("Page hero animation: initializing");

  heroes.forEach((hero) => {
    const top = hero.querySelector(".about-hero__top");
    const title = hero.querySelector(".about-hero__title");
    const intro = hero.querySelector(".about-hero__intro");
    const visual = hero.querySelector(".about-hero__visual");
    const bottom = hero.querySelector(".about-hero__bottom");

    const elements = [top, title, intro, visual, bottom].filter(Boolean);

    // Set initial state
    gsap.set(elements, {
      opacity: 0,
      y: 30,
    });

    if (visual) {
      gsap.set(visual, {
        opacity: 0,
        y: 50,
        clipPath: "inset(100% 0% 0% 0%)",
      });
    }

    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    tl.to(top, {
      opacity: 1,
      y: 0,
      duration: 0.5,
    })
      .to(
        title,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
        },
        "-=0.25",
      )
      .to(
        intro,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        "-=0.4",
      )
      .to(
        visual,
        {
          opacity: 1,
          y: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1,
        },
        "-=0.3",
      )
      .to(
        bottom,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
        },
        "-=0.5",
      );
  });
}

function initAboutAnimation() {
  const about = document.querySelector(".custom-about");
  const holds = document.querySelectorAll(".custom-about__hold");
  const scroller = document.querySelector(".page-wrapper");

  if (!about || !holds.length || !scroller) {
    console.log("About animation: element missing");
    return;
  }

  console.log("About animation: initializing");

  const startingPositions = [
    { x: -180, y: 140, rotation: -35 },
    { x: 160, y: -160, rotation: 30 },
    { x: 200, y: 120, rotation: 40 },
    { x: -180, y: -140, rotation: -30 },
    { x: 180, y: 150, rotation: 35 },
    { x: -160, y: -120, rotation: -40 },
  ];

  holds.forEach((hold, index) => {
    gsap.set(hold, {
      x: startingPositions[index].x,
      y: startingPositions[index].y,
      rotation: startingPositions[index].rotation,
    });
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: about,
      start: "top 90%",
      end: "top 10%",
      scrub: true,
      scroller: scroller,
    },
  });

  tl.to(holds, {
    x: 0,
    y: 0,
    rotation: 0,
    ease: "none",
    stagger: 0.15,
  });
}

function initFeaturesAnimation() {
  const cards = document.querySelectorAll(".custom-feature");
  const scroller = document.querySelector(".page-wrapper");

  console.log("FEATURES DEBUG:", {
    cards: cards.length,
    scroller,
  });

  if (!cards.length || !scroller) {
    console.log("Features animation: element missing");
    return;
  }

  console.log("Features animation: initializing");

  const startingPositions = [
    { x: -400, y: 0, rotation: -8 },
    { x: 400, y: 0, rotation: 8 },
    { x: 0, y: 365, rotation: 8 },
  ];

  const mm = gsap.matchMedia();

  // DESKTOP
  mm.add("(min-width: 990px)", () => {
    cards.forEach((card, index) => {
      const position = startingPositions[index];

      gsap.fromTo(
        card,
        {
          x: position.x,
          y: position.y,
          rotation: position.rotation,
        },
        {
          x: 0,
          y: 0,
          rotation: 0,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            end: "top 50%",
            scrub: true,
            scroller: scroller,
          },
        },
      );
    });
  });
}

function initCommunityCursorAnimation() {
  const visual = document.querySelector(".about-community__visual");
  const holds = document.querySelectorAll(".about-community__visual .hold");
  if (!visual || !holds.length) {
    return;
  }
  const mm = gsap.matchMedia();
  mm.add("(min-width: 750px)", () => {
    const holdData = [];
    holds.forEach((hold, index) => {
      const strength = 0.725 + (index % 3) * 0.75;
      const quickX = gsap.quickTo(hold, "x", {
        duration: 0.7 + index * 0.04,
        ease: "power3.out",
      });
      const quickY = gsap.quickTo(hold, "y", {
        duration: 0.7 + index * 0.04,
        ease: "power3.out",
      });
      holdData.push({
        hold,
        strength,
        quickX,
        quickY,
      });
    });

    function moveHolds(event) {
      const rect = visual.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      holdData.forEach((item) => {
        const holdRect = item.hold.getBoundingClientRect();
        const holdCenterX = holdRect.left - rect.left + holdRect.width / 2;
        const holdCenterY = holdRect.top - rect.top + holdRect.height / 2;
        const distanceX = mouseX - holdCenterX;
        const distanceY = mouseY - holdCenterY;
        const distance = Math.sqrt(
          distanceX * distanceX + distanceY * distanceY,
        );

        const maxDistance = 650;
        const influence = Math.max(0, 1 - distance / maxDistance);
        item.quickX(distanceX * item.strength * influence);
        item.quickY(distanceY * item.strength * influence);
      });
    }

    function resetHolds() {
      holdData.forEach((item) => {
        item.quickX(0);
        item.quickY(0);
      });
    }

    visual.addEventListener("mousemove", moveHolds);
    visual.addEventListener("mouseleave", resetHolds);

    return () => {
      visual.removeEventListener("mousemove", moveHolds);
      visual.removeEventListener("mouseleave", resetHolds);
    };
  });
}

function initAnimations() {
  initHeroAnimation();
  initPageHeroAnimation();
  initAboutAnimation();
  initFeaturesAnimation();
  initCommunityCursorAnimation();
  ScrollTrigger.refresh();
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(initAnimations, 500);
  });
} else {
  setTimeout(initAnimations, 500);
}
document.addEventListener("shopify:section:load", () => {
  setTimeout(initAnimations, 100);
});
