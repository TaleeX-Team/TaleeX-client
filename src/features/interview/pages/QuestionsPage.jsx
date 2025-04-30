import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus, ArrowRight } from "lucide-react"
import {QuestionDialog} from "@/components/interview/QuestionDialog.jsx";
import {GenerateQuestionsDialog} from "@/components/interview/GenerateQuestionsDialog.jsx";
import {Link} from "react-router-dom";
import SplineComponent from "@/components/interview/3dLoading.jsx";


// Mock data
const initialQuestions = [
    {
        question: "Can you explain your experience with React.js and describe a project where you utilized it?",
        type: "technical",
    },
    {
        question: "What challenges have you faced while working with RESTful APIs, and how did you overcome them?",
        type: "technical",
    },
    {
        question:
            "Can you walk us through your understanding of the virtual DOM in React? How does it improve performance?",
        type: "technical",
    },
    {
        question: "How do you ensure your HTML and CSS are optimized for performance? Can you give specific examples?",
        type: "technical",
    },
    {
        question: "Describe your experience with Git. How do you handle version control in your projects?",
        type: "technical",
    },
    {
        question:
            "In a team environment, how do you approach collaboration with designers and backend engineers? Can you provide a specific example?",
        type: "technical",
    },
    {
        question: "What is your approach to debugging JavaScript code? Could you share a challenging debugging experience?",
        type: "technical",
    },
    {
        question: "How do you stay updated with the latest trends and best practices in frontend development?",
        type: "technical",
    },
    {
        question:
            "Can you discuss a time when you had to learn a new technology or framework quickly for a project? How did you approach it?",
        type: "technical",
    },
    {
        question: "What steps do you take to ensure cross-browser compatibility in your web applications?",
        type: "technical",
    },
]

export default function QuestionsPage() {
    const [questions, setQuestions] = useState(initialQuestions)
    const [editingQuestion, setEditingQuestion] = useState(null)
    const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false)
    const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)

    const handleDeleteQuestion = (index) => {
        const newQuestions = [...questions]
        newQuestions.splice(index, 1)
        setQuestions(newQuestions)
    }

    const handleEditQuestion = (index) => {
        setEditingQuestion(questions[index])
        setIsQuestionDialogOpen(true)
    }

    const handleSaveQuestion = (question) => {
        if (editingQuestion) {
            const index = questions.findIndex((q) => q.question === editingQuestion.question)
            const newQuestions = [...questions]
            newQuestions[index] = question
            setQuestions(newQuestions)
        } else {
            setQuestions([...questions, question])
        }
        setEditingQuestion(null)
        setIsQuestionDialogOpen(false)
    }

    const handleAddGeneratedQuestions = (newQuestions) => {
        setQuestions((prev) => [...prev, ...newQuestions])
        setIsGenerateDialogOpen(false)
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Interview Questions</h1>
                    <p className="text-gray-500 mt-2">Manage your interview questions</p>
                </div>
                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setEditingQuestion(null)
                            setIsQuestionDialogOpen(true)
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Question
                    </Button>
                    <Button variant="outline" onClick={() => setIsGenerateDialogOpen(true)}>
                        Generate Questions
                    </Button>
                    <Link to="/interview">
                        <Button disabled={questions.length === 0}>
                            Start Interview
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {questions.map((question, index) => (
                    <Card key={index} className="shadow-sm">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between">
                                <Badge>{question.type}</Badge>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleEditQuestion(index)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteQuestion(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p>{question.question}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <QuestionDialog
                open={isQuestionDialogOpen}
                onOpenChange={setIsQuestionDialogOpen}
                initialQuestion={editingQuestion}
                onSave={handleSaveQuestion}
            />

            <GenerateQuestionsDialog
                open={isGenerateDialogOpen}
                onOpenChange={setIsGenerateDialogOpen}
                onAddQuestions={handleAddGeneratedQuestions}
            />
        </div>
    )
}
