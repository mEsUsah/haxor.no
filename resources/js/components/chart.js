import {
    Chart,
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
  } from 'chart.js';
  
  Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
  );
export default {
    _chart  : document.querySelectorAll("[data-chart]"),
	init() {
        if(this._chart){
            this._chart.forEach((element) => {
                const chartNr = element.getAttribute("data-chart");
                const chartType = element.getAttribute("data-chart-type");
                const chartData = JSON.parse(element.getAttribute("data-chart-content"));
                const chartTitle = element.getAttribute("data-chart-title");
                const chartSubtitle = element.getAttribute("data-chart-subtitle");
            
                let data;
                let config;
                let labels = [];

                // Line Chart
                if (chartType == "line") {
                    const labels = [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                    ];
                    data = {
                    labels: labels,
                    datasets: [{
                        label: 'My First dataset',
                        backgroundColor: 'rgb(0,0,0)',
                        borderColor: 'rgb(0,0,0)',
                        data: [0, 10, 5, 2, 20, 30, 45],
                        }]
                    };
                  
                    config = {
                        type: 'line',
                        data: data,
                        options: {}
                    };

                // Bar Chart - Stacked
                } else if (chartType == "bar-stacked") {
                    data = {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Min',
                                backgroundColor: 'rgb(0, 0, 0)',
                                borderColor: 'rgb(0,0,0)',
                                data: [],
                                stack: "Hypercruce",
                            },
                            {
                                label: 'Max',
                                backgroundColor: 'rgb(113, 113, 113)',
                                borderColor: 'rgb(0,0,0)',
                                data: [],
                                stack: "Hypercruce",
                            },
                        ]
                    };

                    chartData.forEach((dataLine, i) => {
                        labels.push(dataLine.label)

                        chartData.forEach((row, i) => {
                            data.datasets[0].data.push(row.lowest);
                            data.datasets[0].stack = row.stack;

                            data.datasets[1].data.push(row.highest - row.lowest);
                            data.datasets[1].stack = row.stack;
                        });
                    });

                    config = {
                        type: 'bar',
                        data: data,
                        options: {
                            plugins: {
                                title: {
                                    display: true,
                                    size: 16,
                                    color: 'black',
                                    family: 'Oswald',
                                    text: chartTitle,
                                    padding: {
                                        bottom: 2
                                    }
                                },
                                subtitle: {
                                    display: true,
                                    text: chartSubtitle,
                                    color: 'black',
                                    font: {
                                        size: 12,
                                        family: 'Segoe UI',
                                        weight: 'normal',
                                        style: 'normal'
                                    },
                                    padding: {
                                        bottom: -4
                                    }
                                },
                                tooltip:{
                                    enabled: false,
                                }
                            },
                            responsive: true,
                            interaction: {
                                intersect: false,
                            },
                            scales: {
                                x: {
                                stacked: true,
                                },
                                y: {
                                stacked: true
                                }
                            }
                        }
                    };
                }
                var myChart = new Chart(
                    document.getElementById('chart_' + chartNr),
                    config
                );
            })
        }
    }
}