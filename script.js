const sceneConfig = {
  prologue: {
    progress: "序章 / 怡红院内室",
    leftAccent: "怡红公子",
    rightAccent: "心之所系",
  },
  rose: {
    progress: "第一幕 / 怡红院蔷薇架下",
    leftAccent: "宝玉",
    rightAccent: "小红",
  },
  lixiang: {
    progress: "第二幕 / 梨香院廊下",
    leftAccent: "宝玉",
    rightAccent: "龄官",
  },
  ningfu: {
    progress: "第三幕 / 宁府后巷",
    leftAccent: "宝玉",
    rightAccent: "尤三姐",
  },
  hengwu: {
    progress: "第四幕 / 蘅芜苑内",
    leftAccent: "宝玉",
    rightAccent: "宝钗",
  },
  choice: {
    progress: "终章前夜 / 怡红院书房",
    leftAccent: "落笔之时",
    rightAccent: "无字知心",
  },
};

const sceneId = document.body.dataset.scene;
const meta = sceneConfig[sceneId];

if (meta) {
  const progressNode = document.querySelector("[data-progress]");
  const leftNode = document.querySelector("[data-left-accent]");
  const rightNode = document.querySelector("[data-right-accent]");
  if (progressNode) progressNode.textContent = meta.progress;
  if (leftNode) leftNode.textContent = meta.leftAccent;
  if (rightNode) rightNode.textContent = meta.rightAccent;
}

const storyStage = document.querySelector("[data-story-stage]");

if (storyStage) {
  const beats = [...storyStage.querySelectorAll(".story-beat")];
  const hint = storyStage.querySelector("[data-story-hint]");
  const counter = storyStage.querySelector("[data-story-counter]");
  const finalBeat = storyStage.querySelector(".story-beat-final");
  let revealedCount = 0;

  const syncCounter = () => {
    if (counter) {
      counter.textContent = `${revealedCount} / ${beats.length}`;
    }
  };

  const revealNextBeat = () => {
    if (revealedCount >= beats.length) {
      return;
    }
    beats[revealedCount].classList.add("is-visible");
    revealedCount += 1;
    if (finalBeat && beats[revealedCount - 1] === finalBeat) {
      window.setTimeout(() => {
        storyStage.classList.add("is-final-fading");
      }, 350);
    }
    if (hint && revealedCount > 0) {
      hint.textContent = revealedCount === beats.length
        ? "这一幕已展开完毕，可以继续跳转。"
        : "继续点击中间区域，出现下一格。";
    }
    syncCounter();
  };

  storyStage.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) {
      return;
    }
    revealNextBeat();
  });

  document.addEventListener("keydown", (event) => {
    if (!storyStage.isConnected) {
      return;
    }
    if (event.key === " " || event.key === "Enter" || event.key === "ArrowRight") {
      event.preventDefault();
      revealNextBeat();
    }
  });

  syncCounter();
}

const choiceRoot = document.querySelector("[data-choice-page]");

if (choiceRoot) {
  const countdownNode = choiceRoot.querySelector("[data-choice-countdown]");
  const defaultHref = choiceRoot.dataset.defaultChoice;
  let remaining = Number(choiceRoot.dataset.timeoutSeconds || "5");
  let settled = false;

  const renderCountdown = () => {
    if (countdownNode) {
      countdownNode.textContent = `${remaining} 秒`;
    }
  };

  const settleChoice = () => {
    if (settled || !defaultHref) {
      return;
    }
    settled = true;
    window.location.href = defaultHref;
  };

  const optionLinks = [...choiceRoot.querySelectorAll(".choice-option")];
  optionLinks.forEach((link) => {
    link.addEventListener("click", () => {
      settled = true;
    });
  });

  renderCountdown();

  const timer = window.setInterval(() => {
    if (settled) {
      window.clearInterval(timer);
      return;
    }
    remaining -= 1;
    if (remaining <= 0) {
      window.clearInterval(timer);
      settleChoice();
      return;
    }
    renderCountdown();
  }, 1000);
}
