document.documentElement.classList.add("js");

(() => {
  const farmImages = [
    {
      src: "images.html/JPEG%20Image_(01).jpg",
      alt: "Curious pigs leaning over a feeding trough inside a barn",
      caption: ["Family run · Est. 2024", "Gungupa, Chamba"],
    },
    {
      src: "images.html/JPEG%20Image_(02).jpg",
      alt: "Piglets standing in a bright, clean pen",
      caption: ["Our herd", "Healthy, curious piglets"],
    },
    {
      src: "images.html/JPEG%20Image_(03).jpg",
      alt: "A large herd of pigs gathered in a farm pen",
      caption: ["A healthy herd", "Raised with daily care"],
    },
    {
      src: "images.html/JPEG%20Image_(04).jpg",
      alt: "Piglets nursing from their mother in a farrowing pen",
      caption: ["Thoughtful care", "From the very beginning"],
    },
    {
      src: "images.html/JPEG%20Image_(05).jpg",
      alt: "Pigs resting in a bright, well-kept pen",
      caption: ["Comfortable pens", "A clean place to rest"],
    },
    {
      src: "images.html/JPEG%20Image_(06).jpg",
      alt: "Healthy piglets walking together across a clean pen",
      caption: ["Healthy piglets", "Growing strong together"],
    },
    {
      src: "images.html/JPEG%20Image_(07).jpg",
      alt: "Pigs resting and exploring on fresh straw bedding",
      caption: ["Room to roam", "Fresh straw and space"],
    },
  ];

  const themeButton = document.getElementById("th");
  const savedTheme = localStorage.getItem("farm-theme");
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;

  themeButton?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("farm-theme", next);
  });

  const menuButton = document.getElementById("mn");
  const menu = document.getElementById("lk");
  menuButton?.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
    });
  });

  const background = document.querySelector(".bgp");
  if (background) {
    background.style.setProperty(
      "--photo",
      `url("${farmImages[6].src}")`
    );
  }
  const backgroundImageByLabel = new Map([
    ["A large herd", farmImages[2].src],
    ["Healthy piglets walking", farmImages[5].src],
    ["Piglets nursing", farmImages[3].src],
    ["Piglets standing", farmImages[1].src],
    ["Curious pigs leaning", farmImages[0].src],
    ["Pigs resting", farmImages[6].src],
  ]);
  document.querySelectorAll(".spin[data-k]").forEach((bubble) => {
    const image = backgroundImageByLabel.get(bubble.dataset.k);
    if (image) bubble.style.setProperty("--herd", `url("${image}")`);
  });
  const backgroundBubbles = [...document.querySelectorAll(".spin")];
  if (
    backgroundBubbles.length &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches &&
    matchMedia("(hover: hover) and (pointer: fine)").matches
  ) {
    const depths = [18, 28, 12, 22, 10, 16];
    const positions = backgroundBubbles.map(() => ({ x: 0, y: 0 }));
    let pointerX = 0;
    let pointerY = 0;
    addEventListener("pointermove", (event) => {
      pointerX = event.clientX / innerWidth * 2 - 1;
      pointerY = event.clientY / innerHeight * 2 - 1;
    }, { passive: true });

    const followPointer = () => {
      backgroundBubbles.forEach((bubble, index) => {
        const position = positions[index];
        const depth = depths[index % depths.length];
        position.x += (pointerX * depth - position.x) * 0.045;
        position.y += (pointerY * depth - position.y) * 0.045;
        bubble.style.setProperty("--parallax-x", `${position.x.toFixed(2)}px`);
        bubble.style.setProperty("--parallax-y", `${position.y.toFixed(2)}px`);
      });
      requestAnimationFrame(followPointer);
    };
    requestAnimationFrame(followPointer);
  }

  const hero = document.getElementById("hs");
  if (hero) {
    const track = hero.querySelector(".hs-track");
    const slides = [...hero.querySelectorAll(".hsl")];
    farmImages.slice(1).forEach((image) => {
      const slide = document.createElement("img");
      slide.className = "hsl";
      slide.src = image.src;
      slide.alt = image.alt;
      slide.width = 612;
      slide.height = 408;
      slide.decoding = "async";
      track.appendChild(slide);
      slides.push(slide);
    });
    let index = 0;
    const dots = document.getElementById("hd");
    const caption = document.getElementById("hc");
    let timer;
    if (dots) {
      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", `Show photo ${i + 1}`);
        dot.addEventListener("click", () => show(i));
        dots.appendChild(dot);
      });
    }
    const show = (next) => {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("on", i === index));
      dots?.querySelectorAll("button").forEach((dot, i) => dot.setAttribute("aria-current", i === index ? "true" : "false"));
      if (caption) {
        caption.querySelector("small").textContent = farmImages[index].caption[0];
        caption.querySelector("span").textContent = farmImages[index].caption[1];
      }
    };
    const startSlideshow = () => {
      clearInterval(timer);
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
        timer = setInterval(() => show(index + 1), 5000);
      }
    };
    document.getElementById("hp")?.addEventListener("click", () => {
      show(index - 1);
      startSlideshow();
    });
    document.getElementById("hn")?.addEventListener("click", () => {
      show(index + 1);
      startSlideshow();
    });
    hero.addEventListener("mouseenter", () => clearInterval(timer));
    hero.addEventListener("mouseleave", startSlideshow);
    hero.addEventListener("focusin", () => clearInterval(timer));
    hero.addEventListener("focusout", startSlideshow);
    show(0);
    startSlideshow();
  }

  const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 })
    : null;
  document.querySelectorAll(".rv").forEach((element) => {
    revealObserver ? revealObserver.observe(element) : element.classList.add("in");
  });

  const inquiryItems = new Set();
  const inquiryCount = document.getElementById("ic");
  const inquiryEmpty = document.getElementById("ie");
  const inquiryList = document.getElementById("il");
  const inquirySend = document.getElementById("is");
  const renderInquiry = () => {
    if (!inquiryList) return;
    inquiryList.replaceChildren();
    inquiryItems.forEach((item) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = item;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `Remove ${item}`);
      remove.addEventListener("click", () => {
        inquiryItems.delete(item);
        renderInquiry();
      });
      chip.appendChild(remove);
      inquiryList.appendChild(chip);
    });
    if (inquiryCount) inquiryCount.textContent = String(inquiryItems.size);
    if (inquiryEmpty) inquiryEmpty.textContent = inquiryItems.size ? "Items ready to include in your enquiry." : "Your list is empty. Add an item above.";
    if (inquirySend) inquirySend.disabled = inquiryItems.size === 0;
  };
  document.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => {
      inquiryItems.add(button.dataset.add);
      renderInquiry();
      if (button.dataset.go) document.querySelector(button.dataset.go)?.scrollIntoView({ behavior: "smooth" });
    });
  });
  document.getElementById("ix")?.addEventListener("click", () => {
    inquiryItems.clear();
    renderInquiry();
  });
  inquirySend?.addEventListener("click", () => {
    const subject = encodeURIComponent("Pig enquiry - Dominic Nitiwul Farm");
    const body = encodeURIComponent(`Hello,\n\nI am interested in:\n- ${[...inquiryItems].join("\n- ")}\n`);
    window.location.href = `mailto:hello@littlemeadow.farm?subject=${subject}&body=${body}`;
  });
  renderInquiry();

  document.getElementById("vf")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = encodeURIComponent("Farm visit request");
    const body = encodeURIComponent(
      `Name: ${form.get("name")}\nEmail: ${form.get("email")}\nPreferred date: ${form.get("date")}\nGroup: ${form.get("group")}\nNotes: ${form.get("note") || ""}`
    );
    document.getElementById("vs").textContent = "Opening your email application...";
    window.location.href = `mailto:hello@littlemeadow.farm?subject=${subject}&body=${body}`;
  });

  const topButton = document.getElementById("tt");
  addEventListener("scroll", () => {
    if (topButton) topButton.classList.toggle("show", scrollY > 500);
  }, { passive: true });
  topButton?.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

  document.getElementById("ce")?.addEventListener("click", async () => {
    await navigator.clipboard?.writeText("hello@littlemeadow.farm");
  });
})();
