import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"


const mockGenerateQuestions = async (prompt) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return [
        {
            question: "How do you approach responsive design in your projects?",
            type: "technical",
        },
        {
            question: "What's your experience with state management libraries like Redux or MobX?",
            type: "technical",
        },
        {
            question: "Can you explain how you would optimize a React application for performance?",
            type: "technical",
        },
    ]
}

export function GenerateQuestionsDialog({ open, onOpenChange, onAddQuestions }) {
    const [prompt, setPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedQuestions, setGeneratedQuestions] = useState([])

    const handleGenerate = async () => {
        if (!prompt.trim()) return

        setIsGenerating(true)
        try {
            // In a real implementation, this would call an API with Gemini
            const questions = await mockGenerateQuestions(prompt)
            setGeneratedQuestions(questions)
        } catch (error) {
            console.error("Error generating questions:", error)
        } finally {
            setIsGenerating(false)
        }
    }

    const handleAddQuestions = () => {
        onAddQuestions(generatedQuestions)
        setPrompt("")
        setGeneratedQuestions([])
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Generate Interview Questions</DialogTitle>
                    <DialogDescription>
                        Provide context about the role and requirements to generate relevant interview questions.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="prompt">Context</Label>
                        <Textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., Frontend Developer position requiring 3+ years of React experience, knowledge of TypeScript, and experience with RESTful APIs."
                            className="min-h-[100px]"
                            disabled={isGenerating || generatedQuestions.length > 0}
                        />
                    </div>

                    {!generatedQuestions.length && (
                        <Button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating} className="w-full">
                            {isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                "Generate Questions"
                            )}
                        </Button>
                    )}

                    {generatedQuestions.length > 0 && (
                        <div className="border rounded-md p-4 mt-2">
                            <h3 className="font-medium mb-2">Generated Questions:</h3>
                            <ul className="space-y-2">
                                {generatedQuestions.map((q, index) => (
                                    <li key={index} className="text-sm">
                                        {index + 1}. {q.question}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setPrompt("")
                            setGeneratedQuestions([])
                            onOpenChange(false)
                        }}
                    >
                        Cancel
                    </Button>
                    {generatedQuestions.length > 0 && <Button onClick={handleAddQuestions}>Add Questions</Button>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
