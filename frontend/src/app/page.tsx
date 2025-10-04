import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden bg-[var(--secondary-color)]" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between whitespace-nowrap px-10 py-5">
        <div className="flex items-center gap-3 text-white">
          <svg className="h-8 w-8 text-[var(--primary-color)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
          </svg>
          <h1 className="text-xl font-bold leading-tight tracking-[-0.015em]">StudyBuddy</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-5 bg-transparent border border-gray-600 text-white text-sm font-semibold leading-normal hover:bg-gray-800 transition-colors"
          >
            <span className="truncate">Log In</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="flex items-center justify-center min-h-[80vh] pt-20 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-6xl">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[var(--text-primary)] mb-8">
                Transform Your
                <span className="block text-[var(--primary-color)]">Learning Journey</span>
              </h1>
              <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-12 leading-relaxed">
                Upload your study materials and transform them into interactive learning experiences with AI-powered quizzes, flashcards, and instant Q&A
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                <Link
                  href="/signup"
                  className="group relative flex w-full sm:w-auto justify-center rounded-lg border border-transparent bg-[var(--primary-color)] py-4 px-8 text-lg font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/login"
                  className="group relative flex w-full sm:w-auto justify-center rounded-lg border border-gray-600 bg-transparent py-4 px-8 text-lg font-semibold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 ease-in-out"
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <div className="text-center">
                <div className="text-4xl font-bold text-[var(--primary-color)] mb-2">10K+</div>
                <div className="text-[var(--text-secondary)]">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[var(--primary-color)] mb-2">50K+</div>
                <div className="text-[var(--text-secondary)]">Study Materials</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[var(--primary-color)] mb-2">95%</div>
                <div className="text-[var(--text-secondary)]">Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-6">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                Powerful AI-driven tools designed to enhance your learning experience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Ask Questions Card */}
              <div className="bg-gray-900/50 backdrop-blur-sm shadow-2xl rounded-xl p-8 hover:bg-gray-900/60 transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-[var(--primary-color)]/20 mb-6">
                    <svg className="h-8 w-8 text-[var(--primary-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                    Ask Questions
                  </h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    Get instant, accurate answers about your study material with our AI-powered Q&A system
                  </p>
                </div>
              </div>

              {/* Generate Quizzes Card */}
              <div className="bg-gray-900/50 backdrop-blur-sm shadow-2xl rounded-xl p-8 hover:bg-gray-900/60 transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-[var(--primary-color)]/20 mb-6">
                    <svg className="h-8 w-8 text-[var(--primary-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                    Generate Quizzes
                  </h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    Test your knowledge with personalized quizzes generated from your study materials
                  </p>
                </div>
              </div>

              {/* Study Flashcards Card */}
              <div className="bg-gray-900/50 backdrop-blur-sm shadow-2xl rounded-xl p-8 hover:bg-gray-900/60 transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-[var(--primary-color)]/20 mb-6">
                    <svg className="h-8 w-8 text-[var(--primary-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                    Study Flashcards
                  </h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    Review key concepts with smart flashcards that adapt to your learning pace
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-gray-900/50 backdrop-blur-sm shadow-2xl rounded-2xl p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-6">
                Ready to Transform Your Learning?
              </h2>
              <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
                Join thousands of students who are already using StudyBuddy to enhance their learning experience
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/signup"
                  className="group relative flex w-full sm:w-auto justify-center rounded-lg border border-transparent bg-[var(--primary-color)] py-4 px-8 text-lg font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl"
                >
                  Start Learning Today
                </Link>
                <Link
                  href="/login"
                  className="group relative flex w-full sm:w-auto justify-center rounded-lg border border-gray-600 bg-transparent py-4 px-8 text-lg font-semibold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 ease-in-out"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
