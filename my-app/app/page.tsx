import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen space-background text-white font-lastica">
      <div className="min-h-screen grid grid-rows-[auto_1fr] gap-8 p-8">
        <header className="text-center pt-16">
          <h1 className="text-6xl font-bold tracking-wider mb-4 text-white">SYNAPSE X</h1>
          <p className="text-xl text-gray-300 font-light tracking-wide">Helping People Learn.</p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto w-full place-items-center">
          <Link href="/files-to-notes" className="w-full max-w-sm">
            <div className="feature-card wave-pattern rounded-2xl p-8 h-96 cursor-pointer">
              <div className="h-full grid grid-rows-[auto_1fr_auto] gap-4">
                <h2 className="text-2xl font-semibold text-white text-center">Files to Notes</h2>

                <div className="place-self-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-blue-600 opacity-20 relative grid place-items-center">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-white opacity-80"
                    >
                      <path
                        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <polyline
                        points="14,2 14,8 20,8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <line
                        x1="16"
                        y1="13"
                        x2="8"
                        y2="13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <line
                        x1="16"
                        y1="17"
                        x2="8"
                        y2="17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <polyline
                        points="10,9 9,9 8,9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <p className="text-gray-300 text-center text-lg">
                  upload file or
                  <br />
                  input text
                </p>
              </div>
            </div>
          </Link>

          <Link href="/files-to-flashcards" className="w-full max-w-sm">
            <div className="feature-card wave-pattern rounded-2xl p-8 h-96 cursor-pointer">
              <div className="h-full grid grid-rows-[auto_1fr_auto] gap-4">
                <h2 className="text-2xl font-semibold text-white text-center">Files to Flashcards</h2>

                <div className="place-self-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-blue-600 opacity-20 relative grid place-items-center">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-white opacity-80"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                      <line
                        x1="8"
                        y1="21"
                        x2="16"
                        y2="21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <line
                        x1="12"
                        y1="17"
                        x2="12"
                        y2="21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <line x1="6" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <line
                        x1="6"
                        y1="12"
                        x2="14"
                        y2="12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                <p className="text-gray-300 text-center text-lg">
                  upload file or
                  <br />
                  input text
                </p>
              </div>
            </div>
          </Link>

          <Link href="/access-resources" className="w-full max-w-sm">
            <div className="feature-card wave-pattern rounded-2xl p-8 h-96 cursor-pointer">
              <div className="h-full grid grid-rows-[auto_1fr_auto] gap-4">
                <h2 className="text-2xl font-semibold text-white text-center">Access Resources</h2>

                <div className="place-self-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-blue-600 opacity-20 relative grid place-items-center">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-white opacity-80"
                    >
                      <path
                        d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="13" r="2" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 11v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M10 13h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                <p className="text-gray-300 text-center text-lg">
                  upload file or
                  <br />
                  input text
                </p>
              </div>
            </div>
          </Link>
        </main>
      </div>
    </div>
  )
}
