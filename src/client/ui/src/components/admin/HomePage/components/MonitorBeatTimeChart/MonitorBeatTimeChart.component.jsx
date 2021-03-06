/* eslint-disable no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useRef } from 'react'
import { Line } from '@ant-design/charts'
import * as moment from 'moment'
import SocketService from '../../../../../services/socket.service'
import SocketUtils from '../../../../../utils/socket.util'
import { DEFAULT_PAGINATION, SORT_ORDER } from '../../../../../utils/constant'
import MonitorUtils from '../../../../../utils/monitor.util'

const { KAFKA_TOPIC, invokeCheckSubject } = SocketUtils
const { MONITOR_BEAT_SUCCESS_EVENT, MONITOR_BEAT_FAILED_EVENT } = KAFKA_TOPIC

const MonitorBeatTimeChart = ({ getMonitorListObj, getMonitorList }) => {
  const [data, setData] = useState([])
  const isMounted = useRef(true)

  useEffect(() => {
    SocketService.socketOnListeningEvent(MONITOR_BEAT_SUCCESS_EVENT)
    SocketService.socketOnListeningEvent(MONITOR_BEAT_FAILED_EVENT)
  }, [])

  useEffect(() => {
    getMonitorList({ pagination: DEFAULT_PAGINATION.SIZE_10, sortField: 'createdDate', sortOrder: SORT_ORDER.DESC })
  }, [getMonitorList])

  useEffect(() => {
    if (getMonitorListObj.isLoading === false && getMonitorListObj.isSuccess === true) {
      const chartData = MonitorUtils.convertArrToChartData(getMonitorListObj.monitorList.data)
      setData(chartData)
    }
  }, [getMonitorListObj])

  useEffect(() => {
    const unsubscribe$ = invokeCheckSubject.MonitorBeat.subscribe(event => {
      if (isMounted.current && event.error == null) {
        const mappedData = MonitorUtils.mapMonitorDataFunc(event.data)
        const convertedData = MonitorUtils.convertToChartData(mappedData)
        setData(p => {
          const data = p.slice(4)
          return [...data, ...convertedData]
        })
      }
      unsubscribe$.unsubscribe()
      unsubscribe$.complete()
    })
    return () => {
      isMounted.current = false
    }
  }, [])

  const DEFAULT_STYLE = {
    fill: 'rgba(0, 0, 0, 0.9)',
    stroke: '#ffffff',
    lineWidth: 2,
    fontSize: 15,
  }

  const config = {
    title: {
      visible: false,
    },
    description: {
      visible: false,
    },
    padding: 'auto',
    forceFit: true,
    data,
    xField: 'date',
    yField: 'time',
    seriesField: 'type',
    xAxis: {
      label: {
        visible: true,
        autoHide: true,
        autoRotate: false,
        style: DEFAULT_STYLE,
      },
    },
    yAxis: {
      label: {
        visible: true,
        style: DEFAULT_STYLE,
      },
    },
    meta: {
      time: {
        formatter: v => {
          return `${v} ms/item`
        },
      },
      type: {
        formatter: MonitorUtils.formatTextFunc,
      },
      date: {
        formatter: v => {
          return moment(v).format('DD-MM-YYYY HH:mm:ss')
        },
      },
    },
    legend: {
      position: 'top-center',
      text: {
        // formatter: MonitorUtils.formatTextFunc,
        style: DEFAULT_STYLE,
      },
    },
    // label: {
    //   visible: true,
    //   type: 'line',
    //   formatter: MonitorUtils.formatTextFunc,
    //   style: { ...DEFAULT_STYLE, fontSize: 14 },
    // },
    // animation: { appear: { animation: 'clipingWithData' } },
    smooth: true,
    responsive: true,
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Biểu đồ</h4>
          </div>
          <div className="card-content">
            <Line {...config} onlyChangeData />
          </div>
        </div>
      </div>
    </div>
  )
}
export default MonitorBeatTimeChart
