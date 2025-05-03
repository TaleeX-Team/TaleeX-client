"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, Eye, Activity, BarChart2, ChevronDown, ChevronUp, RefreshCw } from "lucide-react"

export function AnalysisPanel({
                                  analysisEnabled,
                                  voiceAnalysis,
                                  facialAnalysis,
                                  bodyLanguageAnalysis,
                                  combinedFeedback,
                                  analysisStatus,
                                  analysisError,
                                  onToggleAnalysis,
                                  onTriggerAnalysis,
                                  className = "",
                              }) {
    const [expanded, setExpanded] = useState(false)

    // If analysis is disabled or there's no data, show minimal panel
    if (!analysisEnabled || (!voiceAnalysis && !facialAnalysis && !bodyLanguageAnalysis && !combinedFeedback)) {
        return (
            <Card className={`p-3 bg-gray-50 dark:bg-gray-900 ${className}`}>
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm font-medium">AI Analysis</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={onToggleAnalysis} className="h-7 text-xs">
                        {analysisEnabled ? "Disable" : "Enable"}
                    </Button>
                </div>
                {analysisEnabled && (
                    <div className="mt-2 text-xs text-gray-500">
                        {analysisStatus === "loading" ? (
                            <div className="flex items-center">
                                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                Loading analysis models...
                            </div>
                        ) : analysisStatus === "analyzing" ? (
                            <div className="flex items-center">
                                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                Analyzing candidate...
                            </div>
                        ) : analysisStatus === "error" ? (
                            <div className="text-red-500">{analysisError || "Analysis error"}</div>
                        ) : (
                            "Waiting for candidate response to analyze..."
                        )}
                    </div>
                )}
            </Card>
        )
    }

    return (
        <Card className={`p-3 bg-gray-50 dark:bg-gray-900 ${className}`}>
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <BarChart2 className="h-4 w-4 mr-2 text-indigo-500" />
                    <span className="text-sm font-medium">Candidate Analysis</span>
                    {analysisStatus === "analyzing" && <RefreshCw className="h-3 w-3 ml-2 text-gray-500 animate-spin" />}
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="h-7 w-7 p-0">
                        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onTriggerAnalysis}
                        className="h-7 text-xs"
                        disabled={analysisStatus === "analyzing" || analysisStatus === "loading"}
                    >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Update
                    </Button>
                </div>
            </div>

            {combinedFeedback && (
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">{combinedFeedback.summary}</div>
            )}

            {expanded && (
                <div className="mt-3">
                    <Tabs defaultValue="combined">
                        <TabsList className="grid grid-cols-4 h-8">
                            <TabsTrigger value="combined" className="text-xs">
                                Summary
                            </TabsTrigger>
                            <TabsTrigger value="voice" className="text-xs">
                                Voice
                            </TabsTrigger>
                            <TabsTrigger value="facial" className="text-xs">
                                Facial
                            </TabsTrigger>
                            <TabsTrigger value="body" className="text-xs">
                                Body
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="combined" className="pt-2">
                            {combinedFeedback ? (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-medium">Overall Confidence</span>
                                        <Badge
                                            variant={
                                                combinedFeedback.confidence > 0.7
                                                    ? "success"
                                                    : combinedFeedback.confidence > 0.5
                                                        ? "default"
                                                        : "outline"
                                            }
                                        >
                                            {Math.round(combinedFeedback.confidence * 100)}%
                                        </Badge>
                                    </div>

                                    <div className="text-xs space-y-1">
                                        <div className="font-medium">Key Observations:</div>
                                        <ul className="list-disc list-inside space-y-1 pl-1">
                                            {combinedFeedback.details.voice && <li>Voice: {combinedFeedback.details.voice.feedback}</li>}
                                            {combinedFeedback.details.facial && <li>Facial: {combinedFeedback.details.facial.feedback}</li>}
                                            {combinedFeedback.details.bodyLanguage && (
                                                <li>Body Language: {combinedFeedback.details.bodyLanguage.feedback}</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-500">No combined analysis available yet.</div>
                            )}
                        </TabsContent>

                        <TabsContent value="voice" className="pt-2">
                            {voiceAnalysis ? (
                                <div className="space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">Tone</span>
                                            <span className="text-sm font-medium">{voiceAnalysis.tone}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">Energy</span>
                                            <span className="text-sm font-medium">{voiceAnalysis.energy}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">Pitch</span>
                                            <span className="text-sm font-medium">{voiceAnalysis.pitch}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">Volume</span>
                                            <span className="text-sm font-medium">{voiceAnalysis.volume}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <Mic className="h-3 w-3 mr-1 text-indigo-500" />
                                        <span className="text-xs">Confidence: {Math.round(voiceAnalysis.confidence * 100)}%</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-500">No voice analysis available yet.</div>
                            )}
                        </TabsContent>

                        <TabsContent value="facial" className="pt-2">
                            {facialAnalysis ? (
                                <div className="space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">Expression</span>
                                            <span className="text-sm font-medium">{facialAnalysis.dominantExpression}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">Eye Contact</span>
                                            <span className="text-sm font-medium">{facialAnalysis.eyeContact}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">Attentiveness</span>
                                            <span className="text-sm font-medium">{facialAnalysis.attentiveness}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">Confidence</span>
                                            <span className="text-sm font-medium">{Math.round(facialAnalysis.confidence * 100)}%</span>
                                        </div>
                                    </div>

                                    {facialAnalysis.expressions && (
                                        <div className="mt-1">
                                            <div className="text-xs text-gray-500 mb-1">Expression Breakdown:</div>
                                            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                                {Object.entries(facialAnalysis.expressions).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between items-center">
                                                        <span className="text-xs capitalize">{key}</span>
                                                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-indigo-500 rounded-full"
                                                                style={{ width: `${Math.round(value * 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center">
                                        <Eye className="h-3 w-3 mr-1 text-indigo-500" />
                                        <span className="text-xs">Analysis based on facial expressions and eye movement</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-500">No facial analysis available yet.</div>
                            )}
                        </TabsContent>

                        <TabsContent value="body" className="pt-2">
                            {bodyLanguageAnalysis ? (
                                <div className="space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">Posture</span>
                                            <span className="text-sm font-medium">{bodyLanguageAnalysis.posture}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">Movement</span>
                                            <span className="text-sm font-medium">{bodyLanguageAnalysis.movement}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">Hand Gestures</span>
                                            <span className="text-sm font-medium">{bodyLanguageAnalysis.handGestures}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">Openness</span>
                                            <span className="text-sm font-medium">{bodyLanguageAnalysis.openness}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <Activity className="h-3 w-3 mr-1 text-indigo-500" />
                                        <span className="text-xs">Confidence: {Math.round(bodyLanguageAnalysis.confidence * 100)}%</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-500">No body language analysis available yet.</div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </Card>
    )
}
