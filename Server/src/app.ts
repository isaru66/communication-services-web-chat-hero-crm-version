// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import express from 'express';
import cors from 'cors';
import createError from 'http-errors';
import logger from 'morgan';
import path from 'path';

import issueToken from './routes/issueToken';
import refreshToken from './routes/refreshToken';
import getEndpointUrl from './routes/getEndpointUrl';
import userConfig from './routes/userConfig';
import createThread from './routes/createThread';
import addUser from './routes/addUser';
import uploadToAzureBlobStorage from './routes/uploadToAzureBlobStorage';
import registerWorker from './routes/registerWorker';
import getJobAssignment from './routes/getJobAssignment';
import deregisterWorker from './routes/deregisterWorker';
import acceptJobOffer from './routes/acceptJobOffer';
import getJobDetail from './routes/getJobDetail';

const app = express();

app.use(logger('tiny'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'build')));

/**
 * route: /createThread
 * purpose: Chat: create a new chat thread
 */
app.use('/createThread', cors(), createThread);

/**
 * route: /addUser
 * purpose: Chat: add the user to the chat thread
 */
app.use('/addUser', cors(), addUser);

/**
 * route: /refreshToken
 * purpose: Chat,Calling: get a new token
 */
app.use('/refreshToken', cors(), refreshToken);

/**
 * route: /getEndpointUrl
 * purpose: Chat,Calling: get the endpoint url of ACS resource
 */
app.use('/getEndpointUrl', cors(), getEndpointUrl);

/**
 * route: /token
 * purpose: Chat,Calling: get ACS token with the given scope
 */
app.use('/token', cors(), issueToken);

/**
 * route: /userConfig
 * purpose: Chat: to add user details to userconfig for chat thread
 */
app.use('/userConfig', cors(), userConfig);

/**
 * route: /getLogUploadData
 * purpose: Get tokens and endpoints for uploading logs to Azure Blob Storage
 */
app.use('/uploadToAzureBlobStorage', cors(), uploadToAzureBlobStorage);

app.use('/registerWorker', cors(), registerWorker);
app.use('/deregisterWorker', cors(), deregisterWorker);
app.use('/getJobAssignment', cors(), getJobAssignment);
app.use('/getJobDetail', cors(), getJobDetail);
app.use('/acceptJobOffer', cors(), acceptJobOffer);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

export default app;
