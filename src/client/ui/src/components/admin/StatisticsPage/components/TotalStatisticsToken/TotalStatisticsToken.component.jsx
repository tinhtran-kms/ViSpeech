/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import ReportUtils from '../../../../../utils/report.util'
import { FREE_TOKEN } from '../../../../../utils/constant'
import TotalStatisticsTemplate from '../TotalStatisticsTemplate/TotalStatisticsTemplate.component'

const TotalStatisticsToken = ({
  currentUser,
  chartOptions,
  getUserTotalStatisticsBytokenObj,
  getUserTotalStatistics,
}) => {
  const [userTotalStatistics, setUserTotalStatistics] = useState({ data: [] })

  useEffect(() => {
    if (getUserTotalStatisticsBytokenObj.data.length > 0) {
      const formatStatisticsData = getUserTotalStatisticsBytokenObj.data.map(item => {
        return {
          ...item,
          data: {
            ...item.data,
            display: item.data.name.includes(FREE_TOKEN)
              ? item.data.name
              : `${item.data.projectName} - ${item.data.name}`,
          },
        }
      })
      setUserTotalStatistics({ ...getUserTotalStatisticsBytokenObj, data: formatStatisticsData })
    }
  }, [getUserTotalStatisticsBytokenObj])

  return (
    <div>
      {currentUser._id && (
        <TotalStatisticsTemplate
          userId={currentUser._id}
          chartOptions={chartOptions}
          statisticsType={ReportUtils.STATISTICS_TYPE.TOKEN}
          getTotalStatisticsObj={userTotalStatistics}
          getTotalStatistics={getUserTotalStatistics}
        />
      )}
    </div>
  )
}

export default TotalStatisticsToken
