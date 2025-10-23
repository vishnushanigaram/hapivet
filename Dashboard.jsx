import React, { useState, useRef, useEffect } from 'react';
import { Send, Stethoscope } from 'lucide-react';

const SPECIALIZATIONS = {
  dermatology: ['skin', 'fur', 'itch', 'rash', 'scratch', 'hair loss', 'bald'],
  cardiology: ['heart', 'breath', 'tired', 'fatigue', 'cough', 'wheez'],
  orthopedics: ['leg', 'bone', 'limp', 'walk', 'jump', 'mobility', 'pain'],
  neurology: ['seizure', 'shake', 'confus', 'balance', 'dizzy', 'tremble'],
  general: ['fever', 'vomit', 'appetite', 'lethargy', 'weak', 'diarrhea'],
  dental: ['tooth', 'teeth', 'gum', 'mouth', 'breath smell', 'drool'],
  ophthalmology: ['eye', 'vision', 'discharge', 'red eye', 'swollen eye'],
  gastroenterology: ['stomach', 'digest', 'bloat', 'gas', 'constipat']
};

const SLOTS = ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'];

export default function Dashboars() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm Hapivet AI 🐾 Tell me about your pet and what's bothering them." }
  ]);
  const [input, setInput] = useState('');
  const [state, setState] = useState({ stage: 'initial' });
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const detectSpecialization = (text) => {
    const lower = text.toLowerCase();
    for (const [spec, keywords] of Object.entries(SPECIALIZATIONS)) {
      if (keywords.some(kw => lower.includes(kw))) return spec;
    }
    return 'general';
  };

  const detectSeverity = (text) => {
    const severe = ['blood', 'seizure', 'collapse', 'emergency', 'not moving', 'unconscious', 'severe'];
    return severe.some(s => text.toLowerCase().includes(s)) ? 'severe' : 'mild';
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    
    const text = input.toLowerCase();
    let botReply = '';

    if (state.stage === 'initial') {
      const spec = detectSpecialization(text);
      const severity = detectSeverity(text);
      
      const specNames = {
        dermatology: 'Dermatology (Skin)',
        cardiology: 'Cardiology (Heart)',
        orthopedics: 'Orthopedics (Bones)',
        neurology: 'Neurology (Nervous System)',
        dental: 'Dental',
        ophthalmology: 'Ophthalmology (Eyes)',
        gastroenterology: 'Gastroenterology (Digestive)',
        general: 'General Medicine'
      };

      if (severity === 'severe') {
        botReply = `This sounds serious! I recommend immediate veterinary care for ${specNames[spec]}. Would you like to book an urgent appointment? (Yes/No)`;
        setState({ stage: 'booking', spec, severity });
      } else {
        botReply = `This seems like a ${specNames[spec]} issue. For mild cases:\n• Monitor your pet closely\n• Ensure they're hydrated\n• Avoid strenuous activity\n\nIf symptoms persist or worsen, I'd recommend seeing a vet. Would you like to schedule an appointment? (Yes/No)`;
        setState({ stage: 'booking', spec, severity });
      }
    } else if (state.stage === 'booking') {
      if (text.includes('yes') || text.includes('book') || text.includes('appointment')) {
        botReply = `Great! Available time slots:\n${SLOTS.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nWhich time works best for you? (Reply with number or time)`;
        setState({ ...state, stage: 'slot_selection' });
      } else {
        botReply = "No problem! If things change or you have more concerns, I'm here to help. Take care of your pet! 🐾";
        setState({ stage: 'initial' });
      }
    } else if (state.stage === 'slot_selection') {
      const slotIndex = parseInt(text) - 1;
      const selectedSlot = slotIndex >= 0 && slotIndex < SLOTS.length ? SLOTS[slotIndex] : 
                           SLOTS.find(s => text.includes(s.toLowerCase()));
      
      if (selectedSlot) {
        const available = Math.random() > 0.3;
        if (available) {
          botReply = `✅ Appointment confirmed for ${selectedSlot}!\n\nSpecialization: ${state.spec}\nYou'll receive a confirmation shortly. See you soon! 🐾`;
          setState({ stage: 'initial' });
        } else {
          const alt = SLOTS.filter(s => s !== selectedSlot).slice(0, 2);
          botReply = `Sorry, ${selectedSlot} is fully booked. How about:\n${alt.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
        }
      } else {
        botReply = `I didn't catch that. Please pick a time:\n${SLOTS.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
      }
    }

    setMessages(prev => [...prev, { role: 'bot', text: botReply }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="bg-white shadow-md p-4 flex items-center gap-3">
        <Stethoscope className="text-green-600" size={32} />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hapivet AI</h1>
          <p className="text-sm text-gray-600">Your Pet's Health Assistant</p>
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
          />
          <button
            onClick={handleSend}
            className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}