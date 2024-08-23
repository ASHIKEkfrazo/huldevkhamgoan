import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = ({ data }) => {
    const [chartData, setChartData] = useState([]);
    const [categories, setCategories] = useState([]);





    useEffect(() => {
        if (data && data.length > 0) {
            const transformData = (dataArray) => {
                if (!Array.isArray(dataArray)) {
                    return <div className="">NO DATA</div>
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
                            shiftData[shift]?.major?.push(parseFloat(data[date][shift].major));
                            shiftData[shift]?.minor?.push(parseFloat(data[date][shift].minor));

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
            categories: categories.length > 0 ? categories : []
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
    console.log(data)
    return (
        <div>
            <div id="chart">
                {
                    data?.length > 0 ?
                        <ReactApexChart options={options} series={chartData} type="bar" height={350} />
                        : <div className="" style={{ display: 'flex', justifyContent: 'center', alignItems: "center", fontWeight: 700 }}>NO DATA</div>
                }
            </div>
        </div>
    );
};

export default ApexChart;
