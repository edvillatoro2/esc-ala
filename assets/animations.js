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
  const community = document.querySelector(".about-community");
  const holds = document.querySelectorAll(".about-community__hold .hold");

  if (!community || !holds.length) {
    console.log("Community cursor animation: element missing", {
      community,
      holds: holds.length,
    });
    return;
  }

  console.log("Community cursor animation: found", {
    community,
    holds: holds.length,
    gsap: typeof gsap,
  });

  const mm = gsap.matchMedia();

  mm.add("(min-width: 750px)", () => {
    console.log("Community cursor animation: initializing");

    const quickX = [];
    const quickY = [];

    holds.forEach((hold, index) => {
      const strength = 8 + (index % 3) * 3;

      quickX[index] = gsap.quickTo(hold, "x", {
        duration: 0.5,
        ease: "power3.out",
      });

      quickY[index] = gsap.quickTo(hold, "y", {
        duration: 0.5,
        ease: "power3.out",
      });

      hold.dataset.strength = strength;
    });

    const moveHolds = (event) => {
      const rect = community.getBoundingClientRect();

      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const percentX = (mouseX - centerX) / centerX;
      const percentY = (mouseY - centerY) / centerY;

      holds.forEach((hold, index) => {
        const strength = Number(hold.dataset.strength);

        quickX[index](percentX * strength);
        quickY[index](percentY * strength);
      });
    };

    const resetHolds = () => {
      holds.forEach((hold, index) => {
        quickX[index](0);
        quickY[index](0);
      });
    };

    community.addEventListener("mousemove", moveHolds);
    community.addEventListener("mouseleave", resetHolds);

    return () => {
      community.removeEventListener("mousemove", moveHolds);
      community.removeEventListener("mouseleave", resetHolds);
    };
  });
}

window.addEventListener("load", () => {
  setTimeout(() => {
    initHeroAnimation();
    initAboutAnimation();
    initFeaturesAnimation();
    initCommunityCursorAnimation();
    ScrollTrigger.refresh();
  }, 500);
});
