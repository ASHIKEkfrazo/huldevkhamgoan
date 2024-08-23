
import { useState, useEffect } from "react";
import "../App.css"
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Link, useNavigate, useNavigation } from "react-router-dom";
import axios from 'axios';
import { Card, notification, Space, Col, Row, Typography, Select, DatePicker, Checkbox, Button, Dropdown, Menu } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { VideoCameraOutlined, BugOutlined, AlertOutlined, NotificationOutlined } from '@ant-design/icons';
import StackChart from "../components/chart/StackChart";
import LineChart from "../components/chart/LineChart";
import PieChart from "../components/chart/PieChart";
import MachinesParameter from "./MachinesParameterWithPagination";
import MachinesParameterWithPagination from "./MachinesParameterWithPagination";
import MachineParam from "../components/chart/MachineParam";
import { API, baseURL, AuthToken, localPlantData } from "./../API/API"
import ProductionVsReject from "../components/chart/ProductionVsReject"
import dayjs from 'dayjs';
import { Hourglass } from "react-loader-spinner";
import ShiftChart from "../components/chart/ShiftChart";
import ApexChart from "../components/chart/ShiftChart";
import TableComponent from "../components/TableComponent/Table";

function Dashboard() {


  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const startDate = new Date();
  console.log(startDate, "<dates")
  startDate.setDate(startDate.getDate() - 7);
  const formattedStartDate = startDate.toISOString().slice(0, 10);
  const endDate = new Date();
  const formattedEndDate = endDate.toISOString().slice(0, 10);
  const dateFormat = 'YYYY/MM/DD';
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}/${month}/${day}`;


  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedStoppage, setSelectedStoppage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loaderData, setLoaderData] = useState(false)
  const [dateRange, setDateRange] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [productionData, setProductionData] = useState([])
  const [datesData, setDatesData] = useState([])

  const [machineOptions, setMachineOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [stoppageOptions, setStoppageOptions] = useState(
  );
  const [productOptions, setProductOptions] = useState([]);
  const [activeMachines, setActiveMachines] = useState([])
  const [activeProd, setActiveProd] = useState([])
  const [currentDateData, setCurrentDateData] = useState();
  const [shiftData, setShiftData] = useState(



  )

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    position: ['topRight'],
    showSizeChanger: true
  });


  const [downTimeData, setDownTimeData] = useState([]);

  const handleMachineChange = value => {
    setSelectedMachine(value);
  };
  const handleDepartmentChange = value => {
    setSelectedDepartment(value);
  };
  const handleProductChange = value => {
    setSelectedProduct(value);
  };
  const handleStoppageChange = value => {
    setSelectedStoppage(value);
  };



  const localItems = localStorage.getItem("PlantData")
  const localPlantData = JSON.parse(localItems)


  const handleDateRangeChange = (dates, dateStrings) => {
    if (dateStrings) {
      setSelectedDate(dateStrings)
      setDateRange(dateStrings);
    } else {
      console.error('Invalid date range:', dates, dateStrings);
    }
  };

  const resetFilter = () => {
    initialTableData()
    setFilterActive(false)
    initialProductionData()
    setSelectedMachine(null)
    setSelectedProduct(null)
    setSelectedDate(null)
    setSelectedStoppage(null)
  }

  const resetTableData = () => {
    setFilterActiveTable(false)
    downtimeAnalysisData()
  }

  const handleApplyFilters = () => {
    setLoaderData(true)
    const domain = `${baseURL}`;
    let fromDate, toDate;
    if (Array.isArray(dateRange) && dateRange.length === 2) {
      [fromDate, toDate] = dateRange;
    }

    let url = `${domain}dashboard/?`;
    // url += `plant_id=${localPlantData.id}&from_date=${fromDate}&to_date=${toDate}&machine_id=${selectedMachine}&department_id=${selectedDepartment}&product_id=${selectedProduct}&defect_id=${selectedDefect}`;
    if (localPlantData.id) {
      url += `plant_id=${localPlantData.id}&`;
    }
    if (fromDate) {
      url += `from_date=${fromDate}&`;
    }
    if (toDate) {
      url += `to_date=${toDate}&`;
    }
    if (selectedMachine) {
      url += `machine_id=${selectedMachine}&`;
    }
    // if (selectedDepartment) {
    //     url += `department_id=${selectedDepartment}&`;
    // }
    if (selectedProduct) {
      url += `area=${selectedProduct}&`;
    }
    if (selectedStoppage) {
      url += `type_of_stoppage=${selectedStoppage}&`;
    }

    // Remove the trailing '&' if present
    if (url.endsWith('&')) {
      url = url.slice(0, -1);
    }

    // If no filters are added, remove the trailing '?'
    if (url.endsWith('?')) {
      url = url.slice(0, -1);
    }
    // if (fromDate && toDate) {
    //   url += `&from_date=${fromDate}&to_date=${toDate}`;
    // }
    axios.get(url, {
      headers: {
        Authorization: `Bearer ${AuthToken}`
      }
    })
      .then(response => {
        setLoaderData(false)
        const { areas, ...datesData } = response.data;
        setDatesData([datesData])

        const extractedData = Object.entries(datesData).reduce((acc, [date, dateData]) => {
          const filteredData = Object.entries(dateData)
            .filter(([key]) => key !== 'total_duration')
            .reduce((obj, [key, value]) => {
              obj[key] = value;
              return obj;
            }, {});

          acc[date] = filteredData;
          return acc;
        }, {});
        setTableData(extractedData);
        setActiveProd(areas)
        setFilterActive(true)
      })
      .catch(error => {
        console.error('Error:', error);
        setLoaderData(false)
      });
  };


  const handleApplyFiltersTable = () => {
    const params = {
      page: 1,
      page_size: 10,
      from_date: dateRange?.[0] || undefined,
      to_date: dateRange?.[1] || undefined,
      areas: selectedProduct || undefined,

    };

    const filteredQueryParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );
    const queryString = new URLSearchParams(filteredQueryParams).toString();
    const url = `${queryString}`;
    axios.get(`${baseURL}downtime-analysis/?${url}`)
      .then((res) => {
        const { results, page_size, total_count, total_pages } = res.data

        setDownTimeData(results)
        setPagination((prev) => ({
          ...prev,
          pageSize: page_size,
          total: total_count,
          totalPages: total_pages
        }))
        setFilterActiveTable(true)
      })
      .catch(err => console.log(err))
  }


  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      pageSize: pagination.pageSize
    })
    if (filterActiveTable) {
      handleApplyFiltersTable(pagination.current, pagination.pageSize)
    }
    else {
      downtimeAnalysisData(pagination.current, pagination.pageSize);
    }

  };

  const getSystemStatus = () => {
    const domain = `${baseURL}`;
    let url = `${domain}system-status/?plant_id=${localPlantData.id}`;
    axios.get(url, {
      headers: {
        'Authorization': `Bearer ${AuthToken}`
      }
    })
      .then(response => {
        setActiveMachines(response.data.results.filter(machine => machine.system_status === true));
      })
      .catch(error => {
        console.error('Error fetching machine data:', error);
      });
  };


  useEffect(() => {
    getDepartments();
    getMachines();
    // initialDateRange();
    getStoppage()
    initialTableData();
    initialProductionData()
    alertApi()
    getSystemStatus()
    downtimeAnalysisData()
    getShiftData()
  }, []);

  const getMachines = () => {
    const domain = `${baseURL}`;
    let url = `${domain}machine/?plant_name=${localPlantData.plant_name}`;
    axios.get(url, {
      headers: {
        'Authorization': `Bearer ${AuthToken}`
      }
    })
      .then(response => {
        console.log(response)
        const formattedMachines = response.data.results.map(machine => ({
          id: machine.id,
          name: machine.name,
        }));
        setMachineOptions(formattedMachines);
      })
      .catch(error => {
        console.error('Error fetching machine data:', error);
      });
  };
  const getShiftData = () => {
    const domain = `${baseURL}`;
    let url = `${domain}stoppage-graph/`;
    axios.get(url, {
      headers: {
        'Authorization': `Bearer ${AuthToken}`
      }
    })
      .then(response => {
        setShiftData([response.data])
      })
      .catch(error => {
        console.error('Error fetching Shift data data:', error);
      });
  };

  const getDepartments = () => {
    const domain = `${baseURL}`;
    let url = `${domain}department/?plant_name=${localPlantData.plant_name}`;
    axios.get(url, {
      headers: {
        Authorization: ` Bearer ${AuthToken}`
      }
    })
      .then(response => {
        const formattedDepartment = response.data.results.map(department => ({
          id: department.id,
          name: department.name,
        }));
        setDepartmentOptions(formattedDepartment);
      })
      .catch(error => {
        console.error('Error fetching department data:', error);
      });
  };


  const getStoppage = () => {
    let url = `${baseURL}stoppage/`;
    axios.get(url, {
      headers: {
        Authorization: `Bearer ${AuthToken}`
      }
    })
      .then(response => {

        setStoppageOptions(response.results);
      })
      .catch(error => {
        console.error('Error fetching machine data:', error);
      });
  }

  // const initialDateRange = () => {
  //   const startDate = new Date();
  //   startDate.setDate(startDate.getDate() - 7); // 7 days ago
  //   const formattedStartDate = startDate.toISOString().slice(0, 10);
  //    // Format startDate as YYYY-MM-DD

  //   const endDate = new Date(); // Today's date
  //   const formattedEndDate = endDate.toISOString().slice(0, 10); // Format endDate as YYYY-MM-DD

  //   setDateRange([formattedStartDate, formattedEndDate]);
  // };

  const [filterActive, setFilterActive] = useState(false)
  const [filterActiveTable, setFilterActiveTable] = useState(false)

  const initialTableData = () => {

    setLoaderData(true)

    const domain = baseURL;
    const [fromDate, toDate] = [startDate, endDate].map(date => date.toISOString().slice(0, 10)); // Format dates as YYYY-MM-DD
    const url = `${domain}dashboard/?plant_id=${localPlantData.id}`;
    // const url = `${domain}dashboard/`;

    axios.get(url, {
      headers: {
        Authorization: ` Bearer ${AuthToken}`
      }
    })
      .then(response => {
        setLoaderData(false)
        const { areas, ...datesData } = response.data;
        setDatesData([datesData])

        const extractedData = Object.entries(datesData).reduce((acc, [date, dateData]) => {
          const filteredData = Object.entries(dateData)
            .filter(([key]) => key !== 'total_duration')
            .reduce((obj, [key, value]) => {
              obj[key] = value;
              return obj;
            }, {});

          acc[date] = filteredData;
          return acc;
        }, {});


        setTableData(extractedData);
        setActiveProd(areas);
        setActiveProd(areas);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoaderData(false)
      });
  };


  const downtimeAnalysisData = () => {
    const url = `${baseURL}downtime-analysis/`
    axios.get(url, {
      headers: {
        Authorization: ` Bearer ${AuthToken}`
      }
    })
      .then(response => {
        const { results, page_size, total_count, total_pages } = response.data
        setDownTimeData(results)
        setPagination((prev) => ({
          ...prev,
          pageSize: page_size,
          total: total_count,
          totalPages: total_pages
        }))
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }



  useEffect(() => {
    const currentDate = getCurrentDate();
    const currentData = datesData.flatMap(obj => obj[currentDate] || null).find(item => item);
    setCurrentDateData(currentData)
  }, [datesData])


  // console.log(Object.keys(tableData).filter(res=>res !== "active_products"),"<<<tabledata")

  const initialProductionData = () => {
    const domain = baseURL;
    // const [fromDate, toDate] = [startDate, endDate].map(date => date.toISOString().slice(0, 10)); // Format dates as YYYY-MM-DD
    const url = `${domain}defct-vs-machine/?plant_id=${localPlantData.id}`;
    // const url = `${domain}dashboard/`;
    axios.get(url, {
      headers: {
        Authorization: ` Bearer ${AuthToken}`
      }
    })
      .then(response => {
        setProductionData(response.data.data_last_7_days);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  const [alertData, setAlertData] = useState(null);

  const alertApi = () => {
    const domain = `${baseURL}`;
    const url = `${domain}area/?plant_name=${localPlantData.plant_name}`;
    axios.get(url, {
      headers: {
        Authorization: `Bearer ${AuthToken}`
      }
    }).then((res) => {
      console.log(res.data, "prod")
      setAlertData(res.data.results)
      setProductOptions(res.data.results)
    })
      .catch((err) => {
        console.log(err)
      })
  }

  const { Title } = Typography;
  const { RangePicker } = DatePicker;
  const [categoryDefects, setCategoryDefects] = useState([]);
  // Function to categorize defects
  const categorizeDefects = (data) => {
    const categories = {};

    // Iterate through each date in the tableData
    Object.keys(data).forEach(date => {
      const defects = data[date];

      // Iterate through each defect in the current date
      Object.keys(defects).forEach(defect => {
        if (!categories[defect]) {
          categories[defect] = 0;
        }

        // Accumulate the defect value for the category
        categories[defect] += defects[defect];
      });
    });

    return categories;
  };

  useEffect(() => {

    const categorizedData = categorizeDefects(tableData);
    setCategoryDefects(categorizedData);

  }, [tableData]);

  // const categorizeDefects = (data) => {
  //   const categorizedData = {};

  //   // Check if data is an array
  //   if (Array.isArray(data)) {
  //     data.forEach(item => {
  //       const { defect_name } = item;
  //       if (!categorizedData[defect_name]) {
  //         categorizedData[defect_name] = [];
  //       }
  //       categorizedData[defect_name].push(item);
  //     });
  //   } else {
  //     console.error('Data is not an array:', data);
  //   }

  //   return categorizedData;
  // };

  const [selectedCheckboxMachine, setSelectedCheckboxMachine] = useState([]);

  const handleMachineCheckBoxChange = (checkedValues) => {
    setSelectedCheckboxMachine(checkedValues);
    let url = `${baseURL}/reports?machine=`;
    checkedValues.forEach((machineId, index) => {
      if (index !== 0) {
        url += ',';
      }
      url += `machine${machineId}`;
    });

    axios.get(url)
      .then(response => {
        console.log(response)
        // setTableData(response.data);
      })
      .catch(error => {
        console.error('Error fetching department data:', error);
      });
  };


  const menu = (
    <Menu selectable={true}>
      <Menu.Item key="0">
        <Checkbox.Group style={{ display: "block" }} value={selectedCheckboxMachine} onChange={handleMachineCheckBoxChange}>
          {activeMachines.map(machine => (
            <div key={machine.id} style={{ display: "flex", flexDirection: "column" }}>
              {machine.system_status ?
                <p style={{ fontSize: "1.1rem", width: "100%" }} value={machine.id}>{machine.machine_name}</p> : <p style={{ fontSize: "1.1rem", width: "100%" }} >NO ACTIVE MACHINES</p>}
            </div>
          ))}
        </Checkbox.Group>
      </Menu.Item>
    </Menu>
  );
  const defectMenu = (
    <Menu>
      <Menu.Item key="0">
        <Checkbox.Group style={{ display: "block" }} >
          {
            Object.keys(categoryDefects).map(defect => (
              <div key={defect.id} style={{ display: "flex", flexDirection: "column" }}>
                <p style={{ fontSize: "1.1rem", width: "100%" }} value={defect}>{defect}</p>
              </div>
            ))
          }


        </Checkbox.Group>
      </Menu.Item>
    </Menu>
  )

  const prodMenu = (
    <Menu>
      <Menu.Item key="0">
        <Checkbox.Group style={{ display: "block" }} >

          {
            activeProd ?
              Object.values(activeProd).map(prod => (
                <div key={prod.id} style={{ display: "flex", flexDirection: "column" }}>
                  <p style={{ fontSize: "1.1rem", width: "100%" }} value={prod}>{prod}</p>
                </div>
              ))
              : null
          }


        </Checkbox.Group>
      </Menu.Item>
    </Menu>
  )
  const [notifications, setNotifications] = useState([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [prevNotificationLength, setPrevNotificationLength] = useState(0);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const initializeWebSocket = () => {
      const socket = new WebSocket(`wss://hul.aivolved.in/ws/notifications/${localPlantData.id}/`);
      socket.onopen = () => {
        console.log(`WebSocket connection established ${localPlantData.id}`);
        setIsSocketConnected(true); // Update connection status
      };


      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setNotifications(prevNotifications => {
          const newNotifications = [...prevNotifications, message.notification];

          // Show notification using Ant Design
          const key = `open${Date.now()}`;
          //   api.open({
          //     message: message.notification,
          //     // description: message.notification,
          //     onClose: close,
          //     duration: 5000,  
          //     showProgress: true,
          // pauseOnHover:true,
          // icon: (

          //   <ExclamationCircleOutlined 
          //     style={{
          //       color: '#ec522d',
          //     }}
          //   />
          // ),
          //     style: { whiteSpace: 'pre-line' },  // Added style for new line character
          //     btn: (
          //       <Space>
          //         <Button type="primary" size="small" onClick={() => api.destroy(key)} style={{color:"#ec522d"}}>
          //     Close
          //   </Button>
          //         {/* <Button type="link" size="small" onClick={() => api.destroy()}>
          //           Destroy All
          //         </Button> */}
          //         <Button type="primary" size="large"  style={{fontSize:"1rem",backgroundColor:"#ec522d"}} onClick={() => api.destroy()}>
          //          <Link to="/insights">View All Errors </Link> 
          //         </Button>
          //       </Space>
          //     ),
          //   });
          api.open({
            message: message.notification,
            // description: message.notification,
            onClose: close,
            duration: 5000,
            showProgress: true,
            pauseOnHover: true,
            key,
            stack: 2,
            icon: (

              <ExclamationCircleOutlined
                style={{
                  color: '#fff',
                }}
              />
            ),
            style: { whiteSpace: 'pre-line' },  // Added style for new line character
            btn: (
              <Space>
                <Button type="link" size="small" onClick={() => api.destroy(key)} style={{ color: "#fff" }}>
                  Close
                </Button>

                <Button type="primary" size="large" style={{ fontSize: "1rem", backgroundColor: "#fff", color: "orangered" }} onClick={() => api.destroy()}>
                  <Link to="/insights">View All Errors </Link>
                </Button>
              </Space>
            ),

          });

          return newNotifications;
        });
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed");
        setIsSocketConnected(false); // Update connection status
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsSocketConnected(false); // Update connection status
      };

      return () => {
        socket.close();
      };
    };

    const cleanup = initializeWebSocket();
    return cleanup;
  }, [api]);
  const close = () => {
    console.log(
      'Notification was closed',
    );
  };





  return (
    <>
      {contextHolder}
      {/* <Button type="primary" onClick={openNotification}>
        Open the notification box
      </Button> */}
      <div className="layout-content">
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
              placeholder="Select Machine"
              value={selectedMachine}
              onChange={handleMachineChange}
              filterOption={(input, machineOptions) =>
                (machineOptions?.children ?? '').toLowerCase().includes(input.toLowerCase())
              }
              size="large"
            >
              {machineOptions?.map(machine => (
                <Select.Option key={machine.id} value={machine.id}>{machine.name}</Select.Option>
              ))}
            </Select>

            <Select
              style={{ minWidth: "200px", marginRight: "10px" }}
              showSearch
              placeholder="Select Area"
              onChange={handleProductChange}
              value={selectedProduct}
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
              placeholder="Select Stoppage"
              onChange={handleStoppageChange}
              value={selectedStoppage}
              size="large"
              filterOption={(input, stoppageOptions) =>
                (stoppageOptions?.children ?? '').toLowerCase().includes(input.toLowerCase())
              }

            >
              {stoppageOptions?.map(department => (
                <Select.Option key={department.id} value={department.id}>{department.name}</Select.Option>
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

        <Row className="rowgap-vbox" gutter={[24, 0]}>
          <Col
            key={1}
            xs={24}
            sm={24}
            md={12}
            lg={6}
            className="mb-24"
          >
            <Card bordered={false} className="criclebox  " style={{ minHeight: "180px" }}>
              <Dropdown overlay={menu} trigger={['click']}>

                <div className="number" style={{ cursor: "pointer" }}>
                  <Row align="middle">
                    <Col xs={18}>
                      <Title level={3} style={{ fontSize: "1.5rem" }}>
                        {`Active Machines`}
                      </Title>
                      <span>{activeMachines.length}</span>
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box"><VideoCameraOutlined /></div>
                    </Col>
                  </Row>
                </div>
              </Dropdown>
            </Card>

          </Col>
          <Col
            key={1}
            xs={24}
            sm={24}
            md={12}
            lg={6}
            className="mb-24"
          >
            <Card bordered={false} className="criclebox " style={{ minHeight: "180px" }}>
              {/* <Dropdown overlay={defectMenu} trigger={['click']} > */}

              <div className="number" >
                <Row align="middle">
                  <Col xs={18}>
                    <Title level={3} style={{ fontSize: "1.5rem" }}>
                      {`Downtime  (seconds)`}
                    </Title>

                    {/* <span>  {Object.keys(categoryDefects).reduce((total, category) => total + category, 0)}</span> */}
                    <span>Today:   {currentDateData?.total_duration ? <span className="bnb2" style={{ color: "#52c41a", fontWeight: "650" }}>{parseFloat(currentDateData?.total_duration).toFixed(2)}</span> : "NO DATA"}</span>


                  </Col>
                  <Col xs={6}>
                    <div className="icon-box"><BugOutlined /></div>
                  </Col>
                </Row>
              </div>
              {/* </Dropdown> */}
            </Card>
          </Col>
          <Col
            key={1}
            xs={24}
            sm={24}
            md={12}
            lg={6}
            className="mb-24"
          >
            <Card bordered={false} className="criclebox " style={{ minHeight: "180px" }}>
              <Dropdown overlay={prodMenu} trigger={['click']}>
                <div className="number" style={{ cursor: "pointer" }}>
                  <Row align="middle">
                    <Col xs={18}>
                      <Title level={3} style={{ fontSize: "1.5rem" }}>
                        {`Areas`}
                      </Title>
                      <span>{productOptions?.length}</span>
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box"><AlertOutlined />

                      </div>
                    </Col>
                  </Row>
                </div>
              </Dropdown>
            </Card>
          </Col>

          <Col
            key={1}
            xs={24}
            sm={24}
            md={12}
            lg={6}
            className="mb-24"

          >
            {/* <Link to="/insights">
              <Card
               bordered={false} className={`criclebox ${notifications.length > prevNotificationLength ? 'notification-change' : ''}`} style={{minHeight:"180px"}}>
          
              <Card bordered={false} className={`criclebox ${notifications.length > prevNotificationLength ? 'notification-change' : ''}`}>
            <div className="number" >
              <Row align="middle">
                <Col xs={18}>
                  <Title level={3} style={{fontSize:"1.5rem"}}>
                    {`Areas`}
                  </Title>
                  <button onClick={notify}>click</button>
                  {
                    notifications ? 
                    <span>{notifications.length}</span>
                    : 0
                  }
                  <br />
                </Col>
                <Col xs={6}>
                  <div className="icon-box"><NotificationOutlined /></div>
                </Col>
              </Row>
            </div>
          </Card>
          </Link> */}

            {/* <Card bordered={false} className="criclebox ">
                <div className="number">
                  <Row align="middle">
                    <Col xs={18}>
                      <Title level={3}>
                        {`Insights`}
                      </Title>
                      {
                        notifications ? 
                        <span>{notifications.length }</span>
                        :0
                      }
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box"><AlertOutlined /></div>
                    </Col>
                  </Row>
                </div>
              </Card> */}
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24} md={12} lg={6} className="mb-24">
            <Card bordered={false} className="h-full">
              {Object.keys(categoryDefects).map((category, index) => (
                <Card key={index} bordered={true} className="criclebox h-full mb-2 px-2 ">
                  <div className="timeline-box">
                    <h5 style={{ overflowWrap: 'break-word' }}>{category}</h5>
                    <Paragraph className="lastweek">
                      <span className="bnb2">{
                        parseFloat(categoryDefects[category]).toFixed(2)
                      }</span> seconds
                    </Paragraph>
                  </div>
                </Card>
              ))}

              <Card bordered={true} className="criclebox h-full mb-2 px-2">
                <div className="timeline-box">
                  <h5>Total Time</h5>
                  <Paragraph className="lastweek">
                    <span className="bnb2">
                      {Object.values(categoryDefects).reduce((total, category) => parseFloat(total + category).toFixed(2), 0)}
                    </span> Seconds
                  </Paragraph>
                </div>
              </Card>

            </Card>
          </Col>
          {/* <Col xs={24} sm={24} md={12} lg={14} xl={18} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
            </Card>
          </Col> */}

          {
            loaderData ?
              <div className="" style={{ display: 'flex', justifyContent: 'center', width: "100%", height: "300px" }}>

                <Hourglass
                  visible={true}
                  height="40"
                  width="40"
                  ariaLabel="hourglass-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  colors={[' #ec522d', '#ec522d']}
                />
              </div>
              :
              <>
                {/* <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <LineChart data={tableData}/>
              <ProductionVsReject data={productionData}/>
            </Card>
          </Col> */}
                <Col xs={24} sm={24} md={24} lg={24} xl={18} className="mb-24">
                  <Card bordered={false} className="criclebox h-full">
                    {
                      tableData ?
                        <StackChart data={tableData} />
                        : null
                    }

                  </Card>
                </Col>


                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                  <Card bordered={false} className="criclebox h-full">
                    {
                      tableData ?
                        <PieChart data={tableData} selectedDate={selectedDate} />
                        : null
                    }
                  </Card>
                </Col>

              </>
          }
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox h-full">

              <ApexChart data={shiftData} />


            </Card>
          </Col>
        </Row>

        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">

          <Card bordered={false} className="criclebox h-full">
            <Row className="rowgap-vbox" gutter={[24, 0]}>
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={6}
                className="mb-24"
                style={{ display: "flex", gap: "1rem" }}
              >
                {/* <Select
                  style={{ minWidth: "200px", marginRight: "10px" }}
                  showSearch
                  placeholder="Select Gate"
                  value={selectedMachine}
                  onChange={handleMachineChange}
                  filterOption={(input, machineOptions) =>
                    (machineOptions?.children ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  size="large"
                >
                  {machineOptions?.map(machine => (
                    <Select.Option key={machine.id} value={machine.id}>{machine.name}</Select.Option>
                  ))}
                </Select> */}

                <Select
                  style={{ minWidth: "200px", marginRight: "10px" }}
                  showSearch
                  placeholder="Select Area"
                  onChange={handleProductChange}
                  value={selectedProduct}
                  size="large"
                  filterOption={(input, productOptions) =>
                    (productOptions?.children ?? '').toLowerCase().includes(input.toLowerCase())
                  }

                >
                  {productOptions?.map(department => (
                    <Select.Option key={department.id} value={department.id}>{department.name}</Select.Option>
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

                <Button type="primary" onClick={handleApplyFiltersTable} style={{ fontSize: "1rem", backgroundColor: "#ec522d", marginRight: "10px" }}>Apply filters</Button>
                {filterActiveTable ?
                  <Button type="primary" onClick={resetTableData} style={{ fontSize: "1rem", backgroundColor: "#ec522d", marginRight: "10px" }}>Reset Filter</Button>
                  : null}


              </Col>
            </Row>
            <TableComponent data={downTimeData} pagination={pagination} action={() => handleTableChange()} />
          </Card>
        </Col>
      </div>
    </>
  );
}

export default Dashboard;