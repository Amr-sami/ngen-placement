'use client';

import React from 'react';
import { useSession, signIn } from 'next-auth/react';

export default function GameSection() {
    const { data: session } = useSession();

    return (
        <section className="w-full py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="font-protestRiot text-4xl md:text-5xl text-center mb-10 text-[#5b21b6]">
                    Play Our Game
                </h2>
                <div className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-white">
                    {session ? (
                        <div className="aspect-video">
                            <iframe
                                src="/game/index.html"
                                title="NGen Game"
                                className="w-full h-full border-0"
                                allow="autoplay; fullscreen"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <div className="aspect-video flex flex-col items-center justify-center p-8 bg-white border border-gray-100">
                            <div className="text-center max-w-md">
                                <h3 className="text-2xl font-bold mb-3 text-gray-800">Please Login to Play</h3>
                                <p className="text-gray-600 mb-6">
                                    You need to be signed in to access the game and save your progress.
                                </p>
                                <button
                                    onClick={() => signIn(undefined, { callbackUrl: window.location.href })}
                                    className="px-8 py-3 bg-[#5b21b6] text-white rounded-full hover:bg-[#4c1d95] transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Login / Sign Up
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
