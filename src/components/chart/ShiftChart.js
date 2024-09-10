import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = ({ data }) => {
    const [chartData, setChartData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [options, setOptions] = useState({});




    useEffect(() => {
        if (data && data.length > 0) {
            const transformData = (dataArray) => {
                if (!Array.isArray(dataArray)) {
                    return <div className="">NO DATA</div>
                }
                const result = [];
                const shiftNames = Object.keys(dataArray[0][Object.keys(dataArray[0])[0]]);
                const shiftData = {};

                dataArray?.forEach(data => {
                    Object.keys(data).forEach(date => {
                        shiftNames.forEach(shift => {
                            if (!shiftData[shift]) {
                                shiftData[shift] = {
                                    major: [],
                                    minor: []
                                };
                            }
                            shiftData[shift]?.major?.push(parseFloat(parseFloat(data[date][shift].major).toFixed(2)));
                            shiftData[shift]?.minor?.push(parseFloat(parseFloat(data[date][shift].minor).toFixed(2)));
                        });
                    });
                });

                shiftNames.forEach(shift => {
                    result.push({
                        name: `${shift} Major`,
                        group: shift,
                        data: shiftData[shift].major
                    });
                    result.push({
                        name: `${shift} Minor`,
                        group: shift,
                        data: shiftData[shift].minor
                    });
                });

                return result;
            };

            const transformedData = transformData(data);
            setChartData(transformedData);
            setCategories(Object.keys(data[0]));

            setOptions({
                chart: {
                    type: 'bar',
                    height: 350,
                    stacked: true,
                },
                stroke: {
                    width: 1,
                    colors: ['#fff']
                },
                plotOptions: {
                    bar: {
                        horizontal: false
                    }
                },
                xaxis: {
                    categories: Object.keys(data[0]),
                    labels: {
                        style: {
                            fontWeight: 700
                        }
                    }
                },
                fill: {
                    opacity: 1
                },
                colors: ['#FF5733', '#FF8D1A', '#33FF57', '#75FF33', '#3357FF', '#33A1FF'],
                yaxis: {
                    labels: {
                        show: true
                    }
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'left'
                }
            });
        }
    }, [data]);

    const daysToShow = 7;
    const baseWidth = 800;
    const additionalWidthPerDay = 300;
    const chartWidth =
        categories.length > daysToShow
            ? baseWidth + (categories.length - daysToShow) * additionalWidthPerDay
            : baseWidth;

    return (
        <div>
            {
                data?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {/* X-axis labels */}


                        {/* Chart area */}
                        <div style={{ width: '100%', overflowX: 'auto' }}>
                            <div style={{ minWidth: `${chartWidth}px`, width: 'auto' }}>
                                <ReactApexChart options={options} series={chartData} type="bar" height={350} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 700 }}>
                        NO DATA
                    </div>
                )
            }
        </div>
    );
};

export default ApexChart;
