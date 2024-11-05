import { FC } from 'react'

import { Text } from '@/components/Text'
import { DialogModal } from '@/components/_overlays/DialogModal'

export type YppSuspendedModalProps = {
  buttonText?: string
  show: boolean
  onClose: () => void
}

export const YppSuspendedModal: FC<YppSuspendedModalProps> = ({
  show,
  onClose,
  buttonText = 'Go back to home page',
}) => {
  return (
    <DialogModal
      size="medium"
      show={show}
      dividers
      primaryButton={{
        text: buttonText,
        onClick: onClose,
      }}
    >
      <Text variant="h400" as="h2" margin={{ bottom: 4 }}>
        YouTube Partner Program temporarily suspended
      </Text>
      <Text variant="t200" as="p" color="colorText" margin={{ bottom: 4 }}>
        Due to recent technical issues with the YouTube Sync service, YouTube Partner Program (YPP) has been temporarily
        suspended until further notice.
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
