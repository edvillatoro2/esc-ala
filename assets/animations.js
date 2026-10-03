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
    { x: 0, y: 200, rotation: 8 },
  ];

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
}

window.addEventListener("load", () => {
  setTimeout(() => {
    initHeroAnimation();
    initAboutAnimation();
    initFeaturesAnimation();
    ScrollTrigger.refresh();
  }, 500);
});
