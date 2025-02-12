import { FC } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Text } from '@/components/Text'
import { useBottomNavStore } from '@/providers/bottomNav'
import { usePersonalDataStore } from '@/providers/personalData'
import { transitions } from '@/styles'

import { CookieEmoticon, StyledAnchor, StyledDialog } from './CookiePopover.styles'

export const CookiePopover: FC = () => {
  const { isCookiesPopoverVisible, setCookiesAccepted } = usePersonalDataStore((state) => ({
    isCookiesPopoverVisible: state.actions.getIsCookiesPopoverVisible(),
    setCookiesAccepted: state.actions.setCookiesAccepted,
  }))
  const bottomNavOpen = useBottomNavStore((state) => state.open)
  return (
    <CSSTransition
      in={isCookiesPopoverVisible}
      timeout={200}
      classNames={transitions.names.modal}
      mountOnEnter
      unmountOnExit
      appear
    >
      <StyledDialog
        bottomNavOpen={bottomNavOpen}
        size="compact"
        title={
          <>
            <CookieEmoticon>🍪</CookieEmoticon>We use cookies
          </>
        }
        primaryButton={{
          text: 'Accept',
          onClick: () => setCookiesAccepted(true),
        }}
        secondaryButton={{
          text: 'Decline',
          onClick: () => setCookiesAccepted(false),
          variant: 'tertiary',
          _textOnly: true,
        }}
      >
        <Text as="p" variant="t200" color="colorText">
          We use cookies and other tracking technologies to improve your experience and provide analytics.{' '}
          <StyledAnchor href="https://www.joystream.org/privacy-policy/">You can read more about it here.</StyledAnchor>
        </Text>
      </StyledDialog>
    </CSSTransition>
  )
}
