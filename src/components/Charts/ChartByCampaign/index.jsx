import * as echarts from 'echarts/core';
import { GridComponent, LegendComponent } from 'echarts/components';
import { LineChart, BarChart, PictorialBarChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { useEffect } from 'react';
import { memo } from 'react';

export default memo(function ChartByCampaign({ htrCall }) {
  useEffect(() => {
    echarts.use([
      GridComponent,
      LegendComponent,
      LineChart,
      BarChart,
      PictorialBarChart,
      CanvasRenderer,
      UniversalTransition,
    ]);

    const chartDom = document.getElementById('main7');
    const myChart = echarts.init(chartDom);
    let option;

    let category = [];
    let lineData = [];
    let barData = [];
    for (let i = 0; i < htrCall?.listCall.length; i++) {
      let date = new Date(htrCall?.listCall[i].date);
      category.push(
        [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-'),
      );

      barData.push(
        htrCall?.listCall[i].answer +
          htrCall?.listCall[i].noAnswer +
          htrCall?.listCall[i].staffOff +
          htrCall?.listCall[i].reject,
      );
      lineData.push(
        htrCall?.listCall[i].answer +
          htrCall?.listCall[i].noAnswer +
          htrCall?.listCall[i].staffOff +
          htrCall?.listCall[i].reject,
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
      ],
    };

    option && myChart.setOption(option);
  }, [htrCall]);
  return (
    <div
      style={{ height: '400px', width: '100%' }}
      id='main7'
    ></div>
  );
});
