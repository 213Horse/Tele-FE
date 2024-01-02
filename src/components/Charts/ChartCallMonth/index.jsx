import * as echarts from 'echarts/core';
import { GridComponent, LegendComponent } from 'echarts/components';
import { LineChart, BarChart, PictorialBarChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { useEffect } from 'react';
import { memo } from 'react';


export default memo(function ChartCallMonth({ callByMonth }) {
  useEffect(() => {
    if (callByMonth) {
      echarts.use([
        GridComponent,
        LegendComponent,
        LineChart,
        BarChart,
        PictorialBarChart,
        CanvasRenderer,
        UniversalTransition,
      ]);

      const chartDom = document.getElementById('main3');
      const myChart = echarts.init(chartDom);
      let option;

      let category = [];
      let lineData = [];
      let barData = [];
      for (let i = 0; i < callByMonth?.listCall.length; i++) {
        let date = new Date(callByMonth?.listCall[i].date);
        category.push(
          [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-'),
        );

        barData.push(
          callByMonth?.listCall[i].answer +
            callByMonth?.listCall[i].noAnswer +
            callByMonth?.listCall[i].staffOff +
            callByMonth?.listCall[i].reject,
        );
        lineData.push(
          callByMonth?.listCall[i].answer +
            callByMonth?.listCall[i].noAnswer +
            callByMonth?.listCall[i].staffOff +
            callByMonth?.listCall[i].reject,
        );
      }

      option = {
        backgroundColor: '#0f375f',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        xAxis: {
          data: category,
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
        },
        yAxis: {
          splitLine: { show: false },
          axisLine: {
            lineStyle: {
              color: '#ccc',
            },
          },
        },
        series: [
          {
            name: 'line',
            type: 'line',
            smooth: true,
            showAllSymbol: true,
            symbol: 'emptyCircle',
            symbolSize: 15,
            data: lineData,
          },
          {
            name: 'bar',
            type: 'bar',
            barWidth: 10,
            itemStyle: {
              borderRadius: 5,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#14c8d4' },
                { offset: 1, color: '#43eec6' },
              ]),
            },
            data: barData,
          },
          {
            name: 'line',
            type: 'bar',
            barGap: '-100%',
            barWidth: 10,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(20,200,212,0.5)' },
                { offset: 0.2, color: 'rgba(20,200,212,0.2)' },
                { offset: 1, color: 'rgba(20,200,212,0)' },
              ]),
            },
            z: -12,
            data: lineData,
          },
        ],
      };

      option && myChart.setOption(option);
    }
  }, [callByMonth]);
  return (
    <div
      style={{ height: '400px', width: '100%' }}
      id='main3'
    ></div>
  );
})
