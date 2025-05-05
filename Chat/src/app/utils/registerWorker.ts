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
export const registerWorker = async (workerId: string, displayName: string): Promise<boolean> => {
  try {
    const response = await fetch(`registerWorker/${workerId}?displayName=${displayName}`);
    if (response.status === StatusCode.OK) {
      return true;
    }
    // if we are attempting to add a user to a thread that is not a thread our admin user is already a part of to add in this user
    // we would be unable to add the user
    // so we are returning a 404 if the thread we want to add them to cannot be accessed by our server user
    else if (response.status === StatusCode.NOTFOUND) {
      return false;
    }
  } catch (error) {
    console.error('Failed at registerWorker, Error: ', error);
  }
  return false;
};
