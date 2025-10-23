import React, { useState, useRef, useEffect } from 'react';
import { Send, Stethoscope, Loader2 } from 'lucide-react';

const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';

const SYSTEM_PROMPT = `You are Hapivet AI, a veterinary assistant chatbot. Analyze pet health issues and respond in JSON format only.

Specializations: dermatology, cardiology, orthopedics, neurology, gastroenterology, dental, ophthalmology, general

Response format:
{
  "message": "Your friendly response to user",
  "specialization": "detected field or null",
  "severity": "mild/moderate/severe or null",
  "needsAppointment": true/false,
  "stage": "chat/ask_appointment/slot_selection/confirmed"
}

Rules:
- Be warm, empathetic, conversational
- Keep responses short (2-3 sentences)
- Detect specialization from symptoms
- mild = home care tips, severe = immediate appointment
- If user agrees to appointment, set stage to "slot_selection"
- Remember conversation context`;

const SLOTS = ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'];

export default function HapivetAI() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm Hapivet AI 🐾 Tell me about your pet and what's bothering them." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState([]);
  const [awaitingSlot, setAwaitingSlot] = useState(false);
  const [currentSpec, setCurrentSpec] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const callGemini = async (userMessage) => {
    const conversationHistory = context.map(m => 
      `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`
    ).join('\n');

    const prompt = `${SYSTEM_PROMPT}

Conversation so far:
${conversationHistory}

User: ${userMessage}

Respond in valid JSON only:`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500
            }
          })
        }
      );

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
      
      return JSON.parse(jsonText.trim());
    } catch (error) {
      console.error('Gemini API Error:', error);
      return {
        message: "I'm having trouble connecting right now. Please describe your pet's symptoms and I'll help!",
        specialization: null,
        severity: null,
        needsAppointment: false,
        stage: 'chat'
      };
    }
  };

  const handleSlotSelection = (userInput) => {
    const text = userInput.toLowerCase();
    const slotIndex = parseInt(text) - 1;
    const selectedSlot = slotIndex >= 0 && slotIndex < SLOTS.length ? SLOTS[slotIndex] : 
                         SLOTS.find(s => text.includes(s.toLowerCase()));
    
    if (selectedSlot) {
      const available = Math.random() > 0.25; // 75% availability
      
      if (available) {
        const specNames = {
          dermatology: 'Dermatology',
          cardiology: 'Cardiology',
          orthopedics: 'Orthopedics',
          neurology: 'Neurology',
          gastroenterology: 'Gastroenterology',
          dental: 'Dental',
          ophthalmology: 'Ophthalmology',
          general: 'General Medicine'
        };
        
        return {
          text: `✅ Appointment confirmed!\n\n📅 Time: ${selectedSlot}\n🏥 Specialization: ${specNames[currentSpec] || 'General Medicine'}\n\nYou'll receive a confirmation shortly. Take care of your pet! 🐾`,
          done: true
        };
      } else {
        const alt = SLOTS.filter(s => s !== selectedSlot).slice(0, 3);
        return {
          text: `Sorry, ${selectedSlot} is fully booked. Available slots:\n${alt.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nWhich works for you?`,
          done: false
        };
      }
    } else {
      return {
        text: `Please choose a time slot:\n${SLOTS.map((s, i) => `${i + 1}. ${s}`).join('\n')}`,
        done: false
      };
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setContext(prev => [...prev, userMsg]);
    setLoading(true);

    // Handle slot selection locally
    if (awaitingSlot) {
      const slotResult = handleSlotSelection(input);
      const botMsg = { role: 'bot', text: slotResult.text };
      setMessages(prev => [...prev, botMsg]);
      setContext(prev => [...prev, botMsg]);
      
      if (slotResult.done) {
        setAwaitingSlot(false);
        setCurrentSpec(null);
      }
      
      setInput('');
      setLoading(false);
      return;
    }

    // Call Gemini for dynamic response
    const aiResponse = await callGemini(input);
    
    let botText = aiResponse.message;

    // Handle appointment flow
    if (aiResponse.stage === 'slot_selection') {
      botText += `\n\nAvailable time slots:\n${SLOTS.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nWhich time works best?`;
      setAwaitingSlot(true);
      setCurrentSpec(aiResponse.specialization);
    }

    const botMsg = { role: 'bot', text: botText };
    setMessages(prev => [...prev, botMsg]);
    setContext(prev => [...prev, botMsg]);
    
    setInput('');
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="bg-white shadow-md p-4 flex items-center gap-3">
        <Stethoscope className="text-green-600" size={32} />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hapivet AI</h1>
          <p className="text-sm text-gray-600">Powered by Gemini API</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-green-600 text-white rounded-br-none' 
                : 'bg-white text-gray-800 shadow rounded-bl-none'
            }`}>
              <p className="whitespace-pre-line text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-2 rounded-2xl shadow">
              <Loader2 className="animate-spin text-green-600" size={20} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="bg-white p-4 shadow-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe your pet's symptoms..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Replace YOUR_GEMINI_API_KEY_HERE with your actual key
        </p>
      </div>
    </div>
  );
}