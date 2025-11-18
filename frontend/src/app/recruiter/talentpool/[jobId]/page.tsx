export default async function JobView({ params }: { params: Promise<{ jobId: string }> }) {
    return <div><p>JOB ID {(await params).jobId}</p></div>
};