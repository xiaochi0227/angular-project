import { EChartOption } from 'echarts';


interface CategoriesdataData {
  count: number[];
  amount: number[];
  maxCount: number;
  maxAmount: number;
  names: string[];
  categories1: any[];
  categories2: any[];
  hour: string[];
  mhour: string[];
}

const _getCategoriesData = (datas: JSON[]): CategoriesdataData => {
  if (datas && datas.length !== 0) {
    let count: number[] = [];
    let amount: number[] = [];
    let maxCount: number = 0;
    let maxAmount: number = 0;
    let names: string[] = [];
    let categories1: any[] = [];
    let categories2: any[] = [];
    let hour: string[] = [];
    let mhour: string[] = [];
    datas.forEach(data => {
      if (maxCount < parseInt(data['iTotal'])) {
        maxCount = parseInt(data['iTotal']);
      }
      if (maxAmount < parseFloat(data['iMoney'])) {
        maxAmount = parseFloat(data['iMoney']);
      }
      count.push(data['iTotal']);
      amount.push(data['iMoney']);
      let weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      let weekDay1 = ['日', '一', '二', '三', '四', '五', '六'];
      let dateStr = String(data['hour']);
      let myDate = new Date(Date.parse(dateStr.replace(/-/g, '/')));
      hour.push(weekDay[myDate.getDay()]);
      let mdateStr = String(data['hour']).substr(8, 2);
      let mypushdate: any;
      if (myDate.getDay() === 0 || myDate.getDay() === 6) {
        mypushdate = mdateStr + '(' + weekDay1[myDate.getDay()] + ')';
      } else {
        mypushdate = mdateStr;
      }
      mhour.push(mypushdate);
      // hour.push(String(data['hour']).substr(5,5));

    });
    if (datas.length > 0) {
      if (datas[0]['onlineCategories']) {
        for (let i = 0; i < datas[0]['onlineCategories'].length; i++) {
          categories1[i] = new Array();
          for (let j = 0; j < datas.length; j++) {
            categories2[j] = new Array();
            categories2[j] = datas[j]['onlineCategories'][i]['money'];
            categories1[i][j] = categories2[j];
          }

        }
        datas[0]['onlineCategories'].forEach(categorie => {
          names.push(categorie.name);
        });
      }
    }
    return {
      count: count,
      amount: amount,
      maxCount: maxCount,
      maxAmount: maxAmount,
      names: names,
      categories1: categories1,
      categories2: categories2,
      hour: hour,
      mhour: mhour
    };
  } else {
    return null;
  }
};

export const convert2OrderAmount1 = (json: JSON): EChartOption => {
  if (json && json['code'] != 0) {
    const interval = 5;
    let option: EChartOption = {};
    let Categoriesdata: any = {};
    Categoriesdata = _getCategoriesData(json['times']);
    if (!Categoriesdata) { return null; } else {
      console.log(Categoriesdata);

      option.tooltip = {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      };
      option.xAxis = [
        {
          type: 'category',
          data: ['0点', '1点', '2点', '3点', '4点', '5点', '6点', '7点', '8点',
            '9点', '10点', '11点', '12点', '13点', '14点', '15点', '16点',
            '17点', '18点', '19点', '20点', '21点', '22点', '23点']
        }
      ];

      option.legend = {
        left: '3%',
        top: '0',
        right: '3%',
        textStyle: {
          color: '#333',
        },
        data: Categoriesdata.names
      };

      option.grid = {
        bottom: '30px',
        top: '85px'
      }
      option.yAxis = [
        {
          type: 'value',
          name: '数量',
          min: 0,
          max: Categoriesdata.maxCount + 5,
          interval: Math.round((Categoriesdata.maxCount + 5) / interval),
          axisLabel: {
            formatter: '{value}笔'
          }
        }, {
          type: 'value',
          name: '金额',
          min: 0,
          max: Math.round(Categoriesdata.maxAmount + 250),
          interval: Math.round((Categoriesdata.maxAmount + 250) / interval),
          axisLabel: {
            formatter: '￥{value}元'
          }
        }
      ];
      option.series = [];
      if (Categoriesdata.names.length > 0) {
        for (let i = 0; i < Categoriesdata.names.length; i++) {
          for (let j = 0; j < Categoriesdata.categories1.length; j++) {

          }
          option.series.push({
            name: Categoriesdata.names[i],
            type: 'bar',
            stack: '金额',
            "barGap": "20%",
            barWidth: '15px',
            yAxisIndex: 1,
            data: Categoriesdata.categories1[i]
          });
        }
      } else {
        option.series.push({
          name: '订单金额',
          type: 'bar',
          stack: '金额',
          "barGap": "20%",
          barWidth: '15px',
          yAxisIndex: 1,
          data: Categoriesdata.amount
        });
      }

      option.series.push(
        {
          name: '订单笔数',
          type: 'line',
          symbolSize: 8,
          symbol: 'circle',
          yAxisIndex: 0,
          'itemStyle': {
            'normal': {
              'color': '#333',
              'barBorderRadius': 10,
              'label': {
                'show': true,
                'position': 'top'
              }
            }
          },
          data: Categoriesdata.count
        }
      );
      option.color = ['#c23531', '#2f4554', '#d48265', '#05a5b9', '#05606b', '#4c7795', '#892522',
        '#d34919', '#962f0b', '#61a0a8', '#ee0a04', '#7b0905', '#5cb85c', '#fc3468', '#c30839', '#c30883',
        '#a608c3', '#5308c3', '#6b0cfa', '#6b0cfa', '#0cc5fa', '#0cfaba', '#0cfa71', '#85bd9d', '#39ac11', '#9eef10',
        '#bcf755', '#f7e655', '#ef7614', '#ef1414'
      ];
      return option;
    }
  } else {
    return null;

  }
};


export const convert2OrderAmount2 = (json: JSON): EChartOption => {


  if (json && json['code'] != 0) {
    const interval = 5;
    let option: EChartOption = {};
    const Categoriesdata: CategoriesdataData = _getCategoriesData(json['times']);
    if (Categoriesdata == null) { return null; }
    else {
      option.tooltip = {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      };
      option.legend = {
        left: '3%',
        top: '0',
        right: '3%',
        textStyle: {
          color: '#333',
        },
        data: Categoriesdata.names
      };
      option.grid = {
        bottom: '30px',
        top: '80px'
      }
      option.xAxis = [
        {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }
      ];
      option.yAxis = [
        {
          type: 'value',
          name: '数量',
          min: 0,
          max: Categoriesdata.maxCount + 5,
          interval: Math.round((Categoriesdata.maxCount + 5) / interval),
          axisLabel: {
            formatter: '{value}笔'
          }
        }, {
          type: 'value',
          name: '金额',
          min: 0,
          max: Categoriesdata.maxAmount + 250,
          interval: Math.round((Categoriesdata.maxAmount + 250) / interval),
          axisLabel: {
            formatter: '￥{value}元'
          }
        }
      ];

      option.series = [];
      if (Categoriesdata.names.length > 0) {
        for (let i = 0; i < Categoriesdata.names.length; i++) {
          for (let j = 0; j < Categoriesdata.categories1.length; j++) {

          }
          option.series.push({
            name: Categoriesdata.names[i],
            type: 'bar',
            stack: '金额',
            "barGap": "20%",
            barWidth: '15px',
            yAxisIndex: 1,
            data: Categoriesdata.categories1[i]
          });
        }
      } else {
        option.series.push({
          name: '订单金额',
          type: 'bar',
          stack: '金额',
          "barGap": "20%",
          barWidth: '15px',
          yAxisIndex: 1,
          data: Categoriesdata.amount
        });
      }

      option.series.push(
        {
          name: '订单笔数',
          type: 'line',
          symbolSize: 8,
          symbol: 'circle',
          yAxisIndex: 0,
          'itemStyle': {
            'normal': {
              'color': '#333',
              'barBorderRadius': 10,
              'label': {
                'show': true,
                'position': 'top'
              }
            }
          },
          data: Categoriesdata.count
        }
      );
      console.log(option.series);

      option.color = ['#c23531', '#2f4554', '#d48265', '#05a5b9', '#05606b', '#4c7795', '#892522',
        '#d34919', '#962f0b', '#61a0a8', '#ee0a04', '#7b0905', '#5cb85c', '#fc3468', '#c30839', '#c30883',
        '#a608c3', '#5308c3', '#6b0cfa', '#6b0cfa', '#0cc5fa', '#0cfaba', '#0cfa71', '#85bd9d', '#39ac11', '#9eef10',
        '#bcf755', '#f7e655', '#ef7614', '#ef1414'
      ];
      return option;
    }
  } else {
    return null;

  }
};


export const convert2OrderAmount3 = (json: JSON): EChartOption => {


  if (json && json['code'] != 0) {
    const interval = 5;
    let option: EChartOption = {};
    const Categoriesdata: CategoriesdataData = _getCategoriesData(json['times']);


    if (Categoriesdata == null) { return null }
    else {
      option.tooltip = {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      };
      option.legend = {
        left: '3%',
        top: '0',
        right: '3%',
        textStyle: {
          color: '#333',
        },
        data: Categoriesdata.names
      };
      option.grid = {
        bottom: '30px',
        top: '80px'
      }
      option.xAxis = [
        {
          type: 'category',
          data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
        }
      ];
      option.yAxis = [
        {
          type: 'value',
          name: '数量',
          min: 0,
          max: Categoriesdata.maxCount + 5,
          interval: Math.round((Categoriesdata.maxCount + 5) / interval),
          axisLabel: {
            formatter: '{value}笔'
          }
        }, {
          type: 'value',
          name: '金额',
          min: 0,
          max: Categoriesdata.maxAmount + 250,
          interval: Math.round((Categoriesdata.maxAmount + 250) / interval),
          axisLabel: {
            formatter: '￥{value}元'
          }
        }
      ];

      option.series = [];
      if (Categoriesdata.names.length > 0) {
        for (let i = 0; i < Categoriesdata.names.length; i++) {
          for (let j = 0; j < Categoriesdata.categories1.length; j++) {

          }
          option.series.push({
            name: Categoriesdata.names[i],
            type: 'bar',
            stack: '金额',
            "barGap": "20%",
            barWidth: '15px',
            yAxisIndex: 1,
            data: Categoriesdata.categories1[i]
          });
        }
      } else {
        option.series.push({
          name: '订单金额',
          type: 'bar',
          stack: '金额',
          "barGap": "20%",
          barWidth: '15px',
          yAxisIndex: 1,
          data: Categoriesdata.amount
        });
      }
      option.series.push(
        {
          name: '订单笔数',
          type: 'line',
          symbolSize: 8,
          symbol: 'circle',
          yAxisIndex: 0,
          'itemStyle': {
            'normal': {
              'color': '#333',
              'barBorderRadius': 10,
              'label': {
                'show': true,
                'position': 'top'
              }
            }
          },
          data: Categoriesdata.count
        }
      );
      option.color = ['#c23531', '#2f4554', '#d48265', '#05a5b9', '#05606b', '#4c7795', '#892522',
        '#d34919', '#962f0b', '#61a0a8', '#ee0a04', '#7b0905', '#5cb85c', '#fc3468', '#c30839', '#c30883',
        '#a608c3', '#5308c3', '#6b0cfa', '#6b0cfa', '#0cc5fa', '#0cfaba', '#0cfa71', '#85bd9d', '#39ac11', '#9eef10',
        '#bcf755', '#f7e655', '#ef7614', '#ef1414'
      ];
      return option;
    }
  } else {
    return null;

  }
};


export const convert2OrderAmount4 = (json: JSON): EChartOption => {


  if (json && json['code'] != 0) {
    const interval = 5;
    let option: EChartOption = {};
    const Categoriesdata: CategoriesdataData = _getCategoriesData(json['times']);

    if (Categoriesdata == null) { return null }
    else {
      option.tooltip = {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      };
      option.legend = {
        left: '3%',
        top: '0',
        right: '3%',
        textStyle: {
          color: '#333',
        },
        data: Categoriesdata.names
      };
      option.grid = {
        bottom: '30px',
        top: '80px'
      }
      option.xAxis = [
        {
          type: 'category',
          data: Categoriesdata.hour
        }
      ];
      option.yAxis = [
        {
          type: 'value',
          name: '数量',
          min: 0,
          max: Categoriesdata.maxCount + 5,
          interval: Math.round((Categoriesdata.maxCount + 5) / interval),
          axisLabel: {
            formatter: '{value}笔'
          }
        }, {
          type: 'value',
          name: '金额',
          min: 0,
          max: Categoriesdata.maxAmount + 250,
          interval: Math.round((Categoriesdata.maxAmount + 250) / interval),
          axisLabel: {
            formatter: '￥{value}元'
          }
        }
      ];

      option.series = [];
      if (Categoriesdata.names.length > 0) {
        for (let i = 0; i < Categoriesdata.names.length; i++) {
          for (let j = 0; j < Categoriesdata.categories1.length; j++) {

          }
          option.series.push({
            name: Categoriesdata.names[i],
            type: 'bar',
            stack: '金额',
            "barGap": "20%",
            barWidth: '15px',
            yAxisIndex: 1,
            data: Categoriesdata.categories1[i]
          });
        }
      } else {
        option.series.push({
          name: '订单金额',
          type: 'bar',
          stack: '金额',
          "barGap": "20%",
          barWidth: '15px',
          yAxisIndex: 1,
          data: Categoriesdata.amount
        });
      }
      option.series.push(
        {
          name: '订单笔数',
          type: 'line',
          symbolSize: 8,
          symbol: 'circle',
          yAxisIndex: 0,
          'itemStyle': {
            'normal': {
              'color': '#333',
              'barBorderRadius': 10,
              'label': {
                'show': true,
                'position': 'top'
              }
            }
          },
          data: Categoriesdata.count
        }
      );
      option.color = ['#c23531', '#2f4554', '#d48265', '#05a5b9', '#05606b', '#4c7795', '#892522',
        '#d34919', '#962f0b', '#61a0a8', '#ee0a04', '#7b0905', '#5cb85c', '#fc3468', '#c30839', '#c30883',
        '#a608c3', '#5308c3', '#6b0cfa', '#6b0cfa', '#0cc5fa', '#0cfaba', '#0cfa71', '#85bd9d', '#39ac11', '#9eef10',
        '#bcf755', '#f7e655', '#ef7614', '#ef1414'
      ];
      return option;
    }
  } else {
    return null;

  }
};

export const convert2OrderAmount5 = (json: JSON): EChartOption => {


  if (json && json['code'] != 0) {
    const interval = 5;
    let option: EChartOption = {};
    const Categoriesdata: CategoriesdataData = _getCategoriesData(json['times']);


    if (Categoriesdata == null) { return null }
    else {
      option.tooltip = {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      };
      option.legend = {
        left: '3%',
        top: '0',
        right: '3%',
        textStyle: {
          color: '#333',
        },
        data: Categoriesdata.names
      };
      option.grid = {
        bottom: '30px',
        top: '80px'
      }
      option.xAxis = [
        {
          type: 'category',
          data: Categoriesdata.mhour
        }
      ];
      option.yAxis = [
        {
          type: 'value',
          name: '数量',
          min: 0,
          max: Categoriesdata.maxCount + 5,
          interval: Math.round((Categoriesdata.maxCount + 5) / interval),
          axisLabel: {
            formatter: '{value}笔'
          }
        }, {
          type: 'value',
          name: '金额',
          min: 0,
          max: Categoriesdata.maxAmount + 250,
          interval: Math.round((Categoriesdata.maxAmount + 250) / interval),
          axisLabel: {
            formatter: '￥{value}元'
          }
        }
      ];

      option.series = [];
      if (Categoriesdata.names.length > 0) {
        for (let i = 0; i < Categoriesdata.names.length; i++) {
          for (let j = 0; j < Categoriesdata.categories1.length; j++) {

          }
          option.series.push({
            name: Categoriesdata.names[i],
            type: 'bar',
            stack: '金额',
            "barGap": "20%",
            barWidth: '15px',
            yAxisIndex: 1,
            data: Categoriesdata.categories1[i]
          });
        }
      } else {
        option.series.push({
          name: '订单金额',
          type: 'bar',
          stack: '金额',
          "barGap": "20%",
          barWidth: '15px',
          yAxisIndex: 1,
          data: Categoriesdata.amount
        });
      }
      option.series.push(
        {
          name: '订单笔数',
          type: 'line',
          symbolSize: 8,
          symbol: 'circle',
          yAxisIndex: 0,
          'itemStyle': {
            'normal': {
              'color': '#333',
              'barBorderRadius': 10,
              'label': {
                'show': true,
                'position': 'top'
              }
            }
          },
          data: Categoriesdata.count
        }
      );
      option.color = ['#c23531', '#2f4554', '#d48265', '#05a5b9', '#05606b', '#4c7795', '#892522',
        '#d34919', '#962f0b', '#61a0a8', '#ee0a04', '#7b0905', '#5cb85c', '#fc3468', '#c30839', '#c30883',
        '#a608c3', '#5308c3', '#6b0cfa', '#6b0cfa', '#0cc5fa', '#0cfaba', '#0cfa71', '#85bd9d', '#39ac11', '#9eef10',
        '#bcf755', '#f7e655', '#ef7614', '#ef1414'
      ];
      return option;
    }
  } else {
    return null;

  }
};


interface ChannelData {
  channels: string[];
  channelsdatas: any[];
  channelstotals: any[];
}
const _getchannelData = (datas: JSON[]): ChannelData => {
  if (datas) {


    let channels: string[] = [];
    let channelsdatas: any[] = [];
    let channelstotals: any[] = [];
    datas.forEach(data => {
      let channelsdata = {
        value: Number,
        name: String
      };
      let channelstotal = {
        value: Number,
        name: String
      };
      channelsdata.value = data['money'];
      channelsdata.name = data['name'];
      channelstotal.value = data['total'];
      channelstotal.name = data['name'];
      channels.push(data['name']);
      channelsdatas.push(channelsdata);
      channelstotals.push(channelstotal);
    });
    return {
      channels: channels,
      channelsdatas: channelsdatas,
      channelstotals: channelstotals
    };
  } else {
    return null;
  }
};
export const piechannel = (json: JSON): EChartOption => {
  if (json && json['code'] != 0) {
    let option: EChartOption = {};
    if (json['channels']) {
      const channeldata: ChannelData = _getchannelData(json['channels']);
      let colorarr: string[] = [];
      if (channeldata) {
        option.tooltip = {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        };
        option.legend = {
          orient: 'horizontal',
          left: 'center',
          textStyle: {
            color: '#333',
          },
          data: channeldata.channels
        };

        for (let i = 0; i < channeldata.channels.length; i++) {
          if (channeldata.channels[i] === '福州电信') {
            colorarr[i] = '#ed6d02';
          }
          if (channeldata.channels[i] === '美团外卖') {
            colorarr[i] = '#feb31a';
          }
          if (channeldata.channels[i] === '饿了么星选') {
            colorarr[i] = '#ff2c4a';
          }
          if (channeldata.channels[i] === '京东到家') {
            colorarr[i] = '#00833f';
          }
          if (channeldata.channels[i] === '京东商城') {
            colorarr[i] = '#f00';
          }
          if (channeldata.channels[i] === '饿了么') {
            colorarr[i] = '#0081cc';
          }
          if (channeldata.channels[i] === '爱便利APP') {
            colorarr[i] = '#ff4081';
          }
          if (channeldata.channels[i] === '有赞') {
            // colorarr[i] = '#e20';
            colorarr[i] = '#2c3a46';
          }
          if (channeldata.channels[i] === '银座云生活') {
            colorarr[i] = '#e60012';
          }
          if (channeldata.channels[i] === '火星兔子') {
            colorarr[i] = '#4c7795';
          }
          if (channeldata.channels[i] === '华冠到家') {
            colorarr[i] = '#2a2a72';
          }
          if (channeldata.channels[i] === '城市超市H5') {
            colorarr[i] = '#930701';
          }
          if (channeldata.channels[i] === '轻松购') {
            colorarr[i] = '#30c749';
          }
          if (channeldata.channels[i] === '美团餐饮') {
            colorarr[i] = '#febd39';
          }
          if (channeldata.channels[i] === '美团扫码购') {
            colorarr[i] = '#eda208';
          }
          if (channeldata.channels[i] === '食派士') {
            colorarr[i] = '#ff9820';
          }
          if (channeldata.channels[i] === '微电汇') {
            colorarr[i] = '#f111c5';
          }
          if (channeldata.channels[i] === '饿了么餐饮') {
            colorarr[i] = '#2e82c5';
          }
          if (channeldata.channels[i] === '易佳购') {
            colorarr[i] = '#eb5c24';
          }
          if (channeldata.channels[i] === '京客隆APP') {
            colorarr[i] = '#5fb631';
          }
        }
        option.color = colorarr;
        option.series = [
          {
            center: ['50%', '58%'],
            name: '销售金额',
            type: 'pie',
            radius: [0, '35%'],
            label: {
              normal: {
                show: false,
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: channeldata.channelsdatas
          },
          {
            center: ['50%', '58%'],
            name: '订单数',
            type: 'pie',
            radius: ['45%', '60%'],
            label: {
              normal: {
                textStyle: {
                  color: '#333',
                  fontSize: '6px',
                  position: 'outside'
                },
                formatter: '{b} \n {c} ({d}%)'
              }
            },
            data: channeldata.channelstotals,
          }
        ];
        return option;
      } else {
        return null;
      }
    }

  }
};
