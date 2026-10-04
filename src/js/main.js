import "../scss/main.scss";

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

// Пример: плавный скролл по анкорам
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector(link.getAttribute("href"))?.scrollIntoView({
      behavior: "smooth",
    });
  });
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
