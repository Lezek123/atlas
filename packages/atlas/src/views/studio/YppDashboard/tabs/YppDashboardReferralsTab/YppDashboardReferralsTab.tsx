import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { axiosInstance } from '@/api/axios'
import { SvgActionLinkUrl } from '@/assets/icons'
import { EmptyFallback } from '@/components/EmptyFallback'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { YppReferral, YppReferralTable } from '@/components/YppReferralTable/YppReferralTable'
import { ReferralLinkButton } from '@/components/_ypp/ReferralLinkButton'
import { YppSuspendedBanner } from '@/components/_ypp/YppSuspendedBanner'
import { atlasConfig } from '@/config'
import { useUser } from '@/providers/user/user.hooks'
import { YppSyncedChannel } from '@/views/global/YppLandingView/YppLandingView.types'

import { FallbackContainer } from '../YppDashboardTabs.styles'

const YPP_SYNC_URL = atlasConfig.features.ypp.youtubeSyncApiUrl

export const YppDashboardReferralsTab = () => {
  const yppSuspended = atlasConfig.features.ypp.suspended
  const { channelId } = useUser()
  const { isLoading, data } = useQuery(
    ['referralsTable', channelId],
    () => axiosInstance.get<YppSyncedChannel[]>(`${YPP_SYNC_URL}/channels/${channelId}/referrals`),
    { enabled: !!channelId }
  )

  const mappedData: YppReferral[] = useMemo(
    () =>
      data?.data.map((channelData) => {
        return {
          date: new Date(channelData.createdAt),
          channelId: String(channelData.joystreamChannelId),
          status: channelData.yppStatus,
        }
      }) ?? [],
    [data?.data]
  )

  return (
    <LayoutGrid>
      {yppSuspended && (
        <GridItem colSpan={{ base: 12 }}>
          <YppSuspendedBanner />
        </GridItem>
      )}
      <GridItem colSpan={{ base: 12 }}>
        {!isLoading && !mappedData?.length ? (
          <FallbackContainer>
            <EmptyFallback
              title="No referred users yet"
              variant="large"
              subtitle="You will see all referred users here once someone uses your link to sign up to the program."
              button={!yppSuspended ? <ReferralLinkButton variant="secondary" icon={<SvgActionLinkUrl />} /> : null}
            />
          </FallbackContainer>
        ) : (
          <YppReferralTable data={mappedData} isLoading={isLoading} />
        )}
      </GridItem>
    </LayoutGrid>
  )
}
