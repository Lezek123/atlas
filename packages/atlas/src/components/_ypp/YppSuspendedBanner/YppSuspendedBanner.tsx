import { FC } from 'react'

import { SvgActionNewTab, SvgAlertsWarning24 } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { cVar } from '@/styles'

import { List, ListItem, ListItemContent, ListItemMarker } from './YppSuspendedBannerStyles'

export const YppSuspendedBanner: FC = () => (
  <Banner
    title="YouTube Partner Program temporarily suspended"
    icon={<SvgAlertsWarning24 />}
    borderColor={cVar('colorTextCaution')}
    size="medium"
    description={
      <>
        <Text variant="t200" color="colorText" as="p" margin={{ bottom: 6 }}>
          Due to recent technical issues with the YouTube Sync service, the YouTube Partner Program (YPP) has been
          temporarily suspended until further notice (
          <TextButton
            openLinkInNewTab={true}
            to="https://pioneerapp.xyz/#/proposals/preview/1033"
            icon={<SvgActionNewTab />}
            iconPlacement="right"
          >
            Related proposal
          </TextButton>
          ).
        </Text>
        <Text variant="t200" color="colorText" as="p" margin={{ bottom: 2 }}>
          The issues we identified:
          <List>
            <ListItem>
              <ListItemMarker />
              <ListItemContent>
                Some creators were inadvertently removed from YPP due to a bug in the YouTube Sync service (
                <TextButton
                  openLinkInNewTab={true}
                  to="https://github.com/Joystream/youtube-synch/issues/337"
                  icon={<SvgActionNewTab />}
                  iconPlacement="right"
                >
                  GitHub issue
                </TextButton>
                ).
              </ListItemContent>
            </ListItem>
            <ListItem>
              <ListItemMarker />
              <ListItemContent>
                Recently imposed YouTube rate limits have caused synchronization delays, leaving over 100,000 videos
                stuck in the sync queue.
              </ListItemContent>
            </ListItem>
          </List>
        </Text>
        <Text variant="t200" color="colorText" as="p" margin={{ bottom: 6 }}>
          We're actively working to resolve these issues and will provide updates as soon as possible.
        </Text>
        <Text variant="t200" color="colorText" as="p" margin={{ bottom: 6 }}>
          To minimize disruption, we have implemented the following temporary measures:
          <List>
            <ListItem>
              <ListItemMarker />
              <ListItemContent>We disabled new YPP signups.</ListItemContent>
            </ListItem>
            <ListItem>
              <ListItemMarker />
              <ListItemContent>We paused all creator payouts and rewards.</ListItemContent>
            </ListItem>
            <ListItem>
              <ListItemMarker />
              <ListItemContent>We limited content synchronization to selected channels.</ListItemContent>
            </ListItem>
          </List>
        </Text>
        <Text variant="t200" color="colorText" as="p" margin={{ bottom: 2 }}>
          If you're currently enrolled in YPP, you can still disable YouTube sync or opt out of the program via the{' '}
          <Text variant="t200" as="span" color="colorTextStrong">
            Settings
          </Text>{' '}
          tab.
        </Text>
        <Text variant="t200" color="colorText" as="p" margin={{ bottom: 2 }}>
          Please note that these actions are currently irreversible.
        </Text>
        <Text variant="t200" color="colorText" as="p">
          We apologize for any inconvenience and appreciate your understanding.
        </Text>
      </>
    }
  />
)
