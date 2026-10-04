import { sendInquiry } from "./inquiry";
import countries from "@/config/countries.json";

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
const fields = (element: Element) => [...element.querySelectorAll<Field>("input,select,textarea")];
const visible = (element: HTMLElement) => !element.closest("[hidden]") && getComputedStyle(element).display !== "none" && element.getClientRects().length > 0;

export function initReferenceInteractions(root: HTMLElement, pathname: string) {
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const listen = (target: EventTarget, event: string, handler: EventListener) => target.addEventListener(event, handler, options);
  const nav = root.querySelector<HTMLElement>("[data-menu-wrap]");
  let hoverTimer: ReturnType<typeof setTimeout>;

  function setMenu(panel: string | null, mobileOpen = false) {
    if (!nav) return;
    nav.dataset.menuOpen = String(!!panel || mobileOpen);
    root.dataset.mobileMenu = String(mobileOpen);
    root.querySelector("[data-burger-toggle]")?.setAttribute("aria-expanded", String(mobileOpen));
    root.querySelectorAll<HTMLElement>("[data-dropdown-toggle]").forEach(toggle => toggle.setAttribute("aria-expanded", String(toggle.dataset.dropdownToggle === panel)));
    root.querySelectorAll<HTMLElement>("[data-nav-content]").forEach(content => {
      const active = content.dataset.navContent === panel;
      content.dataset.panelState = active ? "active" : "closed";
      content.setAttribute("aria-hidden", String(!active));
      content.inert = !active;
    });
    const container = root.querySelector<HTMLElement>("[data-dropdown-container]");
    const active = panel ? root.querySelector<HTMLElement>(`[data-nav-content="${panel}"]`) : null;
    if (container) container.style.height = active ? `${active.scrollHeight}px` : "0px";
  }
  setMenu(null);
  root.querySelectorAll<HTMLElement>("[data-dropdown-toggle]").forEach(toggle => {
    listen(toggle, "mouseenter", () => {
      if (innerWidth < 992) return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => setMenu(toggle.dataset.dropdownToggle || null), 100);
    });
  });
  if (nav) {
    listen(nav, "mouseleave", () => { if (innerWidth >= 992) hoverTimer = setTimeout(() => setMenu(null), 150); });
    listen(nav, "mouseenter", () => clearTimeout(hoverTimer));
  }
  root.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(anchor => {
    if (anchor.getAttribute("href") === pathname) anchor.setAttribute("aria-current", "page");
  });

  // Accessible Webflow-style accordions, without the hosted runtime.
  root.querySelectorAll<HTMLElement>('[fs-accordion-element="accordion"]').forEach((item, index) => {
    const trigger = item.querySelector<HTMLElement>('[fs-accordion-element="trigger"]');
    const content = item.querySelector<HTMLElement>('[fs-accordion-element="content"]');
    if (!trigger || !content || trigger instanceof HTMLInputElement) return;
    trigger.id = `reference-accordion-trigger-${index}`;
    content.id = `reference-accordion-content-${index}`;
    trigger.setAttribute("role", "button");
    trigger.tabIndex = 0;
    trigger.setAttribute("aria-controls", content.id);
    content.setAttribute("aria-labelledby", trigger.id);
    content.setAttribute("role", "region");
    content.hidden = trigger.getAttribute("aria-expanded") !== "true";
    if (!content.hidden) content.style.height = "auto";
  });

  root.querySelectorAll<HTMLElement>(".splide").forEach(slider => {
    slider.setAttribute("role", "region");
    slider.setAttribute("aria-roledescription", "carousel");
    slider.querySelector<HTMLElement>(".splide__track")?.setAttribute("tabindex", "0");
  });

  function updateConditionals(form: HTMLFormElement) {
    fields(form).filter(field => field instanceof HTMLInputElement && /checkbox|radio/.test(field.type)).forEach(field => {
      const input = field as HTMLInputElement;
      input.parentElement?.querySelector(".w-checkbox-input,.w-radio-input")?.classList.toggle("w--redirected-checked", input.checked);
    });
    const alternate = form.querySelector<HTMLInputElement>('input[name="Adressdaten_Andere_Checkbox"]');
    form.querySelectorAll<HTMLElement>(".form_cell.is-abholadresse").forEach(cell => { cell.hidden = !alternate?.checked; });
    const recipient = form.querySelector<HTMLSelectElement>('select[name$="empfaenger"]');
    if (recipient) form.querySelectorAll<HTMLElement>(".form_cell.is-firma").forEach(cell => { cell.hidden = !/firmen|company/i.test(recipient.value); });
    form.querySelectorAll<HTMLElement>("[data-clone]").forEach(row => {
      const dangerous = row.querySelector<HTMLInputElement>('input[data-bws="gefahrgut"], input[ms-code-checkbox-input="lieferumfang"]');
      if (dangerous) row.querySelectorAll<HTMLElement>(".form_extra-row_inner.is-extra").forEach(extra => { extra.hidden = !dangerous.checked; extra.style.display = dangerous.checked ? "flex" : "none"; });
    });
    form.querySelectorAll<HTMLElement>(".multicheck").forEach(dropdown => {
      const tags = dropdown.querySelector(".toggle-tags");
      if (!tags) return;
      tags.replaceChildren(...[...dropdown.querySelectorAll<HTMLInputElement>('input:checked')].map(input => {
        const tag = document.createElement("span");
        tag.className = "toggle-tag";
        tag.textContent = input.dataset.value || input.closest("label")?.textContent || "";
        return tag;
      }));
    });
    const allFields = fields(form);
    form.querySelectorAll<HTMLElement>("[data-input-field]").forEach(display => {
      const field = allFields.find(field => field.name === display.dataset.inputField);
      display.textContent = field instanceof HTMLInputElement && /checkbox|radio/.test(field.type)
        ? (field.checked ? field.dataset.value || "Yes" : "—")
        : field instanceof HTMLSelectElement ? field.selectedOptions[0]?.textContent || "—" : field?.value || "—";
    });
  }

  function validate(section: Element) {
    let first: Field | undefined;
    fields(section).forEach(field => {
      if (field.type === "submit" || field.disabled || !visible(field.closest<HTMLElement>(".form_cell") || field)) return;
      const valid = field.checkValidity();
      field.setAttribute("aria-invalid", String(!valid));
      const error = field.closest(".form_cell")?.querySelector<HTMLElement>(".error-message");
      if (error) error.hidden = valid;
      if (!valid && !first) first = field;
    });
    if (first) {
      first.focus();
      first.reportValidity();
      return false;
    }
    return true;
  }

  const stepState = new Map<HTMLFormElement, { index: number; furthest: number; steps: HTMLElement[]; show: (index: number, scroll?: boolean) => void }>();
  root.querySelectorAll<HTMLFormElement>('form[action="/api/inquiries"]').forEach(form => {
    form.noValidate = true;
    form.querySelectorAll<HTMLElement>(".error-message").forEach(error => { error.hidden = true; });
    fields(form).forEach((field, index) => {
      if (/e-mail|email/i.test(field.name)) field.setAttribute("type", "email");
      if (field instanceof HTMLInputElement && /telefon|phone/i.test(field.name)) field.type = "tel";
      field.id = `${form.id || "inquiry"}-field-${index}`;
      field.closest(".form_cell")?.querySelector<HTMLLabelElement>("label.form-label")?.setAttribute("for", field.id);
      if (field instanceof HTMLSelectElement && field.dataset.dropdown === "country" && field.options.length <= 1) {
        countries.forEach(country => field.add(new Option(country.name, country.value)));
      }
    });
    const steps = [...form.querySelectorAll<HTMLElement>('[data-form="step"]')];
    if (steps.length) {
      const state = { index: 0, furthest: 0, steps, show: (index: number, scroll = true) => {
        state.index = index;
        state.furthest = Math.max(state.furthest, index);
        steps.forEach((step, i) => { step.hidden = i !== index; });
        form.querySelectorAll<HTMLElement>('[data-form="custom-progress-indicator"]').forEach((link, i) => {
          link.classList.toggle("current", i === index);
          link.classList.toggle("disabled", i > state.furthest);
          link.setAttribute("aria-disabled", String(i > state.furthest));
          if (i === index) link.setAttribute("aria-current", "step"); else link.removeAttribute("aria-current");
        });
        updateConditionals(form);
        if (scroll) (form.closest<HTMLElement>("#formular") || form).scrollIntoView({ behavior: "smooth", block: "start" });
      } };
      stepState.set(form, state);
      state.show(0, false);
    }
    form.querySelectorAll<HTMLElement>('[data-form="back-btn"]').forEach(button => { button.tabIndex = 0; button.setAttribute("role", "button"); button.setAttribute("aria-label", "Previous step"); });
    updateConditionals(form);
    const status = form.querySelector<HTMLElement>(".reference-form-status") || document.createElement("div");
    status.className = "reference-form-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.hidden = true;
    form.append(status);
    listen(form, "submit", event => {
      event.preventDefault();
      const state = stepState.get(form);
      if (state && state.index < state.steps.length - 1) {
        if (validate(state.steps[state.index])) state.show(state.index + 1);
        return;
      }
      if (state) {
        // Recheck previous steps so edits cannot bypass required information.
        for (let index = 0; index < state.steps.length; index++) {
          const step = state.steps[index];
          const invalid = fields(step).find(field => field.required && !field.disabled && !field.closest(".form_cell[hidden]") && !field.checkValidity());
          if (invalid) { state.show(index); validate(step); return; }
        }
      } else if (!validate(form)) return;
      void sendInquiry(form, pathname.includes("frachtanfrage/") ? pathname.split("/").at(-1)! : "newsletter", status);
    });
  });
  root.querySelectorAll<HTMLFormElement>('form[fs-list-element="filters"],form[fs-cmsfilter-element="filters"]').forEach(form => listen(form, "submit", event => event.preventDefault()));

  function filterLists() {
    root.querySelectorAll<HTMLElement>('[fs-list-element="list"]:not([fs-list-instance]),[fs-cmsfilter-element="list"]').forEach(list => {
      const filters = [...root.querySelectorAll<Field>('input[fs-list-field],select[fs-list-field]')].filter(input => input.type === "text" || (input as HTMLInputElement).checked);
      const category = root.querySelector<HTMLInputElement>('[fs-cmsfilter-element="filters"] input:checked')?.closest("label")?.querySelector("[fs-cmsfilter-field]")?.textContent?.trim();
      let count = 0;
      [...list.children].forEach(child => {
        const item = child as HTMLElement;
        const matches = filters.every(filter => {
          const field = filter.getAttribute("fs-list-field");
          const value = filter.getAttribute("fs-list-value") || filter.value;
          const text = field === "*" ? item.textContent : [...item.querySelectorAll(`[fs-list-field="${field}"]`)].map(x => x.textContent).join(" ");
          return !value || text?.toLowerCase().includes(value.toLowerCase());
        }) && (!category || item.querySelector('[fs-cmsfilter-field="category"]')?.textContent?.trim() === category);
        item.hidden = !matches;
        if (matches) count++;
      });
      let empty = list.parentElement?.querySelector<HTMLElement>(".reference-filter-empty");
      if (!empty) { empty = document.createElement("p"); empty.className = "reference-filter-empty"; empty.textContent = "No results match your selection."; empty.setAttribute("role", "status"); list.after(empty); }
      empty.hidden = count > 0;
    });
    root.querySelectorAll<HTMLInputElement>('input[type="radio"],input[type="checkbox"]').forEach(input => input.parentElement?.querySelector(".w-radio-input,.w-checkbox-input")?.classList.toggle("w--redirected-checked", input.checked));
  }

  listen(root, "input", event => {
    const target = event.target as Field;
    const form = target.closest("form");
    if (form && form.action.endsWith("/api/inquiries")) updateConditionals(form);
    if (target.hasAttribute("fs-list-field")) filterLists();
    if (target.checkValidity?.()) {
      target.setAttribute("aria-invalid", "false");
      const error = target.closest(".form_cell")?.querySelector<HTMLElement>(".error-message");
      if (error) error.hidden = true;
    }
  });
  listen(root, "change", event => {
    const target = event.target as Field;
    const form = target.closest("form");
    if (form && form.action.endsWith("/api/inquiries")) updateConditionals(form);
    filterLists();
    if (target.getAttribute("fs-list-element") === "sort-trigger") {
      const list = root.querySelector('[fs-list-element="list"]:not([fs-list-instance])');
      if (list) [...list.children].sort((a, b) => (a.querySelector('[fs-list-field="branch"]')?.textContent || "").localeCompare(b.querySelector('[fs-list-field="branch"]')?.textContent || "") * (/desc|z.*a/i.test(target.value) ? -1 : 1)).forEach(child => list.append(child));
    }
  });

  listen(root, "click", event => {
    const target = event.target as Element;
    const toggle = target.closest<HTMLElement>("[data-dropdown-toggle]");
    if (toggle) { setMenu(toggle.getAttribute("aria-expanded") === "true" ? null : toggle.dataset.dropdownToggle || null, innerWidth < 992); return; }
    if (target.closest("[data-burger-toggle]")) { setMenu(null, root.dataset.mobileMenu !== "true"); return; }
    if (target.closest("[data-menu-backdrop],[data-mobile-back]")) { setMenu(null); return; }
    if (target.closest(".search-nav-trigger")) {
      root.dataset.searchOpen = String(root.dataset.searchOpen !== "true");
      if (root.dataset.searchOpen === "true") root.querySelector<HTMLInputElement>(".nav-search")?.focus();
      return;
    }
    const dropdown = target.closest<HTMLElement>(".w-dropdown-toggle");
    if (dropdown) {
      const list = dropdown.parentElement?.querySelector<HTMLElement>(".w-dropdown-list");
      const open = !list?.classList.contains("w--open");
      list?.classList.toggle("w--open", open); dropdown.classList.toggle("w--open", open); dropdown.setAttribute("aria-expanded", String(open));
      if (list) list.style.display = open ? "block" : "";
      return;
    }
    const accordion = target.closest<HTMLElement>('[fs-accordion-element="trigger"]');
    if (accordion && !(accordion instanceof HTMLInputElement)) {
      const item = accordion.closest('[fs-accordion-element="accordion"]');
      const content = item?.querySelector<HTMLElement>('[fs-accordion-element="content"]');
      if (content) { content.hidden = !content.hidden; content.style.height = "auto"; content.style.gridTemplateRows = "1fr"; accordion.setAttribute("aria-expanded", String(!content.hidden)); item?.classList.toggle("is-active-accordion", !content.hidden); }
      return;
    }
    const tab = target.closest<HTMLElement>(".w-tab-link");
    if (tab) {
      event.preventDefault();
      const group = tab.closest(".w-tabs");
      group?.querySelectorAll<HTMLElement>(".w-tab-link").forEach(link => { link.classList.toggle("w--current", link === tab); link.setAttribute("aria-selected", String(link === tab)); });
      group?.querySelectorAll<HTMLElement>(".w-tab-pane").forEach(pane => { pane.classList.toggle("w--tab-active", pane.dataset.wTab === tab.dataset.wTab); });
      return;
    }
    const stepButton = target.closest<HTMLElement>("[data-form]");
    const form = target.closest<HTMLFormElement>("form");
    const state = form ? stepState.get(form) : undefined;
    if (form && state && stepButton) {
      const action = stepButton.dataset.form;
      if (action === "next-btn" || action === "back-btn" || action === "custom-progress-indicator") {
        event.preventDefault();
        if (action === "next-btn" && validate(state.steps[state.index])) state.show(Math.min(state.index + 1, state.steps.length - 1));
        if (action === "back-btn") state.show(Math.max(state.index - 1, 0));
        if (action === "custom-progress-indicator") {
          const index = [...form.querySelectorAll('[data-form="custom-progress-indicator"]')].indexOf(stepButton);
          if (index <= state.furthest && (index <= state.index || validate(state.steps[state.index]))) state.show(index);
        }
        return;
      }
    }
    const add = target.closest<HTMLElement>("[data-add-new]");
    if (add && form) {
      event.preventDefault();
      const key = add.dataset.addNew;
      const wrapper = form.querySelector(`[data-clone-wrapper="${key}"]`);
      const template = wrapper?.querySelector<HTMLElement>("[data-clone]");
      if (!wrapper || !template || wrapper.children.length > 50) return;
      const row = template.cloneNode(true) as HTMLElement;
      const number = Date.now().toString(36);
      const renames = new Map<string, string>();
      fields(row).forEach(field => {
        renames.set(field.name, `${field.name}__${number}`);
        field.name = `${field.name}__${number}`;
        const oldId = field.id;
        field.id = `${oldId}__${number}`;
        row.querySelectorAll<HTMLLabelElement>("label").forEach(label => { if (label.htmlFor === oldId) label.htmlFor = field.id; });
        if (field instanceof HTMLInputElement && /checkbox|radio/.test(field.type)) field.checked = false; else field.value = "";
      });
      row.dataset.cloneId = number;
      row.querySelectorAll<HTMLElement>("[data-index]").forEach(index => { index.textContent = String(wrapper.querySelectorAll("[data-clone]").length + 1); });
      wrapper.append(row);
      form.querySelectorAll<HTMLElement>(".steps-display-item.is-extra").forEach(summary => {
        if (summary.dataset.cloneId) return;
        const copy = summary.cloneNode(true) as HTMLElement;
        copy.dataset.cloneId = number;
        copy.querySelectorAll<HTMLElement>("[data-input-field]").forEach(display => { const name = display.dataset.inputField!; display.dataset.inputField = renames.get(name) || name; });
        summary.parentElement?.append(copy);
      });
      updateConditionals(form);
      return;
    }
    if (stepButton?.dataset.form === "remove-clone" && form) {
      event.preventDefault();
      const row = stepButton.closest<HTMLElement>("[data-clone]");
      if (row?.parentElement?.querySelectorAll("[data-clone]").length === 1) return;
      if (row?.dataset.cloneId) form.querySelectorAll(`[data-clone-id="${row.dataset.cloneId}"]`).forEach(x => x.remove());
      else { row?.remove(); form.querySelectorAll('.steps-display-item.is-extra:not([data-clone-id])').forEach(summary => summary.remove()); }
      form.querySelectorAll<HTMLElement>("[data-clone-wrapper]").forEach(wrapper => wrapper.querySelectorAll<HTMLElement>("[data-clone]").forEach((row, index) => row.querySelectorAll<HTMLElement>("[data-index]").forEach(label => { label.textContent = String(index + 1); })));
      return;
    }
    const clear = target.closest<HTMLElement>('[fs-list-element="clear"],[fs-cmsfilter-element="clear"]');
    if (clear) {
      event.preventDefault();
      const field = clear.getAttribute("fs-list-field");
      root.querySelectorAll<HTMLInputElement>(field ? `input[fs-list-field="${field}"]` : '[fs-cmsfilter-element="filters"] input').forEach(input => { input.checked = false; });
      filterLists();
      return;
    }
    const arrow = target.closest<HTMLElement>(".splide__arrow--next,.splide__arrow--prev");
    if (arrow) {
      event.preventDefault();
      const section = arrow.closest(".splide") || arrow.closest("section");
      const track = section?.querySelector<HTMLElement>(".splide__track");
      if (track) track.scrollBy({ left: track.clientWidth * .8 * (arrow.classList.contains("splide__arrow--prev") ? -1 : 1), behavior: "smooth" });
    }
  });
  listen(root, "keydown", event => {
    const key = event as KeyboardEvent;
    if (key.key === "Escape") { setMenu(null); root.dataset.searchOpen = "false"; root.querySelectorAll(".w-dropdown-list.w--open").forEach(list => list.classList.remove("w--open")); }
    const target = event.target as HTMLElement;
    if ((key.key === "Enter" || key.key === " ") && target.getAttribute("role") === "button" && target.tagName !== "BUTTON") { event.preventDefault(); target.click(); }
  });
  listen(window, "resize", () => setMenu(null));
  return () => { controller.abort(); clearTimeout(hoverTimer); };
}
