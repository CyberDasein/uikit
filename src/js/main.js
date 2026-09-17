import "../scss/main.scss";

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
    label: "Ваш номер в Ватсапе",
    type: "tel",
    placeholder: "+7-___-___-___",
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
    contactInput.style.borderColor = "";
  });
});

// Форма заявки — простая обработка (без бэкенда)
const requestForm = document.querySelector(".request__form");

requestForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const fields = requestForm.querySelectorAll(
    "input[type=text], input[type=tel], input[type=email]"
  );
  let valid = true;

  fields.forEach((field) => {
    if (!field.value.trim()) {
      valid = false;
      field.style.borderColor = "#d92d20";
    } else {
      field.style.borderColor = "";
    }
  });

  if (!valid) return;

  const btn = requestForm.querySelector(".request__submit");
  btn.textContent = "Заявка отправлена ✓";
  btn.disabled = true;
  requestForm.reset();
});
