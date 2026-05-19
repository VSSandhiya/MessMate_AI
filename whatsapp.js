// =============================================
// whatsapp.js — MessMate AI
//
// All WhatsApp-related functions live here.
// wa.me is WhatsApp's official link format:
//   https://wa.me/<phone>?text=<message>
// Opening this URL launches WhatsApp with the
// message pre-filled.
// =============================================

function openWhatsApp() {
  const select = document.getElementById('mess-select');
  const phone  = select.value;
  const message = document.getElementById('wa-msg').value;
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${phone}?text=${encodedMessage}`;
  window.open(whatsappURL, '_blank');
}

function sendWADirect(messId) {
  const mess = getMessById(messId);
  const message = `Hi ${mess.name}! I found you on MessMate AI. Could you share today's lunch menu and confirm if seats are available? My budget is around ?${mess.price}. Thanks!`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${mess.phone}?text=${encodedMessage}`;
  window.open(whatsappURL, '_blank');
}

function copyMessage() {
  const message = document.getElementById('wa-msg').value;
  navigator.clipboard.writeText(message)
    .then(() => {
      const toast = document.getElementById('copy-toast');
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    })
    .catch(() => {
      alert('Could not copy. Please copy manually.');
    });
}

function quickWA(type) {
  const messages = {
    menu:     "Hi! Could you please share today's lunch menu and what's still available right now?",
    crowd:    "Hi! How crowded is the mess right now? Roughly how long is the wait?",
    reserve:  "Hi! I'd like to reserve a seat for 1 person for lunch around 1 PM. Is that possible?",
    delivery: "Hi! Do you provide home delivery? What's the delivery charge and minimum order amount?"
  };

  const msg = messages[type];
  document.getElementById('wa-msg').value          = msg;
  document.getElementById('preview-text').textContent = msg;
}

function aiDraftMessage() {
  const select    = document.getElementById('mess-select');
  const messName  = select.options[select.selectedIndex].text;
  const hour      = new Date().getHours();
  const timeOfDay = hour < 12 ? 'breakfast' : hour < 16 ? 'lunch' : 'dinner';
  const draft = `Hi ${messName}! I found you on MessMate AI. I'm looking for ${timeOfDay} today — could you confirm what's available and whether there are seats? How crowded are you right now? Thank you!`;
  document.getElementById('wa-msg').value          = draft;
  document.getElementById('preview-text').textContent = draft;
}

function syncPreview() {
  const msg = document.getElementById('wa-msg').value;
  document.getElementById('preview-text').textContent = msg;
}

function quickOrderWA() {
  const msg = "Hi, I'd like today's menu and availability for 2 people at 1 PM.";
  document.getElementById('wa-msg').value = msg;
  document.getElementById('preview-text').textContent = msg;
  
  // Auto-copy to clipboard
  copyMessage();
  
  // Auto-open WhatsApp
  setTimeout(() => {
    openWhatsApp();
  }, 500);
}
