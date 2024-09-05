import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = () => {
    const [chartData, setChartData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [options, setOptions] = useState({});


    const data = [
        {
            "2024-08-08y": {
                "shift1": {
                    "major": 154.26666666666625,
                    "minor": 41.99999999999989
                },
                "shift2": {
                    "major": 93.99999999999976,
                    "minor": 0
                },
                "shift3": {
                    "major": 794.3333333333338,
                    "minor": 368.1333333333365
                }
            },
            "2024-08-09": {
                "shift1": {
                    "major": 291.3333333333327,
                    "minor": 48.86666666666656
                },
                "shift2": {
                    "major": 883.9333333333359,
                    "minor": 545.7999999999977
                },
                "shift3": {
                    "major": 558.8666666666676,
                    "minor": 47.66666666666656
                }
            },
            "2024-08-10": {
                "shift1": {
                    "major": 8.20000000000001,
                    "minor": 0
                },
                "shift2": {
                    "major": 12.533333333333308,
                    "minor": 0
                },
                "shift3": {
                    "major": 0,
                    "minor": 0
                }
            },
            "2024-08-11": {
                "shift1": {
                    "major": 0,
                    "minor": 0
                },
                "shift2": {
                    "major": 11.19999999999998,
                    "minor": 0
                },
                "shift3": {
                    "major": 497.06666666666695,
                    "minor": 27.866666666666625
                }
            },
            "2024-08-12": {
                "shift1": {
                    "major": 42.999999999999964,
                    "minor": 0
                },
                "shift2": {
                    "major": 82.9333333333332,
                    "minor": 29.866666666666617
                },
                "shift3": {
                    "major": 0,
                    "minor": 0
                }
            },
            "2024-08-13": {
                "shift1": {
                    "major": 369.53333333333296,
                    "minor": 45.8666666666668
                },
                "shift2": {
                    "major": 118.86666666666649,
                    "minor": 3.400000000000004
                },
                "shift3": {
                    "major": 37.26666666666661,
                    "minor": 0
                }
            },
            "2024-08-14": {
                "shift1": {
                    "major": 6.999999999999995,
                    "minor": 0
                },
                "shift2": {
                    "major": 84.26666666666699,
                    "minor": 23.73333333333329
                },
                "shift3": {
                    "major": 220.99999999999991,
                    "minor": 0
                }
            },
            "2024-08-15": {
                "shift1": {
                    "major": 97.86666666666649,
                    "minor": 0
                },
                "shift2": {
                    "major": 0,
                    "minor": 0
                },
                "shift3": {
                    "major": 0,
                    "minor": 0
                }
            },
            "2024-08-17": {
                "shift1": {
                    "major": 0,
                    "minor": 0
                },
                "shift2": {
                    "major": 0,
                    "minor": 0
                },
                "shift3": {
                    "major": 11.733333333333311,
                    "minor": 0
                }
            },
            "2024-08-19": {
                "shift1": {
                    "major": 31.666666666666615,
                    "minor": 0
                },
                "shift2": {
                    "major": 0,
                    "minor": 0
                },
                "shift3": {
                    "major": 0,
                    "minor": 0
                }
            },
            "2024-08-21": {
                "shift1": {
                    "major": 17.266666666666662,
                    "minor": 0
                },
                "shift2": {
                    "major": 274.6666666666683,
                    "minor": 622.9999999999902
                },
                "shift3": {
                    "major": 91,
                    "minor": 0
                }
            },
            "2024-08-22": {
                "shift1": {
                    "major": 108.4,
                    "minor": 0
                },
                "shift2": {
                    "major": 83.19999999999999,
                    "minor": 111.80000000000004
                },
                "shift3": {
                    "major": 368.60000000000093,
                    "minor": 339.53333333333256
                }
            },
            "2024-08-23": {
                "shift1": {
                    "major": 0,
                    "minor": 0
                },
                "shift2": {
                    "major": 34.20000000000002,
                    "minor": 0
                },
                "shift3": {
                    "major": 24.79999999999997,
                    "minor": 0
                }
            },
            "2024-08-24": {
                "shift1": {
                    "major": 31.53333333333328,
                    "minor": 12.066666666666661
                },
                "shift2": {
                    "major": 421.9333333333338,
                    "minor": 716.8000000000053
                },
                "shift3": {
                    "major": 350.06666666666615,
                    "minor": 137.86666666666645
                }
            },
            "2024-08-25": {
                "shift1": {
                    "major": 78.7999999999999,
                    "minor": 150.00000000000097
                },
                "shift2": {
                    "major": 153.93333333333317,
                    "minor": 31.599999999999987
                },
                "shift3": {
                    "major": 29.06666666666669,
                    "minor": 140.73333333333326
                }
            },
            "2024-08-26": {
                "shift1": {
                    "major": 210.46666666666732,
                    "minor": 184.73333333333315
                },
                "shift2": {
                    "major": 64.79999999999991,
                    "minor": 127.93333333333351
                },
                "shift3": {
                    "major": 0,
                    "minor": 0
                }
            },
            "2024-08-27": {
                "shift1": {
                    "major": 0,
                    "minor": 0
                },
                "shift2": {
                    "major": 0,
                    "minor": 0
                },
                "shift3": {
                    "major": 307.9333333333342,
                    "minor": 28.466666666666587
                }
            },
            "2024-08-28": {
                "shift1": {
                    "major": 312.1333333333334,
                    "minor": 310.4666666666655
                },
                "shift2": {
                    "major": 79.13333333333328,
                    "minor": 3716.3999999998896
                },
                "shift3": {
                    "major": 1177.7333333333358,
                    "minor": 1208.3999999999915
                }
            },
            "2024-08-29": {
                "shift1": {
                    "major": 3.333333333333337,
                    "minor": 0
                },
                "shift2": {
                    "major": 0,
                    "minor": 0
                },
                "shift3": {
                    "major": 30.53333333333328,
                    "minor": 34.2666666666666
                }
            },
            "2024-08-30": {
                "shift1": {
                    "major": 8.200000000000005,
                    "minor": 30.39999999999999
                },
                "shift2": {
                    "major": 0,
                    "minor": 0
                },
                "shift3": {
                    "major": 18.599999999999973,
                    "minor": 166.79999999999944
                }
            },
            "2024-08-31": {
                "shift1": {
                    "major": 146.3333333333333,
                    "minor": 834.5333333333112
                },
                "shift2": {
                    "major": 7.066666666666661,
                    "minor": 0
                },
                "shift3": {
                    "major": 0,
                    "minor": 0
                }
            },
            "2024-09-01": {
                "shift1": {
                    "major": 447.9333333333338,
                    "minor": 82.13333333333321
                },
                "shift2": {
                    "major": 189.26666666666705,
                    "minor": 10.46666666666668
                },
                "shift3": {
                    "major": 94.46666666666665,
                    "minor": 0
                }
            },
            "2024-09-02": {
                "shift1": {
                    "major": 104.93333333333328,
                    "minor": 0
                },
                "shift2": {
                    "major": 0,
                    "minor": 0
                },
                "shift3": {
                    "major": 0,
                    "minor": 0
                }
            },
            "2024-09-03": {
                "shift1": {
                    "major": 0,
                    "minor": 0
                },
                "shift2": {
                    "major": 81.33333333333317,
                    "minor": 87.80000000000142
                },
                "shift3": {
                    "major": 0,
                    "minor": 0
                }
            }
        }
    ]

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
