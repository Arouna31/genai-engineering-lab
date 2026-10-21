import "./style.css";

const form = document.querySelector<HTMLFormElement>("#chat-form")!;
const input = document.querySelector<HTMLInputElement>("#prompt")!;
const messages = document.querySelector<HTMLElement>("#messages")!;
const button = document.querySelector<HTMLButtonElement>("#send")!;

// Appel API Ollama
async function askOllama(prompt: string): Promise<string> {
  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3.2:1b-instruct-q4_K_M",
      messages: [{ role: "user", content: prompt }],
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP : ${response.status}`);
  }

  const data = await response.json();
  return data.message.content;
}

// Affichage des messages
function addMessage(content: string, role: "user" | "bot") {
  const message = document.createElement("div");

  message.className = `message ${role}`;
  message.textContent = content;

  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;

  return message;
}

// Envoi du prompt
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const prompt = input.value.trim();
  if (!prompt) return;

  addMessage(prompt, "user");
  input.value = "";

  button.disabled = true;
  const pending = addMessage("Ollama réfléchit...", "bot");

  try {
    pending.textContent = await askOllama(prompt);
  } catch (error) {
    pending.textContent = `Erreur : ${String(error)}`;
  } finally {
    button.disabled = false;
    input.focus();
    messages.scrollTop = messages.scrollHeight;
  }
});
