---
page_type: sample
languages:
- javascript
- nodejs
products:
- azure
- azure-communication-services
---


# Chat sample for CRM Agent

> **⚠️ Warning:** This repository is currently in the Proof of Concept (POC) stage. The code may not be production-ready.

## Overview

This is a modified version of [Azure Communication Services WebChat Hero](hhttps://github.com/Azure-Samples/communication-services-web-chat-hero). Which add Azure Commnunication Service Job Router to select which Human Agent to assist with customer question.

### Related Microservices

1. **Customer Support Chat Channel**: Deploy the [Azure Communication Services Web Chat Hero](https://github.com/Azure-Samples/communication-services-web-chat-hero) for customer to chat with chatbot and human agent. You can use this official sample code without modification.
2. **Webhook Chatbot**: Deploy the [ACS Chatbot Webhook with Job Router](https://github.com/isaru66/acs-chatbot-webhook-with-jobrouter) for chatbot interactions and seamless handoff to human agents.
3. **CRM Login Channel for Human Agents**: This repository provides a modified version of the ACS Web Chat Hero, tailored for human agents to accept handoffs job from the "Webhook Chatbot."

## Prerequisites

- [Visual Studio Code (Stable Build)](https://code.visualstudio.com/download)
- [Node.js (LTS version)](https://nodejs.org/)
- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource). You'll need to record your resource **connection string** for this quickstart.

## Before running the sample for the first time

1. Open an instance of PowerShell, Windows Terminal, Command Prompt or equivalent and navigate to the directory that you'd like to clone the sample to.
2. clone the repository
3. Get the `Connection String` from the Azure portal. For more information on connection strings, see [Create an Azure Communication Resources](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/create-communication-resource)
4. Once you get the `Connection String`, Add the connection string to the **Server/appsettings.json** file found under the Chat folder. Input your connection string in the variable: `ResourceConnectionString`.
5. Once you get the `Endpoint`, add the endpoint string to the **Server/appsetting.json** file. Input your endpoint in the variable: `EndpointUrl`.
6. Get the `identity` from the Azure portal. Click on `Identities & User Access Tokens` in Azure portal. Generate a user with `Chat` scope.
7. Once you get the `identity` string, add the identity string to the **Server/appsetting.json** file. Input your identity string in the variable: `AdminUserId`. This is the server user to add new users to the chat thread.
8. Please use the same `AdminUserId` if you run both CRM version and Chatbot Version together.

## Local run

1. Set your connection string in `Server/appsettings.json`
1. Set your endpoint URL string in `Server/appsettings.json`
1. Set your adminUserId string in `Server/appsettings.json`
1. `npm run setup` from the root directory
1. `npm run start` from the root directory

## Additional Reading
- [Azure Communication Service - Hero Chat example](https://github.com/Azure-Samples/communication-services-web-chat-hero) - To learn about the original version of chat example
- [Azure Communication Service - Job Router](https://learn.microsoft.com/en-us/azure/communication-services/concepts/router/concepts) - To learn more about ACS Job Router Overview
- [Azure Communication Services - UI Library](https://azure.github.io/communication-ui-library/) - To learn more about what the `@azure/communication-react` package offers.
- [FluentUI](https://developer.microsoft.com/en-us/fluentui#/) - Microsoft powered UI library
- [React](https://reactjs.org/) - Library for building user interfaces
