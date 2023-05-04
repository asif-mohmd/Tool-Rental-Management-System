import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Box, Button, Card, CardContent, CardHeader, Divider, useTheme, TextField, Stack, FormControl, InputLabel, Select, OutlinedInput, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import requestPost from '../../../serviceWorker';

export const Sales = (props) => {
  const theme = useTheme();
  const [fromDate, setFromDate] = useState(dayjs().startOf("M").format("MM/DD/YYYY"));
  const [items, setItems] = useState([])
  const [toDate, setToDate] = useState(dayjs().format("MM/DD/YYYY"));
  const [datas, setDatas] = useState([]);
  const [data, setData] = useState();
  const [selectedItem, setSelectedItems] = useState([]);
  useEffect(() => {
    getData()
    getItems();
  }, [])

  const getItems = () =>{
    let data = {
      "type": "SP_CALL",
      "requestId": 1200005,
      request: {
      }
    }
    requestPost(data).then((res) => {
      console.log(res);
      if (res.errorCode === 3) {
        Router
          .push(
            {
              pathname: '/',
              query: { redirect: '1' },
            })
      } else {
        if (res.errorCode === 1) {
          if(res.result[0] != null){
            console.log(res.result);
            setItems(res.result.map((dt)=>{return {itemName:dt.iName,itemId:dt.itemId}}))
          }
        }
      }
    })
  }

  const getData = (from = dayjs().startOf("M").format("MM/DD/YYYY"), to = dayjs().format("MM/DD/YYYY")) => {
    let data = {
      "type": "SP_CALL",
      "requestId": 2300007,
      request: {
        from: dayjs(from).format("YYYY-MM-DD"),
        to: dayjs(to).format("YYYY-MM-DD"),
        items:selectedItem
      }
    }
    console.log(data);
    requestPost(data).then((res) => {
      console.log(res);
      if (res.errorCode === 3) {
        Router
          .push(
            {
              pathname: '/',
              query: { redirect: '1' },
            })
      } else {
        if (res.errorCode === 1) {
          if (res.result.data.length > 0) {
            let ds = res.result.data;
            let dtset = []
            ds.map(res => {
              let dt = {
                backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                data: res.dataSet,
                label: res.itemName,
              }
              dtset.push(dt)
            });

            setData({
              datasets: dtset,
              labels: res.result.label
            })
          }
          else {
            setData(undefined)
          }
        }
      }
    })

  }
  const ds = {
    datasets: [
      {
        backgroundColor: '#3F51B5',
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: [17, 24, 56, 23, 54, 12, 23],
        label: 'Shutter',
        maxBarThickness: 10
      },
      {
        backgroundColor: '#4753f2',
        data: [65, 32, 54, 12, 98, 36, 24],
        label: 'Jackey',
      },
    ],
    labels: ["label"]
  };

  const options = {
    animation: true,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    xAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
          beginAtZero: true,
          min: 0
        },
        gridLines: {
          borderDash: [2],
          borderDashOffset: [2],
          color: theme.palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: theme.palette.divider
        }
      }
    ],
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };
  function disableRandomDates(dates) {
    return dayjs(dates) < dayjs(fromDate);
  }

  const handleChange = (event) => {
    
    const {
      target: { value },
    } = event;
    console.log(value);
    setSelectedItems(value);
  };

  return (
    <Card {...props}>
      <CardHeader
        action={(
          <Stack direction={'row'} gap={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack gap={1}>
                <DatePicker label="From" format="DD-MM-YYYY" value={fromDate} disableFuture
                  onChange={(newdate) => {
                    setFromDate(newdate)
                    getData(newdate, toDate)
                  }}
                  renderInput={(params) => <TextField {...params} />} />
                <DatePicker label="To" format="DD-MM-YYYY" value={toDate} disableFuture shouldDisableDate={disableRandomDates}
                  onChange={(newdate) => {
                    setToDate(newdate)
                    getData(fromDate, newdate)
                  }}
                  renderInput={(params) => <TextField {...params} />} />
              </Stack>
            </LocalizationProvider>
            <Stack gap={1}>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel >items</InputLabel>
                <Select
                  multiple
                  value={selectedItem}
                  onChange={handleChange}
                  input={<OutlinedInput label="items" />}
                  renderValue={(selected) => {return selected.map((s)=>s.itemName).join()}}
                >
                
                  {items.map((item) => (
                    <MenuItem key={item.itemId} value={item}>
                      <Checkbox checked={selectedItem.indexOf(item) > -1} />
                      <ListItemText primary={item.itemName} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="contained" onClick={()=>{getData(fromDate,toDate)}}>Submit</Button>
            </Stack>
          </Stack>
        )}
        title="Rents"
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 400,
            position: 'relative'
          }}
        >{data ?
          <Line
            data={data}
            options={options}
          /> :
          <Line
            data={{ datasets: [], labels: [] }}
            options={options}
          />}
        </Box>
      </CardContent>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2
        }}
      >

      </Box>
    </Card>
  );
};
