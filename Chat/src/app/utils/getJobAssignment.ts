// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { StatusCode } from './constants';

/**
 * This is a Contoso specific method. Specific to Sample App Heroes. Its meant to be called by Sample App Heroes
 * to add user to thread. Components will automatically know about the new participant when calling listParticipants.
 *
 * @param threadId the acs chat thread id
 * @param userId the acs communication user id
 * @param displayName the new participant's display name
 */
export const getJobAssignment = async (workerId: string): Promise<any> => {
  const response = await fetch(`getJobAssignment/${workerId}`);
  if (response.status === StatusCode.OK) {
    return await response.json();
  } else {
    throw new Error('cloud not get job assignment');
  }
};
