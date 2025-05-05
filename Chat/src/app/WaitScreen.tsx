// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  IImageStyles,
  Icon,
  Image,
  Link,
  List,
  PrimaryButton,
  Spinner,
  Stack,
  Text,
  mergeStyles
} from '@fluentui/react';
import React, { useCallback, useState, useEffect } from 'react';
import {
  configContainerStackTokens,
  configContainerStyle,
  containerTokens,
  containerStyle,
  headerStyle,
  listIconStyle,
  listItemStackTokens,
  listItemStyle,
  imgStyle,
  listStyle,
  nestedStackTokens,
  infoContainerStyle,
  infoContainerStackTokens,
} from './styles/HomeScreen.styles';
import { useTheme } from '@azure/communication-react';

import heroSVG from '../assets/hero.svg';
import heroDarkModeSVG from '../assets/hero_dark.svg';
import { getExistingThreadIdFromURL } from './utils/getParametersFromURL';
import { createThread } from './utils/createThread';
import { useSwitchableFluentTheme } from './theming/SwitchableFluentThemeProvider';
import { getJobAssignment } from './utils/getJobAssignment';
import { acceptJobOffer } from './utils/acceptJobOffer.';
import { getJobDetail } from './utils/getJobDetail';

// These props are set by the caller of ConfigurationScreen in the JSX and not found in context
export interface WaitScreenProps {
  workerId: string;
  displayName: string;
  setThreadId(threadId: string): void;
  acceptJobHandler(): void;
}

const imageStyleProps: IImageStyles = {
  image: {
    height: '100%'
  },
  root: {}
};

const HOMESCREEN_SHOWING_START_CHAT_BUTTON = 1;
const HOMESCREEN_SHOWING_LOADING_SPINNER_CREATE_THREAD = 2;
/**
 * HomeScreen has two states:
 * 1. Showing start chat button
 * 2. Showing spinner after clicking start chat
 *
 * @param props
 */
export default (props: WaitScreenProps): JSX.Element => {
  const spinnerLabel = 'Creating a new chat thread...';
  const iconName = 'SkypeCircleCheck';
  const listItems = [
  ];
  const { workerId, displayName, setThreadId, acceptJobHandler } = props;
  const [homeScreenState, setHomeScreenState] = useState<number>(HOMESCREEN_SHOWING_START_CHAT_BUTTON);
  const { currentTheme } = useSwitchableFluentTheme();
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);


  // Add an interface for the offer type
  interface JobOffer {
    offerId: string;
    jobId: string;
    capacityCost: number;
    offeredAt: string;
    expiresAt: string;
  }

  // Polling for job assignment
  // This logic can be change to websocket or Server-Sent-Events approach
  // but for now we are using polling to keep it simple
  useEffect(() => {
    const pollJobAssignment = async () => {
      try {
        const response = await getJobAssignment(workerId);
        console.log('Job assignment response:', response);
        if (response && response.offers && response.offers.length > 0) {
          setJobOffers(response.offers);
          return true; // Return true if we got offers
        }
        return false; // Return false if no offers
      } catch (error) {
        console.error('Failed to fetch job assignment:', error);
        return false;
      }
    };

    let intervalId: NodeJS.Timeout;
    const startPolling = () => {
      intervalId = setInterval(async () => {
        const gotOffers = await pollJobAssignment();
        if (gotOffers) {
          clearInterval(intervalId); // Stop polling when we get offers
        }
      }, 3000);
    };

    startPolling();

    // Cleanup function to clear the interval when component unmounts
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [workerId]);

  const imageProps = { src: currentTheme.name === 'Light' ? heroSVG.toString() : heroDarkModeSVG.toString() };

  const displayLoadingSpinner = (spinnerLabel: string): JSX.Element => {
    return <Spinner label={spinnerLabel} ariaLive="assertive" labelPosition="top" />;
  };

  const themePrimary = useTheme().palette.themePrimary;

  const onRenderListItem = useCallback(
    (item?: string, index?: number): JSX.Element => {
      const listText =
        index !== 3 ? (
          <Text>{item}</Text>
        ) : (
          <Text>
            {item}{' '}
            <Link href="https://docs.microsoft.com/azure/communication-services/overview" aria-label={`${item} sample`}>
              {'sample'}
            </Link>
          </Text>
        );

      return (
        <Stack horizontal tokens={listItemStackTokens} className={listItemStyle}>
          <Icon className={mergeStyles(listIconStyle, { color: themePrimary })} iconName={iconName} />
          {listText}
        </Stack>
      );
    },
    [themePrimary]
  );

  const displayHomeScreen = (): JSX.Element => {
    return (
      <Stack
        horizontal
        wrap
        horizontalAlign="center"
        verticalAlign="center"
        tokens={containerTokens}
        className={containerStyle}
      >
        <Stack className={infoContainerStyle} tokens={infoContainerStackTokens}>
          <Text role={'heading'} aria-level={1} className={headerStyle}>
            {"CRM Agent [" + displayName + "] - Waiting for Job Assignment"}
          </Text>
          <Stack className={configContainerStyle} tokens={configContainerStackTokens}>
            <Stack tokens={nestedStackTokens}>
              {jobOffers.length > 0 ? (
                <Stack tokens={{ childrenGap: 10 }}>
                  <Text variant="large">We have some client to talk to...</Text>
                  {jobOffers.map((offer) => (
                    <Stack
                      key={offer.offerId}
                      tokens={{ childrenGap: 8 }}
                      styles={{
                        root: {
                          padding: 16,
                          backgroundColor: '#f3f2f1',
                          borderRadius: 4,
                          marginBottom: 12
                        }
                      }}
                    >
                      <Text variant="mediumPlus">Job ID: {offer.jobId}</Text>
                      <Text variant="mediumPlus">Offer ID: {offer.offerId}</Text>
                      <Text>Capacity Cost: {offer.capacityCost}</Text>
                      <Text>Offered At: {new Date(offer.offeredAt).toLocaleString()}</Text>
                      <Text>Expires At: {new Date(offer.expiresAt).toLocaleString()}</Text>
                      <PrimaryButton
                        text="Accept Job"
                        onClick={async () => {
                          try {
                            // Get job details first
                            const jobDetail = await getJobDetail(offer.jobId);

                            // Use channelReference as threadId
                            if (jobDetail.channelReference) {
                              setThreadId(jobDetail.channelReference);
                            } else {
                              console.error('No channel reference found in job details');
                            }

                            // Call acceptJobOffer with the workerId and offerId
                            const accepted = await acceptJobOffer(workerId, offer.offerId);
                            if (accepted) {
                              console.log('Job accepted successfully!');
                            } else {
                              console.error('Failed to accept job offer');
                            }

                            const exisitedThreadId = getExistingThreadIdFromURL();
                            let threadId = exisitedThreadId || jobDetail.channelReference;

                            if (threadId) {
                              // Update the URL parameter without redirecting
                              const url = new URL(window.location.href);
                              url.searchParams.set('threadId', threadId);
                              window.history.replaceState({}, '', url.toString());
                            }
                            // Delay for 2 second to allow job assignment to be processed
                            await new Promise((resolve) => setTimeout(resolve, 2000));
                            // Call the handler to proceed to chat
                            acceptJobHandler();
                          } catch (error) {
                            console.error('Failed to accept job:', error);
                          }
                        }}
                        styles={{ root: { marginTop: 10 } }}
                      />
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <List className={listStyle} items={listItems} onRenderCell={onRenderListItem} />
              )}
            </Stack>
          </Stack>
        </Stack>
        <Image styles={imageStyleProps} alt="Welcome to the ACS Chat sample app" className={imgStyle} {...imageProps} />
      </Stack>
    );
  };

  if (homeScreenState === HOMESCREEN_SHOWING_START_CHAT_BUTTON) {
    return displayHomeScreen();
  } else if (homeScreenState === HOMESCREEN_SHOWING_LOADING_SPINNER_CREATE_THREAD) {
    return displayLoadingSpinner(spinnerLabel);
  } else {
    throw new Error('home screen state ' + homeScreenState.toString() + ' is invalid');
  }
};
