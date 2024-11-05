import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

export const List = styled.ul`
  margin: ${sizes(2)} 0;
  padding: 0 0 0 ${sizes(4)};
  list-style-type: none;
`
export const ListItem = styled.li`
  padding: 0;
  margin: 0 0 ${sizes(2)} 0;
  display: flex;
  align-items: flex-start;
`

export const ListItemMarker = styled.div`
  min-width: 6px;
  min-height: 6px;
  border-radius: 50%;
  width: 6px;
  height: 6px;
  margin: ${sizes(1.5)} ${sizes(3)} 0 0;
  background-color: ${cVar('colorText')};
`

export const ListItemContent = styled.div`
  flex: 1;
`
