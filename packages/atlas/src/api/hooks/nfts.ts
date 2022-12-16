import { QueryHookOptions } from '@apollo/client'
import BN from 'bn.js'
import { useMemo } from 'react'

import {
  BasicBidFieldsFragment,
  BasicMembershipFieldsFragment,
  BasicNftFieldsFragment,
  BasicVideoFieldsFragment,
} from '@/api/queries/__generated__/fragments.generated'
import {
  GetNftQuery,
  GetNftQueryVariables,
  GetNftsConnectionQuery,
  GetNftsConnectionQueryVariables,
  useGetNftQuery,
  useGetNftsConnectionQuery,
} from '@/api/queries/__generated__/nfts.generated'
import {
  GetNftHistoryQuery,
  GetNftHistoryQueryVariables,
  useGetNftHistoryQuery,
} from '@/api/queries/__generated__/notifications.generated'
import { videoFilter } from '@/config/contentFilter'
import { tokenNumberToHapiBn } from '@/joystream-lib/utils'

type CommonNftProperties = {
  title: string | null | undefined
  duration: number | null | undefined
  views: number | undefined
}

const VIDEO_ID_FILTER = videoFilter.id_not_contains

export type NftStatus = (
  | {
      status: 'auction'
      auctionId: string
      type: 'open' | 'english'
      startingPrice: BN
      buyNowPrice: BN | undefined
      topBid: BasicBidFieldsFragment | undefined
      topBidAmount: BN | undefined
      topBidder: BasicMembershipFieldsFragment | undefined
      auctionPlannedEndBlock: number | undefined
      bidLockingTime: number | undefined
      minimalBidStep: BN | undefined
      whitelistedMembers: BasicMembershipFieldsFragment[] | undefined
    }
  | {
      status: 'idle'
      lastSalePrice: BN | undefined
      lastSaleDate: Date | undefined
    }
  | {
      status: 'buy-now'
      buyNowPrice: BN
    }
) &
  CommonNftProperties

export const getNftStatus = (
  nft: BasicNftFieldsFragment | null | undefined,
  video: BasicVideoFieldsFragment | null | undefined
): NftStatus | undefined => {
  if (!nft) return undefined
  const commonProperties = {
    title: video?.title,
    duration: video?.duration,
    views: video?.viewsNum,
  }

  if (nft?.transactionalStatus && nft.transactionalStatus.__typename === 'TransactionalStatusAuction') {
    const auction = nft.transactionalStatus.auction
    const englishAuction = auction.auctionType.__typename === 'AuctionTypeEnglish' && auction.auctionType
    const openAuction = auction.auctionType.__typename === 'AuctionTypeOpen' && auction.auctionType
    return {
      ...commonProperties,
      status: 'auction',
      auctionId: auction.id,
      type: openAuction ? 'open' : 'english',
      startingPrice: new BN(auction.startingPrice || 0),
      buyNowPrice: auction.buyNowPrice ? new BN(auction.buyNowPrice) : undefined,
      topBid: auction.topBid || undefined,
      topBidAmount: auction.topBid?.amount ? new BN(auction.topBid?.amount) : undefined,
      topBidder: auction.topBid?.bidder,
      auctionPlannedEndBlock: englishAuction ? englishAuction.plannedEndAtBlock : undefined,
      bidLockingTime: openAuction ? openAuction.bidLockDuration : undefined,
      minimalBidStep: englishAuction ? tokenNumberToHapiBn(parseInt(englishAuction?.minimalBidStep)) : undefined,
      whitelistedMembers: auction.whitelistedMembers.map((whiteListed) => whiteListed.member),
    }
  }

  if (!nft?.transactionalStatus) {
    throw new Error('NFT missing transactional status')
  }
  switch (nft?.transactionalStatus.__typename) {
    case 'TransactionalStatusBuyNow':
      return {
        ...commonProperties,
        status: 'buy-now',
        buyNowPrice: new BN(nft.transactionalStatus.price),
      }
    case 'TransactionalStatusIdle':
      return {
        ...commonProperties,
        status: 'idle',
        lastSalePrice: nft.lastSalePrice ? new BN(nft.lastSalePrice) : undefined,
        lastSaleDate: nft.lastSaleDate ? new Date(nft.lastSaleDate) : undefined,
      }
    default:
      return undefined
  }
}

export const useNft = (id: string, opts?: QueryHookOptions<GetNftQuery, GetNftQueryVariables>) => {
  const { data, ...rest } = useGetNftQuery({ variables: { id }, skip: !id, ...opts })
  const nft = data?.ownedNftById

  return {
    nft,
    nftStatus: getNftStatus(nft, nft?.video),
    ...rest,
  }
}

export const useNftsConnection = (
  variables?: GetNftsConnectionQueryVariables,
  opts?: QueryHookOptions<GetNftsConnectionQuery, GetNftsConnectionQueryVariables>
) => {
  const { data, ...rest } = useGetNftsConnectionQuery({
    variables: {
      ...variables,
      where: { ...variables?.where, ...(VIDEO_ID_FILTER ? { NOT: [{ id_in: VIDEO_ID_FILTER }] } : {}) },
    },
    ...opts,
  })

  return {
    nfts: data?.ownedNftsConnection.edges.map(({ node }) => node),
    totalCount: data?.ownedNftsConnection.totalCount,
    pageInfo: data?.ownedNftsConnection.pageInfo,
    ...rest,
  }
}

export const useNftHistory = (
  id: string | null,
  opts?: QueryHookOptions<GetNftHistoryQuery, GetNftHistoryQueryVariables>
) => {
  const { data, ...rest } = useGetNftHistoryQuery({ variables: { nftId: id || '' }, skip: !id, ...opts })

  const sortedEvents = useMemo(() => {
    const allEvents = data?.events || []

    return allEvents.sort((e1, e2) => e2.timestamp.getTime() - e1.timestamp.getTime())
  }, [data])

  return {
    events: sortedEvents,
    ...rest,
  }
}
