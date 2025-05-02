// "use client"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { MapPin, Briefcase, Clock, DollarSign, Users, ExternalLink } from "lucide-react"
import { getJobById } from "@/services/apiJobs"

export default function JobDetailsPage() {
  const { id } = useParams()

  const {
    data: job,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: () => getJobById(id),
    enabled: !!id,
  })

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen bg-black/95">
        <p className="text-white">Loading job...</p>
      </div>
    )
  if (isError)
    return (
      <div className="flex items-center justify-center h-screen bg-black/95">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    )
  if (!job)
    return (
      <div className="flex items-center justify-center h-screen bg-black/95">
        <p className="text-white">Job not found.</p>
      </div>
    )

  const {
    title,
    description,
    requirements,
    company,
    workPlaceType,
    jobType,
    experienceLevel,
    Tags,
    salary,
    hiringTarget,
    hiringCount,
    applicationLink,
    status,
    location,
    department,
    applicants,
    postedDate,
  } = job

  return (
    <div className="min-h-screen bg-black/95 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => window.history.back()}
          className="flex items-center mb-6 text-gray-400 hover:text-white transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-gray-400 text-lg">{company?.name || company || "Unknown Company"}</p>
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-bold mb-6">Job Details</h2>

          <div className="space-y-4">
            {location && (
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
                <span>{location || "Remote"}</span>
              </div>
            )}

            <div className="flex items-start">
              <Briefcase className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
              <span>
                {company?.name || company || "Unknown"} {department ? `- ${department}` : ""}
              </span>
            </div>

            {applicants && (
              <div className="flex items-start">
                <Users className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
                <span>{applicants} applicants</span>
              </div>
            )}

            {postedDate && (
              <div className="flex items-start">
                <Clock className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
                <span>Posted {postedDate}</span>
              </div>
            )}

            {salary && (
              <div className="flex items-start">
                <DollarSign className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
                <span>
                  {salary.currency || "USD"}
                  {salary.min} - {salary.currency || "USD"}
                  {salary.max}
                </span>
              </div>
            )}
          </div>

          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              {workPlaceType && (
                <Badge variant="outline" className="bg-zinc-800 text-white border-zinc-700">
                  {workPlaceType}
                </Badge>
              )}
              {jobType && (
                <Badge variant="outline" className="bg-zinc-800 text-white border-zinc-700">
                  {jobType}
                </Badge>
              )}
              {experienceLevel && (
                <Badge variant="outline" className="bg-zinc-800 text-white border-zinc-700">
                  {experienceLevel}
                </Badge>
              )}
              {status && (
                <Badge variant="outline" className="bg-zinc-800 text-white border-zinc-700 capitalize">
                  {status}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {description && (
          <div className="bg-zinc-900 rounded-xl p-6 mb-8 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Job Description</h2>
            <p className="text-gray-300 whitespace-pre-line">{description}</p>
          </div>
        )}

        {requirements && (
          <div className="bg-zinc-900 rounded-xl p-6 mb-8 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Requirements</h2>
            <p className="text-gray-300 whitespace-pre-line">{requirements}</p>
          </div>
        )}

        {Tags && Tags.length > 0 && (
          <div className="bg-zinc-900 rounded-xl p-6 mb-8 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {Tags.map((tag, idx) => (
                <Badge key={idx} className="bg-zinc-800 text-white border-zinc-700 px-4 py-1 text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* {(hiringTarget || hiringCount) && (
          <div className="bg-zinc-900 rounded-xl p-6 mb-8 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Key Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Develop and train ML models</li>
              <li>Process and analyze large datasets</li>
              <li>Deploy models to production</li>
              {hiringTarget && <li>Meet hiring target: {hiringTarget}</li>}
              {hiringCount && <li>Current hiring count: {hiringCount}</li>}
            </ul>
          </div>
        )} */}

        {applicationLink && (
          <div className="mt-8 flex justify-center">
            <a
              href={applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-3 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Apply Now <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}