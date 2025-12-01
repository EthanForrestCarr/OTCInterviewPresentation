import { GeneralInterviewQuestions } from './components/GeneralInterviewQuestions'
import { Navbar } from './components/Navbar'

export function InterviewApp() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-20 sm:pt-24">
        <section className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            General Data Analyst Interview Practice
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            This standalone page is focused only on general data analyst questions so you
            can practice responses away from the project-specific narrative.
          </p>
        </section>

        <GeneralInterviewQuestions />
      </main>
    </div>
  )
}
