// =============================================
// ai.js â€” MessMate AI
//
// This file handles the AI chat tab.
// It talks to the Claude API to generate smart
// mess recommendations based on user messages.
//
// HOW IT WORKS:
// 1. User types a message
// 2. We send it to Claude API with a "system prompt"
//    that tells Claude it's a mess recommender
// 3. Claude replies with a recommendation
// 4. We show it as a chat bubble
// =============================================

// --- IMPORTANT: Add your API keys here ---
// You can use Hugging Face Inference API with a free key.
// Get one at: https://huggingface.co/settings/tokens
const HUGGINGFACE_API_KEY = "";
const HUGGINGFACE_MODEL = "google/flan-t5-small";

// If you still want to use Claude, add it here.
const CLAUDE_API_KEY = "";

// Build a description of all messes to give the model context
function buildMessContext() {
  return MESSES.map(m =>
    `- ${m.name} (${m.area}): ₹${m.price}/meal, ${m.type}, ${m.isOpen ? 'open' : 'CLOSED'}, crowd: ${m.crowd}, ${m.distance} away, rating: ${m.rating}`
  ).join('\n');
}

// Build a string for the user's profile
function getUserProfileString() {
  const diet = localStorage.getItem('pref-diet');
  const budget = localStorage.getItem('pref-budget');
  const crowd = localStorage.getItem('pref-crowd');
  
  if (!diet && !budget && !crowd) return "No specific profile preferences set.";
  
  return `User Profile Preferences:
- Diet: ${diet || 'Any'}
- Max Budget: ${budget ? '₹' + budget : 'Any'}
- Crowd Tolerance: ${crowd === 'quiet' ? 'Hates waiting, wants quiet places' : 'Any'}`;
}

// --- Send a message to Claude API ---
// This is an "async" function â€” it waits for the API to reply
// before continuing. The "await" keyword does the waiting.
async function callClaudeAPI(userMessage) {
  // The system prompt tells Claude its role and gives it mess data
  const hour = new Date().getHours();
  const mealTime = hour < 11 ? 'Breakfast' : hour < 16 ? 'Lunch' : 'Dinner';
  
  const systemPrompt = `You are MessMate AI, an elite food and diet assistant.
Current Time: ${new Date().toLocaleTimeString()} (Meal Phase: ${mealTime})

Here is the user's profile context to prioritize in your recommendations:
${getUserProfileString()}

Here is the REAL-TIME availability and crowd status of messes right now:
${buildMessContext()}

Rules:
- Structure your response using markdown: use **bold** for mess names, bullet points for diet structures, and emojis to make it engaging.
- Provide structured meal recommendations: e.g., "Morning Diet: ..., Noon: ..., Evening: ..." if the user asks for a diet plan.
- Consider the current real-time crowd and availability data. Do not recommend sold-out items.
- Keep replies actionable and concise.`;

  // Prefer Hugging Face if its key is configured.
  if (HUGGINGFACE_API_KEY) {
    return callHuggingFaceAPI(userMessage);
  }

  // Otherwise, use Claude if configured.
  if (CLAUDE_API_KEY && !CLAUDE_API_KEY.includes("YOUR_CLAUDE_API_KEY_HERE")) {
    try {
      // "fetch" sends an HTTP request to the Claude API
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": CLAUDE_API_KEY,
          "anthropic-version": "2023-06-01",
          // This header is needed for browser-based requests
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 300,
          system: systemPrompt,
          messages: [
            { role: "user", content: userMessage }
          ]
        })
      });

      // Parse the JSON response
      const data = await response.json();

      if (!response.ok) {
        console.log("Claude API returned an error status", response.status, data);
        return callFreePublicAPI(userMessage);
      }

      // Extract the text from Claude's reply
      if (typeof data.completion === 'string' && data.completion.trim()) {
        return data.completion.trim();
      }
      if (data.content && data.content[0] && data.content[0].text) {
        return data.content[0].text;
      }

      // If something went wrong with the API
      return fallbackReply(userMessage);

    } catch (error) {
      console.log("API error:", error);
      return callFreePublicAPI(userMessage);
    }
  }

  // No model key configured: use the public fallback for demo mode.
  return callFreePublicAPI(userMessage);
}

// Hugging Face text generation API
async function callHuggingFaceAPI(userMessage) {
  const prompt = `You are MessMate AI, a helpful food assistant that recommends the best mess (canteen/food stall) near the user based on their needs.

Here is the user's profile context to prioritize in your recommendations:
${getUserProfileString()}

Here are the available messes right now:
${buildMessContext()}

User: ${userMessage}
Assistant:`;

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${HUGGINGFACE_MODEL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`
      },
      body: JSON.stringify({
        inputs: prompt,
        options: { wait_for_model: true },
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
          return_full_text: false
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("Hugging Face API returned an error", response.status, data);
      return callFreePublicAPI(userMessage);
    }

    if (typeof data === 'string' && data.trim()) {
      return data.trim();
    }
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text.trim();
    }
    if (data.generated_text) {
      return data.generated_text.trim();
    }

    return fallbackReply(userMessage);
  } catch (error) {
    console.log("Hugging Face API error:", error);
    return callFreePublicAPI(userMessage);
  }
}

// Free public API fallback for browser usage when no model key is configured
async function callFreePublicAPI(userMessage) {
  try {
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();
    return `Top pick: Saravana Mess at 0.3 km (â‚¹65, veg, open now). ${data.content} â€” ${data.author}`;
  } catch (error) {
    console.log("Free public API error:", error);
    return fallbackReply(userMessage);
  }
}

// --- Local AI Simulator (Advanced Fallback) ---
// This acts as a highly intelligent local AI that uses real-time data
// when no API key is present. It dynamically filters the MESSES array.
function fallbackReply(message) {
  const msg = message.toLowerCase();
  
  // Refresh data context
  const openMesses = MESSES.filter(m => m.isOpen);
  const hour = new Date().getHours();
  const mealPhase = hour < 11 ? 'Breakfast' : hour < 16 ? 'Lunch' : 'Dinner';

  // 1. Diet / Protein Plans
  if (msg.includes('diet') || msg.includes('protein') || msg.includes('plan')) {
    const vegMesses = openMesses.filter(m => m.type === 'veg');
    const nonVegMesses = openMesses.filter(m => m.type === 'both');
    
    return `Here is a structured **Healthy Diet Plan** optimized for you right now:
💪 **Morning (High Protein):** Egg Curry or Dosa from *${nonVegMesses[0]?.name || 'a nearby mess'}*
🍲 **Noon (Balanced):** Meals from *${openMesses[0]?.name || 'any open mess'}*
🥗 **Evening (Light):** Chapati or Idli from *${vegMesses[0]?.name || 'a quiet veg spot'}*
Remember to stay hydrated!`;
  }

  // 2. Comparison Engine
  if (msg.includes('compare') || msg.includes('which is best') || msg.includes('better')) {
    let sorted = [...openMesses].sort((a, b) => b.rating - a.rating);
    if (msg.includes('veg') && !msg.includes('non')) {
      sorted = sorted.filter(m => m.type === 'veg');
    }
    if (sorted.length >= 2) {
      return `I've analyzed the live data. Here is a side-by-side comparison of the top options matching your criteria:\n[COMPARE: ${sorted[0].id}, ${sorted[1].id}]`;
    }
    return `There aren't enough open messes right now to run a full comparison, but **${sorted[0]?.name || 'one of our spots'}** is highly rated!`;
  }

  // 3. Finding based on budget
  const budgetMatch = msg.match(/under\s*(?:rs|inr|₹|)?\s*(\d+)/) || msg.match(/(\d+)\s*(?:rs|rupees)/);
  if (budgetMatch || msg.includes('cheap') || msg.includes('budget')) {
    const targetBudget = budgetMatch ? parseInt(budgetMatch[1]) : 70;
    const affordable = openMesses.filter(m => m.price <= targetBudget).sort((a,b) => a.price - b.price);
    
    if (affordable.length > 0) {
      const top = affordable[0];
      return `Absolutely! **${top.name}** is a great budget choice right now at just **₹${top.price}/meal**. 
⭐ Rating: ${top.rating}
🚶 Distance: ${top.distance}
They are currently ${top.crowd === 'quiet' ? '*peaceful*' : '*a bit busy*'}.`;
    } else {
      return `I couldn't find any open messes strictly under ₹${targetBudget} right now, but **${openMesses[0]?.name}** is the cheapest available at ₹${openMesses[0]?.price}.`;
    }
  }

  // 4. Finding based on crowd / peaceful
  if (msg.includes('crowd') || msg.includes('busy') || msg.includes('quiet') || msg.includes('peaceful') || msg.includes('wait')) {
    const quietMesses = openMesses.filter(m => m.crowd === 'quiet');
    if (quietMesses.length > 0) {
      return `If you hate waiting, you should go to **${quietMesses[0].name}**. It's very peaceful right now with almost zero wait time!
🚶 It's only ${quietMesses[0].distance} away.`;
    }
    return `Currently, everywhere seems to be experiencing a rush! **${openMesses[0]?.name}** is probably your fastest bet right now.`;
  }

  // 5. Finding based on diet (Veg / Non-veg)
  if (msg.includes('veg') && !msg.includes('non')) {
    const veg = openMesses.filter(m => m.type === 'veg').sort((a,b) => b.rating - a.rating);
    if (veg.length > 0) {
      return `For Pure Veg, **${veg[0].name}** is the top-rated spot right now (⭐ ${veg[0].rating}). 
It costs around ₹${veg[0].price}/meal and is ${veg[0].crowd === 'quiet' ? '*quiet*' : '*quite busy*'} at the moment.`;
    }
    return `I'm not seeing any Pure Veg spots open right now, unfortunately.`;
  }

  // 6. Current Meal Time Recommendations
  if (msg.includes('eat') || msg.includes('lunch') || msg.includes('dinner') || msg.includes('breakfast') || msg.includes('now') || msg.includes('hungry')) {
    const bestMatch = openMesses.sort((a,b) => b.rating - a.rating)[0];
    if (!bestMatch) return `It looks like all the messes in your area are currently closed.`;
    
    // Get a highly available item from the menu
    const availItems = bestMatch.menu.filter(i => i.available === 'yes');
    const itemRec = availItems.length > 0 ? availItems[0].item : 'their standard meals';

    return `It's currently time for **${mealPhase}**! 
I highly recommend checking out **${bestMatch.name}**. They are open, and their *${itemRec}* is fresh and available right now. 
Tap "Orders" if you want me to WhatsApp them for you!`;
  }

  // 7. General Catch-all / Greetings
  if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
    return `Hello! 👋 I'm your MessMate Intelligence agent. 
I have real-time access to the kitchens around you. How can I help? You can ask me to:
- *Find a cheap place under ₹60*
- *Compare the top veg messes*
- *Find a quiet spot to eat right now*`;
  }

  return `I'm constantly analyzing local food data, but I didn't quite catch that. Try asking me something like:
- *"What's the best veg option?"*
- *"Find a quiet place to eat."*
- *"Suggest a diet plan."*
- *"Compare the best spots."*`;
}

// =============================================
// CHAT UI FUNCTIONS
// =============================================

function generateComparisonHTML(text) {
  // Look for [COMPARE: id1, id2, ...]
  const match = text.match(/\[COMPARE:\s*([^\]]+)\]/);
  if (!match) return text;
  
  const ids = match[1].split(',').map(id => parseInt(id.trim()));
  const messes = ids.map(id => getMessById(id)).filter(m => m);
  
  if (messes.length === 0) return text;

  const cardsHtml = messes.map(m => `
    <div class="compare-card">
      <h4>${m.name}</h4>
      <p>💰 ₹${m.price}</p>
      <p>🚶 ${m.distance}</p>
      <p>⭐ ${m.rating}</p>
      <p>🥗 ${m.type === 'veg' ? 'Veg' : 'Veg+NonVeg'}</p>
      <p>👥 ${m.crowd === 'quiet' ? 'Quiet' : 'Busy'}</p>
      <button onclick="switchTab('find', document.querySelector('.tab:nth-child(1)')); selectCard(${m.id})" style="margin-top:8px; width:100%; padding:6px; background:#2563eb; color:white; border:none; border-radius:8px; cursor:pointer;">View</button>
    </div>
  `).join('');

  const gridHtml = `<div class="compare-grid">${cardsHtml}</div>`;
  return text.replace(match[0], gridHtml);
}

// Add a message bubble to the chat box
function addBubble(role, text) {
  const chatBox = document.getElementById('chat-box');

  const div = document.createElement('div');
  div.className = `bubble ${role}`;  // 'bubble ai' or 'bubble user'

  const avatarIcon = role === 'ai'
    ? '<i class="ti ti-robot"></i>'
    : '<i class="ti ti-user"></i>';

  let finalText = text;
  if (role === 'ai') {
    finalText = generateComparisonHTML(text);
    // Simple markdown parser for bold and newlines
    finalText = finalText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    finalText = finalText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    finalText = finalText.replace(/\n/g, '<br/>');
  }

  div.innerHTML = `
    <div class="bubble-avatar ${role}">${avatarIcon}</div>
    <div class="bubble-text">${finalText}</div>
  `;

  chatBox.appendChild(div);

  // Auto-scroll to the latest message
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Show the "..." typing indicator while waiting for AI
function showTyping() {
  const chatBox = document.getElementById('chat-box');
  const div = document.createElement('div');
  div.className = 'bubble ai';
  div.id = 'typing-indicator';
  div.innerHTML = `
    <div class="bubble-avatar ai"><i class="ti ti-robot"></i></div>
    <div class="bubble-text">
      <div class="typing">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Remove the typing indicator
function removeTyping() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

// --- Main sendChat function ---
// Called when user presses Enter or clicks Send
async function sendChat() {
  const input = document.getElementById('chat-input');
  const message = input.value.trim();

  // Don't send empty messages
  if (!message) return;

  // Show the user's message
  addBubble('user', message);
  input.value = '';  // clear the input box

  // Hide quick chip suggestions after first message
  document.getElementById('quick-chips').style.display = 'none';

  // Show typing indicator while waiting
  showTyping();

  // Get reply (from Claude API or fallback)
  const reply = await callClaudeAPI(message);

  // Remove typing indicator and show the reply
  removeTyping();
  addBubble('ai', reply);
}

// --- Quick suggestion chips ---
// Fill the input and auto-send
function sendQuick(text) {
  document.getElementById('chat-input').value = text;
  sendChat();
}

// --- Initialise chat with a welcome message ---
function initChat() {
  const chatBox = document.getElementById('chat-box');
  chatBox.innerHTML = '';  // clear any old messages

  addBubble('ai', "Hi! I'm MessMate AI ðŸ½ï¸ Tell me your budget, diet preference, and time â€” I'll find the best mess near you and can even WhatsApp them for you!");
}

// =============================================
// VOICE RECOGNITION
// =============================================
function startVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech recognition is not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-IN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const btnMic = document.getElementById('btn-mic');
  
  recognition.onstart = function() {
    btnMic.classList.add('listening');
  };

  recognition.onspeechend = function() {
    recognition.stop();
  };

  recognition.onend = function() {
    btnMic.classList.remove('listening');
  };

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById('chat-input').value = transcript;
    sendChat(); // Auto-send after voice input
  };

  recognition.onerror = function(event) {
    console.error("Speech recognition error:", event.error);
    btnMic.classList.remove('listening');
  };

  recognition.start();
}
