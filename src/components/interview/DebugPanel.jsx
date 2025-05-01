"use client"

import { useState } from "react"
import { X, Camera, FileText, Maximize2, Minimize2, BarChart, Mic, Smile, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export function DebugPanel({
                               debugMode,
                               setDebugMode,
                               screenshots,
                               screenshotTimes,
                               messages,
                               takeManualScreenshot,
                               logTranscriptData,
                               isInterviewStarted,
                               callStatus,
                               interviewDuration,
                               totalQuestionsAsked,
                               totalQuestions,
                               isAITalking,
                               // AI Analysis props
                               analysisEnabled,
                               analysisResults,
                               voiceAnalysis,
                               facialAnalysis,
                               bodyLanguageAnalysis,
                               currentAnalysisStatus,
                               analysisModelsLoaded,
                               combinedFeedback,
                               // AI Analysis actions
                               toggleAnalysis,
                               triggerManualAnalysis,
                           }) {
    const [expanded, setExpanded] = useState(false)
    const [activeTab, setActiveTab] = useState("overview")

    if (!debugMode) return null

    // Get the most recent analysis result
    const latestAnalysis = analysisResults.length > 0 ? analysisResults[analysisResults.length - 1] : null

    // Format timestamp
    const formatTime = (date) => {
        if (!date) return "N/A"
        return typeof date === "string" ? new Date(date).toLocaleTimeString() : date.toLocaleTimeString()
    }

    return (
        <div
            className={`fixed ${expanded ? "inset-4" : "bottom-4 right-4 max-w-md max-h-[70vh]"} 
        z-50 bg-black/90 text-white rounded-lg shadow-lg overflow-hidden flex flex-col`}
        >
            <div className="flex justify-between items-center p-3 bg-gray-800">
                <h3 className="font-bold flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    Interview Debug Panel
                </h3>
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-white hover:bg-gray-700"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-white hover:bg-gray-700"
                        onClick={() => setDebugMode(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="bg-gray-800 p-1 justify-start">
                    <TabsTrigger value="overview" className="text-xs">
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="analysis" className="text-xs">
                        AI Analysis
                    </TabsTrigger>
                    <TabsTrigger value="transcript" className="text-xs">
                        Transcript
                    </TabsTrigger>
                    <TabsTrigger value="screenshots" className="text-xs">
                        Screenshots
                    </TabsTrigger>
                    <TabsTrigger value="raw" className="text-xs">
                        Raw Data
                    </TabsTrigger>
                </TabsList>

                <ScrollArea className="flex-1 p-3">
                    <TabsContent value="overview" className="mt-0">
                        <div className="space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gray-800/50 p-2 rounded">
                                    <div className="text-gray-400 mb-1">Interview Status</div>
                                    <div className="flex justify-between">
                                        <span>Duration:</span>
                                        <span>{interviewDuration}s</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Call Status:</span>
                                        <Badge variant={callStatus === "ACTIVE" ? "success" : "secondary"} className="text-[10px]">
                                            {callStatus}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Questions:</span>
                                        <span>
                      {totalQuestionsAsked}/{totalQuestions}
                    </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>AI Speaking:</span>
                                        <span>{isAITalking ? "Yes" : "No"}</span>
                                    </div>
                                </div>

                                <div className="bg-gray-800/50 p-2 rounded">
                                    <div className="text-gray-400 mb-1">Data Collection</div>
                                    <div className="flex justify-between">
                                        <span>Screenshots:</span>
                                        <span>{screenshots.length}/3</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Messages:</span>
                                        <span>{messages.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Analysis:</span>
                                        <span>{analysisResults.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Analysis Status:</span>
                                        <Badge
                                            variant={
                                                currentAnalysisStatus === "ready"
                                                    ? "success"
                                                    : currentAnalysisStatus === "analyzing"
                                                        ? "warning"
                                                        : currentAnalysisStatus === "loading"
                                                            ? "default"
                                                            : "destructive"
                                            }
                                            className="text-[10px]"
                                        >
                                            {currentAnalysisStatus}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs flex-1"
                                    onClick={takeManualScreenshot}
                                    disabled={screenshots.length >= 3 || !isInterviewStarted || callStatus !== "ACTIVE"}
                                >
                                    <Camera className="h-3 w-3 mr-1" />
                                    Take Screenshot
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs flex-1"
                                    onClick={triggerManualAnalysis}
                                    disabled={!analysisModelsLoaded || isAITalking || !analysisEnabled}
                                >
                                    <BarChart className="h-3 w-3 mr-1" />
                                    Run Analysis
                                </Button>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="h-7 text-xs flex-1" onClick={logTranscriptData}>
                                    <FileText className="h-3 w-3 mr-1" />
                                    Log Data
                                </Button>
                                <Button variant="outline" size="sm" className="h-7 text-xs flex-1" onClick={toggleAnalysis}>
                                    {analysisEnabled ? "Disable Analysis" : "Enable Analysis"}
                                </Button>
                            </div>

                            {combinedFeedback && (
                                <div className="mt-2 bg-gray-800/50 p-2 rounded">
                                    <div className="text-gray-400 mb-1">Latest Feedback</div>
                                    <div className="text-[10px] whitespace-pre-wrap">{combinedFeedback.summary}</div>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="analysis" className="mt-0">
                        <div className="space-y-4 text-xs">
                            <div className="flex justify-between items-center">
                                <h4 className="font-medium">AI Analysis Results</h4>
                                <Badge variant={analysisEnabled ? "success" : "destructive"} className="text-[10px]">
                                    {analysisEnabled ? "Enabled" : "Disabled"}
                                </Badge>
                            </div>

                            {/* Voice Analysis */}
                            <div className="bg-gray-800/50 p-2 rounded">
                                <div className="flex items-center text-gray-300 mb-2">
                                    <Mic className="h-3 w-3 mr-1" />
                                    <span className="font-medium">Voice Analysis</span>
                                </div>

                                {voiceAnalysis ? (
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span>Tone:</span>
                                            <span className="font-medium">{voiceAnalysis.tone}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Energy:</span>
                                            <span>{voiceAnalysis.energy}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Pitch:</span>
                                            <span>{voiceAnalysis.pitch}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Volume:</span>
                                            <span>{voiceAnalysis.volume}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Confidence:</span>
                                            <span>{Math.round(voiceAnalysis.confidence * 100)}%</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-gray-500 italic">No voice analysis data available</div>
                                )}
                            </div>

                            {/* Facial Analysis */}
                            <div className="bg-gray-800/50 p-2 rounded">
                                <div className="flex items-center text-gray-300 mb-2">
                                    <Smile className="h-3 w-3 mr-1" />
                                    <span className="font-medium">Facial Analysis</span>
                                </div>

                                {facialAnalysis ? (
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span>Expression:</span>
                                            <span className="font-medium">{facialAnalysis.dominantExpression}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Eye Contact:</span>
                                            <span>{facialAnalysis.eyeContact}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Attentiveness:</span>
                                            <span>{facialAnalysis.attentiveness}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Confidence:</span>
                                            <span>{Math.round(facialAnalysis.confidence * 100)}%</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-gray-500 italic">No facial analysis data available</div>
                                )}
                            </div>

                            {/* Body Language Analysis */}
                            <div className="bg-gray-800/50 p-2 rounded">
                                <div className="flex items-center text-gray-300 mb-2">
                                    <Activity className="h-3 w-3 mr-1" />
                                    <span className="font-medium">Body Language Analysis</span>
                                </div>

                                {bodyLanguageAnalysis ? (
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span>Posture:</span>
                                            <span className="font-medium">{bodyLanguageAnalysis.posture}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Movement:</span>
                                            <span>{bodyLanguageAnalysis.movement}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Hand Gestures:</span>
                                            <span>{bodyLanguageAnalysis.handGestures}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Openness:</span>
                                            <span>{bodyLanguageAnalysis.openness}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Confidence:</span>
                                            <span>{Math.round(bodyLanguageAnalysis.confidence * 100)}%</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-gray-500 italic">No body language analysis data available</div>
                                )}
                            </div>

                            {/* Analysis History */}
                            <div>
                                <h4 className="font-medium mb-2">Analysis History</h4>
                                {analysisResults.length > 0 ? (
                                    <div className="space-y-2">
                                        {analysisResults
                                            .slice()
                                            .reverse()
                                            .map((result, index) => (
                                                <div key={index} className="bg-gray-800/30 p-2 rounded text-[10px]">
                                                    <div className="flex justify-between mb-1">
                                                        <span className="font-medium">Analysis #{analysisResults.length - index}</span>
                                                        <span className="text-gray-400">{formatTime(result.timestamp)}</span>
                                                    </div>
                                                    <div className="flex gap-1 mb-1">
                                                        {result.voice && (
                                                            <Badge variant="outline" className="text-[8px] h-4">
                                                                Voice: {result.voice.tone}
                                                            </Badge>
                                                        )}
                                                        {result.facial && (
                                                            <Badge variant="outline" className="text-[8px] h-4">
                                                                Face: {result.facial.dominantExpression}
                                                            </Badge>
                                                        )}
                                                        {result.bodyLanguage && (
                                                            <Badge variant="outline" className="text-[8px] h-4">
                                                                Body: {result.bodyLanguage.posture}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="line-clamp-2 text-gray-300">
                                                        Q{result.questionIndex + 1}: {result.voice?.tone || "N/A"} tone,
                                                        {result.facial?.eyeContact || "N/A"} eye contact,
                                                        {result.bodyLanguage?.openness || "N/A"} posture
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 italic">No analysis results yet</div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="transcript" className="mt-0">
                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between items-center">
                                <h4 className="font-medium">Interview Transcript</h4>
                                <span className="text-gray-400">{messages.length} messages</span>
                            </div>

                            <div className="space-y-2">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`p-2 rounded ${msg.role === "assistant" ? "bg-blue-900/30" : "bg-green-900/30"}`}
                                    >
                                        <div className="flex justify-between mb-1">
                      <span className={`font-bold ${msg.role === "assistant" ? "text-blue-400" : "text-green-400"}`}>
                        {msg.role === "assistant" ? "AI: " : "User: "}
                      </span>
                                            <span className="text-gray-400 text-[10px]">
                        {msg.timestamp ? formatTime(msg.timestamp) : "unknown time"}
                      </span>
                                        </div>
                                        <div className="whitespace-pre-wrap text-[10px]">{msg.content || "[No content]"}</div>
                                    </div>
                                ))}

                                {messages.length === 0 && <div className="text-gray-500 italic">No transcript data available</div>}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="screenshots" className="mt-0">
                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between items-center">
                                <h4 className="font-medium">Interview Screenshots</h4>
                                <span className="text-gray-400">{screenshots.length}/3 captured</span>
                            </div>

                            <div className="space-y-3">
                                {screenshots.map((screenshot, index) => (
                                    <div key={index} className="space-y-1">
                                        <div className="flex justify-between">
                                            <span className="font-medium">Screenshot #{index + 1}</span>
                                            <span className="text-gray-400">
                        {screenshotTimes[index] ? formatTime(screenshotTimes[index]) : "unknown time"}
                      </span>
                                        </div>
                                        <div className="bg-gray-800 rounded overflow-hidden">
                                            <img
                                                src={screenshot || "/placeholder.svg"}
                                                alt={`Screenshot ${index + 1}`}
                                                className="w-full object-contain max-h-40"
                                            />
                                        </div>
                                    </div>
                                ))}

                                {screenshots.length === 0 && <div className="text-gray-500 italic">No screenshots captured yet</div>}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs w-full"
                                    onClick={takeManualScreenshot}
                                    disabled={screenshots.length >= 3 || !isInterviewStarted || callStatus !== "ACTIVE"}
                                >
                                    <Camera className="h-3 w-3 mr-1" />
                                    Take Screenshot
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="raw" className="mt-0">
                        <div className="space-y-4 text-xs">
                            <div className="flex justify-between items-center">
                                <h4 className="font-medium">Raw Data Inspector</h4>
                                <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={logTranscriptData}>
                                    Log to Console
                                </Button>
                            </div>

                            {/* Latest Analysis Data */}
                            <div>
                                <h5 className="font-medium mb-1">Latest Analysis Data</h5>
                                <pre className="bg-gray-800/50 p-2 rounded text-[10px] overflow-auto max-h-40 whitespace-pre-wrap">
                  {latestAnalysis ? JSON.stringify(latestAnalysis, null, 2) : "No analysis data available"}
                </pre>
                            </div>

                            {/* Latest Voice Analysis */}
                            <div>
                                <h5 className="font-medium mb-1">Voice Analysis</h5>
                                <pre className="bg-gray-800/50 p-2 rounded text-[10px] overflow-auto max-h-40 whitespace-pre-wrap">
                  {voiceAnalysis ? JSON.stringify(voiceAnalysis, null, 2) : "No voice analysis data available"}
                </pre>
                            </div>

                            {/* Latest Facial Analysis */}
                            <div>
                                <h5 className="font-medium mb-1">Facial Analysis</h5>
                                <pre className="bg-gray-800/50 p-2 rounded text-[10px] overflow-auto max-h-40 whitespace-pre-wrap">
                  {facialAnalysis ? JSON.stringify(facialAnalysis, null, 2) : "No facial analysis data available"}
                </pre>
                            </div>

                            {/* Latest Body Language Analysis */}
                            <div>
                                <h5 className="font-medium mb-1">Body Language Analysis</h5>
                                <pre className="bg-gray-800/50 p-2 rounded text-[10px] overflow-auto max-h-40 whitespace-pre-wrap">
                  {bodyLanguageAnalysis
                      ? JSON.stringify(bodyLanguageAnalysis, null, 2)
                      : "No body language analysis data available"}
                </pre>
                            </div>

                            {/* Combined Feedback */}
                            <div>
                                <h5 className="font-medium mb-1">Combined Feedback</h5>
                                <pre className="bg-gray-800/50 p-2 rounded text-[10px] overflow-auto max-h-40 whitespace-pre-wrap">
                  {combinedFeedback ? JSON.stringify(combinedFeedback, null, 2) : "No combined feedback available"}
                </pre>
                            </div>
                        </div>
                    </TabsContent>
                </ScrollArea>
            </Tabs>
        </div>
    )
}
