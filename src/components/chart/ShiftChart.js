import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = ({ data }) => {
    const [chartData, setChartData] = useState([]);
    const [categories, setCategories] = useState([]);


    // const data = [
    //     {
    //         "2024-08-08": {
    //             "shift1": {
    //                 "major": 0,
    //                 "minor": 0
    //             },
    //             "shift2": {
    //                 "major": 0,
    //                 "minor": 0
    //             },
    //             "shift3": {
    //                 "major": 10,
    //                 "minor": 40
    //             }
    //         },
    //         "2024-08-09": {
    //             "shift1": {
    //                 "major": 20.1,
    //                 "minor": 40.2
    //             },
    //             "shift2": {
    //                 "major": 30.1,
    //                 "minor": 60.300000000000004
    //             },
    //             "shift3": {
    //                 "major": 0,
    //                 "minor": 20.1
    //             }
    //         }
    //     }
    // ]


    useEffect(() => {
        if (data && data.length > 0) {
            const transformData = (dataArray) => {
                if (!Array.isArray(dataArray)) {
                    return []
                }
                const result = [];
                const shiftNames = Object.keys(dataArray[0][Object.keys(dataArray[0])[0]]);
                const shiftData = {};

                // Process each object in the input array

                dataArray?.forEach(data => {
                    Object.keys(data).forEach(date => {
                        shiftNames.forEach(shift => {
                            if (!shiftData[shift]) {
                                shiftData[shift] = {
                                    major: [],
                                    minor: []
                                };
                            }

                            // Push major and minor values to respective arrays, formatting to 1 decimal place
                            shiftData[shift].major.push(parseFloat(data[date][shift].major.toFixed(1)));
                            shiftData[shift].minor.push(parseFloat(data[date][shift].minor.toFixed(1)));
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

            // Transform the input data array and update state
            const transformedData = transformData(data);
            setChartData(transformedData);

            // Set the categories based on dates in the data
            setCategories(Object.keys(data[0]));
            // setCategories(Object.keys(data[0]));
            // setCategories(Object.keys(data[0]));
        }

    }, [data]);

    const [options] = useState({
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
        },
        stroke: {
            width: 1,
            colors: ['#fff']
        },
        dataLabels: {

        },
        plotOptions: {
            bar: {
                horizontal: false
            }
        },
        xaxis: {
            categories: Object.keys(data[0])
        },
        fill: {
            opacity: 1
        },
        // Assign different colors for each shift
        colors: ['#FF5733', '#FF8D1A', '#33FF57', '#75FF33', '#3357FF', '#33A1FF'], // Add your desired colors here
        yaxis: {
            labels: {

            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left'
        }
    });

    return (
        <div>
            <div id="chart">
                <ReactApexChart options={options} series={chartData} type="bar" height={350} />
            </div>
        </div>
    );
};

export default ApexChart;
