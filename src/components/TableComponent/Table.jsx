import React, { useEffect, useState } from 'react';
import { Table } from "antd";



const columns = [


    {
        title: 'Machine Stop Time',
        dataIndex: 'stopTime',
        key: 'stopTime',
    },
    {
        title: 'ID',
        dataIndex: 'details',
        key: 'id',
        render: details => details.map(detail => <div key={detail.id} style={{ padding: "0.5rem" }}>{detail.id}</div>),
    },

    {
        title: 'Machine Stop Duration',
        dataIndex: 'details',
        key: 'id',
        render: details => details.map(detail => <div key={detail.id} style={{ padding: "0.5rem" }}>{detail.machine_stop_duration}</div>),
    },
    {
        title: 'Gate',
        dataIndex: 'details',
        key: 'gate',
        render: details => details.map(detail => <div key={detail.id} style={{ padding: "0.5rem" }}>{detail.gate}</div>),
    },
    {
        title: 'Gate Open Duration',
        dataIndex: 'details',
        key: 'gate_open_duration',
        render: details => details.map(detail => <div key={detail.id} style={{ padding: "0.5rem" }}>{detail.gate_open_duration}</div>),
    },
    {
        title: 'Area Duration',
        dataIndex: 'details',
        key: 'area_duration',
        render: details => details.map(detail => <div key={detail.id} style={{ padding: "0.5rem" }}>{detail.area_duration}</div>),
    },
    {
        title: 'Area Name',
        dataIndex: 'details',
        key: 'area_name',
        render: details => details.map(detail => <div key={detail.id} style={{ padding: "0.5rem" }}>{detail.area_name}</div>),
    }
];



const TableComponent = ({ data, pagination, action }) => {

    console.log(data, "<table")




    const groupByStopTime = (results) => {
        return results?.reduce((groups, item) => {
            const stopTime = item.machine_stop_time;
            if (!groups[stopTime]) {
                groups[stopTime] = [];
            }
            groups[stopTime].push(item);
            return groups;
        }, {});
    };

    const transformDataForTable = (groupedResults) => {
        return Object.keys(groupedResults)?.map(stopTime => ({
            stopTime,
            details: groupedResults[stopTime]
        }));
    };

    const groupedResults = groupByStopTime(data);
    const tableData = transformDataForTable(groupedResults);
    console.log(tableData)
    return (

        <Table dataSource={tableData} columns={columns} pagination={pagination}
            onChange={action} showSizeChanger={false}

        />)
}

export default TableComponent