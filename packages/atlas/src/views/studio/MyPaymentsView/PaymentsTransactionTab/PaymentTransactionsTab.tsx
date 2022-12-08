import { useMemo } from 'react'

import { useFullChannel } from '@/api/hooks/channel'
import { SvgJoyTokenMonochrome24 } from '@/assets/icons'
import { TablePaymentsHistory } from '@/components/TablePaymentsHistory'
import { WidgetTile } from '@/components/WidgetTile'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useUser } from '@/providers/user/user.hooks'
import { formatNumber } from '@/utils/number'
import { useChannelPaymentsHistory } from '@/views/studio/MyPaymentsView/PaymentsTransactionTab/PaymentTransactionsTab.hooks'
import { aggregatePaymentHistory } from '@/views/studio/MyPaymentsView/PaymentsTransactionTab/PaymentTransactionsTab.utils'

import { TableWrapper, TilesWrapper } from './PaymentTransactionsTab.styles'

export const PaymentTransactionsTab = () => {
  const { channelId } = useUser()
  const { channel } = useFullChannel(channelId ?? '')

  const { paymentData, loading } = useChannelPaymentsHistory(channel)
  const paymentHistoryOverview = useMemo(() => aggregatePaymentHistory(paymentData), [paymentData])

  return (
    <>
      <TilesWrapper>
        <WidgetTile
          title="Total earned"
          text={formatNumber(hapiBnToTokenNumber(paymentHistoryOverview.totalEarned))}
          loading={loading}
          icon={<SvgJoyTokenMonochrome24 />}
        />
        <WidgetTile
          title="Total withdrawn"
          loading={loading}
          text={formatNumber(hapiBnToTokenNumber(paymentHistoryOverview.totalWithdrawn))}
          icon={<SvgJoyTokenMonochrome24 />}
        />
      </TilesWrapper>
      <TableWrapper>
        <TablePaymentsHistory data={paymentData} />
      </TableWrapper>
    </>
  )
}
