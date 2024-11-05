import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { YppSuspendedModal } from '@/components/_ypp/YppSuspendedModal'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { usePersonalDataStore } from '@/providers/personalData'
import { StyledLimitedWidthWrapper } from '@/views/global/ReferralsView/ReferralsView.styles'
import { ReferralSteps } from '@/views/global/ReferralsView/sections/ReferralSteps/ReferralSteps'
import { ReferralTiers } from '@/views/global/ReferralsView/sections/ReferralTiers/ReferralTiers'
import { ReferralsList } from '@/views/global/ReferralsView/sections/ReferralsList/ReferralsList'
import { ReferralsVideo } from '@/views/global/ReferralsView/sections/ReferralsVideo/ReferralsVideo'
import { TopReferrals } from '@/views/global/ReferralsView/sections/TopReferrals/TopReferrals'

export const ReferralsView = () => {
  const [showYppSuspendedModal, setShowYppSuspendedModal] = useState(true)
  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)
  useEffect(() => {
    updateDismissedMessages('referrals-banner')
  }, [updateDismissedMessages])

  const mdMatch = useMediaMatch('md')
  const xsMatch = useMediaMatch('xs')

  const navigate = useNavigate()

  return (
    <StyledLimitedWidthWrapper
      flow="column"
      justifyContent="center"
      alignItems="center"
      gap={mdMatch ? 24 : xsMatch ? 16 : 14}
    >
      {atlasConfig.features.ypp.suspended && (
        <YppSuspendedModal
          show={showYppSuspendedModal}
          onClose={() => {
            setShowYppSuspendedModal(false)
            navigate(absoluteRoutes.viewer.index())
          }}
        />
      )}
      <ReferralsVideo />
      <ReferralTiers />
      {/*<ReferralLayers />*/}
      <ReferralSteps />
      <TopReferrals />
      <ReferralsList />
    </StyledLimitedWidthWrapper>
  )
}
