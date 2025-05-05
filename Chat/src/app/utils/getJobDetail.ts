interface JobDetail {
  id: string;
  channelReference: string;
  status: string;
  enqueuedAt: string;
  channelId: string;
  queueId: string;
  priority: number;
  requestedWorkerSelectors: any[];
  attachedWorkerSelectors: any[];
  labels: Record<string, any>;
  assignments: Record<string, any>;
  tags: Record<string, any>;
  notes: any[];
  matchingMode: {
    kind: string;
  };
  etag: string;
}

export async function getJobDetail(jobId: string): Promise<JobDetail> {
  const response = await fetch(`/getJobDetail/${jobId}`);
  if (!response.ok) {
    throw new Error(`Failed to get job detail: ${response.statusText}`);
  }
  return await response.json();
}