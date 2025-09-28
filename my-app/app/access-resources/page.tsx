"use client"

import Link from "next/link"
import { useState } from "react"

export default function AccessResourcesPage() {
  const [inputText, setInputText] = useState("")

  return (
    <div className="min-h-screen space-background text-white font-montserrat">
      <div className="min-h-screen grid grid-rows-[auto_1fr] gap-8 p-8">
        <header className="text-center pt-16">
          <Link href="/" className="inline-block mb-8 text-gray-300 hover:text-white transition-colors">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold tracking-wider mb-4 text-white">Access Resources</h1>
          <p className="text-xl text-gray-300 font-light tracking-wide">
            Explore learning materials and educational content
          </p>
        </header>

        <main className="max-w-4xl mx-auto w-full">
          <div className="feature-card wave-pattern rounded-2xl p-12">
            <div className="grid grid-rows-[auto_1fr_auto] gap-8 min-h-96">
              <h2 className="text-3xl font-semibold text-white text-center">Learning Resources</h2>

              <div className="place-self-center w-full max-w-2xl">
                <div className="border-2 border-dashed border-gray-400 rounded-xl p-12 text-center hover:border-gray-300 transition-colors cursor-pointer mb-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-600 opacity-30 mx-auto mb-4"></div>
                  <p className="text-gray-300 text-lg mb-2">Browse available resources</p>
                  <p className="text-gray-400 text-sm">or upload your own materials</p>
                </div>

                <div className="mb-8">
                  <label htmlFor="textInput" className="block text-gray-300 text-lg mb-4 text-center">
                    Search resources or add content:
                  </label>
                  <textarea
                    id="textInput"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Search for learning resources or paste content to organize..."
                    className="w-full h-40 bg-black/30 border border-gray-500 rounded-lg p-4 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none resize-none backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  Search Resources
                </button>
                <button className="border border-gray-400 hover:border-gray-300 text-gray-300 hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
