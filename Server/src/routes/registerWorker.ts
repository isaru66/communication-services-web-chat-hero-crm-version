// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatClient } from '@azure/communication-chat';
import JobRouterClient from '@azure-rest/communication-job-router';
import * as express from 'express';
import { getEndpoint, getResourceConnectionString } from '../lib/envHelper';

const router = express.Router();

let jobRouterClient: any = undefined;

// lazy init job router client
const getJobRouterClient = () => {
  if (jobRouterClient) {
    return jobRouterClient;
  } else {
    jobRouterClient = JobRouterClient(getResourceConnectionString());
    return jobRouterClient;
  }
};

/**
 * route: /registerWorker/[workerId]
 *
 * purpose: register a worker with specific attributes.
 *
 * @param workerId: id of the worker to register
 *
 */
router.get('/:workerId', async function (req, res, next) {
  const workerId = req.params['workerId'];
  const displayName = req.query.displayName as string || "Agent";

  const jobRouterClient = getJobRouterClient();

  try {
    let worker = await jobRouterClient.path("/routing/workers/{workerId}", workerId).patch({
      body:  {
          capacity: 1,
          queues: ["queue-chat-human-agent"],
          labels: { "investment": 2, "territory-bkk": 1, "acsDisplayName": displayName},
          channels: [{ channelId: "chat", capacityCostPerJob: 1 }],
          availableForOffers: true
      },
      contentType: "application/merge-patch+json"
    });

    res.send(worker.body);
  } catch (err) {
    // we will return a 404 if there is an error , which mean no job assignment for the workerId.
    // So we are returning back that we can't find the thread to add the client user to.
    res.sendStatus(404);
  }
});

export default router;
