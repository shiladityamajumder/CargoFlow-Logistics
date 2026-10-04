export async function sendInquiry(form: HTMLFormElement, kind: string, status: HTMLElement) {
  const data = new FormData(form);
  data.set("kind", kind);
  const submit = form.querySelector<HTMLInputElement | HTMLButtonElement>('[type="submit"]');
  if (submit) submit.disabled = true;
  status.replaceChildren();
  status.hidden = false;
  status.textContent = "Sending your inquiry…";
  try {
    const response = await fetch("/api/inquiries", { method: "POST", body: data });
    const result = await response.json();
    status.textContent = result.message;
    if (response.ok) {
      status.dataset.state = "success";
    } else {
      status.dataset.state = "error";
      if (response.status === 503) {
        const fields = Array.from(data.entries()).map(([name, value]) => [name, typeof value === "string" ? value : value.name]);
        const download = document.createElement("button");
        download.type = "button";
        download.textContent = "Download your inquiry ⤓";
        download.onclick = () => {
          const url = URL.createObjectURL(new Blob([JSON.stringify({ kind, fields }, null, 2)], { type: "application/json" }));
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = `emons-${kind}-inquiry.json`;
          anchor.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        };
        status.append(document.createElement("br"), download);
      }
    }
  } catch {
    status.dataset.state = "error";
    status.textContent = "Your inquiry could not be sent. Your entries are still here; please try again.";
  } finally {
    if (submit) submit.disabled = false;
    status.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
