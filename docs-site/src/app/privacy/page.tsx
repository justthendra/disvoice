import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#0f1012] text-gray-300 font-sans selection:bg-blurple selection:text-white">
            <div className="container mx-auto px-6 py-24 max-w-4xl">
                <Link href="/" className="inline-flex items-center text-blurple hover:text-white transition-colors mb-8">
                    ← Back to Home
                </Link>

                <h1 className="text-4xl md:text-5xl font-black text-white mb-8">Privacy Policy</h1>

                <div className="space-y-8 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                        <p>
                            We prioritize your privacy. Disvoice is a library that runs on your infrastructure.
                            We do not collect, store, or transmit any personal data, voice data, or usage statistics from your bots or users.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Third-Party Services</h2>
                        <p>
                            Disvoice interacts with third-party services like YouTube, Spotify, and SoundCloud to retrieve audio streams.
                            These interactions are subject to the privacy policies of the respective services:
                        </p>
                        <ul className="list-disc pl-6 mt-4 space-y-2">
                            <li><a href="https://policies.google.com/privacy" className="text-blurple hover:underline">Google Privacy Policy</a></li>
                            <li><a href="https://www.spotify.com/us/legal/privacy-policy/" className="text-blurple hover:underline">Spotify Privacy Policy</a></li>
                            <li><a href="https://soundcloud.com/pages/privacy" className="text-blurple hover:underline">SoundCloud Privacy Policy</a></li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
                        <p>
                            Since Disvoice operates entirely within your own Node.js environment, the security of your data depends on your server configuration
                            and how you manage your Discord Bot Tokens and API keys. We recommend following best practices for securing your credentials.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Updates to this Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Revised" date
                            and the updated version will be effective as soon as it is accessible.
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 text-sm text-gray-500">
                    Last Updated: February 9, 2024
                </div>
            </div>
        </div>
    );
}
