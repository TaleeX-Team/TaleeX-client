export const interviewWorkflow = async (call) => {
    try {
        // Get variables from the client
        const { questions, currentQuestionIndex, totalQuestions, isFirstQuestion, isLastQuestion } = call.variables

        const currentQuestion = questions[currentQuestionIndex]

        console.log("Starting interview workflow", {
            currentQuestionIndex,
            totalQuestions,
            isFirstQuestion,
            isLastQuestion,
        })

        // Introduction (only for the first question)
        if (isFirstQuestion) {
            await call.speak(
                `Hello, I'm Alex, your technical interviewer today. I'll be asking you some questions about your experience and skills. Let's have a conversation to learn more about your background. Are you ready to begin?`,
            )

            // Wait for confirmation
            const readyResponse = await call.listen({ timeout: 30000 })
            await call.sleep(500)

            // Proceed with first question
            await call.speak(`Great. ${currentQuestion}`)
        } else {
            // For subsequent questions
            await call.speak(currentQuestion)
        }

        // Listen for candidate's response
        console.log("Listening for candidate response...")
        const response = await call.listen({ timeout: 120000 }) // 2 minute timeout

        console.log("Candidate response received", {
            hasTranscript: !!response.transcript,
            transcript: response.transcript,
        })

        // Short pause after candidate finishes speaking
        await call.sleep(1000)

        // If we got a response, acknowledge it and possibly ask a follow-up
        if (response.transcript) {
            if (isLastQuestion) {
                await call.speak(
                    "Thank you for sharing that. We've come to the end of our interview. I appreciate your time today and the insights you've shared about your experience. Do you have any questions for me before we wrap up?",
                )

                // Listen for any final questions
                const finalResponse = await call.listen({ timeout: 60000 })

                if (finalResponse.transcript) {
                    await call.speak(
                        "That's a good question. While I'm an AI interviewer, I'll make sure your questions are passed along to the hiring team. Thank you again for your time today, and the team will be in touch with next steps.",
                    )
                } else {
                    await call.speak(
                        "No problem. Thank you again for your time today, and the team will be in touch with next steps.",
                    )
                }
            } else {
                // For non-final questions, acknowledge and transition
                const acknowledgments = [
                    "Thank you for sharing that perspective.",
                    "That's helpful context, thank you.",
                    "I appreciate your detailed response.",
                    "That's an interesting approach.",
                    "Thank you for explaining that.",
                ]

                const randomAcknowledgment = acknowledgments[Math.floor(Math.random() * acknowledgments.length)]
                await call.speak(`${randomAcknowledgment} Let's move on to the next question when you're ready.`)
            }
        } else {
            // If no response was detected
            await call.speak("I didn't catch your response. Let's try to move forward with the next question.")
        }
    } catch (error) {
        console.error("Error in interview workflow:", error)
        await call.speak("I'm sorry, there was a technical issue with our conversation. Let's try to continue.")
    }
}
