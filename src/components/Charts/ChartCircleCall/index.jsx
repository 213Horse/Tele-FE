import { useEffect, memo } from 'react';
import * as echarts from 'echarts';


export default memo(function ChartCircleCall({ htrCall }) {
  useEffect(() => {
    if (htrCall) {
      const chartDom = document.getElementById('main5');
      const myChart = echarts.init(chartDom);
      let option;

      option = {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          top: '5%',
          left: 'center',
        },
        series: [
          {
            name: 'Thông tin',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: htrCall?.totalAnswer, name: 'Nghe máy' },
              { value: htrCall?.totalStaffOff, name: 'Tắt máy' },
              { value: htrCall?.totalReject, name: 'Máy bận' },
              { value: htrCall?.totalNoAnswer, name: 'Không cầm máy' },
            ],
          },
        ],
      };

      option && myChart.setOption(option);
    }
  }, [htrCall]);
  return (
    <div
      style={{ height: '400px', width: '100%' }}
      id='main5'
    ></div>
  );
})
