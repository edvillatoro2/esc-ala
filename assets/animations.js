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
  const features = document.querySelector(".custom-features");
  const cards = document.querySelectorAll(".custom-feature");
  const scroller = document.querySelector(".page-wrapper");

  if (!features || cards.length < 3 || !scroller) {
    console.log("Features animation: element missing");
    return;
  }

  console.log("Features animation: initializing");

  // Starting positions
  gsap.set(cards[0], {
    x: -300,
    rotation: -8,
  });

  gsap.set(cards[1], {
    x: 300,
    rotation: 8,
  });

  gsap.set(cards[2], {
    y: 300,
    rotation: 8,
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: features,
      start: "top 80%",
      end: "top 20%",
      scrub: true,
      scroller: scroller,
    },
  });

  tl.to(
    cards[0],
    {
      x: 0,
      rotation: 0,
      ease: "none",
    },
    0,
  );

  tl.to(
    cards[1],
    {
      x: 0,
      rotation: 0,
      ease: "none",
    },
    0.15,
  );

  tl.to(
    cards[2],
    {
      y: 0,
      rotation: 0,
      ease: "none",
    },
    0.3,
  );
}

window.addEventListener("load", () => {
  setTimeout(() => {
    initHeroAnimation();
    initAboutAnimation();
    initFeaturesAnimation();
    ScrollTrigger.refresh();
  }, 500);
});
