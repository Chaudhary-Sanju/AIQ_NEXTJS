"use client";

import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
            <div className="text-center max-w-md mx-auto">
                {/* Animated 404 Number */}
                <div className="relative mb-8">
                    <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
                        404
                    </h1>
                    <div className="absolute inset-0 text-8xl md:text-9xl font-black text-blue-200 -z-10 blur-sm">
                        404
                    </div>
                </div>

                {/* Main Message */}
                <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                        Oops! Page Not Found
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        The page you&apos;re looking for seems to have wandered off.
                        Let&apos;s get you back on track!
                    </p>
                </div>

                {/* Illustration/Icon */}
                <div className="mb-8">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.441.935-5.982 2.453M12 3a9 9 0 110 18 9 9 0 010-18z" />
                        </svg>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold border-2 border-gray-200 hover:border-gray-300 hover:shadow-md transform hover:scale-105 transition-all duration-200"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}