// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatClient } from '@azure/communication-chat';
import JobRouterClient from '@azure-rest/communication-job-router';
import * as express from 'express';
import { getEndpoint, getResourceConnectionString } from '../lib/envHelper';

const router = express.Router();
interface AcceptJobOfferParam {
  workerId: string;
  offerId: string;
}

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
 * route: /acceptJobOffer
 *
 * purpose: Accept a job offer for the specified workerId and offerId.
 *
 * @param workerId: ID of the worker accepting the job offer.
 * @param offerId: ID of the job offer to be accepted.
 *
 */
router.post('/', async function (req, res, next) {
  const acceptJobOfferParam: AcceptJobOfferParam = req.body;
  const {workerId, offerId} = acceptJobOfferParam;

  const jobRouterClient = getJobRouterClient();
  try {
    let acceptedJobAssignment = await jobRouterClient.path("/routing/workers/{workerId}/offers/{offerId}:accept",
      workerId, offerId).post();

    res.send(acceptedJobAssignment.body);
  } catch (err) {
    // we will return a 404 if there is an error , which mean no job assignment for the workerId.
    // So we are returning back that we can't find the thread to add the client user to.
    res.sendStatus(404);
  }
});

export default router;
