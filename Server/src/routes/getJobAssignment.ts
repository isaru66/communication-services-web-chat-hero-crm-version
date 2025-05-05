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
 * route: /router/getJobAssignment/[workerId]
 *
 * purpose: get the job assignment for the workerId.
 *
 * @param workerId: id of the worker to get the job assignment
 *
 */
router.get('/:workerId', async function (req, res, next) {
  const workerId = req.params['workerId'];

  const jobRouterClient = getJobRouterClient();
  try {
    let workerAssignment = await jobRouterClient.path("/routing/workers/{workerId}", workerId).get();

    res.send(workerAssignment.body);
  } catch (err) {
    // we will return a 404 if there is an error , which mean no job assignment for the workerId.
    // So we are returning back that we can't find the thread to add the client user to.
    res.sendStatus(404);
  }
});

export default router;
