import "../scss/main.scss";
import "./animation"

// Мобильное меню header
const headerInner = document.querySelector(".header__inner");
const headerBurger = document.querySelector(".header__burger");

headerBurger?.addEventListener("click", () => {
  const isOpen = headerInner?.classList.toggle("is-menu-open");
  headerBurger.setAttribute("aria-expanded", String(Boolean(isOpen)));
  headerBurger.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
});

headerInner?.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    headerInner.classList.remove("is-menu-open");
    headerBurger?.setAttribute("aria-expanded", "false");
    headerBurger?.setAttribute("aria-label", "Открыть меню");
  });
});

// Табы секции "Возможно, вам это знакомо"
const tabs = document.querySelectorAll(".familiar__tab");
const panels = document.querySelectorAll(".familiar-panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;

    tabs.forEach((t) => t.classList.remove("is-active"));
    panels.forEach((p) => p.classList.remove("is-active"));

    tab.classList.add("is-active");
    document
      .querySelector(`.familiar-panel[data-panel="${target}"]`)
      ?.classList.add("is-active");
  });
});

// Слайдер сравнения «Плохо / Хорошо» в карточках familiar
const familiarCompares = document.querySelectorAll(".familiar-panel__compare");

const familiarMobile = window.matchMedia("(max-width: 768px)");

familiarCompares.forEach((compare) => {
  const items = [...compare.querySelectorAll(":scope > .familiar-compare")];
  if (items.length !== 2) return;

  const [badItem, goodItem] = items;
  const badLabel = badItem.querySelector(".familiar-compare__label");
  const goodLabel = goodItem.querySelector(".familiar-compare__label");
  const badFrame = badItem.querySelector(".familiar-compare__frame");
  const goodFrame = goodItem.querySelector(".familiar-compare__frame");
  if (!badLabel || !goodLabel || !badFrame || !goodFrame) return;

  if (!familiarMobile.matches) return;

  const stage = document.createElement("div");
  stage.className = "familiar-compare__stage";
  stage.style.setProperty("--split", "50%");
  stage.append(badFrame, goodFrame, badLabel, goodLabel);

  const divider = document.createElement("div");
  divider.className = "familiar-compare__divider";
  divider.setAttribute("aria-hidden", "true");
  stage.append(divider);

  const slider = document.createElement("input");
  slider.className = "familiar-compare__range";
  slider.type = "range";
  slider.min = "0";
  slider.max = "100";
  slider.value = "50";
  slider.hidden = false;
  slider.setAttribute("aria-label", "Сравнить плохой и хороший вариант");
  slider.addEventListener("input", () => {
    stage.style.setProperty("--split", `${slider.value}%`);
  });
  stage.append(slider);
  compare.append(stage);
});

// Ползунок сравнения «До / После» в мобильной версии блока rework
const reworkCompare = document.querySelector(".rework__compare");
const reworkMobile = window.matchMedia("(max-width: 768px)");

if (reworkCompare && reworkMobile.matches) {
  const beforeItem = reworkCompare.querySelector(":scope > .rework-compare--before");
  const afterItem = reworkCompare.querySelector(":scope > .rework-compare--after");

  if (beforeItem && afterItem) {
    const beforeLabel = beforeItem.querySelector(".rework-compare__label");
    const afterLabel = afterItem.querySelector(".rework-compare__label");
    const beforeFrame = beforeItem.querySelector(".rework-compare__frame");
    const afterFrame = afterItem.querySelector(".rework-compare__frame");

    if (beforeLabel && afterLabel && beforeFrame && afterFrame) {
      const stage = document.createElement("div");
      stage.className = "rework-compare__stage";
      stage.style.setProperty("--split", "50%");
      stage.append(beforeFrame, afterFrame, beforeLabel, afterLabel);

      const divider = document.createElement("div");
      divider.className = "rework-compare__divider";
      divider.setAttribute("aria-hidden", "true");
      stage.append(divider);

      const slider = document.createElement("input");
      slider.className = "rework-compare__range";
      slider.type = "range";
      slider.min = "0";
      slider.max = "100";
      slider.value = "50";
      slider.setAttribute("aria-label", "Сравнить сайт до и после доработки");
      slider.addEventListener("input", () => {
        stage.style.setProperty("--split", `${slider.value}%`);
      });
      stage.append(slider);
      reworkCompare.append(stage);
    }
  }
}

// Лупа для детального просмотра изображений в сравнении на десктопе
const reworkFrames = document.querySelectorAll(".rework-compare__frame");

reworkFrames.forEach((frame) => {
  const lens = frame.querySelector(".rework-compare__lens");
  if (!lens) return;

  const updateLens = (event) => {
    const frameRect = frame.getBoundingClientRect();
    const x = event.clientX - frameRect.left;
    const y = event.clientY - frameRect.top;
    const zoom = 2.5;
    const lensSize = lens.offsetWidth;

    lens.style.left = `${x}px`;
    lens.style.top = `${y}px`;
    lens.style.backgroundImage = getComputedStyle(frame).backgroundImage;
    lens.style.backgroundSize = `${frameRect.width * zoom}px ${frameRect.height * zoom}px`;
    lens.style.backgroundPosition = `${lensSize / 2 - x * zoom}px ${lensSize / 2 - y * zoom}px`;
  };

  frame.addEventListener("pointerenter", updateLens);
  frame.addEventListener("pointermove", updateLens);
});

// Табы способа связи в форме заявки:
// динамическое поле меняется в зависимости от выбранного способа
const requestTabs = document.querySelectorAll(".request__tab");
const contactLabel = document.getElementById("req-contact-label");
const contactInput = document.getElementById("req-contact");

const contactFieldConfig = {
  telegram: {
    label: "Ваш ник в Телеграме",
    type: "text",
    placeholder: "@username",
  },
  whatsapp: {
    label: "Ваш номер в WhatsApp",
    type: "tel",
    placeholder: "+7 (___) ___-__-__",
  },
  email: {
    label: "Ваша электронная почта",
    type: "email",
    placeholder: "you@example.ru",
  },
};

requestTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    requestTabs.forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");

    const config = contactFieldConfig[tab.dataset.contact];
    if (!config || !contactLabel || !contactInput) return;

    contactLabel.firstChild.textContent = config.label;
    contactInput.type = config.type;
    contactInput.placeholder = config.placeholder;
    contactInput.required = true;
    contactInput.value = "";
    contactInput.removeAttribute("aria-invalid");
    if (tab.dataset.contact === "whatsapp") {
      contactInput.pattern = "\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}";
      contactInput.inputMode = "tel";
      contactInput.autocomplete = "tel";
    } else {
      contactInput.removeAttribute("pattern");
      contactInput.removeAttribute("inputmode");
      contactInput.removeAttribute("autocomplete");
    }
  });
});

// Маска номера: +7 (999) 999-99-99. При вставке принимаем также 8/7 + 10 цифр.
function phoneDigits(value) {
  const digits = value.replace(/\D/g, "");
  if (value.startsWith("+7") || (digits.length === 11 && /^[78]/.test(digits))) {
    return digits.slice(1, 11);
  }
  return digits.slice(0, 10);
}

function formatPhone(digits) {
  if (!digits) return "";
  let result = "+7 (" + digits.slice(0, 3);
  if (digits.length >= 3) result += ")";
  if (digits.length > 3) result += ` ${digits.slice(3, 6)}`;
  if (digits.length > 6) result += "-" + digits.slice(6, 8);
  if (digits.length > 8) result += "-" + digits.slice(8, 10);
  return result;
}

contactInput?.addEventListener("keydown", (e) => {
  if (contactInput.type !== "tel" || e.key !== "Backspace" ||
    contactInput.selectionStart !== contactInput.selectionEnd) return;
  const caret = contactInput.selectionStart;
  if (caret <= 4 && contactInput.value) {
    e.preventDefault();
    contactInput.value = "";
    contactInput.dispatchEvent(new Event("input", { bubbles: true }));
    return;
  }
  if (/\D/.test(contactInput.value[caret - 1])) {
    e.preventDefault();
    const digits = phoneDigits(contactInput.value);
    const precedingDigits = phoneDigits(contactInput.value.slice(0, caret)).length;
    contactInput.value = formatPhone(
      digits.slice(0, precedingDigits - 1) + digits.slice(precedingDigits)
    );
    const position = formatPhone(digits.slice(0, precedingDigits - 1)).length;
    contactInput.setSelectionRange(position, position);
    contactInput.dispatchEvent(new Event("input", { bubbles: true }));
  }
});

contactInput?.addEventListener("input", () => {
  if (contactInput.type !== "tel") return;
  const oldValue = contactInput.value;
  if (oldValue === "7" || oldValue === "8") {
    contactInput.value = "+7 (";
    return;
  }
  const oldCaret = contactInput.selectionStart;
  const beforeCaret = phoneDigits(oldValue.slice(0, oldCaret)).length;
  const formatted = formatPhone(phoneDigits(oldValue));
  contactInput.value = formatted;

  if (oldCaret === oldValue.length) {
    contactInput.setSelectionRange(formatted.length, formatted.length);
  } else {
    let caret = formatted ? 4 : 0;
    let count = 0;
    for (let i = 4; i < formatted.length && count < beforeCaret; i++) {
      if (/\d/.test(formatted[i])) count++;
      caret = i + 1;
    }
    contactInput.setSelectionRange(caret, caret);
  }
});

// Форма заявки — простая обработка (без бэкенда)
const requestForm = document.querySelector(".request__form");

requestForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const fields = requestForm.querySelectorAll("input, textarea");
  let firstInvalid = null;

  fields.forEach((field) => {
    const invalid = !field.checkValidity() ||
      (field.required && field.type !== "checkbox" && !field.value.trim());
    if (invalid) {
      field.setAttribute("aria-invalid", "true");
      firstInvalid ??= field;
    } else {
      field.removeAttribute("aria-invalid");
    }
  });

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  const btn = requestForm.querySelector(".request__submit");
  btn.textContent = "Заявка отправлена  ✓";
  btn.disabled = true;
  requestForm.reset();
});

requestForm?.addEventListener("input", (e) => {
  const field = e.target;
  if (field.matches("input, textarea") && field.getAttribute("aria-invalid") === "true") {
    if (field.checkValidity() &&
      (!field.required || field.type === "checkbox" || field.value.trim())) {
      field.removeAttribute("aria-invalid");
    }
  }
});

requestForm?.addEventListener("change", (e) => {
  const field = e.target;
  if (field.matches("input, textarea") && field.checkValidity()) {
    field.removeAttribute("aria-invalid");
  }
});
