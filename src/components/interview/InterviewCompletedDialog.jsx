"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check, X, Clock, FileText, Camera, BarChart2, RefreshCw } from "lucide-react"

export function InterviewCompletedDialog({
                                             open,
                                             onOpenChange,
                                             onClose,
                                             interviewDuration,
                                             questionsAsked,
                                             totalQuestions,
                                             screenshots = [],
                                             messages = [],
                                             onSubmitData,
                                             analysisResults = [],
                                             combinedFeedback = null,
                                         }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState(null)
    const [activeTab, setActiveTab] = useState("summary")

    // Format duration from seconds to mm:ss
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
    }

    // Handle data submission
    const handleSubmit = async () => {
        setIsSubmitting(true)
        setSubmitStatus("submitting")

        try {
            const result = await onSubmitData()
            setSubmitStatus(result ? "success" : "error")
        } catch (error) {
            console.error("Error submitting data:", error)
            setSubmitStatus("error")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Interview Completed</DialogTitle>
                    <DialogDescription>
                        The interview has been completed successfully. Review the summary below.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
                    <TabsList className="grid grid-cols-3">
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="transcript">Transcript</TabsTrigger>
                        <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary" className="space-y-4 pt-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <Clock className="h-5 w-5 text-gray-500 mb-1" />
                                <div className="text-sm font-medium">{formatDuration(interviewDuration)}</div>
                                <div className="text-xs text-gray-500">Duration</div>
                            </div>

                            <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <FileText className="h-5 w-5 text-gray-500 mb-1" />
                                <div className="text-sm font-medium">
                                    {questionsAsked}/{totalQuestions}
                                </div>
                                <div className="text-xs text-gray-500">Questions</div>
                            </div>

                            <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <Camera className="h-5 w-5 text-gray-500 mb-1" />
                                <div className="text-sm font-medium">{screenshots.length}</div>
                                <div className="text-xs text-gray-500">Screenshots</div>
                            </div>
                        </div>

                        {combinedFeedback && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex items-center mb-2">
                                    <BarChart2 className="h-4 w-4 mr-2 text-indigo-500" />
                                    <h3 className="text-sm font-medium">AI Analysis Summary</h3>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{combinedFeedback.summary}</p>

                                {combinedFeedback.details && (
                                    <div className="mt-3 grid grid-cols-3 gap-2">
                                        {combinedFeedback.details.voice && (
                                            <div className="flex flex-col p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                                                <span className="text-xs font-medium">Voice Tone</span>
                                                <span className="text-sm">{combinedFeedback.details.voice.tone}</span>
                                            </div>
                                        )}

                                        {combinedFeedback.details.facial && (
                                            <div className="flex flex-col p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                                                <span className="text-xs font-medium">Expression</span>
                                                <span className="text-sm">{combinedFeedback.details.facial.expression}</span>
                                            </div>
                                        )}

                                        {combinedFeedback.details.bodyLanguage && (
                                            <div className="flex flex-col p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                                                <span className="text-xs font-medium">Body Language</span>
                                                <span className="text-sm">{combinedFeedback.details.bodyLanguage.posture}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {screenshots.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium mb-2">Screenshots</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {screenshots.map((screenshot, index) => (
                                        <div
                                            key={index}
                                            className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded overflow-hidden"
                                        >
                                            <img
                                                src={screenshot || "/placeholder.svg"}
                                                alt={`Screenshot ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="transcript" className="space-y-4 pt-4">
                        <div className="max-h-[300px] overflow-y-auto p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            {messages.length > 0 ? (
                                messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`mb-3 ${message.role === "assistant" ? "pl-2 border-l-2 border-indigo-300" : ""}`}
                                    >
                                        <div className="flex items-center mb-1">
                      <span
                          className={`text-xs font-medium ${
                              message.role === "assistant" ? "text-indigo-500" : "text-emerald-500"
                          }`}
                      >
                        {message.role === "assistant" ? "AI Interviewer" : "Candidate"}
                      </span>
                                            {message.timestamp && (
                                                <span className="text-xs text-gray-400 ml-2">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                                            )}
                                        </div>
                                        <p className="text-sm">{message.content}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No transcript available.</p>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="analysis" className="space-y-4 pt-4">
                        {analysisResults && analysisResults.length > 0 ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-sm font-medium">Analysis Results</h3>
                                        <Badge variant="outline" className="text-xs">
                                            {analysisResults.length} data points
                                        </Badge>
                                    </div>

                                    {combinedFeedback && (
                                        <div className="mb-3">
                                            <h4 className="text-xs font-medium mb-1">Overall Assessment</h4>
                                            <p className="text-sm">{combinedFeedback.summary}</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-3 gap-3 mt-3">
                                        <div className="p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                                            <h4 className="text-xs font-medium mb-1">Voice Analysis</h4>
                                            <ul className="text-xs space-y-1">
                                                <li>Tone: {combinedFeedback?.details?.voice?.tone || "N/A"}</li>
                                                <li>Energy: {combinedFeedback?.details?.voice?.energy || "N/A"}</li>
                                                <li>Variability: {combinedFeedback?.details?.voice?.variability || "N/A"}</li>
                                            </ul>
                                        </div>

                                        <div className="p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                                            <h4 className="text-xs font-medium mb-1">Facial Analysis</h4>
                                            <ul className="text-xs space-y-1">
                                                <li>Expression: {combinedFeedback?.details?.facial?.expression || "N/A"}</li>
                                                <li>Eye Contact: {combinedFeedback?.details?.facial?.eyeContact || "N/A"}</li>
                                                <li>Attentiveness: {combinedFeedback?.details?.facial?.attentiveness || "N/A"}</li>
                                            </ul>
                                        </div>

                                        <div className="p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                                            <h4 className="text-xs font-medium mb-1">Body Language</h4>
                                            <ul className="text-xs space-y-1">
                                                <li>Posture: {combinedFeedback?.details?.bodyLanguage?.posture || "N/A"}</li>
                                                <li>Movement: {combinedFeedback?.details?.bodyLanguage?.movement || "N/A"}</li>
                                                <li>Openness: {combinedFeedback?.details?.bodyLanguage?.openness || "N/A"}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-xs text-gray-500">
                                    Note: Analysis is based on AI models that evaluate voice tone, facial expressions, and body language
                                    during the interview.
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                                <BarChart2 className="h-5 w-5 mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">No analysis data available for this interview.</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                    {submitStatus === "success" ? (
                        <div className="flex items-center text-sm text-green-600 dark:text-green-400 mr-auto">
                            <Check className="h-4 w-4 mr-1" />
                            Data submitted successfully
                        </div>
                    ) : submitStatus === "error" ? (
                        <div className="flex items-center text-sm text-red-600 dark:text-red-400 mr-auto">
                            <X className="h-4 w-4 mr-1" />
                            Failed to submit data
                        </div>
                    ) : null}

                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Close
                    </Button>

                    <Button onClick={handleSubmit} disabled={isSubmitting || submitStatus === "success"} className="ml-2">
                        {isSubmitting ? (
                            <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Data"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
