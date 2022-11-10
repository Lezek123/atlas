import BN from 'bn.js'
import { FC } from 'react'

import { Fee } from '@/components/Fee'
import { AlertDialogModal, AlertDialogModalProps } from '@/components/_overlays/AlertDialogModal'
import { JoystreamLibExtrinsics } from '@/joystream-lib/extrinsics'
import { TxMethodName } from '@/joystream-lib/types'
import { useFee } from '@/providers/joystream/joystream.hooks'

type AlertDialogModalWithFeeProps = AlertDialogModalProps & {
  fee: {
    methodName: TxMethodName
    args?: Parameters<JoystreamLibExtrinsics[TxMethodName]>
  }
}

export const AlertDialogModalWithFee: FC<AlertDialogModalWithFeeProps> = ({ fee, ...args }) => {
  const { fullFee, loading } = useFee(fee.methodName, fee.args && args.show ? fee.args : undefined)
  return (
    <AlertDialogModal
      {...args}
      additionalActionsNode={<Fee loading={loading} variant="h200" amount={fullFee || new BN(0)} />}
    />
  )
}
