import { FC } from 'react'

import { Text } from '@/components/Text'
import { DialogModal } from '@/components/_overlays/DialogModal'

export type ConnectWithYtModalProps = {
  show: boolean
  onClose: () => void
}

export const YppDisabledModal: FC<ConnectWithYtModalProps> = ({ show, onClose }) => {
  // const smMatch = useMediaMatch('sm')
  return (
    <DialogModal
      size="medium"
      show={show}
      dividers
      primaryButton={{
        text: 'Continue',
        onClick: onClose,
      }}
    >
      <Text variant="h400" as="h2" margin={{ bottom: 4 }}>
        YouTube Partner Program temporarily disabled
      </Text>
      <Text variant="t200" as="p" color="colorText" margin={{ bottom: 4 }}>
        Due to recent technical issues with the YouTube Synch service, YouTube Partner Program has been temporarily
        disabled until further notice.
      </Text>
      <Text variant="t200" as="p" color="colorText" margin={{ bottom: 4 }}>
        You can still create a channel on Gleev, but it will not be connected with your YouTube channel and you will not
        be eligable for any YPP rewards.
      </Text>
      <Text variant="t200" as="p" color="colorText">
        We apologize for any inconvenience.
      </Text>
    </DialogModal>
  )
}
