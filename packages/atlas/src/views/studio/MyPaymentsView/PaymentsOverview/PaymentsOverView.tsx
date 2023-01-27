import { BN } from 'bn.js'
import { useMemo, useState } from 'react'

import { useFullChannel } from '@/api/hooks/channel'
import { SvgAlertsInformative24, SvgJoyTokenMonochrome24 } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { CopyAddressButton } from '@/components/_buttons/CopyAddressButton/CopyAddressButton'
import { ClaimChannelPaymentsDialog } from '@/components/_overlays/ClaimChannelPaymentsDialog'
import { WithdrawFundsDialog } from '@/components/_overlays/SendTransferDialogs'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useMemberAvatar } from '@/providers/assets/assets.hooks'
import { useSubscribeAccountBalance } from '@/providers/joystream/joystream.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { formatNumber } from '@/utils/number'

import { useChannelPayout } from './PaymentsOverview.hooks'
import {
  AvatarAndTokenWrapper,
  CustomNodeWrapper,
  StyledJoyTokenIcon,
  StyledWidgetTile,
  TilesWrapper,
  TokenWrapper,
} from './PaymentsOverview.styles'

export const PaymentsOverView = () => {
  const { channelId, activeMembership, accountId } = useUser()
  const { url: memberAvatarUrl } = useMemberAvatar(activeMembership)
  const { totalBalance } = useSubscribeAccountBalance()
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false)
  const [showClaimDialog, setShowClaimDialog] = useState<boolean>(false)
  const { channel, loading } = useFullChannel(channelId || '')
  const { availableAward, isAwardLoading } = useChannelPayout()

  const memoizedChannelStateBloatBond = useMemo(() => {
    return new BN(channel?.channelStateBloatBond || 0)
  }, [channel?.channelStateBloatBond])

  const { accountBalance: memberBalance } = useSubscribeAccountBalance()
  const { accountBalance: channelBalance } =
    useSubscribeAccountBalance(channel?.rewardAccount, {
      channelStateBloatBond: memoizedChannelStateBloatBond,
    }) || new BN(0)

  const formattedChannelBalance = formatNumber(hapiBnToTokenNumber(channelBalance || new BN(0)))
  const formattedMemberBalance = formatNumber(hapiBnToTokenNumber(memberBalance || new BN(0)))
  const formattedReward = formatNumber(availableAward || 0)

  const { url, isLoadingAsset } = useMemberAvatar(activeMembership)

  const mdMatch = useMediaMatch('md')

  return (
    <>
      <WithdrawFundsDialog
        avatarUrl={memberAvatarUrl}
        activeMembership={activeMembership}
        show={showWithdrawDialog}
        onExitClick={() => setShowWithdrawDialog(false)}
        totalBalance={totalBalance}
        channelBalance={channelBalance}
        channelId={channelId}
      />
      <ClaimChannelPaymentsDialog show={showClaimDialog} onExit={() => setShowClaimDialog(false)} />
      <TilesWrapper>
        <StyledWidgetTile
          title="Claimable Rewards"
          loading={isAwardLoading || loading}
          text={availableAward ? formattedReward : undefined}
          button={
            availableAward
              ? {
                  text: 'Claim',
                  onClick: () => setShowClaimDialog(true),
                  fullWidth: !mdMatch,
                }
              : undefined
          }
          customNode={
            availableAward ? undefined : (
              <CustomNodeWrapper>
                <SvgAlertsInformative24 />
                <Text variant="t100" as="p" color="colorText">
                  High-quality content is occasionally rewarded through JOY tokens by the Joystream council. When you
                  receive a reward, it'll appear here for you to claim. Learn more
                </Text>
              </CustomNodeWrapper>
            )
          }
        />
        <WidgetTile
          title="Channel balance"
          icon={<SvgJoyTokenMonochrome24 />}
          text={formattedChannelBalance}
          loading={loading || channelBalance === undefined}
          button={{
            text: 'Withdraw',
            variant: 'secondary',
            fullWidth: !mdMatch,
            onClick: () => setShowWithdrawDialog(true),
          }}
        />
        <WidgetTile
          title="Membership wallet balance"
          loading={loading || memberBalance === undefined}
          icon={
            <AvatarAndTokenWrapper>
              <Avatar size="bid" assetUrl={url} loading={isLoadingAsset} />
              <TokenWrapper>
                <StyledJoyTokenIcon variant="gray" size={24} />
              </TokenWrapper>
            </AvatarAndTokenWrapper>
          }
          text={formattedMemberBalance}
          customTopRightNode={accountId ? <CopyAddressButton size="small" address={accountId} /> : undefined}
        />
      </TilesWrapper>
    </>
  )
}
