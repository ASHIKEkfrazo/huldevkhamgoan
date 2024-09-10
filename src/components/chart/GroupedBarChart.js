import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { baseURL, AuthToken } from '../../API/API';
import dayjs from 'dayjs';
import { Card, notification, Space, Col, Row, Typography, Select, DatePicker, Checkbox, Button, Dropdown, Menu } from "antd";
import { Hourglass } from "react-loader-spinner";
const GroupedBarChart = ({ machineOptions, productOptions, shiftOptions }) => {
    const [downTimeGraphData, setDownTimeGraphData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedArea, setSelectedArea] = useState(null);
    const [selectedGate, setSelectedGate] = useState(null);
    const [selectedShift, setSelectedShift] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [dateRange, setDateRange] = useState([]);
    const [loaderData, setLoaderData] = useState(false)
    const dateFormat = 'YYYY/MM/DD';
    const [filterActive, setFilterActive] = useState(false)

    const getDownTimeData = async () => {
        const domain = `${baseURL}`;
        let url = `${domain}downtime-graph/`;
        setLoading(true);
        setError(null);  // Reset error state

        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${AuthToken}`
                }
            });
            setDownTimeGraphData(response.data.results);
        } catch (error) {
            setError('Error fetching data. Please try again later.');
            console.error('Error fetching Shift data:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        getDownTimeData();
    }, []);





    const handleApplyFilters = () => {
        setLoaderData(true)
        const domain = `${baseURL}`;
        let fromDate, toDate;
        if (Array.isArray(dateRange) && dateRange.length === 2) {
            [fromDate, toDate] = dateRange;
        }

        let url = `${domain}downtime-graph/?`;
        // url += `plant_id=${localPlantData.id}&from_date=${fromDate}&to_date=${toDate}&machine_id=${selectedMachine}&department_id=${selectedDepartment}&product_id=${selectedProduct}&defect_id=${selectedDefect}`;

        if (fromDate) {
            url += `from_date=${fromDate}&`;
        }
        if (toDate) {
            url += `to_date=${toDate}&`;
        }
        if (selectedArea) {
            url += `areas=${selectedArea}&`;
        }
        // if (selectedDepartment) {
        //     url += `department_id=${selectedDepartment}&`;
        // }
        if (selectedGate) {
            url += `gate=${selectedGate}&`;
        }
        if (selectedShift) {
            url += `type_of_stoppage=${selectedShift}&`;
        }
        if (selectedShift) {
            url += `shift=${selectedShift}`;
        }

        // Remove the trailing '&' if present
        if (url.endsWith('&')) {
            url = url.slice(0, -1);
        }

        // If no filters are added, remove the trailing '?'
        if (url.endsWith('?')) {
            url = url.slice(0, -1);
        }

        axios.get(url, {
            headers: {
                Authorization: `Bearer ${AuthToken}`
            }
        })
            .then(response => {
                setDownTimeGraphData(response.data.results);
                setFilterActive(true)
            })
            .catch(error => {
                console.error('Error:', error);

            });
    };




    const handleDateRangeChange = (dates, dateStrings) => {
        if (dateStrings) {
            setSelectedDate(dateStrings)
            setDateRange(dateStrings);
        } else {
            console.error('Invalid date range:', dates, dateStrings);
        }
    };


    const resetFilter = () => {
        getDownTimeData()
        setSelectedArea(null)
        setSelectedGate(null)
        setSelectedDate(null)
        setSelectedShift(null)
        setFilterActive(false)
    }




    const handleAreaChange = value => {
        setSelectedArea(value);
    };
    // const handleGateChange = value => {
    //     setSelectedGate(value);
    // };
    const handleShiftChange = value => {
        setSelectedShift(value);
    };
    const { RangePicker } = DatePicker;
    const chartData = {
        series: [
            {
                name: 'Max Machine Stop Duration',
                data: downTimeGraphData.map(item => item.max_machine_stop_duration)
            },
            {
                name: 'Max Area Duration',
                data: downTimeGraphData.map(item => item.max_area_duration)
            },
            {
                name: 'Total Max Machine Stop Duration',
                data: downTimeGraphData.map(item => item.total_max_machine_stop_duration)
            }
        ],
        options: {
            chart: {
                type: 'bar',
                height: 2000,
                stacked: false,  // Keep bars side by side
                toolbar: {
                    show: false  // Hide the toolbar to maximize space
                },
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    barHeight: '50%',  // Reduce bar height for more space
                    columnWidth: '15%',  // Increase space between bars
                    borderRadius: 4,
                    dataLabels: {
                        position: 'center',  // Display value at the end of each bar
                    },
                },
            },
            colors: ['#1f77b4', '#04336c', '#f79503'], // Colors for each series
            xaxis: {
                categories: downTimeGraphData.map(item => item.date),  // Use the 'date' field for categories
                min: 0,  // Set minimum value to zero to show zero values
                title: {
                    text: 'Duration (in seconds)',
                },
                labels: {
                    rotate: -45,  // Rotate labels to prevent overlap
                    style: {
                        fontSize: '12px',  // Reduce font size
                    },
                },
            },
            yaxis: {
                title: {
                    text: 'Date',
                },
                labels: {
                    style: {
                        fontSize: '12px',  // Reduce font size
                    },
                },
            },
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: (val) => val.toFixed(2) + ' s',  // Format tooltip with seconds
                },
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val.toFixed(2);  // Format value to 2 decimal points
                },
                style: {
                    colors: ['#000'],
                    fontSize: '10px',  // Reduce font size for data labels
                },
            },
            grid: {
                row: {
                    colors: ['#f3f3f3', 'transparent'],  // Alternate row colors
                    opacity: 0.5,
                },
            },
        },
    };


    return (
        <div>

            <Row className="rowgap-vbox" gutter={[24, 0]}>
                <Col
                    xs={24}
                    sm={24}
                    md={12}
                    lg={6}
                    className="mb-24"
                    style={{ display: "flex", gap: "1rem" }}
                >


                    <Select
                        style={{ minWidth: "200px", marginRight: "10px" }}
                        showSearch
                        placeholder="Select Area"
                        onChange={handleAreaChange}
                        value={selectedArea}
                        size="large"
                        filterOption={(input, productOptions) =>
                            (productOptions?.children ?? '').toLowerCase().includes(input.toLowerCase())
                        }

                    >
                        {productOptions?.map(department => (
                            <Select.Option key={department.id} value={department.id}>{department.name}</Select.Option>
                        ))}
                    </Select>



                    <Select
                        style={{ minWidth: "200px", marginRight: "10px" }}
                        showSearch
                        placeholder="Select Shift"
                        onChange={handleShiftChange}
                        value={selectedShift}
                        size="large"
                        filterOption={(input, shiftOptions) =>
                            (shiftOptions?.children ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {shiftOptions?.map(department => (
                            <Select.Option key={department} value={department}>{department}</Select.Option>
                        ))}
                    </Select>



                    <RangePicker
                        // showTime
                        size="large"
                        style={{ marginRight: "10px", minWidth: "280px" }}
                        onChange={handleDateRangeChange}
                        allowClear={false}
                        inputReadOnly={true}
                        value={selectedDate ? [dayjs(selectedDate[0], dateFormat), dayjs(selectedDate[1], dateFormat)] : []}
                    />

                    <Button type="primary" onClick={handleApplyFilters} style={{ fontSize: "1rem", backgroundColor: "#ec522d", marginRight: "10px" }}>Apply filters</Button>
                    {filterActive ?
                        <Button type="primary" onClick={resetFilter} style={{ fontSize: "1rem", backgroundColor: "#ec522d", marginRight: "10px" }}>Reset Filter</Button>
                        : null}


                </Col>
            </Row>
            {loading && <div style={{ display: "flex", justifyContent: "center", height: "300px", alignItems: "center" }}>
                <Hourglass
                    visible={true}
                    height="40"
                    width="40"
                    ariaLabel="hourglass-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    colors={[' #ec522d', '#ec522d']}
                />
            </div>}
            {error && <p>{error}</p>}
            {!loading && !error && (
                <div id="chart">
                    <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={1600} />
                </div>
            )}
        </div>
    );
};

export default GroupedBarChart;
