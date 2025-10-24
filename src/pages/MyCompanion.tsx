import { useEffect } from 'react';
import { motion } from 'framer-motion';

const MyCompanion = () => {
  useEffect(() => {
    let scriptElement = null;

    // Wait for avatar container to be available
    const waitForContainer = setInterval(() => {
      const avatarContainer = document.getElementById('heygen-avatar-container');
      if (avatarContainer && !scriptElement) {
        clearInterval(waitForContainer);

        // Inject the HeyGen embedding script
        scriptElement = document.createElement('script');
        scriptElement.innerHTML = '!function(window){const host="https://labs.heygen.com",url=host+"/guest/streaming-embed?share=eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiJUaGFkZGV1c19Qcm9mZXNzaW9uYWxMb29r%0D%0AX3B1YmxpYyIsInByZXZpZXdJbWciOiJodHRwczovL2ZpbGVzMi5oZXlnZW4uYWkvYXZhdGFyL3Yz%0D%0ALzhkYzJjYWExNzJjZDRlNjc5NmIzN2U5ZjE2OTU0YjdlXzU1OTUwL3ByZXZpZXdfdGFyZ2V0Lndl%0D%0AYnAiLCJuZWVkUmVtb3ZlQmFja2dyb3VuZCI6dHJ1ZSwia25vd2xlZGdlQmFzZUlkIjoiNTY0OWZl%0D%0AZTc5YjlkNDFiNDlmNDEyYzM3ODM5NTQwY2QiLCJ1c2VybmFtZSI6IjI0MGU3NDU3OGUzNTQ1MzM5%0D%0AMmIwYmU5MGE2OTE0NDNmIn0%3D&inIFrame=1",clientWidth=document.body.clientWidth,wrapDiv=document.createElement("div");wrapDiv.id="heygen-streaming-embed";const container=document.createElement("div");container.id="heygen-streaming-container";const stylesheet=document.createElement("style");stylesheet.innerHTML=`\n  #heygen-streaming-embed {\n    z-index: 999;\n    position: relative;\n    margin: 0 auto;\n    width: 600px;\n    height: 600px;\n    border-radius: 50%;\n    border: 2px solid #fff;\n    box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.12);\n    transition: all linear 0.1s;\n    overflow: hidden;\n\n    opacity: 0;\n    visibility: hidden;\n  }\n  #heygen-streaming-embed.show {\n    opacity: 1;\n    visibility: visible;\n  }\n  #heygen-streaming-embed.expand {\n    ${clientWidth<540?"height: 798px; width: 96%; margin: 0 auto;":"height: 1098px; width: calc(1098px * 16 / 9); margin: 0 auto;"}\n    border: 0;\n    border-radius: 8px;\n  }\n  #heygen-streaming-container {\n    width: 100%;\n    height: 100%;\n  }\n  #heygen-streaming-container iframe {\n    width: 100%;\n    height: 100%;\n    border: 0;\n  }\n  `;const iframe=document.createElement("iframe");iframe.allowFullscreen=!1,iframe.title="Streaming Embed",iframe.role="dialog",iframe.allow="microphone",iframe.src=url;let visible=!1,initial=!1;window.addEventListener("message",(e=>{e.origin===host&&e.data&&e.data.type&&"streaming-embed"===e.data.type&&("init"===e.data.action?(initial=!0,wrapDiv.classList.toggle("show",initial)):"show"===e.data.action?(visible=!0,wrapDiv.classList.toggle("expand",visible)):"hide"===e.data.action&&(visible=!1,wrapDiv.classList.toggle("expand",visible)))})),container.appendChild(iframe),wrapDiv.appendChild(stylesheet),wrapDiv.appendChild(container),document.getElementById("heygen-avatar-container").appendChild(wrapDiv)}(globalThis);';
        document.body.appendChild(scriptElement);
      }
    }, 100);

    return () => {
      clearInterval(waitForContainer);
      const embed = document.getElementById('heygen-streaming-embed');
      if (embed) {
        embed.remove();
      }
      if (scriptElement?.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 font-serif">
              My English Companion
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your AI-powered conversational coach for English learning
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Instructions Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 border-l-4 border-primary-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-primary-600">📌</span>
            Instructions
          </h2>

          <div className="space-y-4 text-gray-700 text-base leading-relaxed">
            <p className="flex gap-3">
              <span className="text-primary-600 font-bold min-w-fit">1.</span>
              <span>
                <strong>Start the conversation</strong> - Click the avatar button in the bottom-left corner to activate your English Companion
              </span>
            </p>

            <p className="flex gap-3">
              <span className="text-primary-600 font-bold min-w-fit">2.</span>
              <span>
                <strong>Open with greeting</strong> - Start the conversation with: <br />
                <span className="italic text-primary-700 bg-blue-50 p-2 rounded inline-block mt-2">
                  "Hello. I am a non-native learner of English. My level is A1. I want you to help me converse in English about who I am, shopping and everyday activities."
                </span>
              </span>
            </p>

            <p className="flex gap-3">
              <span className="text-primary-600 font-bold min-w-fit">3.</span>
              <span>
                <strong>Duration</strong> - Each conversation lasts approximately <strong>10 minutes</strong>
              </span>
            </p>

            <p className="flex gap-3">
              <span className="text-primary-600 font-bold min-w-fit">4.</span>
              <span>
                <strong>Share your progress</strong> - At the end of the conversation, copy the script and send it to your teacher&apos;s WhatsApp for feedback
              </span>
            </p>

            <p className="flex gap-3">
              <span className="text-primary-600 font-bold min-w-fit">5.</span>
              <span>
                <strong>Topics covered</strong> - Your AI companion will help you practice:
              </span>
            </p>

            <div className="ml-8 space-y-2">
              <p className="flex items-center gap-2">
                <span className="text-primary-600">✓</span> Personal introductions and descriptions
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary-600">✓</span> Shopping and everyday transactions
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary-600">✓</span> Daily activities and routines
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary-600">✓</span> Basic conversational English (A1 level)
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Avatar Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-12 text-center">Start Your Conversation</h2>
          <div id="heygen-avatar-container" className="w-full flex justify-center items-center">
            {/* HeyGen Avatar will be injected here - centered */}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Use My Companion?</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ translateY: -5 }}
              className="bg-white rounded-lg shadow-md p-6 text-center"
            >
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-bold text-gray-900 mb-2">Real Conversations</h3>
              <p className="text-gray-600 text-sm">
                Practice authentic English conversations in a judgment-free environment
              </p>
            </motion.div>

            <motion.div
              whileHover={{ translateY: -5 }}
              className="bg-white rounded-lg shadow-md p-6 text-center"
            >
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="font-bold text-gray-900 mb-2">AI Coaching</h3>
              <p className="text-gray-600 text-sm">
                Get personalized feedback and corrections from an intelligent virtual coach
              </p>
            </motion.div>

            <motion.div
              whileHover={{ translateY: -5 }}
              className="bg-white rounded-lg shadow-md p-6 text-center"
            >
              <div className="text-4xl mb-4">📈</div>
              <h3 className="font-bold text-gray-900 mb-2">Track Progress</h3>
              <p className="text-gray-600 text-sm">
                Share conversations with your teacher for detailed feedback and progress tracking
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Tips Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="py-12 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Tips for Better Practice</h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Speak clearly and naturally</h3>
                <p className="text-gray-600 text-sm">Pronounce words clearly so the avatar understands you better</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Don&apos;t be afraid of mistakes</h3>
                <p className="text-gray-600 text-sm">Errors are part of learning - your coach will help you improve</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Practice regularly</h3>
                <p className="text-gray-600 text-sm">Consistent practice leads to faster improvement in speaking skills</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Check your microphone</h3>
                <p className="text-gray-600 text-sm">Ensure your microphone is working and properly configured</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="py-16 px-4 sm:px-6 lg:px-8 text-center"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start?</h2>
          <p className="text-gray-600 mb-8">
            Look for the avatar button in the bottom-left corner of your screen and click it to begin your conversation.
          </p>
          <p className="text-gray-500 text-sm">
            Make sure you allow microphone access when prompted by your browser.
          </p>
        </div>
      </motion.section>
    </div>
  );
};

export default MyCompanion;
