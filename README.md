# 🐾 Hapivet AI – Veterinary Chatbot (Powered by Gemini API)

### 🚀 Project Overview
**Hapivet AI** is an intelligent veterinary management system that introduces an **AI-powered veterinary chatbot** to assist pet owners with their pets’ health queries.  
This chatbot helps users describe their pets’ symptoms and receive instant, veterinary-based guidance — including **disease analysis, specialization detection, and doctor appointment scheduling**.

---

## 🧠 Key Idea

The goal of Hapivet AI is to simplify veterinary assistance by introducing a **conversational AI agent** that can:
- Understand pet symptoms (age, breed, disease, behavior).
- Analyze the problem and identify the relevant **veterinary specialization**.
- Suggest possible remedies or care advice.
- Determine if the condition is **mild, moderate, or severe**.
- Automatically manage **doctor appointments** if the case requires in-person consultation.

All interactions happen naturally within a **chatbot-style interface**, giving users a friendly and intelligent veterinary experience.

---

## 💡 Features

### 🩺 1. Pet Health Chatbot
- Users can chat about their pet’s health (symptoms, behavior, etc.).
- The chatbot provides helpful, empathetic, and medically aware responses.
- Uses **Gemini API** for generating responses dynamically.

### 🧩 2. Specialization Detection
The AI intelligently maps each case to the correct veterinary specialization:

| Symptom Type | Specialization |
|---------------|----------------|
| Skin issues, itching, allergies | Dermatology |
| Breathing, heart problems | Cardiology |
| Limping, fractures | Orthopedics |
| Seizures, paralysis | Neurology |
| Vomiting, fever, infection | General Medicine |
| Mouth odor, gum pain | Dental |
| Eye redness, discharge | Ophthalmology |
| Stomach swelling, digestion issues | Gastroenterology |

### 🔍 3. Condition Analysis
- Analyzes the severity of the pet’s condition.
- Suggests **home remedies** for mild cases.
- Recommends **doctor appointments** for severe ones.

### 📅 4. Doctor Appointment Management
- Users can book appointments directly through chat.  
- AI checks:
  - Doctor’s **specialization** availability.  
  - **Time slot** conflicts (10 AM, 2 PM, 6 PM, etc.).  
- If no slot is available, it suggests alternate times or marks the case as **“On Hold.”**

### 💬 5. Dynamic Conversational Memory
- Remembers chat context (pet details, previous steps, selected time slots).
- Ensures a smooth and continuous conversation like a real assistant.

### 🖥️ 6. Simple Frontend UI
- Chat-style interface (user messages on left, AI messages on right).  
- Appointment confirmations shown clearly in chat.  
- Minimal and mobile-friendly layout.

---

## ⚙️ Technical Stack

| Component | Technology |
|------------|-------------|
| **AI Model** | Gemini API (Google Generative AI) |
| **Backend** | Node.js + Express |
| **Frontend** | React.js / HTML-CSS-JS |
| **Database** | MongoDB / JSON (for doctor & appointment data) |
| **Integration** | REST API endpoints for chatbot interaction |

---

## 🧠 Gemini API Integration

- The chatbot uses **Google Generative AI (Gemini API)** to process user inputs and generate responses.
- The model is instructed through a structured prompt to:
  - Analyze pet symptoms.
  - Identify disease specialization.
  - Evaluate severity.
  - Manage appointment logic.

All AI logic runs dynamically, ensuring the chatbot behaves like a real veterinary expert.

---

## 🧩 System Flow

1. **User enters pet symptoms** → e.g., “My cat has red spots on its skin.”  
2. **AI identifies specialization** → Dermatology.  
3. **AI suggests care or appointment** → “It may be an allergy; would you like to book a dermatology consultation?”  
4. **User selects slot** → “Yes, 2 PM.”  
5. **AI confirms** → “2 PM slot booked with Dr. Meera (Dermatology).”  
6. **If slot unavailable** → AI suggests available alternatives.  

---

## 🔐 Model Behavior Rules

- Responds with empathy and professionalism.  
- Avoids medical prescriptions; suggests safe advice only.  
- Never produces verbose or overly technical text.  
- Keeps messages clear, short, and friendly.  
- Supports multi-turn contextual conversation.

---

## ⚡ Developer Instructions

When generating the implementation:
- Keep code **clean, modular, and concise**.  
- Use **minimal dependencies**.  
- Ensure responses are **non-verbose**.  
- Focus on main logic:
  - Input understanding  
  - Specialization detection  
  - Severity analysis  
  - Appointment scheduling  

---

## 🧾 Example Interaction

**User:** My pug is breathing heavily and feels weak.  
**AI:** That sounds like a **Cardiology** issue. It could be related to heart or respiratory stress.  
Would you like to book a check-up with our cardiology specialist?  
**User:** Yes, 2 PM.  
**AI:** Great! The 2 PM slot is confirmed with Dr. Arjun (Cardiology). 🩺

---

## 📦 Future Enhancements

- Integration with real-time doctor availability API.  
- Add image-based symptom detection using Gemini Vision.  
- Push notifications for appointment reminders.  
- Pet health history dashboard.  
- Multilingual chat support.

---

## 🧰 Setup Instructions

1. Clone the repository  
   ```bash
   git clone https://github.com/vishnushanigaram/hapivet.git
   cd hapivet
