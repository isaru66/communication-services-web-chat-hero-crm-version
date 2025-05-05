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
 * route: /getJobAssignment/[workerId]
 *
 * purpose: get the job assignment for the workerId.
 *
 * @param workerId: id of the worker to get the job assignment
 *
 */
router.get('/:jobId', async function (req, res, next) {
  const jobId = req.params['jobId'];

  const jobRouterClient = getJobRouterClient();
  try {
    let jobDetails = await jobRouterClient.path("/routing/jobs/{jobId}", jobId).get();

    res.send(jobDetails.body);
  } catch (err) {
    // we will return a 404 if there is an error , which mean no job assignment for the workerId.
    // So we are returning back that we can't find the thread to add the client user to.
    res.sendStatus(404);
  }
});

export default router;
