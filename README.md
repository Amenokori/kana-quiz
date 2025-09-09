# 🎌 Kana Quiz

A quiz app for learning Japanese Kana (Hiragana and Katakana).

<img width="1542" height="991" alt="frame_safari_light" src="https://github.com/user-attachments/assets/82636816-8862-464e-9266-4d329957421f" />

## ✨ Why Kana Quiz?

Most kana apps are just flashcards. This one is different. It has a question engine that helps you learn faster by focusing on the tricky parts of Japanese.

- **🧠 Questions that target common mistakes**: The engine creates different types of questions based on what learners usually get wrong:
  - Reading single kana (e.g., `あ` → `a`)
  - Writing single kana (e.g., `a` → `あ`)
  - Telling apart similar-looking kana (like `シ` vs. `ツ` or `さ` vs. `き`)
  - Learning voiced sounds (Dakuten/Handakuten), like `は` vs. `ば` vs. `ぱ`
  - Learning combination sounds (like `きゃ` and `しょ`)
  - Reading real words written in Hiragana, Katakana, or a mix of both.

- **🎯 Challenging questions**: The wrong answers are picked to look like the right answer, so you have to pay close attention to the details.

- **📈 Step-by-step learning**: Questions are grouped by difficulty: `Beginner`, `Intermediate`, and `Advanced`. This lets you learn the basics first before moving on to harder kana.

- **🎨 Other features**:
  - Choose your quiz length (25, 50, 75, or 100 questions).
  - Get instant feedback on your answers.
  - Works on any device, switch between dark and light themes.

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- pnpm (or your favorite package manager)

### Installation & Running Locally

1.  Clone the repository:
    ```bash
    git clone https://github.com/Amenokori/kana-quiz.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd kana-quiz
    ```
3.  Install dependencies:
    ```bash
    pnpm install
    ```
4.  Start the development server:
    ```bash
    pnpm dev
    ```
    The application will be available at `http://localhost:5173`.

## 🛠️ Built With

- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [WanaKana](https://github.com/WaniKani/WanaKana) for Japanese language utilities.
