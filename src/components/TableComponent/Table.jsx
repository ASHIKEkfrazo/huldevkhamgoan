import React, { useEffect, useState } from 'react';
import { Table } from "antd";



const columns = [
    {
        title: 'Machine Stop Time',
        dataIndex: 'machine_stop_time',
        key: 'machine_stop_time',
    },
    {
        title: 'Machine Stop Duration',
        dataIndex: 'machine_stop_duration',
        key: 'machine_stop_duration',
    },
    {
        title: 'Gate',
        dataIndex: 'gate',
        key: 'gate',
    },
    {
        title: 'Gate Open Duration',
        dataIndex: 'gate_open_duration',
        key: 'gate_open_duration',
    },
    {
        title: 'Area Duration',
        dataIndex: 'area_duration',
        key: 'area_duration',
    },
    {
        title: 'Area Name',
        dataIndex: 'area_name',
        key: 'area_name',
    },
];




const TableComponent = ({ data, pagination, action }) => {
    return (
        <Table dataSource={data} columns={columns} pagination={pagination}
            onChange={action}
        />
    )
}

export default TableComponent